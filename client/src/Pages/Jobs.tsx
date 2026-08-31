import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

interface Job {
  airline: string;
  location: string;
  apply: string;
  deadline: string;
  img: string;
}

const Jobs: React.FC = () => {
  const jobs: Job[] = [
    {
      airline: "Qatar Airways",
      location: "Doha, Qatar",
      apply: "https://careers.qatarairways.com/global/en",
      deadline: "Feb 20, 2025",
      img: "https://images.unsplash.com/photo-1485988412941-77a35537dae4?auto=format&fit=crop&w=800&q=80"
    },
    {
      airline: "Emirates",
      location: "Dubai, UAE",
      apply: "https://www.emiratesgroupcareers.com/cabin-crew",
      deadline: "Open",
      img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80"
    },
    {
      airline: "AirAsia",
      location: "Malaysia",
      apply: "https://careers.airasia.com",
      deadline: "Jan 31, 2025",
      img: "https://images.unsplash.com/photo-1506968430777-bf7784a87f23?auto=format&fit=crop&w=800&q=80"
    },
    {
      airline: "Vistara",
      location: "India",
      apply: "https://careers.airvistara.com",
      deadline: "Feb 14, 2025",
      img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          background: #fafafa;
        }

        .hero-job {
          background: url('https://images.unsplash.com/photo-1547049935-88d818352f8a?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat;
          text-align: center;
          padding: 120px 20px;
          color: white;
          position: relative;
        }

        .hero-job::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.45);
        }

        .hero-job h1 {
          position: relative;
          z-index: 2;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .hero-job p {
          position: relative;
          z-index: 2;
          font-size: 18px;
          margin-bottom: 0;
        }

        .jobs-container {
          max-width: 1100px;
          margin: 60px auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          padding: 0 20px;
        }

        .job-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: transform .3s ease;
        }

        .job-card:hover {
          transform: translateY(-5px);
        }

        .job-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .job-details {
          padding: 20px;
        }

        .job-details h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .job-details p {
          color: #555;
          font-size: 15px;
          margin-bottom: 12px;
        }

        .apply-btn {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 10px 20px;
          font-size: 15px;
          border-radius: 6px;
          text-decoration: none;
          transition: background .3s ease;
        }

        .apply-btn:hover {
          background: #0056b3;
        }
      `}</style>

      <Navbar />

      <div className="hero-job">
        <h1>Latest Cabin Crew Job Vacancies</h1>
        <p>Apply to top airlines worldwide — updated frequently.</p>
      </div>

      <div className="jobs-container">
        {jobs.map((job, index) => (
          <div className="job-card" key={index}>
            <img src={job.img} alt="Cabin Crew" />
            <div className="job-details">
              <h3>{job.airline}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>
              <a className="apply-btn" href={job.apply} target="_blank" rel="noreferrer">
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Jobs;
