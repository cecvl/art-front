import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProfile, updateProfile, uploadArtwork, type UserProfile } from '../services/artists';
import ArtPrintLogo from '../assets/PaaJuuPrints.svg';
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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Upload artwork state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [artworkFile, setArtworkFile] = useState<File | null>(null);
    const [artworkTitle, setArtworkTitle] = useState('');
    const [artworkDescription, setArtworkDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
                    // Populate form fields from backend data
                    setName(data.user.displayName || data.user.name || '');
                    setDescription(data.user.description || '');
                    setDateOfBirth(data.user.dateOfBirth || '');
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be less than 10MB');
            return;
        }

        setArtworkFile(file);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadArtwork = async () => {
        setIsUploading(true);
        try {
            // Validation
            if (!artworkFile) {
                toast.error('Please select an image');
                return;
            }
            if (!artworkTitle.trim()) {
                toast.error('Title is required');
                return;
            }
            if (!artworkDescription.trim()) {
                toast.error('Description is required');
                return;
            }

            // Build FormData
            const formData = new FormData();
            formData.append('file', artworkFile);
            formData.append('title', artworkTitle.trim());
            formData.append('description', artworkDescription.trim());

            // Upload
            await uploadArtwork(formData);

            toast.success('Artwork uploaded successfully!');

            // Reset form
            setArtworkFile(null);
            setArtworkTitle('');
            setArtworkDescription('');
            setImagePreview(null);
            setShowUploadModal(false);

            // Reload profile to show new artwork
            const updatedProfile = await getProfile();
            if (updatedProfile) {
                setProfile(updatedProfile);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddArtwork = () => {
        setShowUploadModal(true);
    };

    const handleEditArtwork = (artworkId: string) => {
        toast.info(`Edit artwork ${artworkId} - coming soon`);
    };

    const handleAvatarUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setAvatarFile(file);
                toast.success('Avatar selected. Click "Save Profile" to upload.');
            }
        };
        input.click();
    };

    const handleBackgroundUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setBackgroundFile(file);
                toast.success('Background image selected. Click "Save Profile" to upload.');
            }
        };
        input.click();
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();

            // Add text fields if they have values
            if (name.trim()) formData.append('name', name.trim());
            if (description.trim()) formData.append('description', description.trim());
            if (dateOfBirth) formData.append('dateOfBirth', dateOfBirth);

            // Add file fields if selected
            if (avatarFile) formData.append('avatar', avatarFile);
            if (backgroundFile) formData.append('background', backgroundFile);

            // Check if there's anything to update
            if (Array.from(formData.keys()).length === 0) {
                toast.error('No changes to save');
                return;
            }

            await updateProfile(formData);
            toast.success('Profile updated successfully!');

            // Clear file selections after successful upload
            setAvatarFile(null);
            setBackgroundFile(null);

            // Reload profile to show updated data
            const updatedProfile = await getProfile();
            if (updatedProfile) {
                setProfile(updatedProfile);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
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

                                    <label style={{ marginTop: '10px', display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Description / Bio</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell us about yourself and your art..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderLeft: '3px solid #FFD700',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '0.95rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                        }}
                                    />

                                    <label style={{ marginTop: '10px', display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
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

                                    <label style={{ marginTop: '10px', display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Background Image</label>
                                    <button
                                        onClick={handleBackgroundUpload}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderLeft: '3px solid #FFD700',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            fontSize: '0.95rem',
                                            background: backgroundFile ? '#fffbe6' : '#fff',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            color: backgroundFile ? '#000' : '#666',
                                        }}
                                    >
                                        {backgroundFile ? `✓ ${backgroundFile.name}` : 'Choose Background Image...'}
                                    </button>

                                    {avatarFile && (
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                                            Avatar selected: {avatarFile.name}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSaveProfile}
                                        className="mt-2"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Profile'}
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
                                                const description = e.currentTarget.querySelector('.description-text') as HTMLElement;
                                                if (description) {
                                                    description.style.opacity = '1';
                                                    description.style.maxHeight = '100px';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                const overlay = e.currentTarget.querySelector('.description-text') as HTMLElement;
                                                if (overlay) {
                                                    overlay.style.opacity = '0';
                                                    overlay.style.maxHeight = '0';
                                                }
                                            }}
                                        >
                                            {/* Title Overlay - Always Visible */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
                                                    color: '#fff',
                                                    padding: '12px 8px 8px 8px',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    marginBottom: '4px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {artwork.title}
                                                </div>
                                                {artwork.description && (
                                                    <div
                                                        className="description-text"
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            opacity: 0,
                                                            maxHeight: 0,
                                                            overflow: 'hidden',
                                                            transition: 'opacity 0.2s, max-height 0.2s',
                                                            color: '#ddd',
                                                        }}
                                                    >
                                                        {artwork.description.length > 60
                                                            ? artwork.description.substring(0, 60) + '...'
                                                            : artwork.description}
                                                    </div>
                                                )}
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

            {/* Upload Artwork Modal */}
            {showUploadModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                    onClick={() => !isUploading && setShowUploadModal(false)}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            padding: '24px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem' }}>
                            Upload New Artwork
                        </h2>

                        {/* Image Upload Area */}
                        <div
                            style={{
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                padding: '24px',
                                textAlign: 'center',
                                marginBottom: '20px',
                                background: '#fafafa',
                            }}
                        >
                            {imagePreview ? (
                                <div>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            maxHeight: '300px',
                                            maxWidth: '100%',
                                            borderRadius: '4px',
                                            marginBottom: '12px',
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setArtworkFile(null);
                                            setImagePreview(null);
                                        }}
                                        disabled={isUploading}
                                    >
                                        Change Image
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                        id="artwork-upload-input"
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor="artwork-upload-input"
                                        style={{
                                            cursor: isUploading ? 'not-allowed' : 'pointer',
                                            display: 'block',
                                        }}
                                    >
                                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📷</div>
                                        <div style={{ fontSize: '1rem', marginBottom: '4px', color: '#666' }}>
                                            Click to upload image
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#999' }}>
                                            PNG, JPG up to 10MB
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Title Input */}
                        <div style={{ marginBottom: '16px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                }}
                            >
                                Title *
                            </label>
                            <input
                                type="text"
                                value={artworkTitle}
                                onChange={(e) => setArtworkTitle(e.target.value)}
                                placeholder="Enter artwork title"
                                disabled={isUploading}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                }}
                            />
                        </div>

                        {/* Description Textarea */}
                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                }}
                            >
                                Description *
                            </label>
                            <textarea
                                value={artworkDescription}
                                onChange={(e) => setArtworkDescription(e.target.value)}
                                placeholder="Describe your artwork..."
                                rows={4}
                                disabled={isUploading}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outline"
                                onClick={() => setShowUploadModal(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUploadArtwork}
                                disabled={!artworkFile || !artworkTitle.trim() || !artworkDescription.trim() || isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Artwork'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ArtistManagementConsole;
