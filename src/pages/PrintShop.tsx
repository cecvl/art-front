import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ArtPrintLogo from '../assets/ArtPrint Logo.png';
import { Button } from '../components/ui/button';
import Footer from '../components/navigation/Footer';
import ServiceManager from '../components/printshop/ServiceManager';
import PricingMatrixEditor from '../components/printshop/PricingMatrixEditor';
import type { PrintShop as PrintShopType, PrintService } from '../types/printshop';
import * as printShopService from '../services/printshop';

const PrintShop = () => {
    const navigate = useNavigate();

    // Tab navigation
    const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'pricing'>('profile');

    // Shop data
    const [shopProfile, setShopProfile] = useState<PrintShopType | null>(null);
    const [services, setServices] = useState<PrintService[]>([]);
    const [loading, setLoading] = useState(true);
    const [shopExists, setShopExists] = useState(false);

    // Profile form
    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        description: '',
        isActive: true,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load shop profile
            try {
                const profile = await printShopService.getShopProfile();
                setShopProfile(profile);
                setShopExists(true);
                setFormData({
                    name: profile.name,
                    contactEmail: profile.contactEmail,
                    contactPhone: profile.contactPhone,
                    location: profile.location,
                    description: profile.description || '',
                    isActive: profile.isActive,
                });
            } catch (error: any) {
                if (error.message === 'SHOP_NOT_FOUND') {
                    setShopExists(false);
                } else {
                    console.error('Failed to load shop:', error);
                    toast.error('Failed to load shop profile');
                }
            }

            // Load services
            try {
                const servicesData = await printShopService.getServices();
                setServices(servicesData);
            } catch (error) {
                console.error('Failed to load services:', error);
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
            loadData();
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
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center border-b border-gray-200 bg-gray-50 px-3 py-3 sm:px-4">
                <div className="flex flex-none items-center min-w-[62px]">
                    <img
                        src={ArtPrintLogo}
                        alt="ArtPrint Logo"
                        className="ml-1 mr-6 h-11 w-auto cursor-pointer transition-opacity hover:opacity-80"
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
                maxWidth: '1200px',
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
                            <form onSubmit={handleSaveProfile} style={{ padding: '2rem' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Shop Information</h3>

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
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
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
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                            placeholder="Physical Address"
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
