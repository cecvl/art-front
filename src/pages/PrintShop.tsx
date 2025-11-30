import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ArtPrintLogo from '../assets/PaaJuuPrints.svg';
import { Button } from '../components/ui/button';
import Footer from '../components/navigation/Footer';
import ServiceManager from '../components/printshop/ServiceManager';
import PricingMatrixEditor from '../components/printshop/PricingMatrixEditor';
import type { PrintShop as PrintShopType, PrintService } from '../types/printshop';
import * as printShopService from '../services/printshop';
import { transformBackendToForm, type ShopProfileFormData } from '../services/printshop';

const PrintShop = () => {
    const navigate = useNavigate();

    // Tab navigation
    const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'pricing'>('profile');

    // Shop data
    const [shopProfile, setShopProfile] = useState<PrintShopType | null>(null);
    const [services, setServices] = useState<PrintService[]>([]);
    const [loading, setLoading] = useState(true);
    const [shopExists, setShopExists] = useState(false);

    // Edit mode for profile
    const [editMode, setEditMode] = useState(false);

    // Profile form
    const [formData, setFormData] = useState<ShopProfileFormData>({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: '',
        email: '',
        phone: '',
        website: '',
        isActive: true,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            let hasShop = false;

            // Load shop profile
            try {
                const profile = await printShopService.getShopProfile();
                setShopProfile(profile);
                setShopExists(true);
                setFormData(transformBackendToForm(profile));
                hasShop = true; // Use local variable for immediate check
            } catch (error: any) {
                // Shop not found is expected for first-time users
                console.log('Shop profile not found - first time setup');
                setShopExists(false);
                setEditMode(true); // Show form for first-time users
            }

            // Load services (only if shop exists)
            if (hasShop) {
                try {
                    const servicesData = await printShopService.getServices();
                    setServices(servicesData || []);
                } catch (error) {
                    console.error('Failed to load services:', error);
                    setServices([]);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (shopExists) {
                await printShopService.updateShopProfile(formData);
                toast.success('Profile updated successfully');
            } else {
                await printShopService.createShopProfile(formData);
                toast.success('Shop profile created successfully');
                setShopExists(true);
            }
            await loadData();
            setEditMode(false); // Switch to view mode after save
        } catch (error: any) {
            console.error('Failed to save profile:', error);
            toast.error(error.message || 'Failed to save profile');
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center border-b border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">
                <div className="flex flex-none items-center min-w-[62px]">
                    <img
                        src={ArtPrintLogo}
                        alt="PaaJuu Prints Logo"
                        className="ml-1 mr-6 cursor-pointer transition-opacity hover:opacity-80"
                        style={{ height: 80, width: 'auto' }}
                        onClick={() => navigate('/')}
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
                    onClick={() => navigate('/')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                </Button>
            </div>

            {/* Main Container */}
            <div style={{
                margin: '2rem 3rem',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                flex: 1,
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
                    <h2 style={{ margin: 0, color: '#1a1a1a' }}>Print Shop Console</h2>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>{currentDate}</div>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    borderBottom: '2px solid #e0e0e0',
                    background: '#fafafa',
                    display: 'flex',
                    gap: '0',
                }}>
                    {[
                        { id: 'profile', label: 'Shop Profile' },
                        { id: 'services', label: 'Services' },
                        { id: 'pricing', label: 'Pricing' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                padding: '1rem 2rem',
                                border: 'none',
                                background: activeTab === tab.id ? '#fff' : 'transparent',
                                borderBottom: activeTab === tab.id ? '3px solid #FFD700' : '3px solid transparent',
                                color: activeTab === tab.id ? '#1a1a1a' : '#666',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div style={{ padding: '2rem' }}>
                                {shopExists && !editMode ? (
                                    // View Mode - Show profile information
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h3 style={{ margin: 0 }}>Shop Information</h3>
                                            <Button
                                                onClick={() => setEditMode(true)}
                                                variant="outline"
                                            >
                                                Edit Profile
                                            </Button>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>
                                                    BUSINESS NAME
                                                </label>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#1a1a1a' }}>{formData.name}</p>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>
                                                    EMAIL
                                                </label>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#1a1a1a' }}>{formData.email}</p>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>
                                                    CONTACT NUMBER
                                                </label>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#1a1a1a' }}>{formData.phone}</p>
                                            </div>

                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>
                                                    LOCATION
                                                </label>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#1a1a1a' }}>
                                                    {formData.address}, {formData.city}, {formData.state}, {formData.country}
                                                </p>
                                            </div>

                                            {formData.description && (
                                                <div style={{ gridColumn: '1 / -1' }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>
                                                        DESCRIPTION
                                                    </label>
                                                    <p style={{ margin: 0, fontSize: '1rem', color: '#1a1a1a', lineHeight: '1.6' }}>{formData.description}</p>
                                                </div>
                                            )}

                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>
                                                    STATUS
                                                </label>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    background: formData.isActive ? '#4caf50' : '#f44336',
                                                    color: '#fff',
                                                }}>
                                                    {formData.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Edit Mode - Show form
                                    <form onSubmit={handleSaveProfile}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h3 style={{ margin: 0 }}>Shop Information</h3>
                                            {shopExists && (
                                                <Button
                                                    type="button"
                                                    onClick={() => setEditMode(false)}
                                                    variant="outline"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    Business Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    Contact Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    required
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    Street Address *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    required
                                                    placeholder="123 Main Street"
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    required
                                                    placeholder="Nairobi"
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    State/Region *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    required
                                                    placeholder="Nairobi County"
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    Country *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    required
                                                    placeholder="Kenya"
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
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    Description
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Describe your print shop..."
                                                    rows={4}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '4px',
                                                        fontSize: '1rem',
                                                        fontFamily: 'inherit',
                                                    }}
                                                />
                                            </div>

                                            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input
                                                    type="checkbox"
                                                    id="shopActive"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                />
                                                <label htmlFor="shopActive" style={{ margin: 0, fontSize: '0.9rem' }}>
                                                    Shop is active and accepting orders
                                                </label>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '2rem' }}>
                                            <Button type="submit" style={{ background: '#1a1a1a', color: '#FFD700' }}>
                                                {shopExists ? 'Update Profile' : 'Create Shop Profile'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <ServiceManager />
                        )}

                        {/* Pricing Tab */}
                        {activeTab === 'pricing' && (
                            <PricingMatrixEditor services={services} />
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default PrintShop;
