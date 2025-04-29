
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NosBiens from "./pages/NosBiens";
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
          
          {/* Dynamic page routes */}
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/contact" element={<DynamicPage slug="contact" />} />
          <Route path="/services" element={<DynamicPage slug="services" />} />
          <Route path="/new-home" element={<DynamicPage slug="new-home" />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
