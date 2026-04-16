import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const activeKey = location.pathname.replace("/", "") || "landing";

  const PUBLIC = [
    { k:"landing",  l:"Home"          },
    { k:"services", l:"Services"      },
    { k:"events",   l:"Events"        },
    { k:"contact",  l:"Contact"       },
    { k:"login",    l:"Login"         },
  ];
  const AUTH = [
  { k: "dashboard", l: "Dashboard" },
  { k: "orders", l: "My Orders" },
  { k: "subscriptions", l: "My Plans" },
  { k: "profile", l: "Profile" },

  // 🔥 ADMIN ONLY
  ...(user?.role === "ADMIN"
    ? [
        { k: "admin", l: "Admin Panel" },
        { k: "manage-products", l: "Products" },
        { k: "all-orders", l: "All Orders" },
      ]
    : []),
];

  const links = isAuthenticated ? AUTH : PUBLIC;

  const go = (k) => {
    navigate("/" + (k === "landing" ? "" : k));
    setMenuOpen(false);
  };

  const navBg     = scrolled
    ? "rgba(255,255,255,0.98)"
    : "rgba(255,255,255,0.95)";
  const navShadow = scrolled
    ? "0 2px 20px rgba(14,165,233,0.13)"
    : "0 1px 0 rgba(14,165,233,0.08)";

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; background: #f0f9ff; }

        .nl {
          background: none;
          border: none;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          padding: 6px 4px;
          transition: color .2s;
          white-space: nowrap;
          position: relative;
          display: inline-block;
          line-height: 1.4;
          text-decoration: none;
        }
        .nl:focus { outline: none; box-shadow: none; }
        .nl::after {
          content: "";
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #0ea5e9;
          border-radius: 2px;
          transition: width .25s ease;
        }
        .nl:hover { color: #0ea5e9; }
        .nl:hover::after { width: 100%; }
        .nl.act { color: #0ea5e9; font-weight: 600; }
        .nl.act::after { width: 100%; }

        .nbo {
          background: transparent;
          border: 2px solid #0ea5e9;
          color: #0ea5e9;
          border-radius: 50px;
          padding: 8px 22px;
          font-family: "DM Sans", sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all .2s;
        }
        .nbo:hover { background: #0ea5e9; color: white; transform: translateY(-1px); }

        .nbs {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 8px 22px;
          font-family: "DM Sans", sans-serif;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(14,165,233,.32);
          transition: all .2s;
        }
        .nbs:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14,165,233,.45); }

        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .mmenu { animation: slideDown .22s ease; }

        .mlink {
          font-size: 15px;
          font-family: "DM Sans", sans-serif;
          cursor: pointer;
          padding: 13px 0;
          border-bottom: 1px solid #f0f9ff;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color .15s, padding-left .15s;
        }
        .mlink:hover { color: #0ea5e9; padding-left: 6px; }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: navBg,
        backdropFilter: "blur(16px)",
        boxShadow: navShadow,
        transition: "box-shadow .3s, background .3s",
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          padding: "0 24px", height: 66,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>

          {/* Logo */}
          <div
            onClick={() => go("landing")}
            style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0, userSelect:"none" }}
          >
            <div style={{
              width: 42, height: 42,
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 4px 14px rgba(14,165,233,.35)",
              flexShrink: 0,
              transition: "transform .2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            >💧</div>
            <div>
              <div style={{ fontFamily:"Playfair Display,serif", fontWeight:900, fontSize:17, color:"#0c2340", lineHeight:1.1 }}>
                Jayshree Aqua
              </div>
              <div style={{ fontSize:9, color:"#0ea5e9", letterSpacing:2, fontWeight:700, textTransform:"uppercase" }}>
                PURE · FRESH · TRUSTED
              </div>
            </div>
          </div>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{ display:"flex", gap:28, flex:1, justifyContent:"center" }}>
              {links.map(({ k, l }) => (
                <button
                  key={k}
                  className={"nl" + (activeKey === k ? " act" : "")}
                  onClick={() => go(k)}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Desktop right */}
          {!isMobile && (
            <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
              <button
              className="nbo"
              onClick={() => navigate("/cart")}
            >
              🛒 {cartCount > 0 ? `(${cartCount})` : ""}
            </button>
              {isAuthenticated ? (
            <>
              <div
                onClick={() => go("profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  cursor: "pointer",
                  padding: "4px 10px 4px 4px",
                  borderRadius: 50,
                  transition: "background .2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(14,165,233,.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 15,
                }}>
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0c2340" }}>
                    {user?.fullName?.split(" ")[0]}
                  </div>

                  <div style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                    {user?.role}

                    {/* 🔥 ADMIN BADGE */}
                    {user?.role === "ADMIN" && (
                      <span style={{
                        background: "#0ea5e9",
                        color: "white",
                        fontSize: 9,
                        padding: "2px 6px",
                        borderRadius: "6px"
                      }}>
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="nbo"
                onClick={() => {
                  logout();
                    navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* 🔥 ADD LOGIN BUTTON */}
              <button className="nbo" onClick={() => go("login")}>
                Login
              </button>

              <button className="nbs" onClick={() => go("register")}>
                Register Free
              </button>
            </>
          )}
            </div>
          )}

          {/* Mobile burger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background:"none", border:"none", cursor:"pointer", padding:4, color:"#0c2340", lineHeight:1 }}
            >
              <div style={{ width:24, display:"flex", flexDirection:"column", gap:5, transition:"all .2s" }}>
                <span style={{ display:"block", height:2, background: menuOpen?"#0ea5e9":"#0c2340", borderRadius:2, width:"100%", transform: menuOpen?"rotate(45deg) translate(5px,5px)":"none", transition:"all .25s" }}/>
                <span style={{ display:"block", height:2, background: menuOpen?"#0ea5e9":"#0c2340", borderRadius:2, width:"100%", opacity: menuOpen?0:1, transition:"all .25s" }}/>
                <span style={{ display:"block", height:2, background: menuOpen?"#0ea5e9":"#0c2340", borderRadius:2, width:"100%", transform: menuOpen?"rotate(-45deg) translate(5px,-5px)":"none", transition:"all .25s" }}/>
              </div>
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          
          <div className="mmenu" style={{
            background: "white",
            borderTop: "1px solid #e0f2fe",
            padding: "4px 24px 20px",
            boxShadow: "0 8px 24px rgba(14,165,233,.1)",
          }}>
            <div
              className="mlink"
              onClick={() => navigate("/cart")}
            >
              🛒 Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </div>
            {links.map(({ k, l }) => (
              <div
                key={k}
                className="mlink"
                onClick={() => go(k)}
                style={{ fontWeight: activeKey===k ? 700 : 500, color: activeKey===k ? "#0ea5e9" : "#0c2340" }}
              >
                {activeKey === k
                  ? <><span style={{width:6,height:6,borderRadius:"50%",background:"#0ea5e9",display:"inline-block",flexShrink:0}}/>{l}</>
                  : l
                }
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              {isAuthenticated ? (
              <button
                className="nbo"
                style={{ flex: 1, padding: "12px" }}
                onClick={() => {
                  logout();
                    navigate("/login");
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="nbo"
                  style={{ flex: 1, padding: "12px" }}
                  onClick={() => go("login")}
                >
                  Login
                </button>

                <button
                  className="nbs"
                  style={{ flex: 1, padding: "12px" }}
                  onClick={() => go("register")}
                >
                  Register
                </button>
              </>
            )}
            </div>
          </div>
        )}
      </nav>
      <div style={{ height: 66 }} />
    </>
  );
}