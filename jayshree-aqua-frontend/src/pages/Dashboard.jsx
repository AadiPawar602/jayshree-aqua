import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { productAPI } from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard({ onGoToLanding, onNavigate }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab,setActiveTab]= useState("home");
  const [cartItems,setCartItems]= useState([]);
  const [toast,    setToast]    = useState("");
  

  useEffect(()=>{
    productAPI.getAll()
      .then(r => {
        console.log("Products API:", r.data); 
        setProducts(Array.isArray(r.data?.data) ? r.data.data : []);
      })
      .catch(()=>setProducts([]))
      .finally(()=>setLoading(false));
  },[]);

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const addToCart=(p)=>{
    setCartItems(prev=>{
      const ex = prev.find(i => i.id === p.id);

      if (ex) {
        return prev.map(i =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...p, qty: 1 }];
     
    });
    showToast("Added "+p.name+" to cart 🛒");
  };
  const cartCount=cartItems.reduce((s,i)=>s+i.qty,0);
  const cartTotal=cartItems.reduce((s,i)=>s+(parseFloat(i.price)*i.qty),0);
  const filtered=activeTab==="cold"?products.filter(p=>p.waterType==="COLD_FILTERED"):activeTab==="filtered"?products.filter(p=>p.waterType==="FILTERED"):products;

  const handleNav=(page)=>{
    if(page==="landing"){onGoToLanding();return;}
    if(["dashboard","orders","subscriptions","profile"].includes(page)){setActiveTab(page);return;}
    if(onNavigate) onNavigate(page);
  };

  return(
    <div style={{minHeight:"100vh",background:"#f0f9ff",fontFamily:"DM Sans,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        @keyframes slideIn{from{transform:translateY(-60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes floatDrop{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.04)}}
        @keyframes ripple{0%{transform:scale(0.8);opacity:0.6}100%{transform:scale(2.2);opacity:0}}
        @keyframes pulse{0%,100%{opacity:0.15}50%{opacity:0.28}}
        @keyframes dropFade{0%{opacity:0;transform:translateY(-12px)}100%{opacity:1;transform:translateY(0)}}
        .wdrop{animation:floatDrop 3.5s ease-in-out infinite}
        .ripple1{animation:ripple 2.4s ease-out infinite}
        .ripple2{animation:ripple 2.4s ease-out infinite;animation-delay:0.8s}
        .ripple3{animation:ripple 2.4s ease-out infinite;animation-delay:1.6s}
        .pc:hover{transform:translateY(-6px)!important;box-shadow:0 12px 36px rgba(14,165,233,.16)!important}
      `}</style>

      <Navbar currentPage={activeTab==="home"?"dashboard":activeTab} onNavigate={handleNav}/>

      {/* Toast */}
      {toast&&<div style={{position:"fixed",top:80,right:24,zIndex:9999,background:"#0c2340",color:"white",padding:"12px 22px",borderRadius:50,fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,.2)",animation:"slideIn .3s ease"}}>{toast}</div>}

      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 20px"}}>

        {/* HOME */}
        {(activeTab==="home"||activeTab==="dashboard")&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#0c2340,#0369a1)",borderRadius:24,padding:"40px 48px",marginBottom:32,display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden",position:"relative",flexWrap:"wrap",gap:20}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#bae6fd",textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>Welcome back</div>
                <h1 style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:900,color:"white",marginBottom:12,lineHeight:1.2}}>Hello, {user?.fullName?.split(" ")[0]} 👋</h1>
                <p style={{color:"#93c5fd",fontSize:14,marginBottom:24}}>What would you like to order today?</p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <button onClick={()=>setActiveTab("filtered")} style={{background:"white",color:"#0284c7",border:"none",borderRadius:50,padding:"11px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>🔵 Filtered Water</button>
                  <button onClick={()=>setActiveTab("cold")} style={{background:"rgba(255,255,255,.12)",color:"white",border:"1px solid rgba(255,255,255,.3)",borderRadius:50,padding:"11px 22px",fontSize:13,fontWeight:600,cursor:"pointer"}}>❄️ Cold Water</button>
                  {cartCount>0&&<button onClick={()=>setActiveTab("cart")} style={{background:"#0ea5e9",color:"white",border:"none",borderRadius:50,padding:"11px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>🛒 Cart ({cartCount})</button>}
                </div>
              </div>
              <div style={{position:"relative",width:140,height:140,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {/* Ripple rings */}
              <div className="ripple1" style={{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.25)"}}/>
              <div className="ripple2" style={{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.18)"}}/>
              <div className="ripple3" style={{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.12)"}}/>
              {/* SVG water drop */}
              <div className="wdrop">
                <svg width="72" height="90" viewBox="0 0 72 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.95)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0.5)"/>
                    </linearGradient>
                  </defs>
                  <path d="M36 4 C36 4 6 42 6 58 C6 75.7 19.3 88 36 88 C52.7 88 66 75.7 66 58 C66 42 36 4 36 4Z" fill="url(#dg1)" opacity="0.9"/>
                  <ellipse cx="27" cy="44" rx="5" ry="9" fill="rgba(255,255,255,0.5)" transform="rotate(-30 27 44)"/>
                </svg>
              </div>
            </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:32}}>
              {[{icon:"📦",label:"Orders",val:"0",color:"#0ea5e9"},{icon:"📅",label:"Active Plans",val:"0",color:"#0284c7"},{icon:"💰",label:"Total Spent",val:"₹0",color:"#0369a1"},{icon:"⭐",label:"Points",val:"0",color:"#0c2340"}].map(st=>(
                <div key={st.label} style={{background:"white",borderRadius:20,padding:22,boxShadow:"0 4px 20px rgba(14,165,233,.07)",border:"1px solid rgba(14,165,233,.06)",textAlign:"center"}}>
                  <div style={{fontSize:28,marginBottom:8}}>{st.icon}</div>
                  <div style={{fontSize:22,fontWeight:900,color:st.color,fontFamily:"Playfair Display,serif"}}>{st.val}</div>
                  <div style={{fontSize:12,color:"#64748b",fontWeight:500,marginTop:2}}>{st.label}</div>
                </div>
              ))}
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <h2 style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0c2340"}}>Available Products</h2>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["All","Filtered","Cold"].map(t=>(
                  <button key={t} onClick={()=>setActiveTab(t==="All"?"home":t.toLowerCase())}
                    style={{padding:"6px 16px",borderRadius:50,border:"1px solid #e0f2fe",background:activeTab===(t==="All"?"home":t.toLowerCase())?"#0ea5e9":"white",color:activeTab===(t==="All"?"home":t.toLowerCase())?"white":"#374151",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all .2s"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ProductGrid products={products} loading={loading} onAdd={addToCart}/>
          </div>
        )}

        {/* FILTERED / COLD */}
        {(activeTab==="filtered"||activeTab==="cold")&&(
          <div>
            <div style={{marginBottom:24}}>
              <button onClick={()=>setActiveTab("home")} style={{background:"none",border:"none",color:"#0ea5e9",fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:"DM Sans,sans-serif",padding:0}}>← Back to Dashboard</button>
            </div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:6}}>{activeTab==="cold"?"❄️ Cold Filtered Water":"🔵 Filtered Water"}</h2>
            <p style={{color:"#64748b",fontSize:14,marginBottom:28}}>{activeTab==="cold"?"Chilled RO water — perfect for summers and events.":"Multi-stage RO purified water for daily use."}</p>
            <ProductGrid products={filtered} loading={loading} onAdd={addToCart}/>
          </div>
        )}

        {/* CART */}
        {activeTab==="cart"&&(
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:24}}>🛒 Your Cart</h2>
            {cartItems.length===0?(
              <div style={{textAlign:"center",padding:"80px 0",color:"#94a3b8"}}>
                <div style={{fontSize:64}}>🛒</div>
                <p style={{marginTop:12}}>Your cart is empty</p>
                <button onClick={()=>setActiveTab("home")} style={{marginTop:20,background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",border:"none",borderRadius:50,padding:"12px 24px",fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Browse Products</button>
              </div>
            ):(
              <div>
                {cartItems.map(item=>(
                  <div key={item.productId} style={{background:"white",borderRadius:16,padding:"16px 20px",marginBottom:12,display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 10px rgba(14,165,233,.06)"}}>
                    <div style={{fontSize:32}}>💧</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:"#0c2340"}}>{item.name}</div>
                      <div style={{fontSize:13,color:"#64748b"}}>{item.bottleSize} · {item.waterType}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:900,color:"#0ea5e9",fontSize:16}}>₹{(item.price*item.qty).toFixed(0)}</div>
                      <div style={{fontSize:12,color:"#94a3b8"}}>Qty: {item.qty}</div>
                    </div>
                  </div>
                ))}
                <div style={{background:"white",borderRadius:16,padding:"20px 24px",marginTop:16,boxShadow:"0 4px 20px rgba(14,165,233,.08)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                    <span style={{fontWeight:700,fontSize:16}}>Total</span>
                    <span style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0ea5e9"}}>₹{cartTotal.toFixed(0)}</span>
                  </div>
                  <button style={{width:"100%",background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",border:"none",borderRadius:50,padding:"13px",fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:15}}>Proceed to Checkout →</button>
                  <p style={{textAlign:"center",fontSize:12,color:"#94a3b8",marginTop:10}}>Full checkout coming in Phase 4</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab==="orders"&&(
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <div style={{fontSize:64}}>📦</div>
            <h3 style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0c2340",marginTop:16}}>No orders yet</h3>
            <p style={{color:"#64748b",marginTop:8}}>Your order history will appear here</p>
            <button onClick={()=>setActiveTab("home")} style={{marginTop:20,background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",border:"none",borderRadius:50,padding:"12px 24px",fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif"}}>Shop Now</button>
          </div>
        )}

        {/* SUBSCRIPTIONS */}
        {activeTab==="subscriptions"&&(
          <div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:24}}>📅 Monthly Plans</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24}}>
              {[{name:"Starter",price:"₹299",desc:"30 × 1L bottles/month",color:"#38bdf8"},{name:"Family",price:"₹599",desc:"20 × 5L bottles/month",color:"#0ea5e9",popular:true},{name:"Business",price:"₹999",desc:"15 × 10L bottles/month",color:"#0284c7"}].map(plan=>(
                <div key={plan.name} style={{background:"white",borderRadius:20,padding:28,boxShadow:"0 4px 20px rgba(14,165,233,.08)",border:`2px solid ${plan.popular?plan.color:"transparent"}`,position:"relative",textAlign:"center"}}>
                  {plan.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${plan.color},#0284c7)`,color:"white",borderRadius:50,padding:"3px 16px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>⭐ Most Popular</div>}
                  <div style={{fontSize:36,marginBottom:12}}>💧</div>
                  <h3 style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:900,color:"#0c2340",marginBottom:4}}>{plan.name}</h3>
                  <p style={{fontSize:13,color:"#64748b",marginBottom:16}}>{plan.desc}</p>
                  <div style={{fontSize:30,fontWeight:900,color:plan.color,fontFamily:"Playfair Display,serif",marginBottom:20}}>{plan.price}<span style={{fontSize:14,color:"#94a3b8",fontFamily:"DM Sans,sans-serif"}}>/mo</span></div>
                  <button style={{width:"100%",background:`linear-gradient(135deg,${plan.color},#0284c7)`,color:"white",border:"none",borderRadius:50,padding:"11px",fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:14}}>Subscribe Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab==="profile"&&(
          <div style={{maxWidth:500,margin:"0 auto"}}>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:24}}>👤 My Profile</h2>
            <div style={{background:"white",borderRadius:20,padding:32,boxShadow:"0 4px 20px rgba(14,165,233,.08)"}}>
              <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:28,paddingBottom:24,borderBottom:"1px solid #f0f9ff"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:26}}>{user?.fullName?.[0]?.toUpperCase()||"U"}</div>
                <div>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:900,color:"#0c2340"}}>{user?.fullName}</div>
                  <div style={{fontSize:13,color:"#64748b",marginTop:2}}>{user?.email}</div>
                  <span style={{background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",borderRadius:50,padding:"2px 12px",fontSize:11,fontWeight:700,display:"inline-block",marginTop:6}}>{user?.role}</span>
                </div>
              </div>
              {[["📧","Email",user?.email],["📞","Phone","Not set"],["📍","Address","Not set"],["🗓️","Member since","2025"]].map(([icon,label,val])=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:"1px solid #f8fafc"}}>
                  <span style={{fontSize:20,width:28,textAlign:"center"}}>{icon}</span>
                  <div>
                    <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
                    <div style={{fontSize:14,color:"#0c2340",fontWeight:500,marginTop:1}}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ProductGrid({products,loading,onAdd}){
  if(loading) return(
    <div style={{textAlign:"center",padding:"60px 0",color:"#94a3b8",fontFamily:"DM Sans,sans-serif"}}>
      <div style={{fontSize:48,marginBottom:12}}>💧</div><p>Loading products...</p>
    </div>
  );
  if(!products.length) return <div style={{textAlign:"center",padding:"60px 0",color:"#94a3b8"}}>
    <div style={{textAlign:"center",padding:"60px 0"}}>
      <h3>No products available</h3>
      <p>Add products from backend</p>
    </div>
  </div>;
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:20}}>
      {products.map(p=>(
        <div key={p.id} className="pc"
          style={{background:"white",borderRadius:20,padding:22,boxShadow:"0 4px 20px rgba(14,165,233,.07)",transition:"all .3s",border:"1px solid rgba(14,165,233,.06)",textAlign:"center",fontFamily:"DM Sans,sans-serif"}}>
          <div style={{display:"inline-block",background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",borderRadius:50,padding:"3px 12px",fontSize:11,fontWeight:700,color:"#0369a1",textTransform:"uppercase",letterSpacing:.5,marginBottom:12}}>
            {p.waterType==="COLD_FILTERED"?"❄️ Cold":"🔵 Filtered"}
          </div>
          <div style={{fontSize:44,marginBottom:8}}>💧</div>
          <div style={{fontWeight:900,fontSize:16,color:"#0c2340",marginBottom:2}}>{p.bottleSize||p.name}</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>{p.name}</div>
          <div style={{fontSize:22,fontWeight:900,color:"#0ea5e9",marginBottom:16}}>₹{p.price}</div>
          <button onClick={()=>onAdd(p)}
            style={{width:"100%",background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",border:"none",borderRadius:50,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s"}}>
            + Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}