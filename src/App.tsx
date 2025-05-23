
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NosBiens from "./pages/NosBiens";
import PropertyDetail from "./pages/PropertyDetail";
import NosAvis from "./pages/NosAvis";
import NotreHistoire from "./pages/NotreHistoire";
import Partenaires from "./pages/Partenaires";
import Estimation from "./pages/Estimation";
import PageTest from "./pages/PageTest";
import DynamicPage from "./pages/DynamicPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nos-biens" element={<NosBiens />} />
          <Route path="/page-test" element={<PageTest />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/estimation" element={<Estimation />} />
          <Route path="/nos-avis" element={<NosAvis />} />
          <Route path="/partenaires" element={<Partenaires />} />
          
          {/* Dynamic page routes */}
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/services" element={<DynamicPage slug="services" />} />
          <Route path="/new-home" element={<DynamicPage slug="new-home" />} />
          <Route path="/notre-histoire" element={<NotreHistoire />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
