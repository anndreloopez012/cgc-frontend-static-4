import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, Mail, Book, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageSlider from './ImageSlider';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

/**
 * Componente HomeContent rediseñado estilo gobierno
 * 
 * Incluye todas las secciones con diseño limpio y moderno:
 * - Slider de imágenes heroicas
 * - Información institucional
 * - Auditoría Social
 * - Servicios principales
 * - Unidad de Información Pública
 */

const HomeContent = () => {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);
  const auditoriaSocial = useScrollAnimation();
  const serviciosUsuarios = useScrollAnimation();
  const servicios = useScrollAnimation();
  const programasParticipacion = useScrollAnimation();
  const informacionPublica = useScrollAnimation();

  // Mapeo de iconos de Lucide React
  const iconMap = {
    FileText,
    Mail,
    Book,
    RefreshCcw
  };

  // Cargar datos del menú desde JSON
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const response = await fetch('/src/data/sidebarMenuAPI.json');
        const data = await response.json();
        setMenuData(data.sidebarMenu);
      } catch (error) {
        console.error('Error loading sidebar menu data:', error);
      }
    };
    loadMenuData();
  }, []);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Slider de imágenes heroicas */}
      <section className="py-6">
        <div className="w-full">
          <ImageSlider />
        </div>
      </section>

      {/* Información institucional */}
      <section className="py-8 px-6 bg-white rounded-lg shadow-sm mb-8">
        <div className="text-center">
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
            La Contraloría General de Cuentas es la Institución del Estado encargada de promover y verificar el cumplimiento de la legislación laboral, así como elaborar e implementar políticas y programas con equidad, relativas al trabajo decente y la previsión social, en beneficio de la población trabajadora y grupos en riesgo de vulnerabilidad laboral.
          </p>
        </div>
      </section>

      {/* SERVICIOS A USUARIOS */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            SERVICIOS A USUARIOS
          </h2>
          <div className="w-20 h-1 bg-yellow-500 rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { title: 'Estado de Cuenta', route: '/estado-cuenta', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055645.png' },
            { title: 'Solicitud de Finiquito', route: '/solicitud-finiquito', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png' },
            { title: 'Comunicaciones Electrónicas', route: '/comunicaciones-electronicas', icon: 'https://cdn-icons-png.flaticon.com/512/1161/1161388.png' },
            { title: 'Registro de Títulos', route: '/registro-titulos', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png' },
            { title: 'Actualización de Datos', route: '/actualizacion-datos', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
            { title: 'Declaración Jurada Patrimonial', route: '/declaracion-patrimonial', icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation(item.route)}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img src={item.icon} alt={item.title} className="w-12 h-12 brightness-0 invert drop-shadow-lg" />
              </div>
              <h3 className="font-bold text-blue-900 text-sm text-center leading-tight max-w-32">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Secciones de servicios */}
      <div className="space-y-0">{/* SERVICIOS A USUARIOS DEL MENU LATERAL - MOVIDO ARRIBA */}
        {menuData && (
          <section ref={serviciosUsuarios.elementRef} className={`bg-gradient-to-r from-slate-800 to-slate-900 p-8 transition-all duration-1000 delay-200 ${serviciosUsuarios.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                SERVICIOS A USUARIOS
              </h2>
              <p className="text-slate-300 text-base mb-4">
                {menuData.subtitle}
              </p>
              <div className="w-20 h-1 bg-yellow-500 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {menuData.menuItems.map((item, index) => {
                const IconComponent = iconMap[item.icon] || FileText;
                return (
                  <div key={item.id} className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation(item.route)}>
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                      <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="font-bold text-white text-sm text-center leading-tight max-w-28">{item.title}</h3>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
        {/* AUDITORÍA SOCIAL */}
        <section ref={auditoriaSocial.elementRef} className={`bg-gradient-to-r from-blue-800 to-blue-900 p-8 transition-all duration-1000 delay-250 ${auditoriaSocial.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              AUDITORÍA SOCIAL
            </h2>
            <div className="w-20 h-1 bg-yellow-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/denuncia-ciudadana')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1161/1161388.png" 
                  alt="Denuncia Ciudadana" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Denuncia Ciudadana</h3>
            </div>

            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/auditoria-participativa')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1055/1055645.png" 
                  alt="Auditoría Participativa" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Auditoría Participativa</h3>
            </div>
          </div>
        </section>

        {/* SERVICIOS INTERINSTITUCIONALES */}
        <section ref={servicios.elementRef} className={`bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 transition-all duration-1000 delay-300 ${servicios.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              SERVICIOS INTERINSTITUCIONALES
            </h2>
            <p className="text-yellow-100 text-base mb-4">
              Haga click sobre el servicio de su interés. El enlace abrirá otra pestaña de su navegador.
            </p>
            <div className="w-20 h-1 bg-white rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { route: '/modulo-transicion', title: 'Módulo de Transición', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png' },
              { route: '/rendicion-cuentas', title: 'Rendición de Cuentas', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055645.png' },
              { route: '/registro-titulos', title: 'Registro de Títulos', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png' },
              { route: '/bitacora-electronica', title: 'Bitácora Electrónica', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
              { route: '/cgc-modulo-cuentadantes', title: 'Módulo de Cuentadantes', icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' },
              { route: '/palimnesto', title: 'Palimnesto', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png' },
              { route: '/sistema-nominas', title: 'Sistema de Nóminas', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png' },
              { route: '/registro-asesores', title: 'Registro de Asesores', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055645.png' },
              { route: '/sistema-registro-actas', title: 'Sistema Registro de Actas', icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png' },
              { route: '/rendicion-cuentas-2', title: 'Rendición de Cuentas', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
              { route: '/formacion-capacitacion', title: 'Formación y Capacitación', icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' },
              { route: '/declaraciones-bienes-muebles', title: 'Declaraciones de Bienes Muebles', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-3 cursor-pointer group" onClick={() => handleNavigation(item.route)}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <img src={item.icon} alt={item.title} className="w-8 h-8 brightness-0 invert drop-shadow-lg" />
                </div>
                <h3 className="font-bold text-white text-xs text-center leading-tight max-w-20">{item.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMAS DE PARTICIPACIÓN CIUDADANA */}
        <section ref={programasParticipacion.elementRef} className={`bg-gradient-to-r from-slate-700 to-slate-800 p-8 transition-all duration-1000 delay-400 ${programasParticipacion.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              PROGRAMAS DE PARTICIPACIÓN CIUDADANA
            </h2>
            <div className="w-20 h-1 bg-yellow-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/sembrando-semillas')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1161/1161388.png" 
                  alt="Sembrando Semillas" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Sembrando Semillas</h3>
            </div>

            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/organizaciones-padres-familia')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1055/1055645.png" 
                  alt="Organizaciones de Padres de Familia" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">OPF</h3>
            </div>

            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/plan-capacitacion-etica')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png" 
                  alt="Plan de Capacitación en Ética" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Plan de Capacitación</h3>
            </div>
          </div>
        </section>

        {/* INFORMACIÓN PÚBLICA */}
        <section ref={informacionPublica.elementRef} className={`bg-gradient-to-r from-blue-700 to-blue-800 p-8 transition-all duration-1000 delay-500 ${informacionPublica.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              INFORMACIÓN PÚBLICA
            </h2>
            <p className="text-blue-100 text-base mb-4">
              Haga click sobre el servicio de su interés. El enlace abrirá otra pestaña de su navegador.
            </p>
            <div className="w-20 h-1 bg-yellow-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/informacion-publica-oficio')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1055/1055645.png" 
                  alt="Información pública de oficio" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Información Pública de Oficio</h3>
            </div>

            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/informes-auditoria')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png" 
                  alt="Informes de Auditoría" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Informes de Auditoría</h3>
            </div>

            <div className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={() => handleNavigation('/archivo-general')}>
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" 
                  alt="Archivo General" 
                  className="w-12 h-12 brightness-0 invert drop-shadow-lg"
                />
              </div>
              <h3 className="font-bold text-white text-sm text-center leading-tight max-w-32">Archivo General</h3>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomeContent;