
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Type pour les avis
interface Review {
  id: string;
  author: string;
  authorImage?: string;
  rating: number;
  text: string;
  date: string;
  transactionType?: string;
  source?: string;
  agentId?: string;
}

// Type pour un agent avec ses avis
interface Agent {
  id: string;
  name: string;
  image?: string;
  role: string;
  reviews: Review[];
}

// Données des avis Google
const googleReviews: Review[] = [
  {
    id: 'g1',
    author: 'Hélène Codagnan',
    rating: 5,
    text: "Carole est une personne bienveillante et très professionnelle. Toujours prête à vous écouter et prendre en compte vos besoins, très compétente, je recommande vivement.",
    date: '2024-04-15',
    source: 'Google',
    agentId: 'carole'
  },
  {
    id: 'g2',
    author: 'Maguy Choune',
    rating: 5,
    text: "Personne charmante et à l'écoute, qui a su ajuster ses recommandations au gré de mes besoins !",
    date: '2023-02-15',
    source: 'Google',
    agentId: 'carole'
  },
  {
    id: 'g3',
    author: 'Carl Marthom',
    rating: 5,
    text: "Personne très compétente, qui a le souci de rendre service à ses clients. Je recommande sans hésiter.",
    date: '2023-02-15',
    source: 'Google',
    agentId: 'carole'
  },
  {
    id: 'g4',
    author: 'Valérie Guerinoni',
    rating: 5,
    text: "Charmante personne et travail professionnel, je la recommande pour son professionnalisme.",
    date: '2023-02-15',
    source: 'Google',
    agentId: 'carole'
  },
  {
    id: 'g5',
    author: 'Fri Bri',
    rating: 5,
    text: "Très satisfait du travail effectué par cette dame pour la vente de notre maison.",
    date: '2023-02-15',
    source: 'Google',
    agentId: 'carole'
  },
  {
    id: 'g6',
    author: 'Elisabeth Bicheron-R',
    rating: 5,
    text: "Nous cherchions un studio à acheter sur Aix et nous l'avons trouvé le jour même. Rencontre avec Florence à l'agence d'Aix en Pce, jeune femme très sympathique, très attentive, dynamique et sans ambiguïté, bonne connaissance de ses produits. Je la recommande vivement.",
    date: '2023-04-15',
    source: 'Google',
    agentId: 'florence'
  },
  {
    id: 'g7',
    author: 'DOMINIQUE G',
    rating: 5,
    text: "Sur notre projet d'expatriation, Florence nous a aidé à vendre nos biens immobiliers. Elle est très à l'écoute, elle ne sur-estime pas les biens. Elle n'a fait que des visites qualifiées, elle est d'un grand professionnalisme. Je la recommande absolument.",
    date: '2024-06-15',
    source: 'Google',
    agentId: 'florence'
  },
  {
    id: 'g8',
    author: 'Alain Popeye',
    rating: 5, 
    text: "Très bonne expérience avec Florence de l'agence d'Aix en Provence. Avec sa grande connaissance du marché local, sa réactivité et sa bonne humeur permanente, Florence a été de bon conseil pour l'estimation et la vente de notre bien qui est parti au juste prix malgré cette période difficile pour l'immobilier. Je recommande !",
    date: '2024-06-15',
    source: 'Google',
    agentId: 'florence'
  },
  {
    id: 'g9',
    author: 'Sidonie Fenerol',
    rating: 5,
    text: "Florence a vendu mon appartement en un mois. Elle est très réactive, active, professionnelle. Je recommande Florence ainsi que l'Agence terrasse en ville Aix en Provence !",
    date: '2024-10-15',
    source: 'Google',
    agentId: 'florence'
  }
];

// Données des agents avec leurs avis
const agentsWithReviews: Agent[] = [
  {
    id: 'carole',
    name: 'Carole De BUTLER-ROOS',
    image: '/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png',
    role: 'Négociatrice immobilière',
    reviews: [
      {
        id: 'review1',
        author: 'Hélène',
        rating: 5,
        text: 'Mme de butler à été présente et totalement à l\'écoute, toujours disponible. Beaucoup de professionnalisme, de compréhension. C\'est une personne de confiance avec qui on peut lier une profonde amitié. Je suis très reconnaissante envers Carole.',
        date: '30/08/2024',
        transactionType: 'MISE EN VENTE',
        source: 'Site'
      },
      {
        id: 'review2',
        author: 'Maguy',
        rating: 5,
        text: 'Bon accompagnement jusqu\'à la signature. Très à l\'écoute.',
        date: '02/11/2022',
        transactionType: 'ACHAT',
        source: 'Site'
      }
    ]
  },
  {
    id: 'florence',
    name: 'Florence COURANT',
    image: '/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png',
    role: 'Agent immobilier',
    reviews: [
      {
        id: 'review5',
        author: 'Marie Monteil',
        rating: 5,
        text: 'Nous avons eu une très bonne expérience avec Florence de l\'agence d\'Aix en Provence, concernant la vente de notre maison. Transparence dans le service proposé, un site lisible et pratique, bien organisé quand à la présentation, description complète et juste du bien, un bon reportage photo/video et un planning de visite idéal ; le tout mené tambour battant en respectant les engagements. Florence a su se montrer professionnelle, efficace et réactive. Nous la remercions, ici, pour son très bon travail : la promesse de vente a eu lieu sous moins d\'un mois avec une offre obtenue au prix de l\'estimation. (Avec une semaine de commercialisation)',
        date: '15/06/2024',
        source: 'Site'
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
        id: 'review9',
        author: 'Antoine Brient',
        rating: 5,
        text: 'Super professionnel! Ils savent s\'entourer des compétences professionnelles (Maître D\'oeuvre, Architecte, entreprises, etc.) afin de vous accompagner au mieux dans vos projets. J\'accompagne Florence régulièrement en tant qu\'Architecte. Sa capacité à répondre aux attentes des clients est exceptionnelle.',
        date: '15/06/2024',
        source: 'Site'
      },
      {
        id: 'review10',
        author: 'Quentin Denoyer',
        rating: 5,
        text: 'Très bonne agence ! Merci à Florence pour sa sympathie, sa réactivité et son aide dans le suivi de notre dossier.',
        date: '15/06/2024',
        source: 'Site'
      },
      {
        id: 'review11',
        author: 'Izabela Benharrous',
        rating: 5,
        text: 'Florence Courant a une grande connaissance du marché immobilier d\'Aix. Nous avons apprécié son professionnalisme, sa disponibilité, réactivité et sa gentillesse. Elle a rempli sa mission efficacement et conclu dans les meilleurs délais la vente de notre appartement.',
        date: '15/06/2024',
        source: 'Site'
      },
      {
        id: 'review12',
        author: 'MURAT Philippe',
        rating: 5,
        text: 'Super dynamique, pro et réactive. Très active dans la recherche d\'un potentiel acquéreur pour ma villa. Shooting parfait.',
        date: '15/06/2024',
        source: 'Site'
      }
    ]
  }
];

