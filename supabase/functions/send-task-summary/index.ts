import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TaskMetrics {
  originalDuration: number;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: string;
  pauseCount: number;
  favoriteQuotes: number;
}

interface TaskSummary {
  taskName: string;
  completed: boolean;
  metrics?: TaskMetrics;
  relatedQuotes: Array<{ text: string; author: string }>;
}

interface RequestBody {
  email: string;
  summaryData: {
    completedTasks: TaskSummary[];
    unfinishedTasks: TaskSummary[];
    totalTimeSpent: number;
    favoriteQuotes: Array<{ text: string; author: string }>;
  };
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = (await req.json()) as RequestBody;

    // Calculate overall metrics
    const totalTasks = summaryData.completedTasks.length;
    const totalTimeSpentFormatted = formatDuration(summaryData.totalTimeSpent);
    
    const taskDetailsHtml = summaryData.completedTasks.map(task => {
      const metrics = task.metrics;
      if (!metrics) return '';

      const statusColor = getStatusColor(metrics.completionStatus);

      return `
        <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; color: #1a1a1a; font-size: 18px;">✓ ${task.taskName}</h3>
            <span style="font-size: 14px; color: ${statusColor};">${metrics.completionStatus}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
            <div>
              <p style="margin: 4px 0; color: #4a5568;">⏱️ Expected: ${formatDuration(metrics.originalDuration)}</p>
              <p style="margin: 4px 0; color: #4a5568;">⌛ Actual: ${formatDuration(metrics.actualDuration)}</p>
              <p style="margin: 4px 0; color: #4a5568;">🎯 Net Time: ${formatDuration(metrics.netEffectiveTime)}</p>
            </div>
            <div>
              <p style="margin: 4px 0; color: #4a5568;">⏸️ Paused Time: ${formatDuration(metrics.pausedTime)}</p>
              <p style="margin: 4px 0; color: #4a5568;">⚡ Added Time: ${formatDuration(metrics.extensionTime)}</p>
              <p style="margin: 4px 0; color: #4a5568;">📊 Efficiency: ${metrics.efficiencyRatio.toFixed(1)}%</p>
            </div>
          </div>
          ${task.relatedQuotes.length > 0 ? `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #4a5568; font-weight: 500;">📝 Inspiring quotes:</p>
              ${task.relatedQuotes.map(quote => `
                <div style="margin: 8px 0; padding: 12px; background: white; border-left: 3px solid #6366f1; border-radius: 0 4px 4px 0;">
                  <p style="margin: 0 0 4px 0; color: #1a1a1a; font-style: italic;">"${quote.text}"</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">— ${quote.author}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">Today's Accomplishments 🎯</h1>
          <p style="color: white; opacity: 0.9; text-align: center; margin: 8px 0 0 0;">Here's a detailed breakdown of your productive day</p>
        </div>

        <div style="margin-bottom: 32px;">
          <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #4f46e5; margin-top: 0;">Daily Insights 📊</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0;">
              <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Time Focused</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${totalTimeSpentFormatted}</p>
              </div>
              <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Tasks Completed</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${totalTasks}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 16px;">Completed Tasks (${totalTasks})</h2>
          ${taskDetailsHtml}
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="color: #6b7280; margin: 0;">Great work today! See you tomorrow for another productive session! 🌟</p>
        </div>
      </div>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Focus Timer <success@focustimer.org>",
      to: [email],
      subject: "Your Focus Timer Daily Summary",
      html: emailContent,
    });

    // Log the email in the database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabaseAdmin
      .from('email_logs')
      .insert({
        recipient_email: email,
        subject: "Your Focus Timer Daily Summary",
        content: emailContent,
        status: 'sent',
        expected_time: summaryData.completedTasks.reduce((acc, task) => acc + (task.metrics?.originalDuration || 0), 0),
        actual_time: summaryData.completedTasks.reduce((acc, task) => acc + (task.metrics?.actualDuration || 0), 0),
        paused_time: summaryData.completedTasks.reduce((acc, task) => acc + (task.metrics?.pausedTime || 0), 0),
        extension_time: summaryData.completedTasks.reduce((acc, task) => acc + (task.metrics?.extensionTime || 0), 0),
        net_effective_time: summaryData.completedTasks.reduce((acc, task) => acc + (task.metrics?.netEffectiveTime || 0), 0),
        efficiency_ratio: summaryData.completedTasks.reduce((acc, task) => acc + (task.metrics?.efficiencyRatio || 0), 0) / totalTasks,
        completion_status: summaryData.completedTasks.length > 0 ? summaryData.completedTasks[0].metrics?.completionStatus : null,
      });

    if (dbError) {
      console.error('Error logging email:', dbError);
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-task-summary function:", error);

    // Log the failed email attempt
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin
      .from('email_logs')
      .insert({
        recipient_email: (await req.json()).email,
        subject: "Your Focus Timer Daily Summary",
        status: 'error',
        error_message: error.message,
      });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});