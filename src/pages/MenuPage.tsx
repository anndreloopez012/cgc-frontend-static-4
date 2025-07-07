/**
 * Componente MenuPage
 * 
 * Página principal para mostrar contenido dinámico de diferentes secciones del sitio.
 * Soporta múltiples tipos de contenido: PDFs, imágenes, videos y contenido HTML.
 * 
 * Características principales:
 * - Carga de contenido mediante API simulada
 * - Ordenamiento por campo 'order' (separado para PDFs y otros tipos)
 * - Filtrado y búsqueda específica para PDFs
 * - Visualización responsive con grid de 12 columnas
 * - Sliders interactivos para imágenes y videos
 * - Modal de pantalla completa con zoom para imágenes y videos
 * - Visualizador integrado de PDFs
 * 
 * Flujo de renderizado:
 * 1. Contenido no-PDF ordenado por campo 'order'
 * 2. Barra de búsqueda y filtros (solo para PDFs)
 * 3. Contenido PDF filtrado y ordenado por campo 'order'
 * 
 * @author Sistema de Gestión de Contenido
 * @version 3.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, Search, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, RotateCcw, X, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFViewer from '@/components/PDFViewer';
import { fetchPageContent, ContentItem, PageContent } from '@/data/menuContentAPI';

/**
 * Estado para manejo de sliders de imágenes
 * Controla la navegación, modal y zoom de galerías de imágenes
 */
interface ImageSliderState {
  currentIndex: number;      // Índice de imagen actual en el slider
  isModalOpen: boolean;      // Estado del modal de zoom
  modalImageIndex: number;   // Índice de imagen en el modal
  zoomLevel: number;        // Nivel de zoom (0.5 - 3.0)
  imagePosition: { x: number; y: number }; // Posición de la imagen para pan
}

/**
 * Estado para manejo de sliders de videos
 * Controla la navegación y reproducción de videos
 */
interface VideoSliderState {
  currentIndex: number;  // Índice de video actual
  isPlaying: boolean;   // Estado de reproducción
  isModalOpen: boolean; // Estado del modal de pantalla completa
  modalVideoIndex: number; // Índice del video en el modal
}

/**
 * Componente principal MenuPage
 */
