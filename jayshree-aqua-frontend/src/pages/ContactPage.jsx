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

export default function ContactPage({ onNavigate }) {
  const isMobile = window.innerWidth < 768;
  const [form, setForm]       = useState({name:"",phone:"",email:"",subject:"",message:""});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const handle = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(()=>{ setLoading(false); setSubmitted(true); }, 1200);
  };

  const contacts = [
    {icon:"📞",title:"Call Us",lines:["Mon–Sat 6 AM – 9 PM","+91 98765 43210","+91 98765 43211"],color:"#0ea5e9",action:"tel:+919876543210",actionLabel:"Call now"},
    {icon:"✉️",title:"Email Us",lines:["We reply within 2 hours","hello@jayshreeaqua.com","support@jayshreeaqua.com"],color:"#0284c7",action:"mailto:hello@jayshreeaqua.com",actionLabel:"Send email"},
    {icon:"📍",title:"Service Area",lines:["Pimpri-Chinchwad","Pune city & suburbs","20+ pin codes covered"],color:"#0369a1",action:null,actionLabel:"View map"},
    {icon:"🕐",title:"Working Hours",lines:["Mon–Sat  6 AM – 9 PM","Sunday    7 AM – 7 PM","Holidays  8 AM – 6 PM"],color:"#0c2340",action:null,actionLabel:null},
  ];

  const faqs = [
    {q:"How soon can I get my first delivery?",a:"Same-day delivery is available for orders placed before 12 PM. Orders placed after 12 PM will be delivered next morning by 8 AM."},
    {q:"What areas do you cover?",a:"We currently deliver across Pimpri-Chinchwad, Pune city, Wakad, Hinjewadi, Kothrud, Hadapsar, and 20+ surrounding areas. Enter your pincode on our order page to confirm."},
    {q:"Can I cancel or pause my subscription?",a:"Yes, subscriptions can be paused or cancelled anytime from your dashboard with no cancellation fee. Changes apply from the next delivery cycle."},
    {q:"Do you offer water dispensers?",a:"Yes! We offer monthly dispenser rental at ₹199/month including free installation and maintenance. It works with our 20L refillable cans."},
    {q:"How do I book water for an event?",a:"Use the Event Quote form on our Events page or call us directly. Advance booking of at least 3–7 days is recommended depending on event size."},
    {q:"What payment methods do you accept?",a:"We accept UPI, NEFT, credit/debit cards, and cash on delivery. Subscription customers can also set up auto-pay via UPI mandate."},
  ];

  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#f0f9ff",fontFamily:"DM Sans,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        *,*::before,*::after{box-sizing:border-box}
        html,body,#root{margin:0;padding:0;width:100%;overflow-x:hidden;background:#f0f9ff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fadeup{animation:fadeUp .6s ease both}
        .card-h{transition:transform .3s,box-shadow .3s}
        .card-h:hover{transform:translateY(-5px)!important;box-shadow:0 14px 36px rgba(14,165,233,.13)!important}
        .bp{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;border:none;border-radius:50px;padding:13px 28px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:15px;cursor:pointer;box-shadow:0 4px 14px rgba(14,165,233,.3);transition:all .2s}
        .bp:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(14,165,233,.45)}
        .bo{background:transparent;color:#0ea5e9;border:2px solid #0ea5e9;border-radius:50px;padding:10px 24px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
        .bo:hover{background:#0ea5e9;color:white}
        .inp{width:100%;padding:12px 16px;border:2px solid #e0f2fe;border-radius:12px;font-size:14px;color:#0c2340;outline:none;font-family:"DM Sans",sans-serif;box-sizing:border-box;background:#fafeff;transition:all .2s}
        .inp:focus{border-color:#0ea5e9;box-shadow:0 0 0 3px rgba(14,165,233,.1)}
        .faq-item{border-bottom:1px solid #e0f2fe;overflow:hidden}
        .faq-q{width:100%;background:none;border:none;outline:none;display:flex;align-items:center;justify-content:space-between;padding:18px 0;cursor:pointer;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:600;color:#0c2340;text-align:left;transition:color .2s}
        .faq-q:hover{color:#0ea5e9}
      `}</style>

      <Navbar currentPage="contact" onNavigate={onNavigate} />

      {/* HERO */}
      <div style={{background:"linear-gradient(160deg,#f0f9ff 0%,#e0f2fe 50%,#bae6fd 100%)",padding:isMobile?"64px 20px 72px":"80px 24px 88px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{maxWidth:640,margin:"0 auto",position:"relative",zIndex:1}}>
          <div className="fadeup" style={{display:"inline-block",background:"rgba(14,165,233,.1)",color:"#0369a1",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:18,border:"1px solid rgba(14,165,233,.15)"}}>
            Get in Touch
          </div>
          <h1 className="fadeup" style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?"clamp(28px,8vw,44px)":"clamp(36px,5vw,52px)",fontWeight:900,color:"#0c2340",lineHeight:1.1,marginBottom:16,animationDelay:".1s"}}>
            We're Here to <span style={{color:"#0ea5e9"}}>Help You.</span>
          </h1>
          <p className="fadeup" style={{fontSize:isMobile?14:16,color:"#334155",lineHeight:1.75,animationDelay:".2s"}}>
            Questions, bulk orders, event quotes, or just want to say hello — our team responds within 2 hours.
          </p>
        </div>
        <div style={{position:"absolute",top:-60,right:-60,width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,.08),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-40,left:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,.06),transparent 70%)",pointerEvents:"none"}}/>
      </div>
      {/* CONTACT CARDS */}
      <div style={{maxWidth:1180,margin:"0 auto",padding:isMobile?"48px 20px 40px":"64px 24px 48px"}}>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:20,marginBottom:64}}>
          {contacts.map((c,i)=>(
            <div key={c.title} className="card-h fadeup" style={{background:"white",borderRadius:20,padding:"28px 22px",boxShadow:"0 4px 20px rgba(14,165,233,.07)",border:"1px solid rgba(14,165,233,.06)",textAlign:"center",animationDelay:`${i*0.07}s`}}>
              <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${c.color}18,${c.color}10)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 14px"}}>{c.icon}</div>
              <h3 style={{fontFamily:"Playfair Display,serif",fontSize:16,fontWeight:900,color:"#0c2340",marginBottom:10}}>{c.title}</h3>
              {c.lines.map((l,j)=>(
                <div key={j} style={{fontSize:13,color:j===0?"#94a3b8":"#334155",fontWeight:j===0?500:j===1?600:400,marginBottom:3,lineHeight:1.5}}>{l}</div>
              ))}
              {c.action && (
                <a href={c.action} style={{display:"inline-block",marginTop:14,background:`linear-gradient(135deg,${c.color},#0284c7)`,color:"white",borderRadius:50,padding:"7px 18px",fontSize:12,fontWeight:700,textDecoration:"none",transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>{c.actionLabel}</a>
              )}
            </div>
          ))}
        </div>

        {/* FORM + MAP */}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:32,marginBottom:72}}>

          {/* FORM */}
          <div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:6}}>Send a Message</h2>
            <p style={{color:"#64748b",fontSize:14,marginBottom:28}}>Fill the form and we'll get back to you within 2 hours.</p>

            {submitted ? (
              <div style={{textAlign:"center",background:"white",borderRadius:20,padding:"48px 32px",boxShadow:"0 8px 30px rgba(14,165,233,.1)"}}>
                <div style={{fontSize:56,marginBottom:14}}>✅</div>
                <h3 style={{fontFamily:"Playfair Display,serif",fontSize:22,fontWeight:900,color:"#0c2340",marginBottom:8}}>Message Sent!</h3>
                <p style={{color:"#64748b",fontSize:14,marginBottom:24}}>We'll reply to your email within 2 hours.</p>
                <button className="bo" onClick={()=>setSubmitted(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{background:"white",borderRadius:20,padding:isMobile?"24px":"36px",boxShadow:"0 8px 30px rgba(14,165,233,.08)",border:"1px solid rgba(14,165,233,.06)",display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Name *</label>
                    <input className="inp" name="name" required value={form.name} onChange={handle} placeholder="Your name"/>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Phone</label>
                    <input className="inp" name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+91 98765 43210"/>
                  </div>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Email *</label>
                  <input className="inp" name="email" type="email" required value={form.email} onChange={handle} placeholder="you@example.com"/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Subject *</label>
                  <select className="inp" name="subject" required value={form.subject} onChange={handle} style={{background:"#fafeff"}}>
                    <option value="">Select a topic</option>
                    {["New Order Enquiry","Subscription Help","Event Quote","Technical Support","Complaint","Other"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Message *</label>
                  <textarea className="inp" name="message" rows={4} required value={form.message} onChange={handle} placeholder="How can we help you?" style={{resize:"vertical"}}/>
                </div>
                <button className="bp" type="submit" disabled={loading} style={{padding:"13px",fontSize:15,opacity:loading?.75:1}}>
                  {loading ? (
                    <span style={{display:"inline-flex",alignItems:"center",gap:8}}>
                      <span style={{width:16,height:16,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>
                      Sending...
                    </span>
                  ) : "Send Message 🚀"}
                </button>
              </form>
            )}
          </div>

          {/* INFO + MAP PLACEHOLDER */}
          <div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:6}}>Our Location</h2>
            <p style={{color:"#64748b",fontSize:14,marginBottom:20}}>Serving Pimpri-Chinchwad and the wider Pune region.</p>
            {/* Map placeholder */}
            <div style={{background:"linear-gradient(160deg,#e0f2fe,#bae6fd)",borderRadius:20,height:220,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:20,border:"1px solid rgba(14,165,233,.12)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,opacity:.06,backgroundImage:"radial-gradient(circle,#0ea5e9 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
              <div style={{fontSize:40,marginBottom:8}}>📍</div>
              <div style={{fontFamily:"Playfair Display,serif",fontWeight:700,color:"#0369a1",fontSize:15}}>Pimpri-Chinchwad, Pune</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Maharashtra, India</div>
              <button className="bp" style={{marginTop:16,padding:"8px 20px",fontSize:13}}
                onClick={()=>window.open("https://maps.google.com/?q=Pimpri+Chinchwad+Pune","_blank")}>
                📍 Open in Maps
              </button>
            </div>
            {/* Quick info */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {icon:"🕐",label:"Mon–Sat",val:"6:00 AM – 9:00 PM"},
                {icon:"🕐",label:"Sunday",val:"7:00 AM – 7:00 PM"},
                {icon:"📞",label:"Helpline",val:"+91 98765 43210"},
                {icon:"✉️",label:"Email",val:"hello@jayshreeaqua.com"},
              ].map(({icon,label,val})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:12,background:"white",borderRadius:14,padding:"12px 16px",boxShadow:"0 2px 10px rgba(14,165,233,.06)"}}>
                  <span style={{fontSize:18,width:28,textAlign:"center"}}>{icon}</span>
                  <div>
                    <div style={{fontSize:11,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
                    <div style={{fontSize:14,color:"#0c2340",fontWeight:600}}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{maxWidth:720,margin:"0 auto",marginBottom:32}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{display:"inline-block",background:"linear-gradient(135deg,#e0f2fe,#bae6fd)",color:"#0369a1",borderRadius:50,padding:"5px 16px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Quick Answers</div>
            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?24:34,fontWeight:900,color:"#0c2340"}}>Frequently Asked Questions</h2>
          </div>
          <div style={{background:"white",borderRadius:20,padding:isMobile?"16px 20px":"24px 32px",boxShadow:"0 4px 20px rgba(14,165,233,.07)"}}>
            {faqs.map((faq,i)=>(
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>
                  <span>{faq.q}</span>
                  <span style={{fontSize:20,color:"#0ea5e9",transition:"transform .25s",transform:activeFaq===i?"rotate(45deg)":"rotate(0)",flexShrink:0,marginLeft:12}}>+</span>
                </button>
                {activeFaq===i&&(
                  <div style={{fontSize:14,color:"#64748b",lineHeight:1.75,paddingBottom:16,paddingRight:32,animation:"fadeUp .25s ease"}}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* CTA */}
      <div style={{background:"linear-gradient(135deg,#0c2340,#0369a1)",padding:"60px 24px",textAlign:"center"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{fontSize:44,marginBottom:14}}>🤝</div>
          <h2 style={{fontFamily:"Playfair Display,serif",fontSize:isMobile?24:34,fontWeight:900,color:"white",marginBottom:12}}>Ready to Order?</h2>
          <p style={{color:"#93c5fd",fontSize:15,lineHeight:1.75,marginBottom:28}}>Join 10,000+ happy customers getting pure water delivered daily.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="bp" style={{background:"white",color:"#0284c7"}} onClick={()=>onNavigate("register")}>🚀 Get Started Free</button>
            <button className="bo" style={{borderColor:"rgba(255,255,255,.5)",color:"white"}} onClick={()=>onNavigate("events")}>📋 Plan an Event</button>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}