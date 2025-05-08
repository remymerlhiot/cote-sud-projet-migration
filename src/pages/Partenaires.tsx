
import Layout from "@/components/Layout";
import PartnerSection from "@/components/partner/PartnerSection";
import PartnerVideoGallery from "@/components/partner/PartnerVideoGallery";
import { Handshake, Pencil, Hammer, Home, PalmTree } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Partenaires = () => {
  return (
    <Layout>
      <div className="bg-sable-30/50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-playfair text-cuivre text-center mb-6">
            NOS PARTENAIRES
          </h1>
          <p className="text-center text-anthracite max-w-3xl mx-auto mb-8">
            Pour vous accompagner dans tous vos projets immobiliers, AXO Côté Sud s'entoure 
            des meilleurs professionnels. Découvrez nos partenaires qui sauront vous 
            conseiller et vous accompagner avec le même niveau d'exigence.
          </p>
          <Separator className="bg-sable-80 h-[2px] max-w-md mx-auto mb-12" />

          {/* L'ACCOMPAGNEMENT */}
          <PartnerSection 
            title="L'ACCOMPAGNEMENT"
            subtitle="Experts en financement et assurance"
            icon={<Handshake className="text-cuivre" />}
            imageOnRight={false}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Pour concrétiser votre projet immobilier, nos partenaires vous accompagnent 
              dans toutes les démarches financières et administratives pour garantir une 
              transaction sereine.
            </p>
            <p>
              Courtiers en prêt immobilier, assureurs, notaires... Ces professionnels 
              vous feront bénéficier de leurs services et expertises pour vous 
              permettre de réaliser votre projet dans les meilleures conditions.
            </p>
          </PartnerSection>

          <PartnerVideoGallery 
            categoryTitle="ACCOMPAGNEMENT" 
            partners={[
              {
                name: "Finance Conseil",
                title: "Courtier en prêt immobilier",
                description: "Trouver la meilleure offre de financement pour votre projet",
                videoId: "-Ck0w7BZAbs"
              },
              {
                name: "Allianz Assurances",
                title: "Assurance habitation et emprunteur",
                description: "Des solutions d'assurance sur mesure pour votre bien",
                videoId: "-Ck0w7BZAbs"
              }
            ]} 
          />

          {/* LA CONCEPTION */}
          <PartnerSection 
            title="LA CONCEPTION, PLANS ET SUIVI"
            subtitle="Architecture et plans personnalisés"
            icon={<Pencil className="text-cuivre" />}
            imageOnRight={true}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Nos architectes et maîtres d'œuvre partenaires vous aident à concevoir 
              votre projet, de l'esquisse initiale jusqu'au suivi de chantier.
            </p>
            <p>
              Ils vous accompagnent dans la création de plans sur mesure, le dépôt des 
              autorisations d'urbanisme, et coordonnent les différents corps de métier
              pour garantir un résultat à la hauteur de vos attentes.
            </p>
          </PartnerSection>

          <PartnerVideoGallery 
            categoryTitle="CONCEPTION" 
            partners={[
              {
                name: "Studio Archideco",
                title: "Cabinet d'architectes",
                description: "Conception architecturale et suivi de projet",
                videoId: "-Ck0w7BZAbs"
              },
              {
                name: "Provence Plans",
                title: "Maître d'œuvre",
                description: "Plans sur mesure et coordination de chantier",
                videoId: "-Ck0w7BZAbs"
              }
            ]} 
          />

          {/* LES TRAVAUX */}
          <PartnerSection 
            title="LES TRAVAUX"
            subtitle="Artisans et entrepreneurs qualifiés"
            icon={<Hammer className="text-cuivre" />}
            imageOnRight={false}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Pour transformer, rénover ou construire votre bien, nous vous mettons
              en relation avec notre réseau d'artisans et d'entrepreneurs de confiance.
            </p>
            <p>
              Qu'il s'agisse de gros œuvre, de plomberie, d'électricité ou de finitions,
              ces professionnels expérimentés réalisent des travaux de qualité dans les
              règles de l'art et les délais impartis.
            </p>
          </PartnerSection>

          <PartnerVideoGallery 
            categoryTitle="TRAVAUX" 
            partners={[
              {
                name: "Bâti Provence",
                title: "Entreprise générale du bâtiment",
                description: "Construction et rénovation complète",
                videoId: "-Ck0w7BZAbs"
              },
              {
                name: "Électricité Plus",
                title: "Électricien qualifié",
                description: "Installation électrique aux normes et domotique",
                videoId: "-Ck0w7BZAbs"
              }
            ]} 
          />

          {/* L'INTÉRIEUR */}
          <PartnerSection 
            title="L'INTÉRIEUR"
            subtitle="Décoration et aménagement"
            icon={<Home className="text-cuivre" />}
            imageOnRight={true}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Nos partenaires spécialistes de la décoration et de l'aménagement intérieur
              vous conseillent pour créer un espace qui vous ressemble et valoriser votre bien.
            </p>
            <p>
              Décorateurs, cuisinistes, menuisiers... Ils mettent leur talent et leur 
              créativité à votre service pour transformer votre intérieur en un lieu 
              unique et harmonieux.
            </p>
          </PartnerSection>

          <PartnerVideoGallery 
            categoryTitle="INTÉRIEUR" 
            partners={[
              {
                name: "Style & Déco",
                title: "Décoratrice d'intérieur",
                description: "Conception d'espaces personnalisés",
                videoId: "-Ck0w7BZAbs"
              },
              {
                name: "Provence Cuisines",
                title: "Cuisiniste",
                description: "Cuisines sur mesure et équipements haut de gamme",
                videoId: "-Ck0w7BZAbs"
              }
            ]} 
          />

          {/* L'EXTÉRIEUR */}
          <PartnerSection 
            title="L'EXTÉRIEUR"
            subtitle="Paysagisme et aménagements extérieurs"
            icon={<PalmTree className="text-cuivre" />}
            imageOnRight={false}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Pour sublimer vos espaces extérieurs, nos partenaires paysagistes et 
              spécialistes des aménagements extérieurs vous proposent des solutions 
              adaptées au climat méditerranéen.
            </p>
            <p>
              Création de jardins, installation de piscines, terrasses et pergolas...
              Ils valorisent votre extérieur pour profiter pleinement de l'art de 
              vivre provençal.
            </p>
          </PartnerSection>

          <PartnerVideoGallery 
            categoryTitle="EXTÉRIEUR" 
            partners={[
              {
                name: "Jardin Provence",
                title: "Paysagiste",
                description: "Aménagement de jardins méditerranéens",
                videoId: "-Ck0w7BZAbs"
              },
              {
                name: "Azur Piscines",
                title: "Pisciniste",
                description: "Construction et entretien de piscines",
                videoId: "-Ck0w7BZAbs"
              }
            ]} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Partenaires;
