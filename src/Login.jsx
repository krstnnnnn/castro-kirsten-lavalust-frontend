import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./scrapbook.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", { username, password });
      localStorage.setItem("access_token", res.data.tokens.access_token);
      localStorage.setItem("refresh_token", res.data.tokens.refresh_token);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="page-center">
      <div className="wrap">
        <div className="tape"></div>
        <div className="card">
          <div className="seal">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 10V8a6 6 0 0 1 12 0v2"
                stroke="#FFFDF6"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="4.5"
                y="10"
                width="15"
                height="10"
                rx="2.2"
                fill="#FFFDF6"
                fillOpacity="0.92"
              />
              <circle cx="12" cy="14.5" r="1.6" fill="#4F5B40" />
              <rect
                x="11.3"
                y="15.6"
                width="1.4"
                height="2.4"
                rx="0.7"
                fill="#4F5B40"
              />
            </svg>
          </div>
          <h1 className="title">Welcome back</h1>
          <p className="lead">Sign the ledger to open the shop.</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. aling_nena"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="primary">
              Open the shop
            </button>
          </form>

          <hr className="divider" />
          <p className="footnote">
            Tindahan ni <span>Aling Nena</span> — for shopkeepers only.
          </p>
        </div>
      </div>
    </div>
  );
}
