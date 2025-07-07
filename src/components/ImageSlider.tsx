import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Componente ImageSlider moderno y responsive con zoom
 */

interface SliderImage {
  id: string;
  src: string;
  alt: string;
  title: string;
}

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Imágenes del slider
  const images: SliderImage[] = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000',
      alt: 'Instalaciones CGC',
      title: 'Instalaciones Principales'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2000',
      alt: 'Tecnología y Control',
      title: 'Sistemas de Control'
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=2000',
      alt: 'Innovación',
      title: 'Innovación y Transparencia'
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000',
      alt: 'Auditoría Digital',
      title: 'Auditoría Digital'
    }
  ];

  // Auto-play efecto
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  // Reset zoom when modal opens/closes or image changes
  useEffect(() => {
    if (isModalOpen) {
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isModalOpen, modalImageIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const nextModalImage = () => {
    setModalImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevModalImage = () => {
    setModalImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Mouse drag functions for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile zoom and pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoomLevel > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - imagePosition.x, y: touch.clientY - imagePosition.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && zoomLevel > 1) {
      const touch = e.touches[0];
      setImagePosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      {/* Slider Principal */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl shadow-2xl bg-gray-900">
        {/* Imágenes del slider */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={image.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Contenido superpuesto */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  {image.title}
                </h3>
                <Button
                  onClick={() => openModal(index)}
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                >
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Ver imagen completa
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        <Button
          onClick={prevSlide}
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          onClick={nextSlide}
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Control de Play/Pause */}
        <Button
          onClick={togglePlayPause}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 rounded-full"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal de zoom mejorado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Imagen con zoom y pan */}
            <div 
              className="relative max-w-full max-h-full overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[modalImageIndex].src}
                alt={images[modalImageIndex].alt}
                className="max-w-full max-h-[90vh] object-contain transition-transform duration-200 select-none"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                draggable={false}
              />
            </div>
            
            {/* Controles del modal */}
            <Button
              onClick={closeModal}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Controles de zoom */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <Button
                onClick={zoomIn}
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                onClick={zoomOut}
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button
                onClick={resetZoom}
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicador de zoom */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
              {Math.round(zoomLevel * 100)}%
            </div>

            {/* Navegación del modal */}
            <Button
              onClick={prevModalImage}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              onClick={nextModalImage}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Título en el modal */}
            <div className="absolute bottom-4 left-4 right-4 text-center z-10">
              <h3 className="text-white text-xl font-semibold mb-2">
                {images[modalImageIndex].title}
              </h3>
              <div className="text-white/70 text-sm">
                {zoomLevel > 1 && "Arrastra para mover la imagen"}
              </div>
            </div>

            {/* Indicadores de imagen actual */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === modalImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageSlider;
