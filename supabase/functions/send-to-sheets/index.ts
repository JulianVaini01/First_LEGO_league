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

    if (!scores || !Array.isArray(scores)) {
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
      posicion: score.position,
      equipo: score.team,
      codigo: score.code,
      ronda0: score.round0,
      ronda1: score.round1,
      ronda2: score.round2,
      ronda3: score.round3,
      mejorPuntaje: score.bestScore,
      coreValues: score.coreValues || 0,
    }));

    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scores: formattedScores }),
    });

    const result = await response.text();

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
