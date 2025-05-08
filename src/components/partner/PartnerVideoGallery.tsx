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
const PartnerVideoGallery = ({
  categoryTitle,
  partners
}: PartnerVideoGalleryProps) => {
  const [activeTab, setActiveTab] = useState(partners[0]?.name || "");
  if (partners.length === 0) {
    return null;
  }
  return <div className="mb-16">
      
    </div>;
};
export default PartnerVideoGallery;