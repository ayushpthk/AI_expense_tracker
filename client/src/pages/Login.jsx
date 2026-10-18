
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://ai-expense-tracker-s5m6.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
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
          <span>New around here?</span>
          <button onClick={() => navigate("/register")}>
            Create account ↗
          </button>
        </div>
      </header>

      <main className="auth-layout">
        <section className="auth-art-panel login-art">
          <span className="auth-art-kicker">GOOD TO HAVE YOU BACK</span>

          <div className="auth-art-heading">
            <h1>
              Pick up
              <br />
              where you <em>left off.</em>
            </h1>
            <p>
              Your expenses, your budget, your progress.
              It's all waiting right where you left it.
            </p>
          </div>

          <div className="login-art-illustration" aria-hidden="true">
            <div className="login-orbit login-orbit-one" />
            <div className="login-orbit login-orbit-two" />

            <div className="login-note note-yellow">
              <span>MONTHLY BUDGET</span>
              <strong>You've got this.</strong>
              <div className="login-progress">
                <span />
              </div>
              <small>Little steps add up.</small>
            </div>

            <div className="login-note note-green">
              <span className="login-note-icon">↗</span>
              <div>
                <strong>Back on track</strong>
                <small>One day at a time.</small>
              </div>
            </div>

            <div className="login-spark login-spark-one">✳</div>
            <div className="login-spark login-spark-two">✦</div>
          </div>

          <div className="auth-art-footer">
            <span>02 / PICK UP THE THREAD</span>
            <span>✳ YOU'RE RIGHT ON TIME</span>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-inner login-form-inner">
            <span className="auth-form-kicker">YOUR SPACE, JUST AS YOU LEFT IT</span>

            <h2>Welcome back<span>.</span></h2>
            <p className="auth-form-description">
              Let's get you back to feeling good about your money.
            </p>

            {error && (
              <div className="auth-creative-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-creative-form">
              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">Password</label>
                <div className="auth-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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
              </div>

              <button
                type="submit"
                className="auth-creative-submit"
                disabled={loading}
              >
                {loading ? "Logging you in..." : "Log in to SmartSpend"}
                {!loading && <span>↗</span>}
              </button>
            </form>

            <div className="auth-switch">
              New to SmartSpend?
              <button onClick={() => navigate("/register")}>
                Create an account
              </button>
            </div>

            <div className="auth-reassurance">
              <span>✳</span>
              Your money journey, at your own pace.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
