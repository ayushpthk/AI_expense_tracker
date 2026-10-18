
import "../App.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="creative-home">
      <nav className="creative-nav">
        <button
          className="creative-brand"
          onClick={() => navigate("/")}
          aria-label="SmartSpend home"
        >
          <span className="creative-brand-icon">s!</span>
          <span>smartspend<span className="brand-period">.</span></span>
        </button>

        <div className="creative-nav-links">
          <a href="#how-it-works">How it works</a>
          <button
            className="creative-login"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            className="creative-start"
            onClick={() => navigate("/register")}
          >
            Register <span>↗</span>
          </button>
        </div>
      </nav>

      <main>
        <section className="creative-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="kicker-spark">✳</span>
              YOUR MONEY, YOUR STORY
            </div>

            <h1>
              Make money
              <br />
              make <span className="headline-highlight">sense.</span>
            </h1>

            <p className="hero-description">
              Less “where did it all go?” More “I've got this.”
              Keep tabs on your spending, split the bill, and
              make your money work for your life.
            </p>

            <div className="creative-hero-actions">
              <button
                className="hero-cta"
                onClick={() => navigate("/register")}
              >
                Get started for free <span>↗</span>
              </button>
              <span className="hero-footnote">
                A better money habit starts small.
              </span>
            </div>

            <div className="hero-doodle" aria-hidden="true">
              <svg viewBox="0 0 180 55" fill="none">
                <path
                  d="M4 35 C35 4, 64 50, 94 23 S145 4, 174 23"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="3 7"
                />
                <path
                  d="M160 12 L175 23 L160 31"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="hero-art" aria-label="Illustrated spending overview">
            <div className="art-sticker sticker-sun">✳</div>
            <div className="art-sticker sticker-smile">☺</div>
            <div className="art-note">little by little<br />adds up!</div>

            <div className="money-board">
              <div className="money-board-top">
                <div>
                  <span className="board-eyebrow">YOUR MONEY DIARY</span>
                  <h2>This month<span> ✷</span></h2>
                </div>
                <div className="board-date">
                  <span>OCT</span>
                  <strong>26</strong>
                </div>
              </div>

              <div className="spend-total">
                <span>You've spent</span>
                <strong>₹12,450</strong>
              </div>

              <div className="playful-chart" aria-label="Illustrative spending by category">
                <div className="chart-segment chart-food" />
                <div className="chart-segment chart-travel" />
                <div className="chart-segment chart-shop" />
                <div className="chart-segment chart-other" />
                <div className="chart-center">
                  <span>LOOKING</span>
                  <strong>good!</strong>
                  <span>✳</span>
                </div>
              </div>

              <div className="chart-legend">
                <div><span className="legend-dot dot-food" /> Food <strong>₹3,250</strong></div>
                <div><span className="legend-dot dot-travel" /> Travel <strong>₹2,100</strong></div>
                <div><span className="legend-dot dot-shop" /> Shopping <strong>₹4,300</strong></div>
              </div>

              <div className="board-bottom">
                <span>YOUR FINANCES, AT A GLANCE</span>
                <span>↗</span>
              </div>
            </div>

            <div className="floating-receipt">
              <span className="receipt-emoji">🥑</span>
              <div>
                <strong>Lunch with friends</strong>
                <span>Food · Today</span>
              </div>
              <strong>−₹280</strong>
            </div>

            <div className="floating-budget">
              <span className="budget-mini-label">BUDGET CHECK</span>
              <strong>Looking good <span>☺</span></strong>
              <div className="mini-progress"><span /></div>
              <small>Still room for the fun stuff.</small>
            </div>
          </div>

          <div className="hero-bottom-label">
            <span>01 / A FRESH START</span>
            <span>TRACK IT. SPLIT IT. OWN IT.</span>
          </div>
        </section>

        <section className="creative-manifesto" id="how-it-works">
          <div className="manifesto-title">
            <span className="section-kicker">MONEY MANAGEMENT, MINUS THE MOOD</span>
            <h2>
              Grown-up money stuff.
              <br />
              <span>Without the grown-up stress.</span>
            </h2>
          </div>

          <div className="manifesto-aside">
            <span className="aside-star">✳</span>
            <p>
              Your finances don't need to be complicated.
              Just a little more organised, one day at a time.
            </p>
          </div>
        </section>

        <section className="creative-bento">
          <article className="bento-card bento-tracking">
            <div className="bento-card-top">
              <span className="bento-index">01 — THE EVERYDAY</span>
              <span className="bento-symbol">↗</span>
            </div>
            <div className="receipt-stack" aria-hidden="true">
              <div className="receipt-paper receipt-back">₹ 850<br />Groceries</div>
              <div className="receipt-paper receipt-front">
                <span>YOUR LATEST</span>
                <strong>₹420</strong>
                <span>Dinner · Food</span>
                <div className="receipt-line" />
                <span>PAID & RECORDED ✓</span>
              </div>
            </div>
            <h3>Every rupee has a place.</h3>
            <p>
              Add expenses, organise them by category, and find
              what you need when you need it.
            </p>
          </article>

          <article className="bento-card bento-budget">
            <div className="bento-card-top">
              <span className="bento-index">02 — THE BIG PICTURE</span>
              <span className="budget-doodle">☺</span>
            </div>
            <div className="budget-illustration" aria-hidden="true">
              <div className="budget-circle">
                <span>MONTHLY</span>
                <strong>₹15k</strong>
                <span>YOUR LIMIT</span>
              </div>
              <div className="budget-star">✳</div>
              <div className="budget-orbit" />
            </div>
            <h3>A budget with breathing room.</h3>
            <p>
              Set your monthly budget and keep an eye on what's
              left. Plans change. Your budget can too.
            </p>
          </article>

          <article className="bento-card bento-split">
            <div className="bento-card-top">
              <span className="bento-index">03 — THE GROUP CHAT</span>
              <span className="bento-symbol">⇄</span>
            </div>
            <div className="friends-illustration" aria-hidden="true">
              <div className="friend-avatar friend-one">A</div>
              <div className="friend-avatar friend-two">S</div>
              <div className="friend-avatar friend-three">Y</div>
              <div className="split-pill">I'll pay you back! ✓</div>
              <div className="split-amount">₹650 <span>owed to you</span></div>
            </div>
            <h3>Friends, not financial confusion.</h3>
            <p>
              Split expenses, see who owes what, and mark payments
              when the money comes through.
            </p>
          </article>

          <article className="bento-card bento-insight">
            <div className="insight-squiggle" aria-hidden="true">〰</div>
            <span className="bento-index">04 — A LITTLE MORE CLARITY</span>
            <h3>Notice the little things.</h3>
            <p>
              Get a clearer view of your habits and make more
              thoughtful everyday money decisions.
            </p>
            <div className="insight-tags">
              <span>Spending patterns</span>
              <span>Category breakdown</span>
              <span>Room to improve</span>
            </div>
          </article>
        </section>

        <section className="creative-last-call">
          <span className="last-call-spark">✳</span>
          <span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>
            It's your money.
            <br />
            <span>Make it make sense.</span>
          </h2>
          <button
            className="hero-cta"
            onClick={() => navigate("/register")}
          >
            Let's get you started <span>↗</span>
          </button>
        </section>
      </main>

      <footer className="creative-footer">
        <button
          className="creative-brand"
          onClick={() => navigate("/")}
        >
          <span className="creative-brand-icon">s!</span>
          <span>smartspend<span className="brand-period">.</span></span>
        </button>
        <span>Made for real life, one expense at a time.</span>
        <button onClick={() => navigate("/login")}>Already a member? Log in ↗</button>
      </footer>
    </div>
  );
}

export default Home;
