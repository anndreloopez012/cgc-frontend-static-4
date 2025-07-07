
import React, { useState } from 'react';
import Header from '@/components/Header';
import SidebarMenu from '@/components/SidebarMenu';
import SidebarDrawer from '@/components/SidebarDrawer';
import HomeContent from '@/components/HomeContent';
import SocialMediaSection from '@/components/SocialMediaSection';

/**
 * Página Index (Home) - Actualizada
 * 
 * Layout simplificado:
 * - Header fijo en la parte superior con botón de menú lateral
 * - Contenido principal en grid de 2 columnas en desktop
 * - Menú lateral en la primera columna (oculto en móvil)
 * - Contenido principal con slider y secciones en la segunda columna
 * - Drawer del menú lateral para móviles/tablets
 * - Sección de redes sociales al final
 * - En móvil, solo se muestra el contenido principal
 * 
 * Compatible con React + Astro
 */
const Index = () => {
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  const handleOpenSidebarDrawer = () => {
    setIsSidebarDrawerOpen(true);
  };

  const handleCloseSidebarDrawer = () => {
    setIsSidebarDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header 
        showSidebarButton={false}
        onSidebarButtonClick={handleOpenSidebarDrawer}
      />
      
      {/* Contenido principal sin sidebar */}
      <div className="w-full">
        <main>
          <HomeContent />
        </main>
      </div>
    </div>
  );
};

export default Index;
