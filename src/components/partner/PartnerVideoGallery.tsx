
import { useState } from 'react';
import YouTubeVideo from '@/components/YouTubeVideo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Partner {
  name: string;
  title: string;
  description: string;
  videoId: string;
}

interface PartnerVideoGalleryProps {
  categoryTitle: string;
  partners: Partner[];
}

const PartnerVideoGallery = ({ categoryTitle, partners }: PartnerVideoGalleryProps) => {
  const [activeTab, setActiveTab] = useState(partners[0]?.name || "");
  
  if (partners.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-medium text-cuivre mb-6">
          Découvrez nos partenaires {categoryTitle.toLowerCase()}
        </h4>
        
        <Tabs 
          defaultValue={partners[0]?.name}
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-sable-30 w-full flex overflow-x-auto space-x-1 mb-6">
            {partners.map((partner) => (
              <TabsTrigger 
                key={partner.name}
                value={partner.name}
                className="flex-1 data-[state=active]:bg-sable data-[state=active]:text-white"
              >
                {partner.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {partners.map((partner) => (
            <TabsContent key={partner.name} value={partner.name}>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border border-sable-30">
                  <CardHeader className="pb-2">
                    <CardTitle>{partner.name}</CardTitle>
                    <CardDescription>{partner.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-anthracite mb-4">{partner.description}</p>
                    <div className="flex justify-start">
                      <a 
                        href="#"
                        className="text-cuivre hover:text-sable inline-flex items-center gap-1"
                        onClick={(e) => e.preventDefault()}
                      >
                        Contacter ce partenaire
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                <YouTubeVideo 
                  videoId={partner.videoId} 
                  title={`Vidéo de présentation - ${partner.name}`}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PartnerVideoGallery;
