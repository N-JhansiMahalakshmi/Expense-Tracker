function Home({ onLogin, onGetStarted }) {
  return (
    <div className="home-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-section">

        {/* LEFT SIDE */}
        <div className="hero-content">

          <p className="eyebrow">
            PERSONAL FINANCE
          </p>

          <h1>
            Take control of <span>your money.</span>
          </h1>

          <p className="hero-description">
            Paisa Dairy makes it simple to track your expenses,
            manage your monthly budget, and stay focused
            on your savings goals.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={onGetStarted}
            >
              Get started
            </button>

            <button
              className="secondary-button"
              onClick={onLogin}
            >
              Login
            </button>

          </div>

        </div>


        {/* RIGHT SIDE — ILLUSTRATION */}

        <div className="hero-illustration">

          <img
            src="/Illustration.png"
            alt="Expense tracking illustration"
          />

        </div>

      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section className="features-section">

        <div className="section-heading center">

          <h2 className="eyebrow">
            WHY PAISA DAIRY?
          </h2>

          <h4>
            Everything you need to manage your money
          </h4>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              ₹
            </div>

            <h3>
              Track expenses
            </h3>

            <p>
              Record your daily expenses and understand
              exactly where your money is going.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              %
            </div>

            <h3>
              Manage your budget
            </h3>

            <p>
              Set a monthly spending budget and get
              notified when your spending goes too far.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Reach savings goals
            </h3>

            <p>
              Set a savings target and monitor your
              progress toward building better financial habits.
            </p>

          </div>

        </div>

      </section>


     {/* =========================
    CTA
========================= */}

<section className="cta-section">

  {/* LEFT SIDE */}
  <div className="cta-content">

    <h2 className="eyebrow">
      START TODAY
    </h2>

    <ul className="cta-list">

      <li>
        Your money deserves a clearer picture.
      </li>

      <li>
        Paisa Dairy helps you understand your
        spending and make better financial decisions.
      </li>

      <li>
        Start tracking your expenses with Paisa Dairy.
      </li>

    </ul>

    <button
      className="primary-button"
      onClick={onGetStarted}
    >
      Create your account
    </button>

  </div>


  {/* RIGHT SIDE — ILLUSTRATION */}
  <div className="cta-illustration">

    <img
      src="/endIllustration.png"
      alt="Expense tracking illustration"
    />

  </div>

</section>
    </div>
  )
}

export default Home