import { useState } from "react";
import Navbar from "../components/Navbar";

function Footer({ onNavigate }) {
  const isMobile = window.innerWidth < 768;
  return (
    <footer style={{background:"#0c2340",padding:isMobile?"40px 20px 24px":"56px 40px 24px"}}>
      <div style={{maxWidth:1180,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"2fr 1fr 1fr 1fr",gap:isMobile?28:40,marginBottom:40}}>
          <div style={{gridColumn:isMobile?"1 / -1":"auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,cursor:"pointer"}} onClick={()=>onNavigate("landing")}>
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
                  <li key={label} onClick={()=>onNavigate(pg)}
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

export default function EventsPage({ onNavigate }) {
  const isMobile = window.innerWidth < 768;
  const [form, setForm] = useState({name:"",phone:"",email:"",eventType:"",eventDate:"",guests:"",notes:""});
  const [submitted, setSubmitted] = useState(false);
  const handle = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = e => { e.preventDefault(); setSubmitted(true); };

  const eventTypes = [
    {icon:"💍",title:"Weddings",desc:"From mehndi to reception — we supply chilled and ambient water for all wedding functions.",bottles:"500–5,000+ bottles",notice:"7 days",color:"#f472b6"},
    {icon:"🏢",title:"Corporate Events",desc:"Conferences, seminars, product launches. Branded water bottles available for premium events.",bottles:"200–2,000+ bottles",notice:"5 days",color:"#0ea5e9"},
    {icon:"🎉",title:"Parties & Celebrations",desc:"Birthday parties, anniversaries, get-togethers. Hassle-free delivery on your schedule.",bottles:"100–1,000 bottles",notice:"3 days",color:"#a78bfa"},
    {icon:"🏃",title:"Sports & Marathons",desc:"Hydration stations and cold water supply for marathons, sports events, and tournaments.",bottles:"1,000–10,000+ bottles",notice:"10 days",color:"#34d399"},
    {icon:"🎓",title:"Institutional Events",desc:"College fests, school events, government functions. Bulk supply with custom invoicing.",bottles:"500–5,000 bottles",notice:"7 days",color:"#f59e0b"},
    {icon:"🙏",title:"Religious & Cultural",desc:"Temple events, cultural programs, community gatherings — trusted for large-scale functions.",bottles:"200–10,000+ bottles",notice:"5 days",color:"#fb923c"},
  ];

  const steps = [
    {n:"01",title:"Fill the Form",desc:"Tell us your event type, date, and estimated guest count using the enquiry form."},
    {n:"02",title:"Get a Quote",desc:"Our team will call you within 2 hours with a customised pricing quote."},
    {n:"03",title:"Confirm & Pay",desc:"Confirm your order with a 50% advance. We lock your delivery slot immediately."},
    {n:"04",title:"On-time Delivery",desc:"We arrive 1 hour before your event starts. Cold water kept chilled till serving time."},
  ];

  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#f0f9ff",fontFamily:"DM Sans,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        *,*::before,*::after{box-sizing:border-box}
        html,body,#root{margin:0;padding:0;width:100%;overflow-x:hidden;background:#f0f9ff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .fadeup{animation:fadeUp .6s ease both}
        .float{animation:float 3.5s ease-in-out infinite}
        .card-h{transition:transform .3s,box-shadow .3s}
        .card-h:hover{transform:translateY(-6px)!important;box-shadow:0 16px 40px rgba(14,165,233,.14)!important}
        .bp{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;border:none;border-radius:50px;padding:12px 26px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(14,165,233,.3);transition:all .2s}
        .bp:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(14,165,233,.45)}
        .bo{background:transparent;color:#0ea5e9;border:2px solid #0ea5e9;border-radius:50px;padding:10px 24px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
        .bo:hover{background:#0ea5e9;color:white}
        .inp{width:100%;padding:12px 16px;border:2px solid #e0f2fe;border-radius:12px;font-size:14px;color:#0c2340;outline:none;font-family:"DM Sans",sans-serif;box-sizing:border-box;background:#fafeff;transition:all .2s}
        .inp:focus{border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.1)}
      `}</style>

      <Navbar currentPage="events" onNavigate={onNavigate} />

      {/* HERO */}
      <div style={{background:"linear-gradient(160deg,#0c2340 0%,#0369a1 55%,#0ea5e9 100%)",padding:isMobile?"72px 20px 80px":"90px 24px 100px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:700,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="fadeup" style={{display:"inline-block",background:"rgba(255,255,255,.12)",color:"#bae6fd",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:18,border:"1px solid rgba(255,255,255,.15)"}}>
            🎉 Event Water Supply
          </div>
          <h1 className="fadeup" style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?"clamp(28px,8vw,44px)":"clamp(36px,5vw,54px)",fontWeight:900,color:"white",lineHeight:1.1,marginBottom:16,animationDelay:".1s"}}>
            Water for Your<br/><span style={{color:"#7dd3fc"}}>Special Moments.</span>
          </h1>
          <p className="fadeup" style={{fontSize:isMobile?14:16,color:"#bae6fd",lineHeight:1.75,marginBottom:32,animationDelay:".2s"}}>
            Weddings, corporates, marathons — bulk water delivered on time, every time. Cold and ambient options available.
          </p>
          <div className="fadeup" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animationDelay:".3s"}}>
            <button className="bp" style={{background:"white",color:"#0284c7",boxShadow:"0 4px 14px rgba(0,0,0,.15)"}}
              onClick={()=>document.getElementById("event-form").scrollIntoView({behavior:"smooth"})}>
              📋 Get Event Quote
            </button>
            <button className="bo" style={{borderColor:"rgba(255,255,255,.5)",color:"white"}} onClick={()=>onNavigate("contact")}>📞 Call Us</button>
          </div>
        </div>
        {/* Floating badges */}
        <div className="float" style={{position:"absolute",top:isMobile?20:40,left:isMobile?10:60,background:"rgba(255,255,255,.1)",backdropFilter:"blur(8px)",borderRadius:14,padding:"10px 16px",border:"1px solid rgba(255,255,255,.15)"}}>
          <div style={{fontSize:18,marginBottom:2}}>💍</div>
          <div style={{fontSize:11,color:"white",fontWeight:600}}>Weddings</div>
        </div>
        <div className="float" style={{position:"absolute",bottom:isMobile?20:50,right:isMobile?10:80,background:"rgba(255,255,255,.1)",backdropFilter:"blur(8px)",borderRadius:14,padding:"10px 16px",border:"1px solid rgba(255,255,255,.15)",animationDelay:".8s"}}>
          <div style={{fontSize:18,marginBottom:2}}>🏃</div>
          <div style={{fontSize:11,color:"white",fontWeight:600}}>Marathons</div>
        </div>
        <div style={{position:"absolute",top:-100,right:-100,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,.04),transparent 70%)",pointerEvents:"none"}}/>
      </div>
      {/* STATS */}
      <div style={{background:"white",borderBottom:"1px solid #e0f2fe"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
          {[["50+","Events Served"],["10,000+","Bottles/Event"],["4.9★","Avg. Rating"],["100%","On-time Delivery"],["6","Event Types"]].map(([v,l])=>(
            <div key={l} style={{padding:"22px 28px",textAlign:"center"}}>
              <div style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0ea5e9"}}>{v}</div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* EVENT TYPES */}
      <div style={{maxWidth:1180,margin:"0 auto",padding:isMobile?"48px 20px":"64px 24px"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <div style={{display:"inline-block",background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",color:"#0369a1",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>All Event Categories</div>
          <h2 style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?26:38,fontWeight:900,color:"#0c2340"}}>We Supply Water For</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
          {eventTypes.map((ev,i)=>(
            <div key={ev.title} className="card-h fadeup" style={{background:"white",borderRadius:20,padding:26,boxShadow:"0 4px 20px rgba(14,165,233,.07)",border:"1px solid rgba(14,165,233,.06)",animationDelay:`${i*0.06}s`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:52,height:52,borderRadius:16,background:`${ev.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{ev.icon}</div>
                <h3 style={{fontFamily:"Playfair Display,serif",fontSize:18,fontWeight:900,color:"#0c2340",margin:0}}>{ev.title}</h3>
              </div>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.7,marginBottom:14}}>{ev.desc}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{background:`${ev.color}12`,color:ev.color,borderRadius:50,padding:"3px 12px",fontSize:11,fontWeight:600}}>📦 {ev.bottles}</span>
                <span style={{background:"#f0f9ff",color:"#0369a1",borderRadius:50,padding:"3px 12px",fontSize:11,fontWeight:600}}>⏰ {ev.notice} advance</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* HOW IT WORKS */}
      <div style={{background:"linear-gradient(160deg,#0c2340,#0369a1)",padding:isMobile?"48px 20px":"64px 24px"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div style={{display:"inline-block",background:"rgba(255,255,255,.1)",color:"#bae6fd",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Simple Process</div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?26:38,fontWeight:900,color:"white"}}>How It Works</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(4,1fr)",gap:24}}>
            {steps.map((st,i)=>(
              <div key={st.n} className="fadeup" style={{textAlign:"center",animationDelay:`${i*0.1}s`}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,.12)",border:"2px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontFamily:"Playfair Display,serif",fontSize:20,fontWeight:900,color:"#7dd3fc"}}>{st.n}</div>
                <h3 style={{fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:900,color:"white",marginBottom:8}}>{st.title}</h3>
                <p style={{fontSize:13,color:"#93c5fd",lineHeight:1.7,margin:0}}>{st.desc}</p>
                {i<steps.length-1&&!isMobile&&<div style={{position:"absolute"}}/>}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ENQUIRY FORM */}
      <div id="event-form" style={{maxWidth:780,margin:"0 auto",padding:isMobile?"48px 20px":"72px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",color:"#0369a1",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Free Quote</div>
          <h2 style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?26:36,fontWeight:900,color:"#0c2340"}}>Get Your Event Quote</h2>
          <p style={{color:"#64748b",fontSize:14,marginTop:8}}>We'll call you back within 2 hours with a custom quote.</p>
        </div>

        {submitted ? (
          <div style={{textAlign:"center",background:"white",borderRadius:24,padding:"56px 40px",boxShadow:"0 8px 40px rgba(14,165,233,.1)"}}>
            <div style={{fontSize:64,marginBottom:16}}>🎉</div>
            <h3 style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:900,color:"#0c2340",marginBottom:8}}>Enquiry Sent!</h3>
            <p style={{color:"#64748b",fontSize:14,marginBottom:28}}>Our events team will contact you within 2 hours to discuss your requirements and pricing.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="bp" onClick={()=>setSubmitted(false)}>Send Another</button>
              <button className="bo" onClick={()=>onNavigate("landing")}>Go to Home</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{background:"white",borderRadius:24,padding:isMobile?"28px 24px":"44px 48px",boxShadow:"0 8px 40px rgba(14,165,233,.1)",border:"1px solid rgba(14,165,233,.06)"}}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Your Name *</label>
                <input className="inp" name="name" required value={form.name} onChange={handle} placeholder="Full name"/>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Phone Number *</label>
                <input className="inp" name="phone" type="tel" required value={form.phone} onChange={handle} placeholder="+91 98765 43210"/>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Email Address</label>
                <input className="inp" name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com"/>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Event Type *</label>
                <select className="inp" name="eventType" required value={form.eventType} onChange={handle} style={{background:"#fafeff"}}>
                  <option value="">Select event type</option>
                  {["Wedding","Corporate Event","Birthday Party","Marathon / Sports","College Fest","Religious Event","Other"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Event Date *</label>
                <input className="inp" name="eventDate" type="date" required value={form.eventDate} onChange={handle}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Expected Guests *</label>
                <select className="inp" name="guests" required value={form.guests} onChange={handle} style={{background:"#fafeff"}}>
                  <option value="">Select range</option>
                  {["Under 100","100–300","300–500","500–1,000","1,000–5,000","5,000+"].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Special Requirements</label>
              <textarea className="inp" name="notes" rows={3} value={form.notes} onChange={handle} placeholder="Cold water, branded bottles, delivery time, venue address..." style={{resize:"vertical"}}/>
            </div>
            <button className="bp" type="submit" style={{width:"100%",padding:"14px",fontSize:15}}>
              🚀 Send Event Enquiry
            </button>
            <p style={{textAlign:"center",fontSize:12,color:"#94a3b8",marginTop:12}}>We respond within 2 hours · No spam · Free quote</p>
          </form>
        )}
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}