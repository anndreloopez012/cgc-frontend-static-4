
import React, { useState } from 'react';
import { ChevronDown, Menu, X, Home, Users, Scale, Settings, BookOpen, Link, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BentoMegaMenu from './BentoMegaMenu';
import MobileMenu from './MobileMenu';
import { useContentAPI } from '@/hooks/useContentAPI';

interface HeaderProps {
  showSidebarButton?: boolean;
  onSidebarButtonClick?: () => void;
}

/**
 * Componente Header principal
 * Maneja la navegación principal con menú flotante y menú móvil adaptativo
 * 
 * Características:
 * - Header fijo con backdrop blur
 * - Mega menú pegado directamente al nav
 * - Navegación responsive con iconos
 * - Estados de hover mejorados
 * - Botón de menú lateral para móviles/tablets (solo en home)
 */
const Header: React.FC<HeaderProps> = ({ showSidebarButton = false, onSidebarButtonClick }) => {
  // Estados para controlar la apertura de menús
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  // Obtener contenido desde la API simulada
  const { mainNavItems, isLoading } = useContentAPI();

  // Mapeo de iconos de string a componentes de React
  const iconMap: Record<string, React.ComponentType<any>> = {
    Home, Users, Scale, Settings, BookOpen, Link, Phone
  };

  /**
   * Maneja el evento de mouse enter para mostrar el mega menú
   */
  const handleMouseEnter = (key: string) => {
    setActiveMegaMenu(key);
  };

  /**
   * Maneja el evento de mouse leave para ocultar el mega menú
   */
  const handleMouseLeave = () => {
    setActiveMegaMenu(null);
  };

  /**
   * Alterna el estado del menú móvil
   */
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mostrar loading si los datos aún se están cargando
  if (isLoading) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/30 rounded-3xl shadow-2xl mx-auto max-w-7xl h-16 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header estilo gobierno */}
      <div className="w-full bg-primary z-50 relative">
        <header className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo del gobierno */}
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="relative">
                    {/* Logo principal con imagen */}
                    <img 
                      src="/lovable-uploads/be6267fe-c26a-4dd8-bdc3-95323c6a0fd7.png" 
                      alt="CGC Logo" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Navegación de escritorio */}
              <nav className="hidden lg:flex items-center space-x-1">
                {mainNavItems.map((item) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div
                      key={item.key}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.key)}
                    >
                      <button className="flex items-center px-4 py-3 font-medium transition-all duration-200 hover:bg-white/10 text-white text-sm border-r border-white/20 last:border-r-0">
                        {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                        <span className="hidden xl:inline">{item.title}</span>
                        <span className="xl:hidden">{item.title.slice(0, 8)}</span>
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  );
                })}
              </nav>

              {/* Botones de la derecha */}
              <div className="flex items-center space-x-2">
                {/* Botón de menú lateral - Solo en móviles/tablets y en home */}
                {showSidebarButton && (
                  <Button
                    onClick={onSidebarButtonClick}
                    className="lg:hidden bg-white text-primary hover:bg-gray-100 shadow-lg transition-all duration-300"
                    size="sm"
                    aria-label="Abrir menú de servicios"
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    <span className="text-xs">Servicios</span>
                  </Button>
                )}

                {/* Botón de menú móvil principal */}
                <div className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMobileMenu}
                    className="text-white hover:bg-white/10"
                    aria-label="Toggle mobile menu"
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mega menú de escritorio - Pegado directamente al nav sin espacio */}
      <div 
        className="absolute top-full left-0 right-0 z-40"
        onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
        onMouseLeave={handleMouseLeave}
      >
        <BentoMegaMenu 
          isOpen={!!activeMegaMenu} 
          activeMenu={activeMegaMenu}
          onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* Menú móvil */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Header;
