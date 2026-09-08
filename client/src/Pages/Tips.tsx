import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

interface GuideChapter {
  heading: string;
  body?: string;
  items: string[];
}

interface GuideData {
  id: number | string;
  title: string;
  subtitle: string | null;
  chapters: GuideChapter[];
  pdfUrl: string | null;
  active: boolean;
}

const Tips: React.FC = () => {
  const backendUrl: string =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: GuideData }>(
          `${backendUrl}/api/guide/byCategory/tips`
        );
        if (res.data.success && res.data.data) {
          setGuide(res.data.data);
        }
      } catch {
        // leave null
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        body { background: #f3f6ff; font-family: Poppins; }

        .hero {
          background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80")
          center/cover no-repeat;
          text-align: center;
          padding: 150px 25px;
          color: white;
        }
        .hero h1 { font-size: 46px; font-weight: 700; margin-bottom: 15px; }
        .hero p { font-size: 20px; opacity: 0.92; }

        .tips-container {
          max-width: 1150px;
          margin: 60px auto;
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .tip { margin-bottom: 35px; }
        .tip h3 {
          font-size: 23px;
          font-weight: 600;
          color: #003b7a;
          margin-bottom: 12px;
        }
        .tip p { font-size: 17px; line-height: 1.65; }

        .highlight-box {
          background: #eef4ff;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
          font-size: 17px;
          border-left: 5px solid #0057d8;
        }

        .check-section { margin-top: 45px; }
        .check-title { font-size: 25px; color: #002f5d; font-weight: 700; }
        .check-list li {
          font-size: 17px;
          margin-bottom: 9px;
          line-height: 1.6;
        }

        .cta {
          max-width: 1150px;
          margin: 70px auto 70px;
          padding: 50px;
          background: linear-gradient(135deg, #00448f, #001e3c);
          border-radius: 18px;
          color: white;
        }
        .cta h2 { font-size: 30px; margin-bottom: 14px; font-weight: 700; }
        .cta p { font-size: 18px; line-height: 1.65; }

        .cta-btn {
          display: inline-block;
          margin-top: 25px;
          background: #ffb300;
          padding: 15px 34px;
          font-size: 19px;
          font-weight: 600;
          color: #111;
          border-radius: 40px;
          text-decoration: none;
          transition: 0.3s;
        }
        .cta-btn:hover { background: #ff9d00; transform: scale(1.03); }

        @media (max-width: 880px) {
          .hero h1 { font-size: 36px; }
          .hero p { font-size: 18px; }
        }
      `}</style>

      <Navbar />

      <div className="hero">
        <h1>{guide?.title || "Cabin Crew Interview Tips"}</h1>
        <p>
          {guide?.subtitle ||
            "Professional guidance to help you pass the interview on your first attempt."}
        </p>
      </div>

      {guide?.pdfUrl && (
        <div className="tips-container" style={{ padding: "20px", textAlign: "center" }}>
          <a
            href={guide.pdfUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: "#004d99",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ⬇ Download Tips (PDF)
          </a>
        </div>
      )}

      <div className="tips-container">
        {loading ? (
          <p>Loading tips...</p>
        ) : Array.isArray(guide?.chapters) && guide.chapters.length > 0 ? (
          guide.chapters.map((tip: GuideChapter, idx: number) => (
            <div className="tip" key={idx}>
              <h3>
                {tip.heading}
              </h3>
              {tip.body && <p>{tip.body}</p>}
              {Array.isArray(tip.items) &&
                tip.items.map((item: string, i: number) => (
                  <div className="highlight-box" key={i}>
                    {item}
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>No tips added yet. Check back soon.</p>
        )}
      </div>

      <div className="cta">
        <h2>Want Complete Interview Preparation?</h2>
        <p>
          Our <strong>Cabin Crew Interview Mastery Guide</strong> includes grooming rules,
          communication techniques, sample interview answers, confidence training,
          and real questions asked by international airlines.
        </p>

        <Link to="/guide" className="cta-btn">
          Get the Full Guide →
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default Tips;