const MenuPage = () => {
  // Hooks de React Router
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  
  // Estados principales
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPDF, setSelectedPDF] = useState<ContentItem | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para manejo de sliders
  const [imageSliders, setImageSliders] = useState<{[key: string]: ImageSliderState}>({});
  const [videoSliders, setVideoSliders] = useState<{[key: string]: VideoSliderState}>({});

  /**
   * Efecto para cargar contenido de la página
   * Se ejecuta cuando cambia la sección en la URL
   */
  useEffect(() => {
    const loadPageContent = async () => {
      console.log('[MenuPage] Iniciando carga de contenido para sección:', section);
      setIsLoading(true);
      setError(null);
      
      try {
        // Si no hay sección, usar 'actualizacion-datos' como default
        const sectionToLoad = section || 'actualizacion-datos';
        const content = await fetchPageContent(sectionToLoad);
        
        if (content) {
          console.log('[MenuPage] Contenido cargado exitosamente:', content.title);
          setPageContent(content);
          setSelectedCategory('Todos');
        } else {
          console.log('[MenuPage] No se encontró contenido específico, cargando contenido por defecto');
          // Intentar cargar contenido por defecto
          const defaultContent = await fetchPageContent('actualizacion-datos');
          if (defaultContent) {
            setPageContent(defaultContent);
          } else {
            console.error('[MenuPage] No se pudo cargar ningún contenido');
            setError('No se pudo cargar el contenido de la página');
          }
        }
      } catch (err) {
        console.error('[MenuPage] Error al cargar contenido:', err);
        // En caso de error, intentar cargar contenido por defecto
        try {
          const defaultContent = await fetchPageContent('actualizacion-datos');
          if (defaultContent) {
            setPageContent(defaultContent);
          } else {
            setError('Error al cargar el contenido');
          }
        } catch (defaultErr) {
          setError('Error al cargar el contenido');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPageContent();
  }, [section]);

  /**
   * Separación y ordenamiento del contenido por tipo
   * Los PDFs se muestran al final con filtros separados
   * Cada tipo se ordena por su campo 'order'
   */
  const nonPdfContent = pageContent?.content
    .filter(item => item.type !== 'pdf')
    .sort((a, b) => a.order - b.order) || [];
  
  const pdfContent = pageContent?.content
    .filter(item => item.type === 'pdf')
    .sort((a, b) => a.order - b.order) || [];

  /**
   * Filtrado de contenido PDF
   * Aplica filtros de categoría y búsqueda solo a PDFs
   * Mantiene el ordenamiento después del filtrado
   */
  const filteredPdfContent = pdfContent.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /**
   * Filtrado de contenido no-PDF
   * Solo aplica búsqueda, sin filtros de categoría
   * Mantiene el ordenamiento original
   */
  const filteredNonPdfContent = nonPdfContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  /**
   * Obtención de categorías solo de PDFs
   * Las categorías del filtro se generan únicamente del contenido PDF
   */
  const pdfCategories = ['Todos', ...Array.from(new Set(pdfContent.map(item => item.category)))];

  // Funciones para manejo de PDFs
  const handleViewPDF = (item: ContentItem) => {
    console.log('[MenuPage] Abriendo visualizador PDF:', item.title);
    setSelectedPDF(item);
    setIsPDFViewerOpen(true);
  };

  const handleDownloadPDF = (item: ContentItem) => {
    console.log('[MenuPage] Iniciando descarga PDF:', item.title);
    const link = window.document.createElement('a');
    link.href = item.url || '';
    link.download = `${item.title}.pdf`;
    link.click();
  };

  // ==================== FUNCIONES PARA SLIDER DE IMÁGENES ====================

  /**
   * Función para manejar el arrastre en imágenes con zoom
   */
  const handleMouseDown = (itemId: string, e: React.MouseEvent) => {
    const sliderState = getImageSliderState(itemId);
    if (sliderState.zoomLevel > 1) {
      updateImageSliderState(itemId, {
        imagePosition: {
          x: e.clientX - sliderState.imagePosition.x,
          y: e.clientY - sliderState.imagePosition.y
        }
      });
    }
  };

  const handleMouseMove = (itemId: string, e: React.MouseEvent) => {
    const sliderState = getImageSliderState(itemId);
    if (sliderState.zoomLevel > 1) {
      updateImageSliderState(itemId, {
        imagePosition: {
          x: e.clientX - sliderState.imagePosition.x,
          y: e.clientY - sliderState.imagePosition.y
        }
      });
    }
  };

  /**
   * Obtiene el estado actual del slider de imágenes
   * @param itemId ID del elemento de contenido
   * @returns Estado del slider o estado por defecto
   */
  const getImageSliderState = (itemId: string): ImageSliderState => {
    return imageSliders[itemId] || {
      currentIndex: 0,
      isModalOpen: false,
      modalImageIndex: 0,
      zoomLevel: 1,
      imagePosition: { x: 0, y: 0 }
    };
  };

  /**
   * Actualiza el estado del slider de imágenes
   * @param itemId ID del elemento
   * @param updates Actualizaciones parciales del estado
   */
  const updateImageSliderState = (itemId: string, updates: Partial<ImageSliderState>) => {
    setImageSliders(prev => ({
      ...prev,
      [itemId]: { ...getImageSliderState(itemId), ...updates }
    }));
  };

  /**
   * Navega a la siguiente imagen en el slider
   */
  const nextImageSlide = (itemId: string, totalImages: number) => {
    const current = getImageSliderState(itemId).currentIndex;
    updateImageSliderState(itemId, {
      currentIndex: current === totalImages - 1 ? 0 : current + 1
    });
  };

  /**
   * Navega a la imagen anterior en el slider
   */
  const prevImageSlide = (itemId: string, totalImages: number) => {
    const current = getImageSliderState(itemId).currentIndex;
    updateImageSliderState(itemId, {
      currentIndex: current === 0 ? totalImages - 1 : current - 1
    });
  };

  /**
   * Abre el modal de zoom para una imagen específica
   */
  const openImageModal = (itemId: string, imageIndex: number) => {
    updateImageSliderState(itemId, {
      isModalOpen: true,
      modalImageIndex: imageIndex,
      zoomLevel: 1,
      imagePosition: { x: 0, y: 0 }
    });
  };

  /**
   * Cierra el modal de zoom
   */
  const closeImageModal = (itemId: string) => {
    updateImageSliderState(itemId, {
      isModalOpen: false,
      zoomLevel: 1,
      imagePosition: { x: 0, y: 0 }
    });
  };

  // ==================== FUNCIONES PARA SLIDER DE VIDEOS ====================

  /**
   * Obtiene el estado actual del slider de videos
   */
  const getVideoSliderState = (itemId: string): VideoSliderState => {
    return videoSliders[itemId] || {
      currentIndex: 0,
      isPlaying: true,
      isModalOpen: false,
      modalVideoIndex: 0
    };
  };

  /**
   * Actualiza el estado del slider de videos
   */
  const updateVideoSliderState = (itemId: string, updates: Partial<VideoSliderState>) => {
    setVideoSliders(prev => ({
      ...prev,
      [itemId]: { ...getVideoSliderState(itemId), ...updates }
    }));
  };

  /**
   * Navega al siguiente video
   */
  const nextVideoSlide = (itemId: string, totalVideos: number) => {
    const current = getVideoSliderState(itemId).currentIndex;
    updateVideoSliderState(itemId, {
      currentIndex: current === totalVideos - 1 ? 0 : current + 1
    });
  };

  /**
   * Navega al video anterior
   */
  const prevVideoSlide = (itemId: string, totalVideos: number) => {
    const current = getVideoSliderState(itemId).currentIndex;
    updateVideoSliderState(itemId, {
      currentIndex: current === 0 ? totalVideos - 1 : current - 1
    });
  };

  /**
   * Abre el modal de pantalla completa para videos
   */
  const openVideoModal = (itemId: string, videoIndex: number) => {
    updateVideoSliderState(itemId, {
      isModalOpen: true,
      modalVideoIndex: videoIndex
    });
  };

  /**
   * Cierra el modal de pantalla completa para videos
   */
  const closeVideoModal = (itemId: string) => {
    updateVideoSliderState(itemId, {
      isModalOpen: false
    });
  };

  // ==================== FUNCIONES DE RENDERIZADO ====================

  /**
   * Renderiza tarjetas de contenido PDF con diseño formal gubernamental
   * Diseño sobrio sin esquinas redondeadas
   */
  const renderPDFContent = (item: ContentItem) => (
    <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in h-full overflow-hidden">
      {/* Imagen principal formal */}
      {item.thumbnail && (
        <div className="relative h-48 w-full overflow-hidden group">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium">
              {item.subtype || 'PDF'}
            </span>
          </div>
          
          {item.size && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-white text-gray-700 text-xs">
                {item.size}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 font-medium">
            {item.category}
          </span>
          {item.downloadCount && (
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {item.downloadCount}
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          Actualizado: {item.lastUpdated}
        </div>
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <Button
          onClick={() => handleViewPDF(item)}
          className="flex-1 bg-gray-800 hover:bg-gray-900 text-white transition-colors duration-200"
          size="sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Documento
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDownloadPDF(item)}
          size="sm"
          className="border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  /**
   * Renderiza contenido de tipo imagen con slider interactivo y modal de pantalla completa
   */
  const renderImageContent = (item: ContentItem) => {
    const sliderState = getImageSliderState(item.id);
    const isMultipleImages = item.images && item.images.length > 1;
    
    if (!item.images || item.images.length === 0) return null;

    return (
      <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up h-full">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600">
            {item.description}
          </p>
        </div>

        <div className="relative">
          {isMultipleImages ? (
            <div className="relative h-64 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${sliderState.currentIndex * 100}%)` }}
              >
                {item.images.map((image, index) => (
                  <div key={image.id} className="w-full h-full flex-shrink-0 relative group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => openImageModal(item.id, index)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold drop-shadow-lg">{image.title}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => prevImageSlide(item.id, item.images!.length)}
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                onClick={() => nextImageSlide(item.id, item.images!.length)}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => updateImageSliderState(item.id, { currentIndex: index })}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === sliderState.currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 relative group">
              <img
                src={item.images[0].src}
                alt={item.images[0].alt}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openImageModal(item.id, 0)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold drop-shadow-lg">{item.images[0].title}</h4>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 font-medium">
              {item.category}
            </span>
            <span>Actualizado: {item.lastUpdated}</span>
          </div>
        </div>

        {/* Modal de pantalla completa con zoom para imágenes - ARREGLADO PARA PANTALLA COMPLETA */}
        {sliderState.isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
            <div className="absolute inset-0 flex items-center justify-center p-0">
              {/* Imagen con tamaño completo de pantalla */}
              <div 
                className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => handleMouseDown(item.id, e)}
                onMouseMove={(e) => handleMouseMove(item.id, e)}
              >
                <img
                  src={item.images![sliderState.modalImageIndex].src}
                  alt={item.images![sliderState.modalImageIndex].alt}
                  className="w-full h-full object-contain transition-transform duration-200 select-none"
                  style={{
                    transform: `scale(${sliderState.zoomLevel}) translate(${sliderState.imagePosition.x / sliderState.zoomLevel}px, ${sliderState.imagePosition.y / sliderState.zoomLevel}px)`,
                    cursor: sliderState.zoomLevel > 1 ? 'grab' : 'default'
                  }}
                  draggable={false}
                />
              </div>
              
              {/* Controles del modal */}
              <Button
                onClick={() => closeImageModal(item.id)}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Controles de zoom */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <Button
                  onClick={() => updateImageSliderState(item.id, { zoomLevel: Math.min(sliderState.zoomLevel + 0.25, 3) })}
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                  disabled={sliderState.zoomLevel >= 3}
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => updateImageSliderState(item.id, { zoomLevel: Math.max(sliderState.zoomLevel - 0.25, 0.5) })}
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                  disabled={sliderState.zoomLevel <= 0.5}
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => updateImageSliderState(item.id, { zoomLevel: 1, imagePosition: { x: 0, y: 0 } })}
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>

              {/* Indicador de zoom */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
                {Math.round(sliderState.zoomLevel * 100)}%
              </div>

              {/* Navegación entre imágenes si hay múltiples */}
              {item.images!.length > 1 && (
                <>
                  <Button
                    onClick={() => {
                      const newIndex = sliderState.modalImageIndex === 0 ? item.images!.length - 1 : sliderState.modalImageIndex - 1;
                      updateImageSliderState(item.id, { modalImageIndex: newIndex, zoomLevel: 1, imagePosition: { x: 0, y: 0 } });
                    }}
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    onClick={() => {
                      const newIndex = sliderState.modalImageIndex === item.images!.length - 1 ? 0 : sliderState.modalImageIndex + 1;
                      updateImageSliderState(item.id, { modalImageIndex: newIndex, zoomLevel: 1, imagePosition: { x: 0, y: 0 } });
                    }}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Título en el modal */}
              <div className="absolute bottom-4 left-4 right-4 text-center z-10">
                <h3 className="text-white text-xl font-semibold drop-shadow-lg">
                  {item.images![sliderState.modalImageIndex].title}
                </h3>
                <div className="text-white/70 text-sm mt-1">
                  {sliderState.zoomLevel > 1 && "Arrastra para mover la imagen"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renderiza contenido de tipo video con slider interactivo y modal de pantalla completa
   */
  const renderVideoContent = (item: ContentItem) => {
    const sliderState = getVideoSliderState(item.id);
    const isMultipleVideos = item.videos && item.videos.length > 1;
    
    if (!item.videos || item.videos.length === 0) return null;

    return (
      <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up h-full">
        <div className="p-6 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600">
            {item.description}
          </p>
        </div>

        <div className="relative">
          {isMultipleVideos ? (
            <div className="relative">
              <div className="h-64 relative group">
                {item.videos[sliderState.currentIndex].type === 'iframe' ? (
                  <iframe
                    src={item.videos[sliderState.currentIndex].src}
                    title={item.videos[sliderState.currentIndex].title}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={item.videos[sliderState.currentIndex].src}
                    controls
                    className="w-full h-full rounded-lg object-cover"
                    poster={item.videos[sliderState.currentIndex].thumbnail}
                  />
                )}
                
                <Button
                  onClick={() => openVideoModal(item.id, sliderState.currentIndex)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={() => prevVideoSlide(item.id, item.videos!.length)}
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                onClick={() => nextVideoSlide(item.id, item.videos!.length)}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {item.videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => updateVideoSliderState(item.id, { currentIndex: index })}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === sliderState.currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <div className="absolute top-2 left-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                  {item.videos[sliderState.currentIndex].title}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 relative group">
              {item.videos[0].type === 'iframe' ? (
                <iframe
                  src={item.videos[0].src}
                  title={item.videos[0].title}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <video
                  src={item.videos[0].src}
                  controls
                  className="w-full h-full rounded-lg object-cover"
                  poster={item.videos[0].thumbnail}
                />
              )}
              
              <Button
                onClick={() => openVideoModal(item.id, 0)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 font-medium">
              {item.category}
            </span>
            <span>Actualizado: {item.lastUpdated}</span>
          </div>
        </div>

        {/* Modal de pantalla completa para videos - ARREGLADO PARA PANTALLA COMPLETA */}
        {sliderState.isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
            <div className="absolute inset-0 flex items-center justify-center p-0">
              {/* Video con tamaño completo de pantalla */}
              <div className="relative w-full h-full">
                {item.videos![sliderState.modalVideoIndex].type === 'iframe' ? (
                  <iframe
                    src={item.videos![sliderState.modalVideoIndex].src}
                    title={item.videos![sliderState.modalVideoIndex].title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={item.videos![sliderState.modalVideoIndex].src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    poster={item.videos![sliderState.modalVideoIndex].thumbnail}
                  />
                )}
              </div>
              
              {/* Controles del modal */}
              <Button
                onClick={() => closeVideoModal(item.id)}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navegación entre videos si hay múltiples */}
              {item.videos!.length > 1 && (
                <>
                  <Button
                    onClick={() => {
                      const newIndex = sliderState.modalVideoIndex === 0 ? item.videos!.length - 1 : sliderState.modalVideoIndex - 1;
                      updateVideoSliderState(item.id, { modalVideoIndex: newIndex });
                    }}
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <Button
                    onClick={() => {
                      const newIndex = sliderState.modalVideoIndex === item.videos!.length - 1 ? 0 : sliderState.modalVideoIndex + 1;
                      updateVideoSliderState(item.id, { modalVideoIndex: newIndex });
                    }}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Título en el modal */}
              <div className="absolute bottom-4 left-4 right-4 text-center z-10">
                <h3 className="text-white text-xl font-semibold drop-shadow-lg">
                  {item.videos![sliderState.modalVideoIndex].title}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renderiza contenido de tipo contenido HTML enriquecido
   */
  const renderContentType = (item: ContentItem) => (
    <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up h-full">
      <div className="p-6 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600">
          {item.description}
        </p>
      </div>

      <div className="p-6">
        <div 
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: item.content || '' }}
        />
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 font-medium">
            {item.category}
          </span>
          <span>Actualizado: {item.lastUpdated}</span>
        </div>
      </div>
    </div>
  );

  /**
   * Obtiene la clase CSS correspondiente al número de columnas
   * @param col Número de columnas (1-12)
   * @returns Clase CSS de Tailwind
   */
  const getResponsiveColumnClass = (col: number) => {
    // Para móviles (sm y menores): máximo 2 columnas, preferiblemente 1
    // Para tablets (md): máximo 3 columnas
    // Para desktop (lg y mayores): usar el valor original
    
    let mobileClass = 'col-span-12'; // Por defecto, ancho completo en móvil
    let tabletClass = 'md:col-span-6'; // Mitad del ancho en tablet
    let desktopClass = `lg:col-span-${col}`; // Valor original en desktop
    
    // Ajustes específicos para diferentes tamaños de columna
    if (col <= 3) {
      mobileClass = 'col-span-12'; // Ancho completo en móvil
      tabletClass = 'md:col-span-6'; // Mitad en tablet
    } else if (col <= 6) {
      mobileClass = 'col-span-12'; // Ancho completo en móvil
      tabletClass = 'md:col-span-6'; // Mitad en tablet
    } else if (col <= 8) {
      mobileClass = 'col-span-12'; // Ancho completo en móvil
      tabletClass = 'md:col-span-8'; // Casi todo el ancho en tablet
    } else {
      mobileClass = 'col-span-12'; // Ancho completo en móvil
      tabletClass = 'md:col-span-12'; // Ancho completo en tablet
    }
    
    return `${mobileClass} ${tabletClass} ${desktopClass}`;
  };

  // Estados de carga y error simplificados - SIN LOADING CIRCULAR
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-gray-600 text-lg font-medium">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="bg-red-100 border-2 border-red-300 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 transition-all duration-300">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contenido no encontrado</h1>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">No se pudo encontrar el contenido solicitado.</p>
          <Button onClick={() => navigate('/')} className="transition-all duration-300">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  console.log('[MenuPage] Renderizando página:', pageContent.title);
  console.log('[MenuPage] Contenido no-PDF (ordenado):', filteredNonPdfContent.length);
  console.log('[MenuPage] Contenido PDF (ordenado):', filteredPdfContent.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header estilo gobierno */}
      <div className="w-full bg-primary z-50 relative">
        <header className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo del gobierno */}
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <img 
                    src="/lovable-uploads/be6267fe-c26a-4dd8-bdc3-95323c6a0fd7.png" 
                    alt="CGC Logo" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Botón volver */}
              <div className="flex items-center">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-white text-primary hover:bg-gray-100 shadow-lg transition-all duration-300"
                  size="sm"
                  aria-label="Volver al inicio"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-sm">Volver</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Contenido de la página */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageContent.title}</h1>
          <p className="text-gray-600 max-w-4xl">{pageContent.description}</p>
        </div>

        {/* 1. CONTENIDO NO-PDF PRIMERO (ORDENADO POR 'order') */}
        {filteredNonPdfContent.length > 0 && (
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              {filteredNonPdfContent.map((item, index) => (
                <div
                  key={item.id}
                  className={`${getResponsiveColumnClass(item.col)} animate-fade-in`}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  {item.type === 'image' && renderImageContent(item)}
                  {item.type === 'video' && renderVideoContent(item)}
                  {item.type === 'content' && renderContentType(item)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. BARRA DE BÚSQUEDA Y FILTROS (SOLO SI HAY PDFs) */}
        {pdfContent.length > 0 && (
          <div className="mb-8 bg-white border border-gray-300 p-6 shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar documentos PDF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                {pdfCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 
                      "bg-gray-800 hover:bg-gray-900 text-white transition-all duration-200" : 
                      "border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. CONTENIDO PDF AL FINAL (ORDENADO POR 'order') */}
        {pdfContent.length > 0 && (
          <div className="grid grid-cols-12 gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
            {filteredPdfContent.map((item, index) => (
              <div
                key={item.id}
                className={`${getResponsiveColumnClass(item.col)} animate-fade-in`}
                style={{ animationDelay: `${700 + (filteredNonPdfContent.length + index) * 100}ms` }}
              >
                {renderPDFContent(item)}
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {filteredNonPdfContent.length === 0 && filteredPdfContent.length === 0 && (
          <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontró contenido
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente.
            </p>
          </div>
        )}
      </div>

      {/* Visualizador de PDF */}
      {selectedPDF && (
        <PDFViewer
          isOpen={isPDFViewerOpen}
          pdfUrl={selectedPDF.url || ''}
          title={selectedPDF.title}
          onClose={() => {
            setIsPDFViewerOpen(false);
            setSelectedPDF(null);
          }}
        />
      )}
    </div>
  );
};

export default MenuPage;
