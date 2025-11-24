import React from "react";
import ArtPrintLogo from '../../assets/ArtPrint Logo.png';

// Nav Button Style Function - handles active and hover states
const getNavBtnStyle = (isActive: boolean): React.CSSProperties => ({
  background: isActive ? "#e5e7eb" : "none",
  border: "none",
  color: "#151f33",
  padding: "8px 10px",
  fontWeight: 600,
  fontSize: 12,
  borderRadius: 6,
  cursor: "pointer",
  letterSpacing: 0.5,
  transition: "all 0.2s ease",
});

// Auth Button Style with hover support
const getAuthBtnStyle = (): React.CSSProperties => ({
  background: "#fff",
  border: "1px solid #e5e7eb",
  color: "#151f33",
  padding: "8px 13px",
  fontWeight: 600,
  fontSize: 12,
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.2s ease",
});

// Nav Button Component with hover and active states
const NavButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}> = ({ children, isActive, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const baseStyle = getNavBtnStyle(isActive);
  const hoverStyle = isHovered && !isActive ? { background: "#f3f4f6" } : {};
  
  return (
    <button
      style={{ ...baseStyle, ...hoverStyle }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

// Auth Button Component with hover states
const AuthButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const baseStyle = getAuthBtnStyle();
  const hoverStyle = isHovered ? { 
    background: "#f3f4f6", 
    borderColor: "#d1d5db" 
  } : {};
  
  return (
    <button
      style={{ ...baseStyle, ...hoverStyle }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

// Nav Select Component with hover states - acts as a button to navigate to Artists page
const NavSelect: React.FC<{
  onArtistsClick?: () => void;
  isActive: boolean;
}> = ({ onArtistsClick, isActive }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const baseStyle = getNavBtnStyle(isActive);
  const hoverStyle = isHovered ? { background: "#f3f4f6" } : {};
  
  return (
    <button
      style={{
        ...baseStyle,
        ...hoverStyle,
        paddingRight: "24px",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23151f33' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onArtistsClick) {
          onArtistsClick();
        }
      }}
    >
      ARTISTS
    </button>
  );
};

// Cart Icon Component with notification badge
const CartIcon: React.FC<{
  onClick: () => void;
  itemCount: number;
}> = ({ onClick, itemCount }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <button
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        color: "#151f33",
        padding: "8px 12px",
        fontWeight: 600,
        fontSize: 12,
        borderRadius: 6,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
        position: "relative",
        ...(isHovered ? { background: "#f3f4f6", borderColor: "#d1d5db" } : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Cart (${itemCount} items)`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21C10.5 21.8 9.8 22.5 9 22.5C8.2 22.5 7.5 21.8 7.5 21C7.5 20.2 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21C21.5 21.8 20.8 22.5 20 22.5C19.2 22.5 18.5 21.8 18.5 21C18.5 20.2 19.2 19.5 20 19.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {itemCount > 0 && (
        <span
          style={{
            background: "#d53c2c",
            color: "#fff",
            borderRadius: "50%",
            minWidth: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            position: "absolute",
            top: "-8px",
            right: "-8px",
            padding: itemCount > 9 ? "0 6px" : "0",
            boxSizing: "border-box",
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
};

// Header Component
const Header: React.FC<{
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onArtPrintsClick: () => void;
  onArtistsClick?: () => void;
  onHomeClick?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
  currentPage: "home" | "artprints" | "artists";
}> = ({ onLoginClick, onSignUpClick, onArtPrintsClick, onArtistsClick, onHomeClick, onCartClick, cartItemCount = 0, currentPage }) => {
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 600;
  
  return (
    <header style={{
      padding: isSmall ? "10px 6px" : 12,
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      background: "#f9fafb",
      position: "relative"
    }}>
      {/* LOGO ON THE LEFT */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', minWidth: 62 }}>
        <img src={ArtPrintLogo} alt="ArtPrint Logo" style={{ height: 44, width: 'auto', marginRight: 24, marginLeft: 4, cursor: onHomeClick ? 'pointer' : 'default', transition: 'opacity 0.15s' }}
          onClick={onHomeClick} />
      </div>
      {/* Navigation Buttons */}
      <div style={{ flex: 1, display: "flex", gap: 8, minWidth:0, justifyContent: "center" }}>
        <NavButton isActive={currentPage === "home"} onClick={onHomeClick}>NEW ARRIVALS</NavButton>
        <NavButton isActive={currentPage === "artprints"} onClick={onArtPrintsClick}>ART PRINTS</NavButton>
        <NavSelect onArtistsClick={onArtistsClick} isActive={currentPage === "artists"} />
      </div>
      <div style={{ flex: 1, display: "flex", gap: 8, minWidth:0, justifyContent: "flex-end", alignItems: "center" }}>
        {onCartClick && <CartIcon onClick={onCartClick} itemCount={cartItemCount} />}
        <AuthButton onClick={onLoginClick}>Login</AuthButton>
        <AuthButton onClick={onSignUpClick}>Sign Up</AuthButton>
      </div>
    </header>
  );
};

export default Header;

