
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";

// Configuration pour Supabase
const supabaseUrl = 'https://oopbrlptvjkldvzdgxkm.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// URL de la page Google à scraper (à remplacer par l'URL réelle de la fiche Google de l'agence)
const GOOGLE_PLACE_URL = "https://www.google.com/maps/place/AXO+C%C3%B4t%C3%A9+Sud"; 

Deno.serve(async (req) => {
  // Gestion des requêtes CORS OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Simuler la récupération des avis (dans une implémentation réelle, ce serait du vrai scraping)
    console.log("Début du scraping des avis Google...");

    // NOTE: Dans une implémentation réelle, nous utiliserions Puppeteer ou un service de scraping
    // comme Browse AI ou Hexomatic. Pour cette démo, nous générons des avis fictifs.
    const simulatedReviews = await simulateScraping();

    // Insérer les avis dans la base de données
    const { data, error } = await supabase
      .from('google_reviews')
      .upsert(
        simulatedReviews.map(review => ({
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          review_date: review.review_date,
          profile_photo: review.profile_photo,
          review_place: 'AXO Côté Sud',
          scraped_at: new Date().toISOString()
        })), 
        { 
          onConflict: 'name,review_date',  // Éviter les doublons en se basant sur nom et date
          ignoreDuplicates: true
        }
      );

    if (error) {
      console.error("Erreur lors de l'insertion des avis:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Avis récupérés et enregistrés avec succès", count: simulatedReviews.length }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erreur lors du scraping des avis:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Fonction pour simuler le scraping (dans une implémentation réelle, ce serait un vrai scraping)
async function simulateScraping() {
  // Dans une implémentation réelle, cette fonction utiliserait Puppeteer ou similar
  // pour extraire les avis depuis la page Google

  // Simulation d'avis supplémentaires (différents de ceux déjà insérés via SQL)
  return [
    {
      name: "Laurent Mercier",
      rating: 5,
      comment: "J'ai vendu ma villa grâce à AXO en seulement 3 semaines. Estimation juste et professionnalisme remarquable.",
      review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 jours avant
      profile_photo: "https://lh3.googleusercontent.com/a/default-user"
    },
    {
      name: "Sophie Bernard",
      rating: 5,
      comment: "Excellente expérience avec Sophie qui a su parfaitement comprendre nos besoins pour notre achat en Provence.",
      review_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 jours avant
      profile_photo: "https://lh3.googleusercontent.com/a/default-user"
    },
    {
      name: "Michel Durand",
      rating: 4,
      comment: "Bonne agence avec un large portefeuille de propriétés. Service client réactif et disponible.",
      review_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 jours avant
      profile_photo: "https://lh3.googleusercontent.com/a/default-user"
    }
  ];
}
