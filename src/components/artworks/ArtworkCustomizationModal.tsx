import { useState, useEffect } from 'react';
import '../../styles/ArtworkCustomizationModal.css';

export interface CustomizationOptions {
    material: string;
    size: string;
    frame: string;
}

export interface ArtworkCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
    };
    onAddToCart: (options: {
        artId: number;
        title: string;
        material: string;
        size: string;
        frame: string;
        image: string;
        price: number;
    }) => void;
    initialOptions?: CustomizationOptions;
    mode?: 'add' | 'edit';
}

// Pricing configuration
const PRICING = {
    materials: {
        Canvas: { base: 3000, multiplier: 1.0 },
        'Photo Paper': { base: 2000, multiplier: 0.8 },
        'Metal Print': { base: 5000, multiplier: 1.5 },
        'Acrylic Print': { base: 6000, multiplier: 1.8 },
    },
    sizes: {
        Small: 1.0,
        Medium: 1.5,
        Large: 2.0,
        'Extra Large': 2.5,
    },
    frames: {
        'No Frame': 0,
        'Black Frame': 1500,
        'White Frame': 1500,
        'Natural Wood': 2000,
        'Gold Frame': 2500,
    },
};

const ArtworkCustomizationModal = ({
    isOpen,
    onClose,
    artwork,
    onAddToCart,
    initialOptions,
    mode = 'add',
}: ArtworkCustomizationModalProps) => {
    const [material, setMaterial] = useState(initialOptions?.material || 'Canvas');
    const [size, setSize] = useState(initialOptions?.size || 'Medium');
    const [frame, setFrame] = useState(initialOptions?.frame || 'No Frame');

    // Reset selections when modal opens with new artwork
    useEffect(() => {
        if (isOpen && initialOptions) {
            setMaterial(initialOptions.material);
            setSize(initialOptions.size);
            setFrame(initialOptions.frame);
        } else if (isOpen && !initialOptions) {
            setMaterial('Canvas');
            setSize('Medium');
            setFrame('No Frame');
        }
    }, [isOpen, initialOptions]);

    // Calculate price based on selections
    const calculatePrice = (): number => {
        const materialConfig = PRICING.materials[material as keyof typeof PRICING.materials];
        const sizeMultiplier = PRICING.sizes[size as keyof typeof PRICING.sizes];
        const framePrice = PRICING.frames[frame as keyof typeof PRICING.frames];

        if (!materialConfig || !sizeMultiplier) return 0;

        const basePrice = materialConfig.base * materialConfig.multiplier * sizeMultiplier;
        return Math.round(basePrice + framePrice);
    };

    const handleSubmit = () => {
        const price = calculatePrice();
        onAddToCart({
            artId: Number(artwork.id),
            title: artwork.title,
            material,
            size,
            frame,
            image: artwork.imageUrl,
            price,
        });
        onClose();
    };

    if (!isOpen) return null;

    const price = calculatePrice();

    return (
        <div className="customization-modal-overlay" onClick={onClose}>
            <div className="customization-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <div className="modal-content">
                    <div className="modal-image-section">
                        <img src={artwork.imageUrl} alt={artwork.title} className="modal-artwork-image" />
                        <h2 className="modal-artwork-title">{artwork.title}</h2>
                    </div>

                    <div className="modal-options-section">
                        <h3 className="modal-section-title">Customize Your Print</h3>

                        {/* Material Selection */}
                        <div className="option-group">
                            <label className="option-label">Material</label>
                            <div className="option-buttons">
                                {Object.keys(PRICING.materials).map((mat) => (
                                    <button
                                        key={mat}
                                        className={`option-btn ${material === mat ? 'selected' : ''}`}
                                        onClick={() => setMaterial(mat)}
                                    >
                                        {mat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="option-group">
                            <label className="option-label">Size</label>
                            <div className="option-buttons">
                                {Object.keys(PRICING.sizes).map((sz) => (
                                    <button
                                        key={sz}
                                        className={`option-btn ${size === sz ? 'selected' : ''}`}
                                        onClick={() => setSize(sz)}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Frame Selection */}
                        <div className="option-group">
                            <label className="option-label">Frame</label>
                            <div className="option-buttons">
                                {Object.keys(PRICING.frames).map((frm) => (
                                    <button
                                        key={frm}
                                        className={`option-btn ${frame === frm ? 'selected' : ''}`}
                                        onClick={() => setFrame(frm)}
                                    >
                                        {frm}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Display */}
                        <div className="modal-price-section">
                            <div className="price-breakdown">
                                <span className="price-label">Total Price:</span>
                                <span className="price-amount">KES {price.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="modal-submit-btn" onClick={handleSubmit}>
                            {mode === 'edit' ? 'Update Cart Item' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkCustomizationModal;
