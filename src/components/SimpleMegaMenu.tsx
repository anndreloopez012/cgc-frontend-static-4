import React from 'react';
import { 
  Home, Users, FileText, Settings, BookOpen, Link, Phone, ArrowRight,
  Building, Scale, Award, GraduationCap, MapPin, Globe, Mail
} from 'lucide-react';
import { useContentAPI } from '@/hooks/useContentAPI';
import { useNavigate } from 'react-router-dom';

interface SimpleMegaMenuProps {
  isOpen: boolean;
  activeMenu: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Mega menú simple y profesional con diseño limpio
 * Estructura de dos columnas: categorías principales y subcategorías
 */
const SimpleMegaMenu: React.FC<SimpleMegaMenuProps> = ({ 
  isOpen, 
  activeMenu, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const navigate = useNavigate();
  const { menuStructure } = useContentAPI();

  const iconMap: Record<string, React.ComponentType<any>> = {
    Home, Users, FileText, Settings, BookOpen, Link, Phone, Building, 
    Scale, Award, GraduationCap, MapPin, Globe, Mail
  };

  const handleItemClick = (route: string) => {
    navigate(route);
  };

  if (!isOpen || !activeMenu) return null;

  const items = menuStructure[activeMenu as keyof typeof menuStructure] || [];

  return (
    <div 
      className="fixed top-20 left-0 right-0 z-50 bg-white shadow-xl border-t border-gray-100"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div key={index} className="group">
                <div 
                  className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                  onClick={() => handleItemClick(`/${activeMenu}/${item.key}`)}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                    {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.children && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.children.length} servicios disponibles
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200" />
                </div>
                
                {/* Subcategorías */}
                {item.children && item.children.length > 0 && (
                  <div className="ml-16 mt-2 space-y-1">
                    {item.children.slice(0, 3).map((child, childIndex) => (
                      <div 
                        key={childIndex}
                        className="text-sm text-gray-600 hover:text-primary cursor-pointer py-1 transition-colors"
                        onClick={() => handleItemClick(`/${activeMenu}/${item.key}/${child.key}`)}
                      >
                        {child.title}
                      </div>
                    ))}
                    {item.children.length > 3 && (
                      <div className="text-sm text-gray-500 py-1">
                        +{item.children.length - 3} más...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimpleMegaMenu;