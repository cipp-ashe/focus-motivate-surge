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

    // Format email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Your Daily Task Summary</h1>
        <p>Here's a summary of your tasks and progress:</p>
        
        <h2>Completed Tasks (${summaryData.completedTasks.length})</h2>
        ${summaryData.completedTasks.map((task: any) => `
          <div style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #4f46e5;">${task.taskName}</h3>
            ${task.relatedQuotes.length > 0 ? `
              <div style="margin-top: 10px;">
                <p style="color: #6b7280; font-style: italic;">Inspiring quotes:</p>
                ${task.relatedQuotes.map((quote: any) => `
                  <blockquote style="margin: 10px 0; padding-left: 10px; border-left: 3px solid #6366f1;">
                    "${quote.text}"<br>
                    <small>- ${quote.author}</small>
                  </blockquote>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}

        ${summaryData.unfinishedTasks.length > 0 ? `
          <h2>Tasks for Tomorrow (${summaryData.unfinishedTasks.length})</h2>
          ${summaryData.unfinishedTasks.map((task: any) => `
            <div style="margin-bottom: 10px; padding: 10px; background: #f3f4f6; border-radius: 8px;">
              <h3 style="margin: 0; color: #4b5563;">${task.taskName}</h3>
            </div>
          `).join('')}
        ` : ''}

        <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
          <h2 style="margin-top: 0; color: #4f46e5;">Daily Overview</h2>
          <p>Total time spent: ${Math.floor(summaryData.totalTimeSpent / 60)} minutes</p>
          <p>Tasks completed: ${summaryData.completedTasks.length}</p>
          <p>Favorite quotes: ${summaryData.favoriteQuotes.length}</p>
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