// Component pour afficher la notation avec des étoiles
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-sable fill-sable' : 'text-gray-300'}`} />
      ))}
    </div>
  );
};

// Fonction pour formater la date
const formatDisplayDate = (dateString: string) => {
  // Si le format est déjà "DD/MM/YYYY", on le garde tel quel
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  // Sinon on tente de parser et formater
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

// Component principal
const NosAvis = () => {
  const [activeTab, setActiveTab] = useState("tous");
  
  // Fusionner tous les avis (Google + site) pour chaque agent
  const mergedAgentsWithReviews = useMemo(() => {
    return agentsWithReviews.map(agent => {
      // Trouver les avis Google correspondant à cet agent
      const agentGoogleReviews = googleReviews.filter(review => 
        review.agentId === agent.id
      ).map(review => ({
        ...review,
        date: formatDisplayDate(review.date)
      }));
      
      // Fusionner avec les avis du site
      const allReviews = [
        ...agent.reviews.map(review => ({
          ...review,
          date: formatDisplayDate(review.date)
        })),
        ...agentGoogleReviews
      ];
      
      return {
        ...agent,
        reviews: allReviews
      };
    });
  }, []);
  
  // Tous les avis confondus
  const allReviews = useMemo(() => {
    const reviews = [
      ...googleReviews.map(review => ({
        ...review,
        date: formatDisplayDate(review.date)
      })),
      ...agentsWithReviews.flatMap(agent => 
        agent.reviews.map(review => ({
          ...review,
          agentId: agent.id,
          date: formatDisplayDate(review.date)
        }))
      )
    ];
    
    // Trier par date décroissante
    return reviews.sort((a, b) => {
      // Convertir les dates au format DD/MM/YYYY en objets Date
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, []);
  
  // Trouver l'agent correspondant à un avis
  const getAgentForReview = (agentId: string | undefined) => {
    if (!agentId) return null;
    return agentsWithReviews.find(agent => agent.id === agentId);
  };
  
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
        
        {/* Tabs system for reviews */}
        <div className="mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-5xl mx-auto">
            <TabsList className="bg-sable-30 w-full flex justify-center mb-8">
              <TabsTrigger 
                value="tous" 
                className="data-[state=active]:bg-cuivre data-[state=active]:text-white"
              >
                Tous les avis
              </TabsTrigger>
              {mergedAgentsWithReviews.map(agent => (
                <TabsTrigger 
                  key={agent.id} 
                  value={agent.id} 
                  className="data-[state=active]:bg-cuivre data-[state=active]:text-white"
                >
                  {agent.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Tab content for all reviews */}
            <TabsContent value="tous" className="mt-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-playfair text-cuivre">Tous nos avis clients</h2>
                <p className="text-anthracite mt-2">
                  Découvrez l'ensemble des témoignages de nos clients satisfaits
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {allReviews.map(review => {
                  const agent = getAgentForReview(review.agentId);
                  return (
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
                          <div className="flex flex-col items-end">
                            <Badge className="bg-sable text-white mb-1">{review.date}</Badge>
                            {review.source && (
                              <Badge variant="outline" className="border-sable-80 text-xs">
                                {review.source}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Afficher le conseiller concerné */}
                        {agent && (
                          <div className="flex items-center mb-2 text-sm text-anthracite/70">
                            <Avatar className="h-5 w-5 mr-1">
                              {agent.image ? (
                                <AvatarImage src={agent.image} alt={agent.name} />
                              ) : (
                                <AvatarFallback className="bg-sable-30 text-cuivre text-xs">
                                  {agent.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span>Conseiller : {agent.name}</span>
                          </div>
                        )}
                        
                        {review.transactionType && (
                          <div className="mb-2">
                            <Badge variant="outline" className="border-sable-80 text-xs">
                              {review.transactionType}
                            </Badge>
                          </div>
                        )}
                        
                        <p className="text-anthracite">{review.text}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            {/* Tabs for each agent */}
            {mergedAgentsWithReviews.map(agent => (
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
                          <div className="flex flex-col items-end">
                            <Badge className="bg-sable text-white mb-1">{review.date}</Badge>
                            {review.source && (
                              <Badge variant="outline" className="border-sable-80 text-xs">
                                {review.source}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {review.transactionType && (
                          <div className="mb-2">
                            <Badge variant="outline" className="border-sable-80 text-xs">
                              {review.transactionType}
                            </Badge>
                          </div>
                        )}
                        
                        <p className="text-anthracite">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
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
