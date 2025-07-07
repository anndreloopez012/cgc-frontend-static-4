import { useState, useEffect } from 'react';

/**
 * Hook para simular una API de contenido
 * Este hook simula la obtención de datos desde una API externa
 * En producción, aquí se haría la llamada real a la API
 */

// Tipo para los elementos del menú
export interface MenuItem {
  icon: string;
  title: string;
  key: string;
  description?: string;
  color?: string;
  iconColor?: string;
  videoTitle?: string;
  children?: MenuItem[];
  images?: { url: string; title: string; description?: string }[];
}

// Tipo para redes sociales
export interface SocialMedia {
  name: string;
  icon: string;
  url: string;
  color: string;
}

// Tipo para imágenes del carrusel
export interface CarouselImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

// Tipo para publicidad
export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

// Tipo para el contenido de la página principal
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaButtons: {
    primary: { text: string; icon: string };
    secondary: { text: string; icon: string };
  };
  features: {
    title: string;
    description: string;
    icon: string;
    color: string;
  }[];
}

// Simulación de datos de la API completa
const mockApiData = {
  // Configuración del menú principal
  mainNavItems: [
    {
      icon: 'Home',
      title: 'Inicio',
      key: 'inicio',
      description: 'Página principal',
      color: 'bg-blue-50/60 border-blue-200/40',
      iconColor: 'text-blue-600',
      videoTitle: 'Bienvenido a la CGC'
    },
    {
      icon: 'Users',
      title: 'Nosotros',
      key: 'nosotros',
      description: 'Conoce nuestra institución',
      color: 'bg-green-50/60 border-green-200/40',
      iconColor: 'text-green-600',
      videoTitle: 'Historia y Misión de la CGC'
    },
    {
      icon: 'Scale',
      title: 'Legislación',
      key: 'legislacion',
      description: 'Marco legal y normativo',
      color: 'bg-purple-50/60 border-purple-200/40',
      iconColor: 'text-purple-600',
      videoTitle: 'Marco Legal de la CGC'
    },
    {
      icon: 'Settings',
      title: 'Servicios',
      key: 'servicios',
      description: 'Servicios disponibles',
      color: 'bg-orange-50/60 border-orange-200/40',
      iconColor: 'text-orange-600',
      videoTitle: 'Servicios en Línea'
    },
    {
      icon: 'BookOpen',
      title: 'Publicaciones',
      key: 'publicaciones',
      description: 'Documentos y boletines',
      color: 'bg-indigo-50/60 border-indigo-200/40',
      iconColor: 'text-indigo-600',
      videoTitle: 'Boletines y Documentos'
    },
    {
      icon: 'Link',
      title: 'Enlaces',
      key: 'enlaces',
      description: 'Enlaces útiles',
      color: 'bg-teal-50/60 border-teal-200/40',
      iconColor: 'text-teal-600',
      videoTitle: 'Aplicaciones y Enlaces'
    },
    {
      icon: 'Phone',
      title: 'Contáctenos',
      key: 'contactenos',
      description: 'Información de contacto',
      color: 'bg-red-50/60 border-red-200/40',
      iconColor: 'text-red-600',
      videoTitle: 'Oficinas y Contacto'
    }
  ],

  // Estructura completa del menú anidado
  menuStructure: {
    inicio: [
      { icon: 'Home', title: 'Página Principal', key: 'pagina-principal' },
      { 
        icon: 'FileText', 
        title: 'Publicidad', 
        key: 'publicidad',
        description: 'Información publicitaria y promocional'
      },
      { 
        icon: 'Globe', 
        title: 'Redes Sociales', 
        key: 'redes-sociales',
        description: 'Síguenos en nuestras redes sociales'
      }
    ],
    nosotros: [
      { 
        icon: 'FileText', 
        title: 'Historia', 
        key: 'historia',
        images: [
          { url: '/placeholder.svg', title: 'Fundación de la CGC', description: 'Momento histórico de la creación' },
          { url: '/placeholder.svg', title: 'Primeras instalaciones', description: 'Edificio original de la institución' }
        ]
      },
      {
        icon: 'Users',
        title: 'Autoridades',
        key: 'autoridades',
        children: [
          { icon: 'Users', title: 'Autoridades Superiores', key: 'autoridades-superiores' },
          { icon: 'Building', title: 'Organigrama de la CGC', key: 'organigrama' },
          { icon: 'Scale', title: 'Atribuciones de la CGC', key: 'atribucion' },
          { icon: 'Award', title: 'Consejo Consultivo', key: 'consejo-consultivo' }
        ]
      },
      { 
        icon: 'Award', 
        title: 'Filosofía Institucional', 
        key: 'filosofia',
        children: [
          { icon: 'FileText', title: 'Misión', key: 'mision' },
          { icon: 'FileText', title: 'Visión', key: 'vision' },
          { icon: 'FileText', title: 'Valores', key: 'valores' },
          { icon: 'FileText', title: 'Objetivos', key: 'objetivos' }
        ]
      },
      { icon: 'FileText', title: 'Código de Ética y su Reglamento', key: 'codigo-etica' },
      { icon: 'Building', title: 'Estructura Organizacional', key: 'estructura' },
      { icon: 'MapPin', title: 'Ubicación', key: 'ubicacion' }
    ],
    legislacion: [
      { 
        icon: 'Scale', 
        title: 'Leyes y Reglamentos', 
        key: 'leyes-reglamentos',
        children: [
          { icon: 'FileText', title: 'Ley Orgánica de la CGC', key: 'ley-organica' },
          { icon: 'FileText', title: 'Reglamento de la Ley Orgánica', key: 'reglamento-ley' },
          { icon: 'FileText', title: 'Ley de Probidad y Responsabilidades', key: 'ley-probidad' },
          { icon: 'FileText', title: 'Ley de Libre Acceso a la Información', key: 'ley-acceso-info' }
        ]
      },
      {
        icon: 'FileText',
        title: 'Acuerdos Gubernativos',
        key: 'acuerdos-gubernativos',
        children: [
          { icon: 'FileText', title: 'Acuerdo Gubernativo No. 364-2013', key: 'acuerdo-364-2013' },
          { icon: 'FileText', title: 'Acuerdo Gubernativo No. 148-2022', key: 'acuerdo-148-2022' },
          { icon: 'FileText', title: 'Acuerdo Gubernativo No. 17-2022', key: 'acuerdo-17-2022' },
          { icon: 'FileText', title: 'Acuerdo Gubernativo No. 93-2020', key: 'acuerdo-93-2020' }
        ]
      },
      {
        icon: 'Settings',
        title: 'Auditoría Interna Gubernamental',
        key: 'auditoria-interna',
        children: [
          { icon: 'FileText', title: 'Normas de Auditoría Interna Gubernamental', key: 'normas-auditoria' },
          { icon: 'BookOpen', title: 'Manual de Auditoría Interna Gubernamental', key: 'manual-auditoria' },
          { icon: 'Settings', title: 'Organización de Auditoría Interna Gubernamental', key: 'organiza-auditoria' },
          { icon: 'FileText', title: 'Metodología de Evaluación', key: 'metodologia-evaluacion' }
        ]
      },
      { icon: 'FileText', title: 'Normas Generales de Control Interno', key: 'normas-control' },
      { icon: 'BookOpen', title: 'Manuales y Procedimientos', key: 'manuales' }
    ],
    servicios: [
      { 
        icon: 'Globe', 
        title: 'Servicios en Línea', 
        key: 'servicios-linea',
        children: [
          { icon: 'FileText', title: 'Consulta de Auditorías', key: 'consulta-auditorias' },
          { icon: 'Users', title: 'Registro de Proveedores', key: 'registro-proveedores' },
          { icon: 'FileText', title: 'Declaraciones Patrimoniales', key: 'declaraciones' },
          { icon: 'Globe', title: 'Portal de Transparencia', key: 'portal-transparencia' }
        ]
      },
      { 
        icon: 'MapPin', 
        title: 'Delegaciones Departamentales', 
        key: 'delegaciones',
        children: [
          { icon: 'MapPin', title: 'Región I - Norte', key: 'region-norte' },
          { icon: 'MapPin', title: 'Región II - Nororiente', key: 'region-nororiente' },
          { icon: 'MapPin', title: 'Región III - Suroccidente', key: 'region-suroccidente' },
          { icon: 'MapPin', title: 'Región IV - Central', key: 'region-central' },
          { icon: 'MapPin', title: 'Región V - Suroriente', key: 'region-suroriente' },
          { icon: 'MapPin', title: 'Región VI - Petén', key: 'region-peten' }
        ]
      },
      {
        icon: 'Building',
        title: 'Oficinas Regionales',
        key: 'oficinas-regionales',
        children: [
          { icon: 'Building', title: 'Oficina Central Zona 1', key: 'zona-1' },
          { icon: 'Building', title: 'Oficina Zona 10', key: 'zona-10' },
          { icon: 'Building', title: 'Oficina Zona 13', key: 'zona-13' }
        ]
      },
      { icon: 'Phone', title: 'Centro de Atención Ciudadana', key: 'atencion-ciudadana' },
      { icon: 'FileText', title: 'Trámites y Requisitos', key: 'tramites' }
    ],
    publicaciones: [
      { 
        icon: 'FileText', 
        title: 'Informes de Auditoría', 
        key: 'informes-auditoria',
        children: [
          { icon: 'FileText', title: 'Auditorías Gubernamentales', key: 'auditorias-gubernamentales' },
          { icon: 'FileText', title: 'Auditorías Municipales', key: 'auditorias-municipales' },
          { icon: 'FileText', title: 'Auditorías de Obras Públicas', key: 'auditorias-obras' },
          { icon: 'FileText', title: 'Auditorías Especiales', key: 'auditorias-especiales' }
        ]
      },
      { 
        icon: 'BookOpen', 
        title: 'Boletines y Comunicados', 
        key: 'boletines',
        children: [
          { icon: 'BookOpen', title: 'Boletín Institucional', key: 'boletin-institucional' },
          { icon: 'BookOpen', title: 'Comunicados de Prensa', key: 'comunicados-prensa' },
          { icon: 'BookOpen', title: 'Circulares', key: 'circulares' }
        ]
      },
      { icon: 'Award', title: 'Memoria de Labores', key: 'memoria-labores' },
      { icon: 'FileText', title: 'Plan Operativo Anual', key: 'plan-operativo' },
      { icon: 'FileText', title: 'Informes de Gestión', key: 'informes-gestion' }
    ],
    enlaces: [
      { 
        icon: 'Globe', 
        title: 'Portales Gubernamentales', 
        key: 'portales-gubernamentales',
        children: [
          { icon: 'Globe', title: 'Portal del Gobierno de Guatemala', key: 'portal-gobierno' },
          { icon: 'Globe', title: 'Portal de Transparencia', key: 'portal-transparencia-gov' },
          { icon: 'Globe', title: 'Superintendencia de Administración Tributaria', key: 'sat' },
          { icon: 'Globe', title: 'Registro de Ciudadanos', key: 'registro-ciudadanos' }
        ]
      },
      { 
        icon: 'Link', 
        title: 'Organismos Internacionales', 
        key: 'organismos-internacionales',
        children: [
          { icon: 'Globe', title: 'OLACEFS', key: 'olacefs' },
          { icon: 'Globe', title: 'INTOSAI', key: 'intosai' },
          { icon: 'Globe', title: 'Banco Mundial', key: 'banco-mundial' },
          { icon: 'Globe', title: 'BID', key: 'bid' }
        ]
      },
      { icon: 'FileText', title: 'Bases Legales', key: 'bases-legales' },
      { icon: 'Settings', title: 'Sistemas de Información', key: 'sistemas-informacion' }
    ],
    contactenos: [
      { 
        icon: 'Phone', 
        title: 'Información de Contacto', 
        key: 'info-contacto',
        children: [
          { icon: 'Phone', title: 'Teléfonos', key: 'telefonos' },
          { icon: 'Mail', title: 'Correos Electrónicos', key: 'correos' },
          { icon: 'MapPin', title: 'Direcciones', key: 'direcciones' }
        ]
      },
      { icon: 'MapPin', title: 'Ubicación de Oficinas', key: 'ubicacion-oficinas' },
      { icon: 'FileText', title: 'Formulario de Contacto', key: 'formulario-contacto' },
      { icon: 'Settings', title: 'Servicios de Atención', key: 'servicios-atencion' },
      { icon: 'Phone', title: 'Línea Directa', key: 'linea-directa' }
    ]
  },

  // Redes sociales
  socialMedia: [
    {
      name: 'Facebook',
      icon: 'facebook',
      url: 'https://facebook.com/cgc-guatemala',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: 'twitter',
      url: 'https://twitter.com/cgc-guatemala',
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'YouTube',
      icon: 'youtube',
      url: 'https://youtube.com/cgc-guatemala',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      url: 'https://instagram.com/cgc-guatemala',
      color: 'bg-pink-600 hover:bg-pink-700'
    }
  ],

  // Carrusel de imágenes
  carouselImages: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
      title: 'Instalaciones Principales',
      description: 'Vista de las oficinas centrales de la CGC'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
      title: 'Sala de Auditorías',
      description: 'Espacio donde se llevan a cabo las auditorías'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
      title: 'Centro de Atención',
      description: 'Área de servicio al ciudadano'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
      title: 'Archivo de Documentos',
      description: 'Área de resguardo de documentos importantes'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
      title: 'Eventos Institucionales',
      description: 'Ceremonias y eventos de la institución'
    }
  ],

  // Publicidad
  advertisements: [
    {
      id: '1',
      title: 'Consulta de Auditorías en Línea',
      description: 'Accede a los informes de auditoría de manera rápida y segura',
      imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
      link: '/servicios/consulta-auditorias'
    },
    {
      id: '2',
      title: 'Portal de Transparencia',
      description: 'Información pública disponible para todos los ciudadanos',
      imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
      link: '/transparencia'
    }
  ],

  // Contenido de la página principal
  heroContent: {
    title: 'Contraloría General de Cuentas',
    subtitle: 'Transparencia, Control y Fiscalización',
    description: 'Ejercemos control gubernamental para el uso transparente y eficiente de los recursos públicos, promoviendo la rendición de cuentas en beneficio de la sociedad guatemalteca.',
    ctaButtons: {
      primary: { text: 'Consultar Auditorías', icon: 'Search' },
      secondary: { text: 'Documentos Públicos', icon: 'FileText' }
    },
    features: [
      {
        title: 'Control Gubernamental',
        description: 'Fiscalizamos el uso de los recursos públicos para garantizar transparencia y eficiencia.',
        icon: 'Shield',
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Auditorías',
        description: 'Realizamos auditorías integrales para verificar el cumplimiento de la normativa vigente.',
        icon: 'FileText',
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: 'Servicio Ciudadano',
        description: 'Brindamos servicios de calidad para facilitar el acceso a la información pública.',
        icon: 'Users',
        color: 'from-teal-500 to-teal-600'
      }
    ]
  }
};

