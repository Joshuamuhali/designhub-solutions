import React from 'react';

interface CarouselItemProps {
  image: string;
  alt: string;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({ image, alt }) => (
  <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <img 
      src={image} 
      alt={alt}
      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop";
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
      <div className="text-white text-sm font-medium">{alt}</div>
    </div>
  </div>
);
