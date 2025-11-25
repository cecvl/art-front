import { useNavigate } from 'react-router-dom';
import ArtistsPage from '../components/artists/ArtistsPage';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';

const Artists = () => {
    const navigate = useNavigate();
    const { cartItemCount } = useCart();

    return (
        <div style={{ position: 'relative' }}>
            <ArtistsPage
                onNavigateToHome={() => navigate('/')}
                onArtistClick={(artistId) => navigate(`/artist/${artistId}`)}
                onHeaderCartClick={() => navigate('/cart')}
                cartItemCount={cartItemCount}
            />

            {/* Management Console Button - positioned below header */}
            <div style={{
                position: 'fixed',
                top: '80px', // Below the header
                right: '20px',
                zIndex: 50,
            }}>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate('/artist-console')}
                    style={{
                        background: '#1a1a1a',
                        color: '#FFD700',
                        fontWeight: 'bold',
                    }}
                >
                    Artist Management Console
                </Button>
            </div>
        </div>
    );
};

export default Artists;
