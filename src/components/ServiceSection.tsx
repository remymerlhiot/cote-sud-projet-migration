
import { 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

type ServiceProps = {
  service: {
    id: string;
    title: string;
    content: string;
  }
};

const ServiceSection = ({ service }: ServiceProps) => {
  return (
    <AccordionItem value={service.id} className="border-b border-[#CD9B59]/50">
      <AccordionTrigger className="text-[#CD9B59] hover:no-underline py-3">
        {service.title}
      </AccordionTrigger>
      <AccordionContent className="text-white">
        {service.content}
      </AccordionContent>
    </AccordionItem>
  );
};

export default ServiceSection;
