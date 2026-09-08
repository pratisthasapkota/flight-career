import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Guide.css";

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
  updatedAt?: string;
}

const Guide: React.FC = () => {
  const backendUrl: string =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: GuideData }>(
          `${backendUrl}/api/guide/byCategory/guide`
        );
        if (res.data.success && res.data.data) {
          setGuide(res.data.data);
        } else {
          setError("No guide is available yet. Please check back soon.");
        }
      } catch {
        setError("No guide is available yet. Please check back soon.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="guide-wrapper"><div className="guide-container">Loading guide...</div></div>;
  }

  if (!guide) {
    return <div className="guide-wrapper"><div className="guide-container"><p>{error}</p></div></div>;
  }

  return (
    <div className="guide-wrapper">
      <div className="guide-container">
        <h1 className="guide-title">{guide.title}</h1>
        {guide.subtitle && <p className="guide-subtitle">{guide.subtitle}</p>}

        {guide.pdfUrl && (
          <p style={{ marginBottom: "30px" }}>
            <a
              className="guide-pdf-btn"
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
              ⬇ Download the Full Guide (PDF)
            </a>
          </p>
        )}

        {Array.isArray(guide.chapters) &&
          guide.chapters.map((ch: GuideChapter, idx: number) => (
            <section key={idx}>
              <h2>{ch.heading}</h2>
              {ch.body && <p>{ch.body}</p>}
              {Array.isArray(ch.items) && ch.items.length > 0 && (
                <ul>
                  {ch.items.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
      </div>
    </div>
  );
};

export default Guide;
