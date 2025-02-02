import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";
import { RequestBody } from "./types.ts";
import { formatDuration, generateEmailContent } from "./utils.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = (await req.json()) as RequestBody;
    console.log("Received request to send summary email to:", email);
    console.log("Summary data:", JSON.stringify(summaryData, null, 2));

    const totalTasks = summaryData.completedTasks.length;
    const totalTimeSpentFormatted = formatDuration(summaryData.totalTimeSpent);
    const averageEfficiency = summaryData.completedTasks.reduce(
      (acc, task) => acc + (task.metrics?.efficiencyRatio || 0),
      0
    ) / (totalTasks || 1);

    const emailContent = generateEmailContent(
      totalTasks,
      totalTimeSpentFormatted,
      averageEfficiency,
      summaryData.completedTasks,
      summaryData.favoriteQuotes
    );

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