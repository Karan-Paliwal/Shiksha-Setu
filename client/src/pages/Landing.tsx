import React, { useState } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is Shiksha Setu free for individual students?",
      answer: "Yes, Shiksha Setu is completely free for individual students to track their academics, build resumes, and search for scholarships."
    },
    {
      question: "How does the AI Study Assistant work?",
      answer: "The AI Study Assistant uses advanced language models to solve doubts, generate personalized study guides, and create flashcards based on your syllabus."
    },
    {
      question: "Is Shiksha Setu accessible on mobile devices?",
      answer: "Yes! The Shiksha Setu platform is fully responsive, ensuring you get a seamless, premium experience whether you are on a smartphone, tablet, or desktop."
    },
    {
      question: "Is my data secure on the platform?",
      answer: "Security is our top priority. Your academic records, personal information, and resume data are encrypted and protected with industry-standard security protocols."
    }
  ];

  const features = [
    {
      iconClass: "bi-stars",
      bgClass: "lp-icon-blue",
      title: "AI Study Assistant",
      desc: "Instant doubt solving, personalized revision notes, and exam prep flows powered by advanced AI models.",
      link: "/features"
    },
    {
      iconClass: "bi-mortarboard",
      bgClass: "lp-icon-indigo",
      title: "Scholarship Finder",
      desc: "Match with thousands of national and international scholarships based on your unique profile and academic merit.",
      link: "/features"
    },
    {
      iconClass: "bi-journal-text",
      bgClass: "lp-icon-cyan",
      title: "Academic Hub",
      desc: "Manage your smart timetable and calculate your CGPA with beautiful visual analytics.",
      link: "/features"
    },
    {
      iconClass: "bi-target",
      bgClass: "lp-icon-emerald",
      title: "Skill Development",
      desc: "Expert-curated learning roadmaps and certifications to help you bridge the gap between classroom and career.",
      link: "/features"
    },
    {
      iconClass: "bi-briefcase",
      bgClass: "lp-icon-violet",
      title: "Placement Tracker",
      desc: "Stay on top of internship and job applications with a centralized dashboard and status tracking notifications.",
      link: "/features"
    },
    {
      iconClass: "bi-patch-check",
      bgClass: "lp-icon-pink",
      title: "ATS Resume Builder",
      desc: "Create industry-standard, ATS-friendly resumes in minutes with live previews and professional templates.",
      link: "/features"
    }
  ];

  return (
    <div className="landing-page fade-in">
      {/* ─── Header / Navigation ───────────────────────────────── */}
      <nav className="navbar navbar-expand-lg navbar-light lp-navbar position-sticky top-0 z-3 border-bottom px-3 px-md-5 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/final-logo.png" alt="Shiksha Setu Logo" style={{ height: "36px", width: "36px", objectFit: "cover", borderRadius: "8px" }} />
            <span className="fw-bold fs-4 text-ss-primary">Shiksha Setu</span>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <button className="btn fw-semibold text-ss-text hover-primary" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn-ss-primary px-4" onClick={() => navigate("/login")}>Join Shiksha Setu</button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="landing-hero container d-flex flex-column align-items-center text-center py-5 mt-4 mt-md-5">
        <div className="lp-badge-capsule mb-4">
          <span>🚀</span>
          <span>NEW: AI Resume Builder Integrated</span>
        </div>

        <h1 className="lp-hero-title mb-4">
          Connecting Students to <br />
          <span className="lp-hero-opportunities">Opportunities.</span>
        </h1>

        <p className="lp-hero-subtitle mb-5">
          Shiksha Setu is the ultimate bridge between your academic journey and professional career. Track grades, find scholarships, and leverage AI to unlock your full potential.
        </p>

        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mb-4 w-100 px-3">
          <button className="btn-ss-primary btn-lg px-4 px-md-5 py-3 fs-6 fw-bold lp-btn-mobile-full" onClick={() => navigate("/login")}>
            Get Started for Free
          </button>
          <button className="btn-ss-outline btn-lg px-4 px-md-5 py-3 fs-6 fw-bold bg-white shadow-sm lp-btn-mobile-full" onClick={() => navigate("/features")}>
            Features
          </button>
        </div>

        {/* Browser Mockup Area */}
        <div className="position-relative lp-mockup-wrapper px-3">
          {/* Floating Trophy Card */}
          <div className="lp-floating-card lp-card-trophy">
            <div className="lp-icon-wrapper-circle lp-bg-trophy-light">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <div className="text-start">
              <div className="lp-card-title">Scholarship Won</div>
              <div className="lp-card-text">$12,500 Merit Award</div>
            </div>
          </div>

          {/* Floating AI Insight Card */}
          <div className="lp-floating-card lp-card-ai">
            <div className="lp-icon-wrapper-circle lp-bg-ai-light">
              <i className="bi bi-stars"></i>
            </div>
            <div className="text-start">
              <div className="lp-card-title">AI Insight</div>
              <div className="lp-card-text">Next Exam: Math Prep 92%</div>
            </div>
          </div>

          {/* Browser Mockup Window */}
          <div className="lp-browser-frame">
            <div className="lp-browser-header">
              <div className="lp-dot red"></div>
              <div className="lp-dot yellow"></div>
              <div className="lp-dot green"></div>
            </div>
            <img
              src="/visily-web-student-dashboard1.webp"
              alt="Shiksha Setu Student Dashboard Mockup"
              className="lp-mockup-image"
            />
          </div>

          {/* Mobile version container of floating cards */}
          <div className="lp-badges-mobile-container">
            <div className="lp-floating-card">
              <div className="lp-icon-wrapper-circle lp-bg-trophy-light">
                <i className="bi bi-trophy-fill"></i>
              </div>
              <div className="text-start">
                <div className="lp-card-title">Scholarship Won</div>
                <div className="lp-card-text">$12,500 Merit Award</div>
              </div>
            </div>
            <div className="lp-floating-card">
              <div className="lp-icon-wrapper-circle lp-bg-ai-light">
                <i className="bi bi-stars"></i>
              </div>
              <div className="text-start">
                <div className="lp-card-title">AI Insight</div>
                <div className="lp-card-text">Next Exam: Math Prep 92%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid Section ─────────────────────────────── */}
      <section id="features" className="lp-features-section">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5 px-3">
            <div>
              <h2 className="lp-section-title mb-2">Everything You Need to Succeed</h2>
              <p className="lp-section-subtitle mb-0">
                A unified platform that handles the complexities of student life, so you can focus on learning and growing.
              </p>
            </div>
            <a href="/features" onClick={(e) => { e.preventDefault(); navigate("/features"); }} className="lp-view-features-btn mt-2 mt-md-0">
              <span>View All Features</span>
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>

          <div className="row g-4 px-3">
            {features.map((feature, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={idx}>
                <div className="lp-feature-card">
                  <div className={`lp-feature-icon-box ${feature.bgClass}`}>
                    <i className={`bi ${feature.iconClass}`}></i>
                  </div>
                  <h3 className="lp-feature-title">{feature.title}</h3>
                  <p className="lp-feature-desc">{feature.desc}</p>
                  <a href={feature.link} onClick={(e) => { e.preventDefault(); navigate(feature.link); }} className="lp-feature-link">
                    <span>Explore Feature</span>
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordion Section ─────────────────────────────── */}
      <section className="lp-faq-section">
        <div className="container">
          <div className="text-center mb-5 px-3">
            <h2 className="lp-section-title mb-3">Frequently Asked Questions</h2>
            <p className="lp-section-subtitle mx-auto">
              Got questions? We've got answers. Everything you need to know about the platform.
            </p>
          </div>

          <div className="lp-faq-container px-3">
            {faqs.map((faq, idx) => (
              <div className={`lp-faq-item ${activeFaq === idx ? "active" : ""}`} key={idx}>
                <button
                  className="lp-faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={activeFaq === idx}
                >
                  <span>{faq.question}</span>
                  <i className="bi bi-chevron-down lp-faq-chevron"></i>
                </button>
                <div className="lp-faq-answer">
                  <div className="lp-faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner Section ────────────────────────────────── */}
      <section className="lp-cta-section container px-4">
        <div className="lp-cta-card">
          <div className="lp-cta-content">
            <h2 className="lp-cta-title">Ready to Build Your Future?</h2>
            <p className="lp-cta-subtitle">
              Join thousands of students who are already taking control of their careers. Start your journey with Shiksha Setu today.
            </p>
            <button className="btn-ss-primary btn-lg px-5 py-3 fs-6 fw-bold lp-btn-mobile-full" onClick={() => navigate("/login")}>
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer Section ────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="container px-4">
          <div className="row g-5">
            <div className="col-12 col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <img src="/final-logo.png" alt="Shiksha Setu Logo" style={{ height: "32px", width: "32px", objectFit: "cover", borderRadius: "6px" }} />
                <span className="lp-footer-brand text-white">Shiksha Setu</span>
              </div>
              <p className="lp-footer-desc">
                AI-powered student portal bridging the gap between talent and opportunity. Empowering the next generation of professionals.
              </p>
              <div className="lp-footer-social">
                <a href="#" className="lp-social-link"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="lp-social-link"><i className="bi bi-linkedin"></i></a>
                <a href="#" className="lp-social-link"><i className="bi bi-github"></i></a>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg-2 offset-lg-1">
              <h4 className="lp-footer-title">Platform</h4>
              <ul className="lp-footer-links">
                <li><a href="#" className="lp-footer-link">Scholarship Finder</a></li>
                <li><a href="#" className="lp-footer-link">AI Tutor</a></li>
                <li><a href="#" className="lp-footer-link">Career Roadmap</a></li>
                <li><a href="#" className="lp-footer-link">Interview Prep</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-2">
              <h4 className="lp-footer-title">Company</h4>
              <ul className="lp-footer-links">
                <li><a href="#" className="lp-footer-link">About Us</a></li>
                <li><a href="#" className="lp-footer-link">Success Stories</a></li>
                <li><a href="#" className="lp-footer-link">Partners</a></li>
                <li><a href="#" className="lp-footer-link">Contact</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-4 col-lg-3">
              <h4 className="lp-footer-title">Support</h4>
              <ul className="lp-footer-links">
                <li><a href="#" className="lp-footer-link">Help Center</a></li>
                <li><a href="#" className="lp-footer-link">Privacy Policy</a></li>
                <li><a href="#" className="lp-footer-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <p className="mb-0">© 2026 Shiksha Setu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
