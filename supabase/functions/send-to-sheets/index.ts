import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScoreData {
  position: number;
  team: string;
  code: string;
  round0: number;
  round1: number;
  round2: number;
  round3: number;
  bestScore: number;
  coreValues: number | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { scores } = await req.json() as { scores: ScoreData[] };

    console.log('Received scores:', scores);

    if (!scores || !Array.isArray(scores)) {
      console.error('Invalid data format:', scores);
      return new Response(
        JSON.stringify({ error: "Invalid data format" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const SHEET_URL = "https://script.google.com/macros/s/AKfycbyy96bo10sYRgVrNFHucSaujFVfWAz_6U1AHzsUcW_LT3GasdE-jT_StBsPR8STKNkPAA/exec";

    const formattedScores = scores.map(score => ({
      position: score.position,
      round0: score.round0,
      round1: score.round1,
      round2: score.round2,
      round3: score.round3,
      bestScore: score.bestScore,
      coreValues: score.coreValues || 0
    }));

    console.log('Formatted scores to send:', formattedScores);

    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scores: formattedScores }),
    });

    console.log('Google Sheets response status:', response.status);

    let result;
    try {
      result = await response.text();
      console.log('Google Sheets response:', result);
    } catch (e) {
      console.log('Could not read response text:', e);
      result = "Success (no-cors)";
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending to sheets:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