/**
 * Hook personalizado para obtener el contenido desde la "API"
 * Simula la carga de datos con un delay para imitar una llamada real
 */
export const useContentAPI = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mainNavItems, setMainNavItems] = useState<MenuItem[]>([]);
  const [menuStructure, setMenuStructure] = useState<Record<string, MenuItem[]>>({});
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    // Simular llamada a API con delay
    const fetchContent = async () => {
      setIsLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // "Obtener" datos de la API
      setMainNavItems(mockApiData.mainNavItems);
      setMenuStructure(mockApiData.menuStructure);
      setHeroContent(mockApiData.heroContent);
      setSocialMedia(mockApiData.socialMedia);
      setCarouselImages(mockApiData.carouselImages);
      setAdvertisements(mockApiData.advertisements);
      
      setIsLoading(false);
    };

    fetchContent();
  }, []);

  return {
    isLoading,
    mainNavItems,
    menuStructure,
    heroContent,
    socialMedia,
    carouselImages,
    advertisements,
    // Función para actualizar contenido (simula PUT/PATCH a API)
    updateContent: (newContent: Partial<typeof mockApiData>) => {
      if (newContent.mainNavItems) setMainNavItems(newContent.mainNavItems);
      if (newContent.menuStructure) setMenuStructure(newContent.menuStructure);
      if (newContent.heroContent) setHeroContent(newContent.heroContent);
      if (newContent.socialMedia) setSocialMedia(newContent.socialMedia);
      if (newContent.carouselImages) setCarouselImages(newContent.carouselImages);
      if (newContent.advertisements) setAdvertisements(newContent.advertisements);
    }
  };
};
