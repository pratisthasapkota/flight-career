import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

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

const Question: React.FC = () => {
  const backendUrl: string =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: GuideData }>(
          `${backendUrl}/api/guide/byCategory/questions`
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
        body { font-family: Poppins, sans-serif; background: #f3f6ff; margin: 0; }

        .hero {
          background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url("https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=1300&q=80")
          center/cover no-repeat;
          padding: 150px 30px;
          text-align: center;
          color: white;
        }
        .hero h1 { font-size: 46px; margin-bottom: 15px; font-weight: 700; }
        .hero p { font-size: 20px; opacity: 0.9; }

        .box {
          max-width: 1150px;
          margin: 60px auto;
          background: white;
          padding: 45px;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }
        .question { margin-bottom: 45px; }
        .question h3 {
          font-size: 23px;
          color: #003b7a;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .question p {
          font-size: 17px;
          line-height: 1.65;
          margin-bottom: 8px;
        }
        .sample {
          background: #eef4ff;
          padding: 18px;
          border-radius: 10px;
          border-left: 5px solid #0057d8;
          font-size: 17px;
          line-height: 1.7;
          margin-top: 10px;
        }

        .cta {
          max-width: 1150px;
          margin: 70px auto 70px;
          background: linear-gradient(135deg, #00448f, #001e3c);
          padding: 55px;
          border-radius: 20px;
          color: white;
          text-align: center;
        }
        .cta h2 { font-size: 33px; margin-bottom: 15px; }
        .cta p { font-size: 19px; line-height: 1.7; opacity: 0.95; }
        .cta-btn {
          display: inline-block;
          margin-top: 25px;
          background: #ffb300;
          padding: 15px 36px;
          font-size: 19px;
          font-weight: 600;
          border-radius: 40px;
          color: #111;
          text-decoration: none;
          transition: 0.3s;
        }
        .cta-btn:hover { background: #ff9600; transform: scale(1.03); }

        @media (max-width: 880px) {
          .hero h1 { font-size: 36px; }
          .hero p { font-size: 17px; }
        }
      `}</style>

      <Navbar />

      <div className="hero">
        <h1>{guide?.title || "Cabin Crew Interview Questions & Sample Answers"}</h1>
        <p>
          {guide?.subtitle ||
            "Frequently asked questions in real airline interviews — with expert answers."}
        </p>
      </div>

      {guide?.pdfUrl && (
        <div className="box" style={{ padding: "20px", textAlign: "center" }}>
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
            ⬇ Download Questions & Answers (PDF)
          </a>
        </div>
      )}

      <div className="box">
        {loading ? (
          <p>Loading questions...</p>
        ) : Array.isArray(guide?.chapters) && guide.chapters.length > 0 ? (
          guide.chapters.map((q: GuideChapter, idx: number) => (
            <div className="question" key={idx}>
              <h3>{q.heading}</h3>
              {q.body && <p>{q.body}</p>}
              {Array.isArray(q.items) &&
                q.items.map((sample: string, i: number) => (
                  <div className="sample" key={i}>
                    {sample}
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p style={{ color: "#666" }}>No questions added yet. Check back soon.</p>
        )}
      </div>

      <div className="cta">
        <h2>Want Complete Interview Preparation?</h2>
        <p>
          The <strong>Cabin Crew Interview Mastery Guide</strong> includes 100+ real interview
          questions, ideal answers, grooming rules, confidence training and role-play scripts
          used by real airlines.
        </p>

        <a href="/guide" className="cta-btn">
          Get the Full Guide →
        </a>
      </div>

      <Footer />
    </>
  );
};

export default Question;
