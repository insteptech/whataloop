import { DashBoardPreviewImg } from "@/components/common/Icon";
import React from "react";

function DashboardPage() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1>
                  Lorem, ipsum dolor. <span>lorem</span>
                </h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Doloremque dolore, iste, nesciunt dicta, velit numquam laborum
                  molestiae neque iure eos itaque voluptates? Quam, placeat
                  fugit!
                </p>
                <div className="cta-buttons d-flex">
                  <a href="/register" className="btn btn-primary">
                    Get Started Free
                  </a>
                  <a href="/demo" className="btn btn-outline">
                    See Demo
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <DashBoardPreviewImg />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Lorem, ipsum.</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
              aperiam minima dignissimos?
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3>Lead Management</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas ex unde voluptate perspiciatis, autem deleniti enim.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3>WhatsApp Integration</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                  exercitationem dolore tempore!
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3>Smart Reminders</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
                  quae sed alias voluptates ad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>Trusted by Businesses</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque
              sed qui exercitationem. Tenetur tempore magnam odio ipsa, enim
              eligendi!
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="quote">
                  "This platform cut our follow-up time in half and increased
                  our conversion rate by 30%. Absolutely game-changing!"
                </div>
                <div className="author">
                  <img src="/images/testimonial-1.jpg" alt="" />
                  <div className="info">
                    <h4>Upkar Verma</h4>
                    <p>Sales Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="quote">
                  "The WhatsApp integration alone is worth the price. Our
                  response time went from hours to minutes."
                </div>
                <div className="author">
                  <img src="/images/testimonial-2.jpg" alt="" />
                  <div className="info">
                    <h4>Karam Sir</h4>
                    <p>Founder, GrowthAgency</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <div className="quote">
                  "Finally a tool that understands how sales actually work. The
                  reminder system saved us countless deals."
                </div>
                <div className="author">
                  <img src="/images/testimonial-3.jpg" alt="" />
                  <div className="info">
                    <h4>Lovepreet</h4>
                    <p>CEO, RealEstatePro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Lead Management?</h2>
          <p>
            Join thousands of businesses who are closing more deals with less
            effort.
          </p>
          <a href="/register" className="btn">
            Start Your 14-Day Free Trial
          </a>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
