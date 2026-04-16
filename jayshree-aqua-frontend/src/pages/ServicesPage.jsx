import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";


// ── Shared sub-components ─────────────────────────────────────
function Footer() {
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();
  return (
    <footer style={{background:"#0c2340",padding:isMobile?"40px 20px 24px":"56px 40px 24px"}}>
      <div style={{maxWidth:1180,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"2fr 1fr 1fr 1fr",gap:isMobile?28:40,marginBottom:40}}>
          <div style={{gridColumn:isMobile?"1 / -1":"auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,cursor:"pointer"}} onClick={()=>navigate("/")}>
              <div style={{width:38,height:38,background:"linear-gradient(135deg,#0ea5e9,#0284c7)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💧</div>
              <div style={{fontFamily:"Playfair Display,serif",fontWeight:900,fontSize:17,color:"white"}}>Jayshree Aqua</div>
            </div>
            <p style={{fontSize:13,color:"#7dd3fc",lineHeight:1.8,maxWidth:240}}>Delivering pure, safe drinking water since 2009.</p>
          </div>
          {[
            {title:"Quick Links",items:[["landing","Home"],["services","Services"],["events","Events"],["contact","Contact"]]},
            {title:"Services",items:[["services","Filtered Water"],["services","Cold Water"],["events","Event Orders"],["contact","Get Quote"]]},
            {title:"Company",items:[["landing","About Us"],["contact","Contact Us"],["landing","Careers"],["landing","Privacy"]]},
          ].map(col=>(
            <div key={col.title}>
              <h4 style={{fontSize:11,fontWeight:700,color:"white",textTransform:"uppercase",letterSpacing:1.5,marginBottom:16}}>{col.title}</h4>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:9}}>
                {col.items.map(([pg,label])=>(
                  <li key={label} onClick={()=>navigate("/" + (pg === "landing" ? "" : pg))}
                    style={{fontSize:13,color:"#7dd3fc",cursor:"pointer",transition:"color .2s,paddingLeft .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color="white";e.currentTarget.style.paddingLeft="6px"}}
                    onMouseLeave={e=>{e.currentTarget.style.color="#7dd3fc";e.currentTarget.style.paddingLeft="0"}}>{label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <p style={{fontSize:12,color:"#475569",margin:0}}>© 2025 Jayshree Aqua. All rights reserved.</p>
          <p style={{fontSize:12,color:"#475569",margin:0}}>Made with 💧 for pure hydration</p>
        </div>
      </div>
    </footer>
  );
}

// ── ServicesPage ──────────────────────────────────────────────
export default function ServicesPage() {
  const isMobile = window.innerWidth < 768;
  const [activeTab, setActiveTab] = useState("all");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const services = [
    { id:"filtered", icon:"🔵", title:"Filtered Water", tag:"Daily Use", color:"#0ea5e9",
      desc:"Our flagship multi-stage RO purification removes 99.9% of impurities, dissolved salts, bacteria, and viruses. Safe, clean water delivered fresh daily.",
      features:["7-stage RO purification","TDS controlled 50–150 ppm","Zero bacteria & virus","Same-day delivery","500ml · 1L · 2L bottles"],
      price: 10,label: "From ₹10/bottle", category:"water" },
    { id:"cold", icon:"❄️", title:"Cold Filtered Water", tag:"Premium", color:"#38bdf8",
      desc:"Chilled RO-purified water kept at 4–8°C. Perfect for offices, summer events, and anywhere you need refreshing cold water on demand.",
      features:["Chilled at 4–8°C","Same RO purity standards","Ideal for events & offices","Insulated delivery cans","Available in 5L & 10L"],
      price: 25,label: "From ₹25/bottle", category:"water" },
    { id:"bulk", icon:"🏺", title:"Bulk Office Supply", tag:"Business", color:"#0284c7",
      desc:"Dedicated delivery schedule for offices, factories, and institutions. Never run out of water again with our auto-replenishment service.",
      features:["Weekly/bi-weekly delivery","Dedicated account manager","Invoice-based billing","Custom branded dispensers","Free first installation"],
      price:null, label:"Custom pricing", category:"business" },
    { id:"subscription", icon:"📅", title:"Home Subscription", tag:"Most Popular", color:"#0369a1",
      desc:"Set up a recurring monthly delivery and save up to 20%. Choose your bottle size, quantity, and delivery frequency — we handle the rest.",
      features:["Save up to 20%","Flexible frequency","Pause or cancel anytime","SMS delivery alerts","Loyalty reward points"],
      price:null, label:"From ₹299/month", category:"subscription" },
    { id:"dispenser", icon:"🚰", title:"Dispenser Rental", tag:"New", color:"#0c2340",
      desc:"Rent a premium hot & cold water dispenser and combine it with our filtered water delivery. A complete pure water solution for your home or office.",
      features:["Hot & cold dispenser","Monthly rental ₹199","Free installation & service","Works with our 20L cans","Replace anytime"],
      price:null, label:"₹199/month rental", category:"business" },
    { id:"event", icon:"🎉", title:"Event Water Supply", tag:"Bulk Orders", color:"#0ea5e9",
      desc:"Supplying water for weddings, corporate events, marathons, and festivals. We handle logistics so you focus on your event.",
      features:["Min. order 500 bottles","Event-day delivery","Cold & ambient options","Custom label available","Advance booking required"],
      price:null, label:"Contact for quote", category:"event" },
  ];

  const tabs = [{k:"all",l:"All Services"},{k:"water",l:"Water Products"},{k:"business",l:"Business"},{k:"subscription",l:"Subscriptions"},{k:"event",l:"Events"}];
  const filtered = activeTab === "all" ? services : services.filter(s => s.category === activeTab);

  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#f0f9ff",fontFamily:"DM Sans,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        *,*::before,*::after{box-sizing:border-box}
        html,body,#root{margin:0;padding:0;width:100%;overflow-x:hidden;background:#f0f9ff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .fadeup{animation:fadeUp .6s ease both}
        .card-h{transition:transform .3s,box-shadow .3s,border-color .3s}
        .card-h:hover{transform:translateY(-6px)!important;box-shadow:0 16px 40px rgba(14,165,233,.15)!important}
        .bp{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;border:none;border-radius:50px;padding:12px 26px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(14,165,233,.3);transition:all .2s}
        .bp:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(14,165,233,.45)}
        .bo{background:transparent;color:#0ea5e9;border:2px solid #0ea5e9;border-radius:50px;padding:10px 24px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
        .bo:hover{background:#0ea5e9;color:white}
        .tab{background:none;border:none;outline:none;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:500;cursor:pointer;padding:8px 18px;border-radius:50px;transition:all .2s;white-space:nowrap}
        .tab:hover{background:rgba(14,165,233,.08);color:#0ea5e9}
        .tab.active{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;font-weight:700;box-shadow:0 4px 12px rgba(14,165,233,.3)}
      `}</style>

      <Navbar />

      {/* HERO */}
      <div style={{background:"linear-gradient(160deg,#f0f9ff 0%,#e0f2fe 50%,#bae6fd 100%)",padding:isMobile?"64px 20px 72px":"80px 24px 90px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:680,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="fadeup" style={{display:"inline-block",background:"rgba(14,165,233,.1)",color:"#0369a1",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:18,border:"1px solid rgba(14,165,233,.15)"}}>
            What We Offer
          </div>
          <h1 className="fadeup" style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?"clamp(28px,8vw,44px)":"clamp(36px,5vw,54px)",fontWeight:900,color:"#0c2340",lineHeight:1.1,marginBottom:16,animationDelay:".1s"}}>
            Pure Water, <span style={{color:"#0ea5e9"}}>Every Way</span><br/>You Need It.
          </h1>
          <p className="fadeup" style={{fontSize:isMobile?14:16,color:"#334155",lineHeight:1.75,marginBottom:32,animationDelay:".2s"}}>
            From daily home delivery to bulk event supply — Jayshree Aqua has a water solution for every need.
          </p>
          <div className="fadeup" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animationDelay:".3s"}}>
            <button className="bp" onClick={()=>navigate("/register")}>🚀 Get Started Free</button>
            <button className="bo" onClick={()=>navigate("/contact")}>Get a Quote</button>
          </div>
        </div>
        <div style={{position:"absolute",top:-80,right:-80,width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,.08),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-60,left:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,.06),transparent 70%)",pointerEvents:"none"}}/>
      </div>
      {/* STATS BAR */}
      <div style={{background:"white",borderBottom:"1px solid #e0f2fe"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
          {[["10,000+","Happy Customers"],["99.9%","Water Purity"],["15+","Years Experience"],["6","Service Types"],["50+","Events Served"]].map(([v,l])=>(
            <div key={l} style={{padding:"22px 32px",textAlign:"center",borderRight:"1px solid #f0f9ff"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0ea5e9"}}>{v}</div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* FILTER TABS */}
      <div style={{maxWidth:1180,margin:"0 auto",padding:"40px 24px 0"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:36}}>
          {tabs.map(t=>(
            <button key={t.k} className={"tab"+(activeTab===t.k?" active":"")} onClick={()=>setActiveTab(t.k)}>{t.l}</button>
          ))}
        </div>

        {/* SERVICE CARDS */}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":filtered.length===1?"1fr":"repeat(auto-fill,minmax(320px,1fr))",gap:24,marginBottom:60}}>
          {filtered.map((sv,i)=>(
            <div key={sv.id} className="card-h fadeup" style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 4px 24px rgba(14,165,233,.07)",border:"1px solid rgba(14,165,233,.06)",animationDelay:`${i*0.07}s`}}>
              {/* Card header */}
              <div style={{background:`linear-gradient(135deg,${sv.color}18,${sv.color}08)`,padding:"28px 28px 20px",borderBottom:"1px solid rgba(14,165,233,.06)",position:"relative"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontSize:44}}>{sv.icon}</div>
                  <span style={{background:`${sv.color}18`,color:sv.color,borderRadius:50,padding:"3px 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{sv.tag}</span>
                </div>
                <h3 style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0c2340",marginBottom:8}}>{sv.title}</h3>
                <p style={{fontSize:13,color:"#64748b",lineHeight:1.7,margin:0}}>{sv.desc}</p>
                
              </div>
              {/* Features */}
              <div style={{padding:"20px 28px"}}>
                <div style={{marginBottom:16}}>
                  {sv.features.map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0"}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:`${sv.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke={sv.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{fontSize:13,color:"#374151"}}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid #f0f9ff"}}>
                  <div>
                    <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Pricing</div>
                    <div style={{fontFamily:"Playfair Display,serif",fontSize:17,fontWeight:900,color:sv.color,marginTop:2}}>{sv.label}</div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    {sv.price !== null && (
                    <button
                className="bp"
                onClick={() => {
                  addToCart({
                    id: sv.id === "filtered" ? 1 : 2,
                    name: sv.title,
                    price: sv.price,
                    icon: sv.icon
                  });
                  console.log("Added to cart");
                  localStorage.clear()
                }}
              >
                Add to Cart 🛒
              </button>
              )}
                  <button className="bp" style={{padding:"9px 20px",fontSize:13,background:`linear-gradient(135deg,${sv.color},#0284c7)`}}
                    onClick={() => sv.id === "event" ? navigate("/events") : navigate("/register")}>
                    {sv.id==="event"?"Learn More":"Get Started"}
                  </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CTA BANNER */}
      <div style={{background:"linear-gradient(135deg,#0c2340,#0369a1)",padding:"64px 24px",textAlign:"center"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{fontSize:48,marginBottom:16}}>💧</div>
          <h2 style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?26:36,fontWeight:900,color:"white",marginBottom:12}}>Not Sure Which Service?</h2>
          <p style={{color:"#93c5fd",fontSize:15,lineHeight:1.75,marginBottom:28}}>Our team will help you find the perfect water solution for your home or business.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="bp" style={{background:"white",color:"#0284c7",boxShadow:"0 4px 14px rgba(0,0,0,.15)"}} onClick={()=>navigate("/contact")}>📞 Talk to Us</button>
            <button className="bo" style={{borderColor:"rgba(255,255,255,.5)",color:"white"}} onClick={()=>navigate("/register")}>Start Free Trial</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}