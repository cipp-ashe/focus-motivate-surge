import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { DailySummary } from "../../../src/types/summary";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  summaryData: DailySummary;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, summaryData } = (await req.json()) as RequestBody;

    // Create email content
    const emailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .task { padding: 10px; margin: 5px 0; background: #f5f5f5; border-radius: 5px; }
            .quote { font-style: italic; color: #666; padding: 10px; border-left: 3px solid #8b5cf6; }
            .metrics { background: #f0f0f0; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Daily Task Summary</h1>
              <p>${new Date(summaryData.date).toLocaleDateString()}</p>
            </div>

            <div class="section">
              <h2>Completed Tasks (${summaryData.completedTasks.length})</h2>
              ${summaryData.completedTasks
                .map(
                  (task) => `
                <div class="task">
                  <h3>${task.taskName}</h3>
                  ${
                    task.metrics
                      ? `
                    <div class="metrics">
                      <p>Time spent: ${Math.floor(task.metrics.actualDuration / 60)} minutes</p>
                      <p>Pauses: ${task.metrics.pauseCount}</p>
                    </div>
                  `
                      : ""
                  }
                  ${
                    task.relatedQuotes.length > 0
                      ? `
                    <div class="quotes">
                      <h4>Quotes that inspired you:</h4>
                      ${task.relatedQuotes
                        .map(
                          (quote) => `
                        <div class="quote">
                          "${quote.text}"
                          <br>
                          <small>- ${quote.author}</small>
                        </div>
                      `
                        )
                        .join("")}
                    </div>
                  `
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>

            ${
              summaryData.unfinishedTasks.length > 0
                ? `
              <div class="section">
                <h2>Tasks for Tomorrow (${summaryData.unfinishedTasks.length})</h2>
                ${summaryData.unfinishedTasks
                  .map(
                    (task) => `
                  <div class="task">
                    <h3>${task.taskName}</h3>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }

            <div class="section">
              <h2>Daily Overview</h2>
              <div class="metrics">
                <p>Total time spent: ${Math.floor(summaryData.totalTimeSpent / 60)} minutes</p>
                <p>Tasks completed: ${summaryData.completedTasks.length}</p>
                <p>Favorite quotes: ${summaryData.favoriteQuotes.length}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Supabase Edge Function
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabaseAdmin.auth.admin.sendEmail(email, {
      subject: "Your Daily Task Summary",
      html: emailContent,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});