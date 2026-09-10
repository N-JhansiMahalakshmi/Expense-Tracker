function Contact() {
  return (
    <div className="info-page">

      <section className="info-hero">

        <p className="eyebrow">
          CONTACT
        </p>

        <h1>
          We'd love to hear from you.
        </h1>

        <p>
          Have a question, suggestion, or feedback about
          Paisa Dairy? Get in touch.
        </p>

      </section>

      <section className="contact-section">

        <div className="contact-card">

          <h2>
            Send us a message
          </h2>

          <form>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea
                rows="6"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="button"
              className="primary-button"
            >
              Send message
            </button>

          </form>

        </div>

      </section>

    </div>
  )
}

export default Contact