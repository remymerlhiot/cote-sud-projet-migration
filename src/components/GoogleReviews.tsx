
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type GoogleReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  review_date: string;
  profile_photo?: string;
  review_place: string;
};

// Nouvelles données d'avis basées sur les captures d'écran
const staticReviews: GoogleReview[] = [
  {
    id: '1',
    name: 'Hélène Codagnan',
    rating: 5,
    comment: 'Carole est une personne bienveillante et très professionnelle. Toujours prête à vous écouter et prendre en compte vos besoins, très compétente, je recommande vivement.',
    review_date: '2024-04-15',
    review_place: 'Google'
  },
  {
    id: '2',
    name: 'Maguy Choune',
    rating: 5,
    comment: "Personne charmante et à l'écoute, qui a su ajuster ses recommandations au gré de mes besoins !",
    review_date: '2023-02-15',
    review_place: 'Google'
  },
  {
    id: '3',
    name: 'Carl Marthom',
    rating: 5,
    comment: 'Personne très compétente, qui a le souci de rendre service à ses clients. Je recommande sans hésiter.',
    review_date: '2023-02-15',
    review_place: 'Google'
  },
  {
    id: '4',
    name: 'Valérie Guerinoni',
    rating: 5,
    comment: 'Charmante personne et travail professionnel, je la recommande pour son professionnalisme.',
    review_date: '2023-02-15', 
    review_place: 'Google'
  },
  {
    id: '5',
    name: 'Fri Bri',
    rating: 5,
    comment: 'Très satisfait du travail effectué par cette dame pour la vente de notre maison.',
    review_date: '2023-02-15',
    review_place: 'Google'
  },
  {
    id: '6',
    name: 'Elisabeth Bicheron-R',
    rating: 5,
    comment: "Nous cherchions un studio à acheter sur Aix et nous l'avons trouvé le jour même. Rencontre avec Florence à l'agence d'Aix en Pce, jeune femme très sympathique, très attentive, dynamique et sans ambiguïté, bonne connaissance de ses produits. Je la recommande vivement.",
    review_date: '2023-04-15',
    review_place: 'Google'
  },
  {
    id: '7',
    name: 'DOMINIQUE G',
    rating: 5,
    comment: "Sur notre projet d'expatriation, Florence nous a aidé à vendre nos biens immobiliers. Elle est très à l'écoute, elle ne sur-estime pas les biens. Elle n'a fait que des visites qualifiées, elle est d'un grand professionnalisme. Je la recommande absolument.",
    review_date: '2024-06-15',
    review_place: 'Google'
  },
  {
    id: '8',
    name: 'Alain Popeye',
    rating: 5, 
    comment: "Très bonne expérience avec Florence de l'agence d'Aix en Provence. Avec sa grande connaissance du marché local, sa réactivité et sa bonne humeur permanente, Florence a été de bon conseil pour l'estimation et la vente de notre bien qui est parti au juste prix malgré cette période difficile pour l'immobilier. Je recommande !",
    review_date: '2024-06-15',
    review_place: 'Google'
  },
  {
    id: '9',
    name: 'Sidonie Fenerol',
    rating: 5,
    comment: "Florence a vendu mon appartement en un mois. Elle est très réactive, active, professionnelle. Je recommande Florence ainsi que l'Agence terrasse en ville Aix en Provence !",
    review_date: '2024-10-15',
    review_place: 'Google'
  }
];

// Composant pour afficher la notation avec des étoiles
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <StarIcon 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-sable fill-sable' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>(staticReviews);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Fonction pour charger les avis depuis Supabase
  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .order('review_date', { ascending: false })
        .eq('enabled', true);

      if (error) throw error;
      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // Si pas de données, utiliser les avis statiques
        setReviews(staticReviews);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      toast({
        title: "Information",
        description: "Affichage des avis en mode statique.",
      });
      setReviews(staticReviews);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour déclencher manuellement le scraping
  const refreshReviews = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        'https://oopbrlptvjkldvzdgxkm.supabase.co/functions/v1/scrape-google-reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcGJybHB0dmprbGR2emRneGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzM5OTEsImV4cCI6MjA1ODkwOTk5MX0.3GpYH1AeuicIwALqrYGUnKonBsdKU3ZpxHOLe0svvm8`
          },
        }
      );

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Mise à jour réussie",
          description: `${result.count} avis Google ont été récupérés.`,
        });
        
        // Recharger les avis après la mise à jour
        await loadReviews();
      } else {
        throw new Error(result.error || "Une erreur s'est produite");
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des avis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les avis Google. Avis statiques utilisés.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Charger les avis au chargement du composant
  useEffect(() => {
    // Pour cette version, nous utilisons directement les avis statiques
    // Vous pouvez décommenter la ligne suivante pour essayer de charger depuis Supabase
    // loadReviews();
  }, []);

  // Formatage de la date au format français
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair text-cuivre">Avis Google</h2>
        <Button 
          onClick={refreshReviews} 
          variant="outline" 
          disabled={refreshing}
          className="border-sable text-sable hover:bg-sable hover:text-white"
        >
          {refreshing ? "Mise à jour..." : "Rafraîchir les avis"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="rounded-md bg-sable-30 p-4 w-full">
            <div className="h-5 w-3/4 bg-sable-50 animate-pulse rounded mb-3"></div>
            <div className="h-20 bg-sable-50 animate-pulse rounded"></div>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">Aucun avis Google disponible pour le moment.</p>
      ) : (
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border border-sable-30 h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          {review.profile_photo ? (
                            <AvatarImage src={review.profile_photo} alt={review.name} />
                          ) : (
                            <AvatarFallback className="bg-sable-50 text-cuivre">
                              {review.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-anthracite">{review.name}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <Badge className="bg-sable text-white">{formatDate(review.review_date)}</Badge>
                    </div>
                    <p className="text-anthracite">{review.comment}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex bg-sable text-white hover:bg-sable-80" />
          <CarouselNext className="hidden md:flex bg-sable text-white hover:bg-sable-80" />
        </Carousel>
      )}
    </div>
  );
}
