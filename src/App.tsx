
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MenuPage from "./pages/MenuPage";
import EstadoCuenta from "./pages/EstadoCuenta";
import ManualesProcedimientos from "./pages/ManualesProcedimientos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rutas específicas del menú lateral */}
          <Route path="/estado-cuenta" element={<EstadoCuenta />} />
          <Route path="/solicitud-finiquito" element={<MenuPage />} />
          <Route path="/comunicaciones-electronicas" element={<MenuPage />} />
          <Route path="/registro-titulos" element={<MenuPage />} />
          <Route path="/actualizacion-datos" element={<MenuPage />} />
          <Route path="/declaracion-patrimonial" element={<MenuPage />} />
          <Route path="/manuales-procedimientos" element={<ManualesProcedimientos />} />
          
          {/* Rutas generales */}
          <Route path="/:section" element={<MenuPage />} />
          <Route path="/:section/:subsection" element={<MenuPage />} />
          <Route path="/:section/:subsection/:item" element={<MenuPage />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
