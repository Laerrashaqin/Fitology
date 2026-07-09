import React from 'react';

interface ImageAutoSliderProps {
  images?: string[];
}

export const ImageAutoSlider = ({ images: customImages }: ImageAutoSliderProps) => {
  // Images for the infinite scroll - using Unsplash URLs
  const defaultImages = [
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1711434824963-ca894373272e?q=80&w=2030&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1675705721263-0bbeec261c49?q=80&w=1940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop"
  ];

  const images = customImages || defaultImages;

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .infinite-scroll {
          animation: scroll-right 20s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      
      <div className="w-full bg-[#FAFAFA] relative overflow-hidden flex items-center justify-center py-4 mb-8">
        
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center py-4">
          <div className="scroll-container w-full">
            <div className="infinite-scroll flex gap-4 md:gap-6 w-max">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-32 h-40 md:w-48 md:h-64 lg:w-56 lg:h-72 rounded-xl overflow-hidden shadow-md"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
