import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>🎉 Order Placed Successfully!</h1>
      <button onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
}