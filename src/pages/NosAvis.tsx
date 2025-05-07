
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Type for reviews
interface AgentReview {
  id: string;
  author: string;
  authorImage?: string;
  rating: number;
  text: string;
  date: string;
}

// Type for an agent with their reviews
interface Agent {
  id: string;
  name: string;
  image?: string;
  role: string;
  reviews: AgentReview[];
}

// Sample data for agents and reviews
const agentsWithReviews: Agent[] = [
  {
    id: 'agent1',
    name: 'Sophie Martin',
    image: '/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png',
    role: 'Directrice',
    reviews: [
      {
        id: 'review1',
        author: 'Jean Dupont',
        rating: 5,
        text: 'Sophie a été fantastique dans la vente de notre propriété à Arles. Son expertise du marché local et sa connaissance des acheteurs potentiels nous ont permis de vendre rapidement et au meilleur prix.',
        date: '15/04/2024'
      },
      {
        id: 'review2',
        author: 'Marie Rousseau',
        rating: 5,
        text: 'Ayant cherché pendant plusieurs mois, Sophie a su comprendre exactement ce que nous voulions et nous a trouvé la maison parfaite. Son professionnalisme et sa gentillesse ont rendu l\'expérience agréable.',
        date: '02/03/2024'
      }
    ]
  },
  {
    id: 'agent2',
    name: 'Thomas Blanc',
    image: '/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png',
    role: 'Agent immobilier',
    reviews: [
      {
        id: 'review3',
        author: 'Philippe Leroy',
        rating: 4,
        text: 'Thomas est très professionnel et connaît parfaitement le marché immobilier de luxe en Provence. Il a été à l\'écoute de nos besoins et nous a proposé des biens correspondant exactement à nos critères.',
        date: '10/02/2024'
      }
    ]
  },
  {
    id: 'agence',
    name: 'AXO Côté Sud',
    image: '/lovable-uploads/97689347-4c31-4d84-bcba-5f3e6f50b63e.png',
    role: 'Agence immobilière',
    reviews: [
      {
        id: 'review4',
        author: 'Laurent Bernard',
        rating: 5,
        text: 'AXO Côté Sud est une agence exceptionnelle. Leur professionnalisme et leur connaissance du marché immobilier de luxe sont inégalés. Je recommande vivement leurs services à tous ceux qui recherchent un bien d\'exception.',
        date: '25/03/2024'
      },
      {
        id: 'review5',
        author: 'Catherine Petit',
        rating: 5,
        text: 'Service de qualité supérieure. L\'équipe d\'AXO a su m\'accompagner dans l\'acquisition de ma maison en Provence avec une patience et un professionnalisme remarquables.',
        date: '18/01/2024'
      },
      {
        id: 'review6',
        author: 'François Dubois',
        rating: 4,
        text: 'Très bonne expérience avec AXO. L\'équipe est réactive et compétente. La recherche a été personnalisée selon mes critères précis.',
        date: '05/12/2023'
      }
    ]
  }
];

// Component to display star ratings
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-sable fill-sable' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// Component to display Google Reviews integration information
const GoogleReviewsIntegration = () => {
  const { toast } = useToast();
  
  // Function to handle when the Google Reviews script is loaded
  const handleScriptLoad = () => {
    // This would typically contain code to initialize the Google Reviews widget
    // For now, we just show a toast notification
    toast({
      title: "Google Reviews",
      description: "Les avis Google ont été chargés avec succès.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-sable-30 p-6 rounded-lg mt-8">
      <h3 className="text-xl font-playfair mb-4 text-cuivre">Intégration des Avis Google</h3>
      <p className="text-anthracite mb-4">
        Cette section permettra d'intégrer automatiquement les avis Google de l'agence et des agents. 
        Pour l'intégration complète, il faudra:
      </p>
      <ul className="list-disc pl-6 mb-4 text-anthracite">
        <li>Obtenir un API key Google Places</li>
        <li>Configurer les IDs Place de l'agence et des agents</li>
        <li>Implémenter la récupération des avis via l'API</li>
      </ul>
      <div className="flex justify-center mt-6">
        <Button 
          onClick={() => handleScriptLoad()}
          className="bg-cuivre hover:bg-sable text-white"
        >
          <MessageCircle className="mr-2" />
          Charger les avis Google
        </Button>
      </div>
    </div>
  );
};

// Main component
const NosAvis = () => {
  const [activeTab, setActiveTab] = useState("agence");
  
  // Effet pour charger le script Google au chargement de la page (simulé)
  /* useEffect(() => {
    // Cette fonction serait utilisée pour charger le script Google Reviews
    const loadGoogleReviewsScript = () => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
      script.async = true;
      script.onload = initializeGoogleReviews;
      document.head.appendChild(script);
    };
    
    // Cette fonction initialiserait les widgets de review
    const initializeGoogleReviews = () => {
      // Code pour initialiser les widgets Google Reviews
    };
    
    // Appel de la fonction de chargement (commenté pour l'instant)
    // loadGoogleReviewsScript();
  }, []); */
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-cuivre mb-4">Nos Avis Clients</h1>
          <p className="text-anthracite max-w-3xl mx-auto">
            Découvrez ce que nos clients disent de notre service personnalisé et de notre engagement à trouver 
            les biens immobiliers de prestige qui correspondent parfaitement à leurs attentes.
          </p>
          <Separator className="bg-sable my-6 w-1/3 mx-auto" />
        </div>
        
        {/* Agent reviews tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="bg-sable-30 w-full flex justify-center mb-8">
            {agentsWithReviews.map(agent => (
              <TabsTrigger 
                key={agent.id} 
                value={agent.id}
                className="data-[state=active]:bg-cuivre data-[state=active]:text-white"
              >
                {agent.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {agentsWithReviews.map(agent => (
            <TabsContent key={agent.id} value={agent.id} className="mt-4">
              <div className="text-center mb-8">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-sable">
                  {agent.image ? (
                    <AvatarImage src={agent.image} alt={agent.name} />
                  ) : (
                    <AvatarFallback className="bg-sable-50 text-cuivre text-xl">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-2xl font-playfair text-cuivre">{agent.name}</h2>
                <p className="text-anthracite">{agent.role}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {agent.reviews.map(review => (
                  <Card key={review.id} className="border border-sable-30">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            {review.authorImage ? (
                              <AvatarImage src={review.authorImage} alt={review.author} />
                            ) : (
                              <AvatarFallback className="bg-sable-50 text-cuivre">
                                {review.author[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium text-anthracite">{review.author}</p>
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                        <Badge className="bg-sable text-white">{review.date}</Badge>
                      </div>
                      <p className="text-anthracite">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Google Reviews Integration Information */}
        <GoogleReviewsIntegration />
        
        {/* Call-to-action section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-playfair text-cuivre mb-4">Votre expérience avec AXO</h3>
          <p className="text-anthracite max-w-2xl mx-auto mb-6">
            Nous sommes fiers d'offrir un service d'exception à nos clients. 
            Si vous avez travaillé avec nous, n'hésitez pas à partager votre expérience.
          </p>
          <Button 
            className="bg-cuivre hover:bg-anthracite text-white px-8 py-2"
            onClick={() => window.open('https://g.page/r/YOURREVIEWLINK/review', '_blank')}
          >
            Laisser un avis sur Google
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NosAvis;
