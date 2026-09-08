import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

const Final: React.FC = () => {
  const backendUrl: string =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: GuideData }>(
          `${backendUrl}/api/guide/byCategory/course`
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
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #fafafa;
        }
        .course-hero {
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
          url("https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=1400&q=80")
          center/cover no-repeat;
          color: white;
          text-align: center;
          padding: 120px 30px;
        }
        .course-hero h1 {
          font-size: 42px;
          font-weight: 700;
        }
        .course-hero p {
          font-size: 19px;
          opacity: 0.9;
          margin-top: 12px;
        }
        .course-container {
          max-width: 1100px;
          margin: 60px auto;
          padding: 20px;
        }
        .section {
          margin-bottom: 60px;
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .section h2 {
          font-size: 26px;
          margin-bottom: 15px;
          color: #00305c;
        }
        .section ul li {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .cta-box {
          background: #00305c;
          padding: 40px;
          margin-top: 60px;
          border-radius: 12px;
          text-align: center;
          color: white;
        }
        .cta-box a {
          display: inline-block;
          background: yellow;
          padding: 13px 35px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          color: black;
          margin-top: 18px;
        }
      `}</style>

      <Navbar />

      <div className="course-hero">
        <h1>{guide?.title || "Cabin Crew Interview Mastery Course"}</h1>
        <p>
          {guide?.subtitle ||
            "Learn everything needed to crack your Dream Airline Interview on the FIRST attempt."}
        </p>
      </div>

      <div className="course-container">
        {loading ? (
          <div className="section">Loading course content...</div>
        ) : Array.isArray(guide?.chapters) && guide.chapters.length > 0 ? (
          guide.chapters.map((mod: GuideChapter, idx: number) => (
            <div className="section" key={idx}>
              <h2>{mod.heading}</h2>
              {mod.body && <p>{mod.body}</p>}
              {Array.isArray(mod.items) && mod.items.length > 0 && (
                <ul>
                  {mod.items.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <div className="section">
            <p>No course content added yet. Check back soon.</p>
          </div>
        )}

        {guide?.pdfUrl && (
          <div className="section" style={{ textAlign: "center" }}>
            <a
              href={guide.pdfUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                background: "#004d99",
                color: "#fff",
                padding: "13px 30px",
                borderRadius: "8px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ⬇ Download the Full Course (PDF)
            </a>
          </div>
        )}

        <div className="cta-box">
          <h2>📖 Want to Read Our Cabin Crew Interview Book?</h2>
          <p>Click below to get full access to the book.</p>

          <Link to="/finals" style={{ backgroundColor: "yellow", padding: "13px 35px", fontWeight: 700, borderRadius: 8, textDecoration: "none", color: "black", display: "inline-block", marginTop: 18 }}>
            Read the Book
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Final;
