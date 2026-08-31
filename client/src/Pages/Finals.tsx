import React from "react";
import "./Guide.css";

const Finals: React.FC = () => {
  return (
    <div className="guide-wrapper">
      <div className="guide-container">
        <h1 className="guide-title">Cabin Crew Training Guide – Become Interview Ready</h1>
        <p className="guide-subtitle">
          A complete book-style guide for grooming, communication, aviation etiquette,
          interview tips & sample answers — all in one page.
        </p>

        <section>
          <h2>Chapter 1 — Grooming & Professional Appearance</h2>
          <p>
            Grooming is the first thing recruiters notice — even before you speak.
            Cabin crew are the face of the airline, so appearance must reflect discipline,
            hygiene and confidence.
          </p>
          <ul>
            <li>Neat and tidy hair; no flyaways</li>
            <li>Subtle & natural makeup for females — professional shave for males</li>
            <li>Well-fitted formal clothes (navy / white / black)</li>
            <li>Good posture, soft smile, and professional elegance</li>
          </ul>
        </section>

        <section>
          <h2>Chapter 2 — Communication & Aviation Etiquette</h2>
          <p>
            Airlines observe how you speak, listen, and interact. Communication must be
            polite, calm and confident — especially under pressure.
          </p>
          <ul>
            <li>Speak slowly and clearly — no filler words (umm, ahh, etc.)</li>
            <li>Use formal and respectful greetings</li>
            <li>Maintain eye contact but not aggressively</li>
            <li>Listen patiently before answering</li>
            <li>Never interrupt the interviewer or passengers</li>
          </ul>
        </section>

        <section>
          <h2>Chapter 3 — Purpose of Cabin Crew</h2>
          <p>
            Many candidates think cabin crew is mainly hospitality — but <strong>safety is the main
            responsibility.</strong> Hospitality comes after safety and security protocols.
          </p>
          <ol>
            <li>Handle onboard emergencies</li>
            <li>Follow safety procedures & briefings</li>
            <li>Reassure and calm passengers</li>
            <li>Provide professional and friendly customer service</li>
          </ol>
        </section>

        <section>
          <h2>Chapter 4 — Most Important Interview Question</h2>
          <p><strong>Q: Why should we hire you as a cabin crew?</strong></p>
          <p className="highlight-box">
            "You should hire me because I genuinely enjoy helping people.
            I stay calm in stressful situations and work well in a team.
            I quickly adapt to new environments and represent the airline with
            confidence, respect and professionalism. I believe every passenger
            deserves a pleasant flying experience — and I am committed to that."
          </p>
        </section>

        <section>
          <h2>Chapter 5 — Frequent Mistakes Candidates Make</h2>
          <ul>
            <li>Walking in with no smile / nervous body language</li>
            <li>Memorizing answers instead of speaking naturally</li>
            <li>Wearing heavy perfume, dark lipstick or flashy accessories</li>
            <li>Talking too much instead of answering precisely</li>
            <li>Not researching about the airline</li>
          </ul>
        </section>

        <section>
          <h2>Chapter 6 — Aviation Behaviour & First Impression</h2>
          <p>
            The interview begins the moment you enter the room — not when you sit.
            Your walk, smile, confidence and politeness build the first impression.
          </p>
          <ul>
            <li>Knock softly → greet politely → take permission to sit</li>
            <li>Be calm and graceful while speaking</li>
            <li>Smile naturally but not continuously</li>
            <li>Always thank the interviewer before leaving</li>
          </ul>
        </section>

        <section>
          <h2>Final Message from the Aviation Industry</h2>
          <p>
            Becoming a cabin crew is not about perfection — it is about progress.
            If you focus on grooming, communication, confidence and calmness,
            you will stand out automatically. Believe in yourself, practice daily
            and act like the professional you dream to become.
          </p>
        </section>

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
