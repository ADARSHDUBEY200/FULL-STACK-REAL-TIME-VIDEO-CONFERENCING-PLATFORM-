import React from "react";
import "../styles/Home.css";
import { Users, ShieldCheck, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleJoin = ()=>{
    navigate("/video");
  }
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">
          Your <span className="highlight">Ultimate</span> Video Conferencing
        </h1>
        <p className="hero-subtext">
          Unleash next-gen HD video meetings with blazing speed, rock-solid security, and real-time collaboration tools built for modern teams.
        </p>
        <div className="button-group">
          <button className="btn primary" onClick={handleJoin}>Join Now</button>
          <button className="btn outline" onClick={handleJoin}>Watch Demo</button>
        </div>
      </div>

      <div className="image-section">
        <img
          src="/image.jpg"
          alt="Video conferencing demo"
          className="conference-image"
        />
      </div>

      <div className="features-section">
        <div className="feature-card">
          <Users className="feature-icon" size={40} />
          <h3 className="feature-title">Multi-User Rooms</h3>
          <p className="feature-desc">Host up to 100 participants with smooth audio-video sync and zero lag.</p>
        </div>

        <div className="feature-card">
          <ShieldCheck className="feature-icon" size={40} />
          <h3 className="feature-title">Enterprise-Grade Security</h3>
          <p className="feature-desc">End-to-end encrypted streams and multi-layered protection you can trust.</p>
        </div>

        <div className="feature-card">
          <Calendar className="feature-icon" size={40} />
          <h3 className="feature-title">Scheduling & Reminders</h3>
          <p className="feature-desc">Integrated calendar and email alerts so you never miss a meeting again.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
