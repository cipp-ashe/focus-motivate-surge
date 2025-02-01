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

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = (await req.json()) as RequestBody;

    const taskDetailsHtml = summaryData.completedTasks.map(task => `
      <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h3 style="margin: 0 0 12px 0; color: #1a1a1a;">${task.taskName}</h3>
        ${task.metrics ? `
          <div style="margin-bottom: 16px;">
            <p style="margin: 4px 0; color: #4a5568;">⏱️ Planned duration: ${formatDuration(task.metrics.originalDuration / 60)}</p>
            <p style="margin: 4px 0; color: #4a5568;">⌛ Actual duration: ${formatDuration(task.metrics.actualDuration / 60)}</p>
            <p style="margin: 4px 0; color: #4a5568;">⏸️ Number of breaks: ${task.metrics.pauseCount}</p>
            <p style="margin: 4px 0; color: #4a5568;">⭐ Quotes saved: ${task.metrics.favoriteQuotes}</p>
          </div>
        ` : ''}
        ${task.relatedQuotes.length > 0 ? `
          <div style="margin-top: 16px;">
            <p style="margin: 0 0 8px 0; color: #4a5568; font-weight: 500;">📝 Saved quotes:</p>
            ${task.relatedQuotes.map(quote => `
              <div style="margin: 8px 0; padding: 12px; background: white; border-left: 3px solid #6366f1; border-radius: 0 4px 4px 0;">
                <p style="margin: 0 0 4px 0; color: #1a1a1a; font-style: italic;">"${quote.text}"</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">— ${quote.author}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');

    const totalQuotes = summaryData.favoriteQuotes.length;
    const totalTime = formatDuration(Math.floor(summaryData.totalTimeSpent / 60));

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">Your Focus Timer Summary</h1>
        </div>

        <div style="margin-bottom: 32px;">
          <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #4f46e5; margin-top: 0;">Session Overview</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; text-align: center;">
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Time</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${totalTime}</p>
              </div>
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Tasks Completed</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${summaryData.completedTasks.length}</p>
              </div>
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Quotes Saved</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${totalQuotes}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 16px;">Completed Tasks</h2>
          ${taskDetailsHtml}
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
          <p style="color: #6b7280; margin: 0;">Keep up the great work! 🎉</p>
        </div>
      </div>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Focus Timer <success@focustimer.org>",
      to: [email],
      subject: "Your Focus Timer Summary",
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
        subject: "Your Focus Timer Summary",
        content: emailContent,
        status: 'sent',
      });

    if (dbError) {
      console.error('Error logging email:', dbError);
    }

    console.log('Email sent successfully:', emailResponse);

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
        subject: "Your Focus Timer Summary",
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