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

const Finals: React.FC = () => {
  const backendUrl: string =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: GuideData }>(
          `${backendUrl}/api/guide/byCategory/guide`
        );
        if (res.data.success && res.data.data) {
          setGuide(res.data.data);
        }
      } catch {
        // leave guide null
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="guide-wrapper">
        <div className="guide-container">Loading guide...</div>
      </div>
    );
  }

  const title = guide?.title || "Cabin Crew Training Guide – Become Interview Ready";
  const subtitle =
    guide?.subtitle ||
    "A complete book-style guide for grooming, communication, aviation etiquette, interview tips & sample answers — all in one page.";

  return (
    <div className="guide-wrapper">
      <div className="guide-container">
        {guide?.pdfUrl && (
          <p style={{ marginBottom: "25px" }}>
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
        <h1 className="guide-title">{title}</h1>
        <p className="guide-subtitle">{subtitle}</p>

        {Array.isArray(guide?.chapters) && guide.chapters.length > 0 ? (
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
          ))
        ) : (
          <p style={{ color: "#666" }}>No content has been added for this section yet.</p>
        )}

        <section>
          <h2> Recommended Cabin Crew Books & Study Materials</h2>
          <p>Here are some of the most trusted books for aviation and interview preparation:</p>

          <ul className="book-links">
            <li>
              <a href="https://www.amazon.com/dp/1539551724" target="_blank" rel="noreferrer">
                ✈ Flight Attendant Interview Questions & Answers – Natalie King
              </a>
            </li>
            <li>
              <a href="https://www.amazon.com/dp/1521382983" target="_blank" rel="noreferrer">
                ✈ The Complete Flight Attendant Handbook – Amber Ripp
              </a>
            </li>
            <li>
              <a href="https://www.amazon.com/dp/1857883948" target="_blank" rel="noreferrer">
                ✈ The Perfect CV For Cabin Crew – Louise Newlove
              </a>
            </li>
            <li>
              <a href="https://www.amazon.com/dp/8891804110" target="_blank" rel="noreferrer">
                ✈ Safety & Emergency Procedures Manual – IATA Guide
              </a>
            </li>
            <li>
              <a href="https://www.amazon.com/dp/152030691X" target="_blank" rel="noreferrer">
                ✈ Aviation English for International Cabin Crew – Oxford
              </a>
            </li>
          </ul>

          <p className="book-note">
            These books are optional but extremely valuable for scoring high during interviews
            and becoming aviation-ready.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Finals;
