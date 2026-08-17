import "../App.css";

function Home() {
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Expense Tracker <span>AI</span>
        </div>

        <div className="nav-buttons">
          <button className="login-btn">
            Login
          </button>

          <button className="signup-btn">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">

        <div className="hero-content">

          <div className="badge">
            ✨ AI-powered personal finance
          </div>

          <h1>
            TESTING EXPENSE TRACKER
          </h1>

          <p>
            Track your expenses, understand your spending habits,
            and get personalized AI-powered insights to make
            better financial decisions.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Get Started →
            </button>

            <button className="secondary-btn">
              See how it works
            </button>

          </div>

        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-preview">

          <div className="preview-header">

            <div>
              <small>Total spending</small>
              <h2>₹12,450</h2>
            </div>

            <div className="month">
              August 2026
            </div>

          </div>

          <div className="stats">

            <div className="stat">
              <span>Food</span>
              <strong>₹3,250</strong>
            </div>

            <div className="stat">
              <span>Travel</span>
              <strong>₹2,100</strong>
            </div>

            <div className="stat">
              <span>Shopping</span>
              <strong>₹4,300</strong>
            </div>

          </div>

          <div className="ai-insight">

            <div className="ai-icon">
              ✨
            </div>

            <div>
              <strong>AI Insight</strong>

              <p>
                Your food spending increased by 18% this month.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Features */}
      <section className="features">

        <div className="feature">

          <div className="feature-icon">
            📊
          </div>

          <h3>
            Track Expenses
          </h3>

          <p>
            Easily record and organize every expense.
          </p>

        </div>


        <div className="feature">

          <div className="feature-icon">
            🤖
          </div>

          <h3>
            AI Insights
          </h3>

          <p>
            Understand your spending with intelligent analysis.
          </p>

        </div>


        <div className="feature">

          <div className="feature-icon">
            🎯
          </div>

          <h3>
            Smart Goals
          </h3>

          <p>
            Set budgets and work toward your financial goals.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Home;