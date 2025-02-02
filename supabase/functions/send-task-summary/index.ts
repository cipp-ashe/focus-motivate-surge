import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Focus Timer Summary</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white;">Your Focus Timer Summary</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9);">Here's what you accomplished today!</p>
            </div>
            
            <!-- Stats Overview -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; background: white;">
              <div style="text-align: center; padding: 16px; background: #f1f5f9; border-radius: 8px;">
                <div style="font-size: 24px; color: #6366f1; margin-bottom: 8px;">✨</div>
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Tasks Completed</div>
                <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${totalTasks}</div>
              </div>
              
              <div style="text-align: center; padding: 16px; background: #f1f5f9; border-radius: 8px;">
                <div style="font-size: 24px; color: #6366f1; margin-bottom: 8px;">⏱️</div>
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Total Time</div>
                <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${formatDuration(totalTimeSpent)}</div>
              </div>
              
              <div style="text-align: center; padding: 16px; background: #f1f5f9; border-radius: 8px;">
                <div style="font-size: 24px; color: #6366f1; margin-bottom: 8px;">📈</div>
                <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Avg. Efficiency</div>
                <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${averageEfficiency.toFixed(1)}%</div>
              </div>
            </div>

            <!-- Completed Tasks -->
            <div style="padding: 0 24px 24px;">
              <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 16px;">Completed Tasks</h2>
              ${summaryData.completedTasks.map(task => `
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                  <h3 style="margin: 0 0 12px; color: #1e293b; font-size: 16px;">${task.taskName}</h3>
                  ${task.metrics ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                      <div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Time Metrics</div>
                        <div style="color: #475569; font-size: 14px;">
                          <div style="margin-bottom: 4px;">⏱️ Expected: ${formatDuration(task.metrics.originalDuration)}</div>
                          <div style="margin-bottom: 4px;">⚡ Actual: ${formatDuration(task.metrics.actualDuration)}</div>
                          <div>🎯 Net: ${formatDuration(task.metrics.netEffectiveTime)}</div>
                        </div>
                      </div>
                      <div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Performance</div>
                        <div style="color: #475569; font-size: 14px;">
                          <div style="margin-bottom: 4px;">⏸️ Pauses: ${task.metrics.pauseCount}</div>
                          <div style="margin-bottom: 4px;">⏲️ Added: ${formatDuration(task.metrics.extensionTime)}</div>
                          <div>📊 Efficiency: ${task.metrics.efficiencyRatio.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>

            ${summaryData.favoriteQuotes.length > 0 ? `
              <!-- Favorite Quotes -->
              <div style="padding: 0 24px 24px;">
                <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 16px;">Favorite Quotes</h2>
                ${summaryData.favoriteQuotes.map(quote => `
                  <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #6366f1;">
                    <p style="margin: 0 0 8px; color: #1e293b; font-style: italic;">"${quote.text}"</p>
                    <p style="margin: 0; color: #6366f1;">— ${quote.author}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Footer -->
            <div style="text-align: center; padding: 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                Generated by Focus Timer<br>
                <span style="color: #6366f1;">Keep building great habits!</span>
              </p>
            </div>
          </div>
        </body>
      </html>
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