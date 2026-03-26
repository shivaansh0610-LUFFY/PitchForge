import InputForm from "../components/InputForm";
import OutputBox from "../components/OutputBox";
import { useState, useEffect } from "react";

const Home = () => {
  const [result, setResult] = useState("");

  const steps = ["Founders", "Startups", "Marketers", "Sales Teams"];
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleGenerate = (data) => {
    console.log("Form Data:", data);
    setResult("Generated email will appear here...");
  };

  return (
    <div className="container">
      
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">
          <span className="rocket">🚀</span> PitchPilot
        </div>
      </div>

      <div className="wrapper">

        {/* HERO */}
        <div className="hero">
          <h1 className="hero-title">
            Write Better Cold Emails
            <br />
            for{" "}
            <span key={steps[stepIndex]} className="highlight">
              {steps[stepIndex]}
            </span>
          </h1>

          <p>
            Generate personalized outreach emails for startups, hiring, and networking in seconds.
          </p>

          <div className="features">
            <span>⚡ Fast</span>
            <span>🎯 Personalized</span>
            <span>📩 Ready to Send</span>
          </div>
        </div>

        {/* FORM */}
        <div className="card">
          <InputForm onGenerate={handleGenerate} />
        </div>

        {/* OUTPUT */}
        <OutputBox result={result} />

      </div>
    </div>
  );
};

export default Home;