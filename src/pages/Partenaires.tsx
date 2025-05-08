
import Layout from "@/components/Layout";
import PartnerSection from "@/components/partner/PartnerSection";
import PartnerVideoGallery from "@/components/partner/PartnerVideoGallery";
import { HandHelping, DraftingCompass, HardHat, Armchair, TreePalm } from "lucide-react";
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
            Pour vous accompagner dans vos projets immobiliers, nous collaborons avec les meilleurs professionnels.
          </p>
          <Separator className="bg-sable-80 h-[2px] max-w-md mx-auto mb-12" />

          {/* L'ACCOMPAGNEMENT */}
          <PartnerSection 
            title="L'ACCOMPAGNEMENT"
            subtitle="Notaires, courtiers, conciergeries"
            icon={<HandHelping className="text-cuivre" />}
            imageOnRight={false}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Nos partenaires vous offrent des solutions sur-mesure pour garantir une expérience fluide et sereine.
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
            subtitle="Architectes, maîtres d'oeuvres"
            icon={<DraftingCompass className="text-cuivre" />}
            imageOnRight={true}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Collaborez avec les architectes les plus talentueux pour sublimer vos biens et les maîtres d'oeuvres pour la bonne réalisation de l'ouvrage.
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
            subtitle="Entreprises générales et spécialistes"
            icon={<HardHat className="text-cuivre" />}
            imageOnRight={false}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Des entreprises locales soigneusement sélectionnées pour des réalisations de qualité.
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
            subtitle="Décorateurs, Home staging, Feng shui"
            icon={<Armchair className="text-cuivre" />}
            imageOnRight={true}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Nos spécialistes transforment votre propriété pour révéler tout son potentiel. Apportez une touche de raffinement et de modernité grâce à nos décorateurs partenaires.
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
            subtitle="Paysagistes, piscinistes"
            icon={<TreePalm className="text-cuivre" />}
            imageOnRight={false}
            imageSrc="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"
          >
            <p className="mb-4">
              Transformez vos extérieurs avec nos partenaires créatifs.
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
