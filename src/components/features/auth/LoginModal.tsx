import React, { useState, useEffect } from "react";

// Modal Overlay Component with smooth transitions
const ModalOverlay: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.12)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Modal base width logic helper
const getModalWidth = () =>
  window.innerWidth < 450 ? "98vw" : 384;

// LoginModal Component
const LoginModal: React.FC<{ open: boolean; onClose: () => void; onSignUpClick: () => void }> = ({ open, onClose, onSignUpClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <ModalOverlay open={open} onClose={onClose}>
      <div
        style={{
          width: getModalWidth(),
          maxWidth: "98vw",
          background: "#f6f6f7",
          borderRadius: 16,
          boxShadow: "0 4px 32px #26365a13",
          padding: window.innerWidth < 500 ? 16 : 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 30, fontFamily: 'inherit', color: "#171c23" }}>Login</h2>
        <div style={{width:'100%', height:1, background:'#e8e8eb', marginBottom:24}} />
        <button style={{
          width:'100%',
          background:'#fff',
          border: 'none',
          borderRadius:12,
          padding:'13px 0',
          fontSize:20,
          fontWeight:500,
          boxShadow:"0 0 0 1.5px #ececec",
          marginBottom:18,
          cursor:'pointer',
        }}>
          Login with Google
        </button>
        <div style={{width:'100%',display:'flex',alignItems:'center',marginBottom:20}}>
          <div style={{flex:1, height:2, background:'#ededf0'}}/>
          <span style={{margin:'0 16px', color: '#8b93a2', fontWeight: 500}}>or</span>
          <div style={{flex:1, height:2, background:'#ededf0'}}/>
        </div>
        <div style={{width:'100%',textAlign:'left',marginBottom:6, fontWeight:600,fontSize:18}}>Email</div>
        <input
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{width:'100%',marginBottom:18,padding:'13px',fontSize:19,borderRadius:12,border:'none',outline:'1.7px solid #ececec',background:'#fff',color:'#454960'}} placeholder="team@mynaui.com"
        />
        <div style={{width:'100%',textAlign:'left',marginBottom:6, fontWeight:600,fontSize:18}}>Password</div>
        <input
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{width:'100%',marginBottom:24,padding:'13px',fontSize:19,borderRadius:12,border:'none',outline:'1.7px solid #ececec',background:'#fff',color:'#454960'}} placeholder="••••••••"
        />
        <button
          style={{width:'100%',background:'#1867ff',border:'none',borderRadius:15,padding:'15px 0',fontSize:22,fontWeight:500,color:'#fff',marginBottom:28, cursor:'pointer'}}
        >
          Login
        </button>
        <div style={{marginBottom: 16, fontSize: 19, color: '#242936', width: '100%', textAlign: 'center'}}>
          <div style={{marginBottom:7}}>Forgot your password?</div>
          <div>New to Art Print? <span style={{ textDecoration: 'underline', cursor: 'pointer', color:'#222a44' }} onClick={()=>{ onClose(); onSignUpClick(); }}>Sign up</span></div>
        </div>
        <div style={{width:'100%',height:1, background:'#e8e8eb',margin:'18px 0 10px 0'}}/>
        <div style={{marginBottom:4, fontSize:17, color:'#8b93a2', width: '100%', textAlign: 'center'}}>
          © 2025 Art Prints
        </div>
      </div>
    </ModalOverlay>
  );
};

export default LoginModal;

