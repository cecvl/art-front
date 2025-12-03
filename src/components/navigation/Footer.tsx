import React from "react";
import { Link } from "react-router-dom";
import ArtPrintLogo from "../../assets/PaaJuuPrints.svg";

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
                <ul style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <li>
                        <Link
                            to="/"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            style={{
                                textDecoration: "none",
                                color: "#111",
                                fontWeight: 500,
                                transition: "color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#666"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#111"}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contacts"
                            style={{
                                textDecoration: "none",
                                color: "#111",
                                fontWeight: 500,
                                transition: "color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#666"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#111"}
                        >
                            Contacts
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            style={{
                                textDecoration: "none",
                                color: "#111",
                                fontWeight: 500,
                                transition: "color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#666"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#111"}
                        >
                            About
                        </Link>
                    </li>
                </ul>
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
                    alt="PaaJuu Prints Logo"
                    style={{ height: 140, marginLeft: 24 }}
                />
            </div>

            <div style={{ flex: 1, textAlign: "right", paddingRight: 24 }}>
                ©25 PAAJUU PRINTS — All rights reserved
            </div>
        </footer>
    );
};

export default Footer;
