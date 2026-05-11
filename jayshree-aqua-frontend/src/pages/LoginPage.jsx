import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const handle = (e) => setForm({...form,[e.target.name]:e.target.value});

  

  const submit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    await login(form);
    setTimeout(() => {
      navigate("/dashboard");
    }, 50);

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Invalid email or password."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{width:"100%",minHeight:"100vh",background:"#f0f9ff",fontFamily:"DM Sans,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .lcard{animation:fadeUp .5s ease}
        .lbtn{transition:all .2s}
        .lbtn:hover:not(:disabled){transform:translateY(-2px)!important;box-shadow:0 8px 28px rgba(14,165,233,.45)!important}
        .linp:focus{border-color:#0ea5e9!important;box-shadow:0 0 0 3px rgba(14,165,233,.12)!important;outline:none}
      `}</style>

      <Navbar />

      <div style={{display:"flex",minHeight:"calc(100vh - 66px)"}}>

        {/* LEFT brand panel */}
        <div style={{flex:1,background:"linear-gradient(160deg,#0c2340 0%,#0369a1 55%,#0ea5e9 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"56px 48px",position:"relative",overflow:"hidden",minWidth:0}}>
          <div style={{position:"relative",zIndex:1,maxWidth:380}}>
            <div style={{fontSize:72,marginBottom:20}}>💧</div>
            <h1 style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(30px,3.5vw,50px)",fontWeight:900,color:"white",lineHeight:1.1,marginBottom:16}}>
              Pure Water,<br/>Delivered<br/>Daily.
            </h1>
            <p style={{fontSize:15,color:"#93c5fd",lineHeight:1.75,marginBottom:40}}>
              Join thousands of happy Jayshree Aqua customers getting fresh RO-purified water at their doorstep.
            </p>
            <div style={{display:"flex",gap:28}}>
              {[["10,000+","Customers"],["99.9%","Purity"],["15+","Years"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{fontFamily:"Playfair Display,serif",fontSize:24,fontWeight:900,color:"white"}}>{v}</div>
                  <div style={{fontSize:11,color:"#7dd3fc",fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",border:"1px solid rgba(255,255,255,.07)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-80,left:-40,width:180,height:180,borderRadius:"50%",border:"1px solid rgba(255,255,255,.05)",pointerEvents:"none"}}/>
        </div>

        {/* RIGHT form panel */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40,background:"#f0f9ff",minWidth:0,position:"relative"}}>
          <div className="lcard" style={{background:"white",borderRadius:24,padding:"44px 48px",width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(14,165,233,.12)",border:"1px solid rgba(14,165,233,.06)"}}>

            <h2 style={{fontFamily:"Playfair Display,serif",fontSize:26,fontWeight:900,color:"#0c2340",marginBottom:6}}>Welcome back</h2>
            <p style={{fontSize:13,color:"#64748b",marginBottom:28}}>Sign in to manage your orders and subscriptions</p>

            {error && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 16px",fontSize:13,color:"#dc2626",marginBottom:20}}>⚠️ {error}</div>}

            <form onSubmit={submit}>
              <div style={{marginBottom:20}}>
                <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>Email address</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none",zIndex:1}}>✉️</span>
                  <input className="linp" name="email" type="email" required value={form.email} onChange={handle}
                    placeholder="you@example.com"
                    style={{width:"100%",padding:"12px 14px 12px 40px",border:"2px solid #e0f2fe",borderRadius:12,fontSize:14,color:"#0c2340",outline:"none",transition:"all .2s",boxSizing:"border-box",fontFamily:"DM Sans,sans-serif",background:"#fafeff"}}/>
                </div>
              </div>

              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <label style={{fontSize:13,fontWeight:600,color:"#374151"}}>Password</label>
                  <span style={{color:"#0ea5e9",fontWeight:600,cursor:"pointer",fontSize:13}}>Forgot password?</span>
                </div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none",zIndex:1}}>🔒</span>
                  <input className="linp" name="password" type={showPwd?"text":"password"} required value={form.password} onChange={handle}
                    placeholder="Enter your password"
                    style={{width:"100%",padding:"12px 44px 12px 40px",border:"2px solid #e0f2fe",borderRadius:12,fontSize:14,color:"#0c2340",outline:"none",transition:"all .2s",boxSizing:"border-box",fontFamily:"DM Sans,sans-serif",background:"#fafeff"}}/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,padding:4}}>
                    {showPwd?"🙈":"👁️"}
                  </button>
                </div>
              </div>

              <button className="lbtn" type="submit" disabled={loading}
                style={{width:"100%",background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",border:"none",borderRadius:50,padding:"14px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",boxShadow:"0 4px 15px rgba(14,165,233,.35)",fontFamily:"DM Sans,sans-serif",marginTop:20,opacity: loading ? 0.75 : 1}}>
                {loading?"⏳ Signing in...":"Sign In →"}
              </button>
            </form>

            <p style={{textAlign:"center",marginTop:22,fontSize:13,color:"#64748b"}}>
              No account?{" "}
              <span style={{color:"#0ea5e9",fontWeight:600,cursor:"pointer"}} onClick={() => navigate("/register")}>Create one free →</span>
            </p>

            <div style={{marginTop:24,background:"#f0f9ff",borderRadius:12,padding:"14px 16px",border:"1px dashed #bae6fd"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#0369a1",marginBottom:8}}>🔑 Demo Credentials</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{background:"linear-gradient(135deg,#0ea5e9,#0284c7)",color:"white",borderRadius:50,padding:"2px 12px",fontSize:11,fontWeight:700}}>Admin</span>
                <code style={{fontSize:12,color:"#334155"}}>admin@jayshreeaqua.com</code>
                <span style={{background:"#0c2340",color:"white",borderRadius:50,padding:"2px 12px",fontSize:11,fontWeight:700,fontFamily:"monospace"}}>Admin@123</span>
              </div>
            </div>
          </div>
        </div>
              
      </div>
    </div>
  );
}