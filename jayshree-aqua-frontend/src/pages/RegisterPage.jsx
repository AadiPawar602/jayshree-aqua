import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const STEPS = ["Account", "Personal", "Address"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [step,       setStep]       = useState(0);
  const [form,       setForm]       = useState({ fullName:"", email:"", phone:"", password:"", confirmPassword:"", addressLine1:"", addressLine2:"", city:"", pincode:"" });
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});
  const [apiError,   setApiError]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showPwd,    setShowPwd]    = useState(false);
  const navigate = useNavigate();

  // ── Field-level live validation ──────────────────────────────
  const liveErrors = useMemo(() => {
    const e = {};
    // Step 0
    if (!form.email)                           e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password)                        e.password = "Password is required";
    else if (form.password.length < 8)         e.password = "Min 8 characters";
    if (form.confirmPassword && form.password !== form.confirmPassword)
                                               e.confirmPassword = "Passwords do not match";
    if (!form.confirmPassword)                 e.confirmPassword = "Please confirm password";
    // Step 1
    if (!form.fullName)                        e.fullName = "Full name is required";
    if (!form.phone)                           e.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone))e.phone = "Enter valid 10-digit number";
    return e;
  }, [form]);

  // ── Per-step valid field count → progress % ──────────────────
  const stepProgress = useMemo(() => {
    const completedSteps = step; // previous steps = 100% each
    const STEP_FIELDS = [
      // step 0: email, password, confirmPassword
      [
        { k:"email",           valid: !liveErrors.email },
        { k:"password",        valid: !liveErrors.password },
        { k:"confirmPassword", valid: !liveErrors.confirmPassword && form.confirmPassword !== "" },
      ],
      // step 1: fullName, phone
      [
        { k:"fullName", valid: !liveErrors.fullName },
        { k:"phone",    valid: !liveErrors.phone },
      ],
      // step 2: addressLine1, city, pincode (addressLine2 optional)
      [
        { k:"addressLine1", valid: form.addressLine1.trim() !== "" },
        { k:"city",         valid: form.city.trim() !== "" },
        { k:"pincode",      valid: form.pincode.trim() !== "" },
      ],
    ];

    const currentFields = STEP_FIELDS[step] || [];
    const validCount    = currentFields.filter(f => f.valid).length;
    const total         = currentFields.length;
    const currentPct    = total > 0 ? validCount / total : 0;

    // Each step = 33.33%, current step fills proportionally
    const base  = completedSteps * (100 / STEPS.length);
    const slice = (100 / STEPS.length) * currentPct;
    return Math.round(base + slice);
  }, [form, step, liveErrors]);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (liveErrors.email)           e.email           = liveErrors.email;
      if (liveErrors.password)        e.password        = liveErrors.password;
      if (liveErrors.confirmPassword) e.confirmPassword = liveErrors.confirmPassword;
    }
    if (step === 1) {
      if (liveErrors.fullName) e.fullName = liveErrors.fullName;
      if (liveErrors.phone)    e.phone    = liveErrors.phone;
    }
    if (step === 2) {
      if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
      if (!form.city.trim())         e.city         = "City is required";
      if (!form.pincode.trim())      e.pincode      = "Pincode is required";
    }
    setErrors(e);
    // Mark all current fields as touched so errors show
    const touchNow = {};
    Object.keys(e).forEach(k => { touchNow[k] = true; });
    setTouched(prev => ({ ...prev, ...touchNow }));
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setStep(s => s - 1); setErrors({}); };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setApiError(""); setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const user = await register(payload);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  

  // ── Color of the bar based on progress ──────────────────────
  const barColor = stepProgress < 40
    ? "linear-gradient(90deg,#f97316,#fb923c)"     // orange — just started
    : stepProgress < 80
    ? "linear-gradient(90deg,#0ea5e9,#38bdf8)"     // blue — in progress
    : "linear-gradient(90deg,#10b981,#0ea5e9)";    // green — nearly done

  return (
    <div style={{ width:"100%", minHeight:"100vh", background:"#f0f9ff", fontFamily:"DM Sans,sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap");
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes barPulse { 0%,100%{opacity:1} 50%{opacity:.75} }
        .rcard  { animation: fadeUp .5s ease }
        .rbtn   { transition: all .2s }
        .rbtn:hover:not(:disabled) { transform: translateY(-2px) !important }
        .rinp:focus { border-color:#0ea5e9 !important; box-shadow:0 0 0 3px rgba(14,165,233,.12) !important; outline:none }
        @media(max-width:768px){ .reg-left{ display:none !important } }
      `}</style>

      <Navbar/>

      <div style={{ display:"flex", minHeight:"calc(100vh - 66px)" }}>

        {/* LEFT panel */}
        <div className="reg-left" style={{ flex:1, background:"linear-gradient(160deg,#0c2340 0%,#0369a1 55%,#0ea5e9 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"56px 48px", position:"relative", overflow:"hidden", minWidth:0 }}>
          <div style={{ maxWidth:360, position:"relative", zIndex:1 }}>
            <div style={{ fontSize:72, marginBottom:20 }}>🌊</div>
            <h1 style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(28px,3vw,44px)", fontWeight:900, color:"white", lineHeight:1.1, marginBottom:16 }}>
              Start Your<br/>Pure Water<br/>Journey.
            </h1>
            <p style={{ fontSize:15, color:"#93c5fd", lineHeight:1.75, marginBottom:40 }}>
              Create your free account and get your first order delivered within 24 hours.
            </p>
            <div style={{ marginTop:32 }}>
              {STEPS.map((st, i) => (
                <div key={st} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background: i < step ? "white" : i === step ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.1)", border: i === step ? "2px solid rgba(255,255,255,.7)" : "2px solid transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color: i < step ? "#0284c7" : "white", transition:"all .3s", flexShrink:0 }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight: i === step ? 700 : 400, color: i <= step ? "white" : "rgba(255,255,255,.4)", transition:"all .3s" }}>{st}</div>
                    {i === step && <div style={{ fontSize:11, color:"#7dd3fc", marginTop:1 }}>In progress</div>}
                    {i < step  && <div style={{ fontSize:11, color:"#34d399", marginTop:1 }}>✓ Complete</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini progress on left panel */}
            <div style={{ marginTop:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>Overall Progress</span>
                <span style={{ fontSize:13, color:"white", fontWeight:700 }}>{stepProgress}%</span>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,.15)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${stepProgress}%`, background:"linear-gradient(90deg,#38bdf8,white)", borderRadius:3, transition:"width .5s ease" }}/>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT form panel */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40, background:"#f0f9ff", minWidth:0 }}>
          <div className="rcard" style={{ background:"white", borderRadius:24, padding:"44px 48px", width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(14,165,233,.12)", border:"1px solid rgba(14,165,233,.06)" }}>

            {/* Progress bar */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#0c2340" }}>
                  Step {step + 1} of {STEPS.length} — {STEPS[step]}
                </span>
                <span style={{ fontSize:13, fontWeight:700, color: stepProgress === 100 ? "#10b981" : stepProgress >= 66 ? "#0ea5e9" : "#f97316", transition:"color .4s" }}>
                  {stepProgress}%
                </span>
              </div>
              {/* Track */}
              <div style={{ height:7, background:"#e0f2fe", borderRadius:50, overflow:"hidden" }}>
                <div style={{
                  height:"100%",
                  width:`${stepProgress}%`,
                  background: barColor,
                  borderRadius:50,
                  transition:"width .45s cubic-bezier(.4,0,.2,1), background .4s ease",
                  boxShadow: stepProgress > 0 ? "0 0 8px rgba(14,165,233,.4)" : "none",
                }}/>
              </div>
              {/* Field hints under bar */}
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:5 }}>
                <span style={{ fontSize:11, color:"#94a3b8" }}>
                  {stepProgress < 100 ? "Fill all fields to continue" : "✓ Ready to continue"}
                </span>
              </div>
            </div>

            {apiError && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", fontSize:13, color:"#dc2626", marginBottom:20 }}>
                ⚠️ {apiError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (step === STEPS.length - 1) {
                  submit(e);
                } else {
                  next();
                }
              }}
            >

              {/* ── STEP 0 ── */}
              {step === 0 && (<>
                <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:900, color:"#0c2340", marginBottom:4 }}>Create your account</h2>
                <p style={{ fontSize:13, color:"#64748b", marginBottom:22 }}>You will use these to sign in</p>
                <RField
                  label="Email address" icon="✉️" name="email" type="email"
                  value={form.email} onChange={handle} placeholder="you@example.com"
                  error={touched.email ? errors.email || liveErrors.email : ""}
                  valid={touched.email && !liveErrors.email}
                />
                <RField
                  label="Password" icon="🔒" name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password} onChange={handle} placeholder="Min 8 characters"
                  error={touched.password ? errors.password || liveErrors.password : ""}
                  valid={touched.password && !liveErrors.password}
                  right={
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:15 }}>
                      {showPwd ? "🙈" : "👁️"}
                    </button>
                  }
                />
                <RField
                  label="Confirm password" icon="🔒" name="confirmPassword"
                  type={showPwd ? "text" : "password"}
                  value={form.confirmPassword} onChange={handle} placeholder="Repeat password"
                  error={touched.confirmPassword ? errors.confirmPassword || liveErrors.confirmPassword : ""}
                  valid={touched.confirmPassword && !liveErrors.confirmPassword && form.confirmPassword !== ""}
                />
              </>)}

              {/* ── STEP 1 ── */}
              {step === 1 && (<>
                <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:900, color:"#0c2340", marginBottom:4 }}>Personal details</h2>
                <p style={{ fontSize:13, color:"#64748b", marginBottom:22 }}>So we know who to deliver to</p>
                <RField
                  label="Full name" icon="👤" name="fullName"
                  value={form.fullName} onChange={handle} placeholder="Your full name"
                  error={touched.fullName ? errors.fullName || liveErrors.fullName : ""}
                  valid={touched.fullName && !liveErrors.fullName}
                />
                <RField
                  label="Mobile number" icon="📱" name="phone"
                  value={form.phone} onChange={handle} placeholder="10-digit mobile number"
                  error={touched.phone ? errors.phone || liveErrors.phone : ""}
                  valid={touched.phone && !liveErrors.phone}
                />
              </>)}

              {/* ── STEP 2 ── */}
              {step === 2 && (<>
                <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:22, fontWeight:900, color:"#0c2340", marginBottom:4 }}>Delivery address</h2>
                <p style={{ fontSize:13, color:"#64748b", marginBottom:22 }}>Where should we deliver?</p>
                <RField
                  label="Address line 1" icon="🏠" name="addressLine1"
                  value={form.addressLine1} onChange={handle} placeholder="House/Flat no., Street"
                  error={touched.addressLine1 ? errors.addressLine1 : ""}
                  valid={touched.addressLine1 && form.addressLine1.trim() !== ""}
                />
                <RField
                  label="Address line 2 (optional)" icon="📍" name="addressLine2"
                  value={form.addressLine2} onChange={handle} placeholder="Area, Landmark"
                />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <RField
                    label="City" icon="🌆" name="city"
                    value={form.city} onChange={handle} placeholder="City"
                    error={touched.city ? errors.city : ""}
                    valid={touched.city && form.city.trim() !== ""}
                  />
                  <RField
                    label="Pincode" icon="📮" name="pincode"
                    value={form.pincode} onChange={handle} placeholder="411001"
                    error={touched.pincode ? errors.pincode : ""}
                    valid={touched.pincode && form.pincode.trim() !== ""}
                  />
                </div>
              </>)}

              <div style={{ display:"flex", gap:12, marginTop:8 }}>
                {step > 0 && (
                  <button type="button" onClick={back}
                    style={{ background:"transparent", color:"#0ea5e9", border:"2px solid #0ea5e9", borderRadius:50, padding:"12px 24px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
                    ← Back
                  </button>
                )}
                <button className="rbtn" type="submit" disabled={loading}
                  style={{ flex:1, background:"linear-gradient(135deg,#0ea5e9,#0284c7)", color:"white", border:"none", borderRadius:50, padding:"13px 24px", fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", boxShadow:"0 4px 15px rgba(14,165,233,.35)", fontFamily:"DM Sans,sans-serif", opacity: loading ? .75 : 1 }}>
                  {loading ? "⏳ Creating..." : step === STEPS.length - 1 ? "Create Account 🎉" : "Continue →"}
                </button>
              </div>
            </form>

            <p style={{ textAlign:"center", marginTop:22, fontSize:13, color:"#64748b" }}>
              Already have an account?{" "}
              <span style={{ color:"#0ea5e9", fontWeight:600, cursor:"pointer" }} onClick={() => navigate("/login")}>Sign in →</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Reusable field component ──────────────────────────────────
function RField({ label, icon, name, type="text", value, onChange, placeholder, error, valid, right }) {
  const borderColor = error ? "#fca5a5" : valid ? "#6ee7b7" : "#e0f2fe";
  const bgColor     = error ? "#fef9f9" : valid ? "#f0fdf9" : "#fafeff";
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>
        {label}
        {valid && <span style={{ fontSize:12, color:"#10b981", fontWeight:500 }}>✓</span>}
      </label>
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none", zIndex:1 }}>{icon}</span>
        <input
          className="rinp"
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width:"100%",
            padding:"12px 14px 12px 40px",
            border:`2px solid ${borderColor}`,
            borderRadius:12,
            fontSize:14,
            color:"#0c2340",
            outline:"none",
            transition:"all .2s",
            boxSizing:"border-box",
            fontFamily:"DM Sans,sans-serif",
            background: bgColor,
            paddingRight: right ? 44 : 14,
          }}
        />
        {right}
        {/* Inline valid tick inside field */}
        {valid && !right && (
          <span style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", color:"#10b981", fontSize:16, pointerEvents:"none" }}>✓</span>
        )}
      </div>
      {error && <div style={{ fontSize:12, color:"#dc2626", marginTop:4 }}>⚠️ {error}</div>}
    </div>
  );
}