import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  summaryData: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = (await req.json()) as RequestBody;

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Format email content with improved styling and metrics
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">Congrats on Your Achievements! 🎉</h1>
        </div>
        
        <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #4f46e5; margin-top: 0;">Today's Accomplishments</h2>
          <p style="color: #64748b; font-size: 16px;">Here's a detailed breakdown of your productive day:</p>
          
          <div style="margin: 24px 0;">
            <h3 style="color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <span style="background: #4f46e5; color: white; width: 24px; height: 24px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px;">✓</span>
              Completed Tasks (${summaryData.completedTasks.length})
            </h3>
            ${summaryData.completedTasks.map((task: any) => `
              <details style="margin-bottom: 16px;">
                <summary style="cursor: pointer; padding: 12px; background: #f1f5f9; border-radius: 6px; color: #0f172a; font-weight: 500; display: flex; justify-content: space-between; align-items: center;">
                  <span style="text-decoration: line-through;">${task.taskName}</span>
                  <span style="color: #64748b; font-size: 14px;">${task.completedAt ? new Date(task.completedAt).toLocaleTimeString() : ''}</span>
                </summary>
                <div style="padding: 16px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 6px 6px;">
                  ${task.timeSpent ? `<p style="color: #64748b; margin: 0 0 8px 0;">⏱️ Time spent: ${Math.floor(task.timeSpent / 60)} minutes</p>` : ''}
                  ${task.relatedQuotes.length > 0 ? `
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; margin: 0 0 8px 0;">✨ Inspiring quotes:</p>
                      ${task.relatedQuotes.map((quote: any) => `
                        <blockquote style="margin: 8px 0; padding: 12px; background: #f8fafc; border-left: 3px solid #6366f1; border-radius: 0 6px 6px 0;">
                          <p style="margin: 0 0 4px 0; color: #1e293b; font-style: italic;">"${quote.text}"</p>
                          <footer style="color: #64748b; font-size: 14px;">- ${quote.author}</footer>
                        </blockquote>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </details>
            `).join('')}
          </div>

          ${summaryData.unfinishedTasks.length > 0 ? `
            <div style="margin: 24px 0;">
              <h3 style="color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <span style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px;">!</span>
                Tasks for Tomorrow (${summaryData.unfinishedTasks.length})
              </h3>
              ${summaryData.unfinishedTasks.map((task: any) => `
                <div style="margin-bottom: 12px; padding: 12px; background: #fef3c7; border-radius: 6px;">
                  <p style="margin: 0; color: #92400e;">${task.taskName}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="margin-top: 24px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
            <h3 style="color: #0f172a; margin-top: 0;">Daily Insights 📊</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px;">
              <div style="text-align: center;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Time Focused</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${Math.floor(summaryData.totalTimeSpent / 60)}m</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Tasks Done</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${summaryData.completedTasks.length}</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Quotes Saved</p>
                <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 24px; font-weight: 600;">${summaryData.favoriteQuotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; padding-top: 24px; color: #64748b;">
          <p style="margin: 0;">Keep up the fantastic work! 💪</p>
          <p style="margin: 8px 0 0 0; font-size: 14px;">Ready for another productive day tomorrow!</p>
        </div>
      </div>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Focus Timer <success@focustimer.org>",
      to: [email],
      subject: "Your Daily Task Summary",
      html: emailContent,
    });

    // Log the email in the database
    const { error: dbError } = await supabaseAdmin
      .from('email_logs')
      .insert({
        recipient_email: email,
        subject: "Your Daily Task Summary",
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
        subject: "Your Daily Task Summary",
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