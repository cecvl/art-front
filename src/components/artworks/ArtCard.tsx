import React, { useState } from 'react';
import '../../styles/ArtCard.css';

export interface ArtCardProps {
  image: string;
  title: string;
  description?: string;
  tags?: string[];
  price?: number; // Price in KES
  onClick?: () => void;
  onCartClick?: (e: React.MouseEvent) => void;
  artId?: string;
  height?: number;
  masonry?: boolean;
  className?: string;
  isInCart?: boolean;
}

const ArtCard: React.FC<ArtCardProps> = ({
  image,
  title,
  description,
  tags = [],
  price,
  onClick,
  onCartClick,
  height,
  masonry = false,
  className = '',
  isInCart = false,
}) => {
  const [showLightbox, setShowLightbox] = useState(false);

  // Debug: log what we're receiving
  console.log('ArtCard props:', { title, description, image });

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if cart icon was clicked
    if ((e.target as HTMLElement).closest('.art-card-cart-icon')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLightbox(true);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCartClick) {
      onCartClick(e);
    }
  };

  const cardClasses = `art-card ${masonry ? 'art-card-masonry' : ''} ${className}`.trim();

  return (
    <>
      <div className={cardClasses} onClick={handleCardClick}>
        <div className="art-card-image-wrapper">
          <img
            src={image}
            alt={title}
            className="art-card-image"
            style={height ? { height: `${height}px` } : undefined}
            onClick={handleImageClick}
          />
          {onCartClick && (
            <button
              className={`art-card-cart-icon ${isInCart ? 'selected' : ''}`}
              onClick={handleCartClick}
              aria-label={isInCart ? "Item in cart" : "Add to cart"}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21C10.5 21.8 9.8 22.5 9 22.5C8.2 22.5 7.5 21.8 7.5 21C7.5 20.2 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21C21.5 21.8 20.8 22.5 20 22.5C19.2 22.5 18.5 21.8 18.5 21C18.5 20.2 19.2 19.5 20 19.5Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="art-card-content">
          <div className="art-card-title">{title}</div>
          {description && (
            <div className="art-card-description">
              {description.length > 80 ? description.substring(0, 80) + '...' : description}
            </div>
          )}
          {tags.length > 0 && (
            <div className="art-card-tags">
              {tags.map((tag, index) => (
                <span key={index} className="art-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {price && (
            <div className="art-card-price">
              KES {price.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {showLightbox && (
        <div
          className="art-card-lightbox"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="art-card-lightbox-close"
            onClick={() => setShowLightbox(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={image}
            alt={title}
            className="art-card-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ArtCard;

