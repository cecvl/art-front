import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProfile, type UserProfile } from '../services/artists';
import ArtPrintLogo from '../assets/ArtPrint Logo.png';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import Footer from '../components/navigation/Footer';
import { toast } from 'sonner';

interface PrintShop {
    id: string;
    name: string;
    materials: string;
    rating: number;
}

const ArtistManagementConsole = () => {
    const navigate = useNavigate();
    const { logout: authLogout } = useAuth();

    // Profile state
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [artistName, setArtistName] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [instagram, setInstagram] = useState('');
    const [behance, setBehance] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const printShops: PrintShop[] = [
        { id: '1', name: 'Nairobi Art House', materials: 'Canvas, Wood', rating: 4.8 },
        { id: '2', name: 'ColorPress Ltd', materials: 'Fine Art Paper', rating: 4.5 },
    ];

    const pendingPayouts = 450.00;
    const ordersProcessed = 1245;
    const monthlyGrowth = 12;

    // Fetch profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const data = await getProfile();
                if (data) {
                    setProfile(data);
                    // Populate form fields
                    setArtistName(data.user.displayName || data.user.name || data.user.email || '');
                    setPortfolioUrl(data.user.portfolioUrl || '');
                    setInstagram(data.user.instagram || '');
                    setBehance(data.user.behance || '');
                } else {
                    toast.error('Failed to load profile');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await authLogout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed');
        }
    };

    const handleAddArtwork = () => {
        toast.info('Add artwork functionality coming soon');
    };

    const handleEditArtwork = (artworkId: string) => {
        toast.info(`Edit artwork ${artworkId} - coming soon`);
    };

    const handleAvatarUpload = () => {
        toast.info('Avatar upload functionality coming soon');
    };

    const handleSaveProfile = () => {
        toast.success('Profile saved successfully');
        // TODO: Implement profile update API call
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
                        onClick={() => navigate('/')}
                    />
                </div>
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-semibold">Artist Management Console</h1>
                </div>
            </header>

            {/* Main Console Container */}
            <div style={{
                maxWidth: '1000px',
                margin: '2rem auto',
                background: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                minHeight: '800px',
                backgroundImage: 'linear-gradient(to right, transparent 59%, #e0e0e0 59%, #e0e0e0 60%, transparent 60%)',
            }}>

                {/* LEFT COLUMN: Artist Management */}
                <div style={{ padding: '2rem' }}>
                    <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>Artist Mgt Console</h2>

                    {loading ? (
                        <div>
                            <Skeleton className="h-24 w-full mb-4" />
                            <Skeleton className="h-10 w-full mb-2" />
                            <Skeleton className="h-10 w-full mb-2" />
                        </div>
                    ) : (
                        <>
                            {/* Profile Area */}
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div
                                    onClick={handleAvatarUpload}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        background: profile?.user.photoURL ? `url(${profile.user.photoURL})` : '#eee',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        border: '2px dashed #999',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: '#666',
                                        flexShrink: 0,
                                        position: 'relative',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#FFD700';
                                        if (!profile?.user.photoURL) {
                                            e.currentTarget.style.background = '#fffbe6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#999';
                                        if (!profile?.user.photoURL) {
                                            e.currentTarget.style.background = '#eee';
                                        }
                                    }}
                                >
                                    {!profile?.user.photoURL && (
                                        <>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                            <div style={{ position: 'absolute', marginTop: '50px', fontSize: '0.7rem' }}>Change</div>
                                        </>
                                    )}
                                </div>

                                <div style={{ flexGrow: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Name</label>
                                    <input
                                        type="text"
                                        value={artistName}
                                        onChange={(e) => setArtistName(e.target.value)}
                                        placeholder="Artist Name"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '0.95rem',
                                        }}
                                    />

                                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                                        Email: {profile?.user.email}
                                    </div>

                                    <label style={{ marginTop: '10px', display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Links</label>
                                    <input
                                        type="text"
                                        value={portfolioUrl}
                                        onChange={(e) => setPortfolioUrl(e.target.value)}
                                        placeholder="Portfolio URL"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderLeft: '3px solid #FFD700',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '0.95rem',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        placeholder="Instagram"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderLeft: '3px solid #FFD700',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '0.95rem',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={behance}
                                        onChange={(e) => setBehance(e.target.value)}
                                        placeholder="Behance/Dribbble"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderLeft: '3px solid #FFD700',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '0.95rem',
                                        }}
                                    />

                                    <Button onClick={handleSaveProfile} className="mt-2">
                                        Save Profile
                                    </Button>
                                </div>
                            </div>

                            {/* Manage Artworks */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{
                                    color: '#1a1a1a',
                                    borderBottom: '2px solid #FFD700',
                                    paddingBottom: '5px',
                                    display: 'inline-block',
                                    marginBottom: '1rem',
                                    marginTop: 0,
                                }}>
                                    Manage Artworks ({profile?.artworks.length || 0})
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '15px',
                                    marginTop: '1rem',
                                }}>
                                    {profile?.artworks.map((artwork) => (
                                        <div
                                            key={artwork.id}
                                            onClick={() => handleEditArtwork(artwork.id)}
                                            style={{
                                                aspectRatio: '1',
                                                background: '#ddd',
                                                backgroundImage: `url(${artwork.imageUrl})`,
                                                backgroundSize: 'cover',
                                                border: '1px solid #ccc',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s',
                                                overflow: 'hidden',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                                                const overlay = e.currentTarget.querySelector('.edit-overlay') as HTMLElement;
                                                if (overlay) overlay.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                const overlay = e.currentTarget.querySelector('.edit-overlay') as HTMLElement;
                                                if (overlay) overlay.style.opacity = '0';
                                            }}
                                        >
                                            <div
                                                className="edit-overlay"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: '#fff',
                                                    fontSize: '0.7rem',
                                                    textAlign: 'center',
                                                    padding: '4px',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                }}
                                            >
                                                {artwork.title}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Artwork Button */}
                                    <div
                                        onClick={handleAddArtwork}
                                        style={{
                                            aspectRatio: '1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#eee',
                                            fontSize: '2rem',
                                            color: '#ccc',
                                            cursor: 'pointer',
                                            border: '1px solid #ccc',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#FFD700';
                                            e.currentTarget.style.color = '#1a1a1a';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#eee';
                                            e.currentTarget.style.color = '#ccc';
                                        }}
                                    >
                                        +
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Payment */}
                    <div style={{
                        background: '#fafafa',
                        border: '1px solid #eee',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#555' }}>Payment</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <span>Pending Payouts:</span>
                            <span style={{ fontWeight: 'bold' }}>${pendingPayouts.toFixed(2)}</span>
                        </div>
                        <a href="#" style={{ fontSize: '0.85rem', color: '#1a1a1a', textDecoration: 'none' }}>
                            View History
                        </a>
                    </div>

                    {/* Orders Processed */}
                    <div style={{
                        background: '#fafafa',
                        border: '1px solid #eee',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#555' }}>Orders Processed</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{ordersProcessed.toLocaleString()}</div>
                        <div style={{ fontSize: '0.85rem', color: 'green' }}>▲ {monthlyGrowth}% this month</div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Printshop & System */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>

                    {/* Printshop Selection */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{
                            color: '#1a1a1a',
                            borderBottom: '2px solid #FFD700',
                            paddingBottom: '5px',
                            display: 'inline-block',
                            marginBottom: '1rem',
                            marginTop: 0,
                        }}>
                            Printshop Selection
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Find partners to fulfill your orders.</p>

                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                            <span style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#888',
                            }}>
                                🔍
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for shops..."
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    paddingLeft: '35px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                }}
                            />
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                color: '#1a1a1a',
                                textDecoration: 'underline',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                            }}>
                                See all shops *
                            </span>
                        </div>

                        {/* Mock Result List */}
                        <div style={{ marginTop: '20px' }}>
                            {printShops.map((shop) => (
                                <div key={shop.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <strong>{shop.name}</strong><br />
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                        {shop.materials} • {shop.rating}★
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logout */}
                    <div style={{
                        marginTop: 'auto',
                        textAlign: 'center',
                        paddingTop: '2rem',
                        borderTop: '1px dashed #ddd',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                border: '2px solid #1a1a1a',
                                background: 'transparent',
                                color: '#1a1a1a',
                                padding: '10px 40px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: '0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1a1a1a';
                                e.currentTarget.style.color = '#FFD700';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Button - Bottom Right */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ArtistManagementConsole;
