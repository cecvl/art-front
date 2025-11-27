import React from "react";
import ArtPrintLogo from "../../assets/ArtPrint Logo.png";

const Footer: React.FC = () => {
    return (
        <footer
            style={{
                background: "#fff",
                color: "#111",
                marginTop: "auto",
                width: "100%",
                borderTop: "1px solid #e5e5e5",
                padding: "18px 0 15px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div style={{ flex: 2, textAlign: "center", fontSize: 16 }}>
                THE ESSENCE OF ART
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "flex-start",
                }}
            >
                <img
                    src={ArtPrintLogo}
                    alt="ArtPrint Logo"
                    style={{ height: 46, marginLeft: 24 }}
                />
            </div>

            <div style={{ flex: 1, textAlign: "right", paddingRight: 24 }}>
                ©25 ArtPrint — All rights reserved
            </div>
        </footer>
    );
};

export default Footer;
