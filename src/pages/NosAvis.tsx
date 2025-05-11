
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GoogleReviews from '@/components/GoogleReviews';

// Type for reviews
interface AgentReview {
  id: string;
  author: string;
  authorImage?: string;
  rating: number;
  text: string;
  date: string;
  transactionType?: string;
}

// Type for an agent with their reviews
interface Agent {
  id: string;
  name: string;
  image?: string;
  role: string;
  reviews: AgentReview[];
}

// Sample data for agents and reviews basés sur les captures d'écran
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
        transactionType: 'MISE EN VENTE'
      },
      {
        id: 'review2',
        author: 'Maguy',
        rating: 5,
        text: 'Bon accompagnement jusqu\'à la signature. Très à l\'écoute.',
        date: '02/11/2022',
        transactionType: 'ACHAT'
      },
      {
        id: 'review3',
        author: 'Carl Marthom',
        rating: 5,
        text: 'Personne très compétente, qui a le souci de rendre service à ses clients. Je recommande sans hésiter.',
        date: '15/02/2023'
      },
      {
        id: 'review4',
        author: 'Valérie Guerinoni',
        rating: 5,
        text: 'Charmante personne et travail professionnel, je la recommande pour son professionnalisme.',
        date: '15/02/2023'
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
        author: 'Elisabeth Bicheron-R',
        rating: 5,
        text: 'Nous cherchions un studio à acheter sur Aix et nous l\'avons trouvé le jour même. Rencontre avec Florence à l\'agence d\'Aix en Pce, jeune femme très sympathique, très attentive, dynamique et sans ambiguïté, bonne connaissance de ses produits. Je la recommande vivement.',
        date: '15/04/2023'
      },
      {
        id: 'review6',
        author: 'DOMINIQUE G',
        rating: 5,
        text: 'Sur notre projet d\'expatriation, Florence nous a aidé à vendre nos biens immobiliers. Elle est très à l\'écoute, elle ne sur-estime pas les biens. Elle n\'a fait que des visites qualifiées, elle est d\'un grand professionnalisme. Je la recommande absolument.',
        date: '15/06/2024'
      },
      {
        id: 'review7',
        author: 'Alain Popeye',
        rating: 5,
        text: 'Très bonne expérience avec Florence de l\'agence d\'Aix en Provence. Avec sa grande connaissance du marché local, sa réactivité et sa bonne humeur permanente, Florence a été de bon conseil pour l\'estimation et la vente de notre bien qui est parti au juste prix malgré cette période difficile pour l\'immobilier. Je recommande !',
        date: '15/06/2024'
      },
      {
        id: 'review8',
        author: 'Marie Monteil',
        rating: 5,
        text: 'Nous avons eu une très bonne expérience avec Florence de l\'agence d\'Aix en Provence, concernant la vente de notre maison. Transparence dans le service proposé, un site lisible et pratique, bien organisé quand à la présentation, description complète et juste du bien, un bon reportage photo/video et un planning de visite idéal ; le tout mené tambour battant en respectant les engagements. Florence a su se montrer professionnelle, efficace et réactive. Nous la remercions, ici, pour son très bon travail : la promesse de vente a eu lieu sous moins d\'un mois avec une offre obtenue au prix de l\'estimation. (Avec une semaine de commercialisation)',
        date: '15/06/2024'
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
        date: '15/06/2024'
      },
      {
        id: 'review10',
        author: 'Quentin Denoyer',
        rating: 5,
        text: 'Très bonne agence ! Merci à Florence pour sa sympathie, sa réactivité et son aide dans le suivi de notre dossier.',
        date: '15/06/2024'
      },
      {
        id: 'review11',
        author: 'Izabela Benharrous',
        rating: 5,
        text: 'Florence Courant a une grande connaissance du marché immobilier d\'Aix. Nous avons apprécié son professionnalisme, sa disponibilité, réactivité et sa gentillesse. Elle a rempli sa mission efficacement et conclu dans les meilleurs délais la vente de notre appartement.',
        date: '15/06/2024'
      },
      {
        id: 'review12',
        author: 'MURAT Philippe',
        rating: 5,
        text: 'Super dynamique, pro et réactive. Très active dans la recherche d\'un potentiel acquéreur pour ma villa. Shooting parfait.',
        date: '15/06/2024'
      }
    ]
  }
];

// Component to display star ratings
const StarRating = ({
  rating
}: {
  rating: number;
}) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-sable fill-sable' : 'text-gray-300'}`} />
      ))}
    </div>
  );
};

// Main component
const NosAvis = () => {
  const [activeTab, setActiveTab] = useState("carole");
  
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
        
        {/* Google Reviews Integration */}
        <div className="mb-16">
          <GoogleReviews />
        </div>
        
        {/* Agent reviews tabs */}
        <h2 className="text-2xl font-playfair text-cuivre mb-6 text-center">Témoignages clients par agent</h2>
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
                        <div className="flex flex-col items-end">
                          <Badge className="bg-sable text-white mb-1">{review.date}</Badge>
                          {review.transactionType && (
                            <Badge variant="outline" className="border-sable-80 text-xs">
                              {review.transactionType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-anthracite">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
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
