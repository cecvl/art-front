import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtPrintLogo from '../assets/ArtPrint Logo.png';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';

interface SizeOption {
    width: number;
    height: number;
    priceAddon: number;
}

interface MaterialOption {
    name: string;
    available: boolean;
    basePrice: number;
}

interface FrameOption {
    id: string;
    designId: string;
    price: number;
    sameColor: boolean;
}

const PrintShop = () => {
    const navigate = useNavigate();
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [processingLocation, setProcessingLocation] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [diffLocation, setDiffLocation] = useState(false);

    const [unit, setUnit] = useState<'in' | 'cm'>('in');
    const [materials, setMaterials] = useState<MaterialOption[]>([
        { name: 'Canvas', available: true, basePrice: 0 },
        { name: 'Ink (Fine Art Paper)', available: false, basePrice: 0 },
        { name: 'Wood Panel', available: false, basePrice: 0 },
    ]);

    const [sizes, setSizes] = useState<SizeOption[]>([
        { width: 0, height: 0, priceAddon: 0 },
        { width: 0, height: 0, priceAddon: 0 },
    ]);

    const [frames, setFrames] = useState<FrameOption[]>([
        { id: '1', designId: '#001', price: 0, sameColor: false },
        { id: '2', designId: '#002', price: 0, sameColor: false },
    ]);

    const [glassDiscount, setGlassDiscount] = useState(0);
    const [saving, setSaving] = useState(false);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleMaterialChange = (index: number, field: keyof MaterialOption, value: boolean | number) => {
        const newMaterials = [...materials];
        newMaterials[index] = { ...newMaterials[index], [field]: value };
        setMaterials(newMaterials);
    };

    const handleSizeChange = (index: number, field: keyof SizeOption, value: number) => {
        const newSizes = [...sizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setSizes(newSizes);
    };

    const addSizeRow = () => {
        setSizes([...sizes, { width: 0, height: 0, priceAddon: 0 }]);
    };

    const handleFrameChange = (index: number, field: keyof FrameOption, value: number | boolean) => {
        const newFrames = [...frames];
        newFrames[index] = { ...newFrames[index], [field]: value };
        setFrames(newFrames);
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            alert('Shop Configuration Saved Successfully!');
            setSaving(false);
        }, 1000);
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center border-b border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">
                <div className="flex flex-none items-center min-w-[62px]">
                    <img
                        src={ArtPrintLogo}
                        alt="ArtPrint Logo"
                        className="ml-1 mr-6 h-11 w-auto cursor-pointer transition-opacity hover:opacity-80"
                    />
                </div>
            </header>

            {/* Back Button */}
            <div style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                zIndex: 50,
            }}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </Button>
            </div>

            {/* Main Container */}
            <div style={{
                maxWidth: '900px',
                margin: '2rem auto',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                {/* Console Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid #e0e0e0',
                    background: '#fafafa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h2 style={{ margin: 0, color: '#1a1a1a' }}>Printshop Console Mgt</h2>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>{currentDate}</div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    {/* Section 1: Merchant Profile */}
                    <div style={{ padding: '2rem', borderBottom: '1px solid #e0e0e0' }}>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <span style={{
                                background: '#FFD700',
                                color: '#1a1a1a',
                                width: '24px',
                                height: '24px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                fontSize: '0.8rem',
                            }}>1</span>
                            Merchant Profile
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="e.g. Nairobi Art House"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="contact@shop.com"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    placeholder="+254..."
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                    Processing Location
                                </label>
                                <input
                                    type="text"
                                    value={processingLocation}
                                    onChange={(e) => setProcessingLocation(e.target.value)}
                                    placeholder="Physical Address"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                    }}
                                />

                                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="diffLocationCheck"
                                        checked={diffLocation}
                                        onChange={(e) => setDiffLocation(e.target.checked)}
                                    />
                                    <label htmlFor="diffLocationCheck" style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>
                                        Delivery location is different from processing point?
                                    </label>
                                </div>
                            </div>

                            {diffLocation && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#FFD700' }}>
                                        Delivery Location
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryLocation}
                                        onChange={(e) => setDeliveryLocation(e.target.value)}
                                        placeholder="Enter dispatch address"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '1rem',
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                    License & Documents
                                </label>
                                <div style={{
                                    border: '2px dashed #ccc',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderRadius: '4px',
                                    background: '#fafafa',
                                    cursor: 'pointer',
                                }}>
                                    Click to upload Business License (PDF/JPG)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Print Configuration */}
                    <div style={{ padding: '2rem', borderBottom: '1px solid #e0e0e0' }}>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <span style={{
                                background: '#FFD700',
                                color: '#1a1a1a',
                                width: '24px',
                                height: '24px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                fontSize: '0.8rem',
                            }}>2</span>
                            Print Configuration
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                            Please provide clear pricing for each item variant.
                        </p>

                        {/* Materials Table */}
                        <label style={{ marginTop: '20px', display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
                            Print Options (Materials) <span style={{ color: 'red' }}>*</span>
                        </label>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', color: '#888', fontSize: '0.85rem', paddingBottom: '10px', width: '40%' }}>Material</th>
                                    <th style={{ textAlign: 'left', color: '#888', fontSize: '0.85rem', paddingBottom: '10px' }}>Available?</th>
                                    <th style={{ textAlign: 'left', color: '#888', fontSize: '0.85rem', paddingBottom: '10px' }}>Base Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '8px 0' }}>{material.name}</td>
                                        <td style={{ padding: '8px 0' }}>
                                            <input
                                                type="checkbox"
                                                checked={material.available}
                                                onChange={(e) => handleMaterialChange(index, 'available', e.target.checked)}
                                            />
                                        </td>
                                        <td style={{ padding: '8px 0' }}>
                                            <input
                                                type="number"
                                                value={material.basePrice || ''}
                                                onChange={(e) => handleMaterialChange(index, 'basePrice', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                style={{ width: '100px', marginLeft: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <hr style={{ border: 0, borderTop: '1px dashed #ddd', margin: '30px 0' }} />

                        {/* Sizes */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <label style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>
                                Sizes Available <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div style={{ display: 'flex' }}>
                                <button
                                    type="button"
                                    onClick={() => setUnit('in')}
                                    style={{
                                        padding: '5px 15px',
                                        border: '1px solid #ccc',
                                        background: unit === 'in' ? '#1a1a1a' : '#fff',
                                        color: unit === 'in' ? '#FFD700' : '#000',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    IN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUnit('cm')}
                                    style={{
                                        padding: '5px 15px',
                                        border: '1px solid #ccc',
                                        background: unit === 'cm' ? '#1a1a1a' : '#fff',
                                        color: unit === 'cm' ? '#FFD700' : '#000',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    CM
                                </button>
                            </div>
                        </div>

                        {sizes.map((size, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    {index === 0 && (
                                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                            Width ({unit})
                                        </label>
                                    )}
                                    <input
                                        type="number"
                                        value={size.width || ''}
                                        onChange={(e) => handleSizeChange(index, 'width', parseFloat(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <div style={{ paddingBottom: '10px' }}>by</div>
                                <div style={{ flex: 1 }}>
                                    {index === 0 && (
                                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                            Height ({unit})
                                        </label>
                                    )}
                                    <input
                                        type="number"
                                        value={size.height || ''}
                                        onChange={(e) => handleSizeChange(index, 'height', parseFloat(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    {index === 0 && (
                                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                            Price Add-on
                                        </label>
                                    )}
                                    <input
                                        type="number"
                                        value={size.priceAddon || ''}
                                        onChange={(e) => handleSizeChange(index, 'priceAddon', parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSizeRow}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1a1a1a',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                marginTop: '10px',
                            }}
                        >
                            + Add another size
                        </button>
                    </div>

                    {/* Section 3: Framing Options */}
                    <div style={{ padding: '2rem', borderBottom: '1px solid #e0e0e0' }}>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            marginBottom: '1.5rem',
                            color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <span style={{
                                background: '#FFD700',
                                color: '#1a1a1a',
                                width: '24px',
                                height: '24px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                fontSize: '0.8rem',
                            }}>3</span>
                            Framing Options
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                Upload Frame Designs
                            </label>
                            <div style={{
                                border: '2px dashed #ccc',
                                padding: '1rem',
                                textAlign: 'center',
                                borderRadius: '4px',
                                background: '#fafafa',
                                cursor: 'pointer',
                            }}>
                                Drag & Drop Frame Profiles here
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '1rem',
                        }}>
                            {frames.map((frame, index) => (
                                <div key={frame.id} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                                    <div style={{
                                        height: '80px',
                                        background: '#eee',
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        color: '#999',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        <Skeleton style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                        <span style={{ position: 'relative', zIndex: 1 }}>Design {index + 1}</span>
                                    </div>
                                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                        Design ID: {frame.designId}
                                    </label>
                                    <input
                                        type="number"
                                        value={frame.price || ''}
                                        onChange={(e) => handleFrameChange(index, 'price', parseFloat(e.target.value) || 0)}
                                        placeholder="Price"
                                        style={{
                                            marginTop: '5px',
                                            textAlign: 'center',
                                            width: '100%',
                                            padding: '5px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                    />
                                    <div style={{ marginTop: '5px', textAlign: 'left', fontSize: '0.75rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={frame.sameColor}
                                            onChange={(e) => handleFrameChange(index, 'sameColor', e.target.checked)}
                                        />
                                        {' '}Same colour
                                    </div>
                                </div>
                            ))}

                            {/* Glass Option */}
                            <div style={{ border: '1px solid #eee', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                                <div style={{
                                    height: '80px',
                                    background: '#eee',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    color: '#999',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <Skeleton style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                    <span style={{ position: 'relative', zIndex: 1 }}>Glass Opt.</span>
                                </div>
                                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                    Without Glass
                                </label>
                                <input
                                    type="number"
                                    value={glassDiscount || ''}
                                    onChange={(e) => setGlassDiscount(parseFloat(e.target.value) || 0)}
                                    placeholder="Discount?"
                                    style={{
                                        marginTop: '5px',
                                        textAlign: 'center',
                                        width: '100%',
                                        padding: '5px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '2rem',
                        background: '#fafafa',
                        borderTop: '1px solid #e0e0e0',
                        textAlign: 'right',
                    }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                background: saving ? '#4caf50' : '#1a1a1a',
                                color: '#FFD700',
                                border: 'none',
                                padding: '12px 30px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrintShop;
