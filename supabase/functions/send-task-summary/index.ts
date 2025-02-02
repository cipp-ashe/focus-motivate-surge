import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";
import { DailySummary } from "../../../src/types/summary.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  summaryData: DailySummary;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = (await req.json()) as RequestBody;
    console.log("Received request to send summary email to:", email);
    console.log("Summary data:", JSON.stringify(summaryData, null, 2));

    // Calculate metrics
    const totalTasks = summaryData.completedTasks.length;
    const totalTimeSpent = summaryData.completedTasks.reduce(
      (acc, task) => acc + (task.metrics?.actualDuration || 0),
      0
    );
    const averageEfficiency = summaryData.completedTasks.reduce(
      (acc, task) => acc + (task.metrics?.efficiencyRatio || 0),
      0
    ) / (totalTasks || 1);

    // Generate email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Your Daily Focus Timer Summary</h1>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #4f46e5;">Task Summary</h2>
          <p>Total Tasks Completed: ${totalTasks}</p>
          <p>Total Time Spent: ${Math.round(totalTimeSpent / 60)} minutes</p>
          <p>Average Efficiency: ${(averageEfficiency * 100).toFixed(1)}%</p>
        </div>

        ${summaryData.completedTasks.length > 0 ? `
          <div style="margin: 20px 0;">
            <h2 style="color: #4f46e5;">Completed Tasks</h2>
            <ul style="list-style-type: none; padding: 0;">
              ${summaryData.completedTasks.map(task => `
                <li style="margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px;">
                  <strong>${task.taskName}</strong>
                  ${task.metrics ? `
                    <br>
                    <small>
                      Time: ${Math.round(task.metrics.actualDuration / 60)} minutes
                      | Efficiency: ${(task.metrics.efficiencyRatio * 100).toFixed(1)}%
                    </small>
                  ` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${summaryData.favoriteQuotes.length > 0 ? `
          <div style="margin: 20px 0;">
            <h2 style="color: #4f46e5;">Favorite Quotes</h2>
            <ul style="list-style-type: none; padding: 0;">
              ${summaryData.favoriteQuotes.map(quote => `
                <li style="margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px;">
                  <em>"${quote.text}"</em>
                  <br>
                  <small>— ${quote.author}</small>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Focus Timer <success@focustimer.org>",
      to: [email],
      subject: "Your Focus Timer Daily Summary",
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

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
        efficiency_ratio: averageEfficiency,
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