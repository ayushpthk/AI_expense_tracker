
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-expense-tracker-s5m6.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-creative">
      <header className="auth-topbar">
        <button
          className="creative-brand"
          onClick={() => navigate("/")}
          aria-label="SmartSpend home"
        >
          <span className="creative-brand-icon">s!</span>
          <span>smartspend<span className="brand-period">.</span></span>
        </button>

        <div className="auth-topbar-right">
          <span>Already part of the club?</span>
          <button onClick={() => navigate("/login")}>Log in ↗</button>
        </div>
      </header>

      <main className="auth-layout">
        <section className="auth-art-panel register-art">
          <span className="auth-art-kicker">A LITTLE MORE CLARITY</span>

          <div className="auth-art-heading">
            <h1>
              Your money.
              <br />
              Your <em>rules.</em>
            </h1>
            <p>
              Big plans, everyday coffees, spontaneous trips.
              Give every rupee a place in your story.
            </p>
          </div>

          <div className="auth-art-illustration" aria-hidden="true">
            <div className="auth-orbit" />
            <div className="auth-coin coin-one">₹</div>
            <div className="auth-coin coin-two">✳</div>

            <div className="auth-art-note">
              <span>YOUR NEXT CHAPTER</span>
              <strong>Starts here!</strong>
              <span className="note-smile">☺</span>
            </div>

            <div className="auth-art-receipt">
              <span>GOOD THINGS AHEAD</span>
              <div className="receipt-dashes" />
              <strong>₹ + intention</strong>
              <span>That's a good start.</span>
            </div>
          </div>

          <div className="auth-art-footer">
            <span>01 / START SIMPLE</span>
            <span>✳ MADE FOR REAL LIFE</span>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-inner">
            <span className="auth-form-kicker">
              YOUR MONEY JOURNEY STARTS HERE
            </span>

            <h2>Let's make it official<span>.</span></h2>
            <p className="auth-form-description">
              Create your account. Your future self will thank you.
            </p>

            {error && (
              <div className="auth-creative-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-creative-form">
              <div className="auth-field">
                <label htmlFor="register-name">What should we call you?</label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-email">Email address</label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-password">Create a password</label>
                <div className="auth-password-wrap">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <span className="auth-field-hint">
                  Use at least 6 characters.
                </span>
              </div>

              <button
                type="submit"
                className="auth-creative-submit"
                disabled={loading}
              >
                {loading ? "Creating your account..." : "Create my account"}
                {!loading && <span>↗</span>}
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?
              <button onClick={() => navigate("/login")}>Log in</button>
            </div>

            <div className="auth-reassurance">
              <span>✳</span>
              A fresh start. One small step at a time.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
