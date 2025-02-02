import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { DailySummary } from "./types.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  summaryData: DailySummary;
}

const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  return `${remainingSeconds}s`;
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed Early':
      return '#22c55e';
    case 'Completed On Time':
      return '#3b82f6';
    case 'Completed Late':
      return '#eab308';
    default:
      return '#6b7280';
  }
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = await req.json() as RequestBody;
    
    console.log("Received request to send summary email to:", email);
    console.log("Summary data:", JSON.stringify(summaryData, null, 2));

    const totalTasks = summaryData.completedTasks.length;
    const totalTimeSpent = summaryData.totalTimeSpent;
    const averageEfficiency = summaryData.averageEfficiency;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f8fafc; padding: 32px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 48px 32px; border-radius: 12px; margin-bottom: 32px; text-align: center; position: relative;">
          <img src="https://focustimer.org/logo.png" alt="Focus Timer" style="width: 64px; height: 64px; margin: 0 auto 16px;" />
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">Your Daily Focus Timer Summary</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Here's what you accomplished today!</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
          <div style="background: white; padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; color: #6366f1; margin-bottom: 8px;">✨</div>
            <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Tasks Completed</div>
            <div style="font-size: 24px; font-weight: 600; color: #1e293b;">${totalTasks}</div>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; color: #6366f1; margin-bottom: 8px;">⏱️</div>
            <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Total Time</div>
            <div style="font-size: 24px; font-weight: 600; color: #1e293b;">${Math.round(totalTimeSpent / 60)}m</div>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 24px; color: #6366f1; margin-bottom: 8px;">📈</div>
            <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Avg. Efficiency</div>
            <div style="font-size: 24px; font-weight: 600; color: #1e293b;">${averageEfficiency.toFixed(1)}%</div>
          </div>
        </div>

        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 32px;">
          <div style="background: #f1f5f9; padding: 16px 24px;">
            <h2 style="margin: 0; color: #1e293b; font-size: 18px;">Completed Tasks</h2>
          </div>
          <div style="padding: 0;">
            ${summaryData.completedTasks.map((task, index) => `
              <div style="padding: 24px; ${index !== summaryData.completedTasks.length - 1 ? 'border-bottom: 1px solid #e2e8f0;' : ''}">
                <div style="margin-bottom: 16px;">
                  <h3 style="margin: 0 0 8px; color: #1e293b; font-size: 16px;">${task.taskName}</h3>
                  ${task.metrics ? `
                    <div style="display: inline-block; padding: 4px 12px; background: ${getStatusColor(task.metrics.completionStatus)}; color: white; border-radius: 9999px; font-size: 12px;">
                      ${task.metrics.completionStatus}
                    </div>
                    <div style="margin-top: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                      <div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Time Metrics</div>
                        <div style="color: #475569; font-size: 14px;">
                          <div style="margin-bottom: 4px;">⏱️ Expected: ${formatDuration(task.metrics.originalDuration)}</div>
                          <div style="margin-bottom: 4px;">⚡ Actual: ${formatDuration(task.metrics.actualDuration)}</div>
                          <div>🎯 Net: ${formatDuration(task.metrics.netEffectiveTime)}</div>
                        </div>
                      </div>
                      <div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Performance</div>
                        <div style="color: #475569; font-size: 14px;">
                          <div style="margin-bottom: 4px;">⏸️ Pauses: ${task.metrics.pauseCount} (${formatDuration(task.metrics.pausedTime)})</div>
                          <div style="margin-bottom: 4px;">⏲️ Added: ${formatDuration(task.metrics.extensionTime)}</div>
                          <div>📊 Efficiency: ${task.metrics.efficiencyRatio.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${summaryData.favoriteQuotes.length > 0 ? `
          <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="background: #f1f5f9; padding: 16px 24px;">
              <h2 style="margin: 0; color: #1e293b; font-size: 18px;">Favorite Quotes</h2>
            </div>
            <div style="padding: 24px;">
              ${summaryData.favoriteQuotes.map(quote => `
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #6366f1;">
                  <p style="margin: 0 0 8px; color: #1e293b; font-style: italic; font-size: 16px;">"${quote.text}"</p>
                  <p style="margin: 0; color: #6366f1; font-size: 14px;">— ${quote.author}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            Generated by Focus Timer<br>
            <span style="color: #6366f1;">Keep building great habits!</span>
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Focus Timer <success@focustimer.org>",
      to: [email],
      subject: "Your Focus Timer Summary",
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { error: logError } = await supabaseAdmin
      .from('email_logs')
      .insert({
        recipient_email: email,
        subject: "Your Focus Timer Summary",
        content: emailContent,
        status: 'sent',
        expected_time: summaryData.totalPlannedTime,
        actual_time: summaryData.totalTimeSpent,
        paused_time: summaryData.totalPauses,
        efficiency_ratio: averageEfficiency,
        completion_status: 'Completed'
      });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-task-summary function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});