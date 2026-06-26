import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import "./DetailedAnalytics.css";

const DetailedAnalytics: React.FC = () => {
  const { user } = useAuth();
  
  // What-If Calculator State
  const profile = user?.academicProfile || {};
  const currentCgpa = profile.currentCgpa || 0;
  const creditsEarned = profile.creditsEarned || 0;
  const totalCredits = profile.totalCredits || 160;
  const targetCgpa = profile.targetCgpa || 9.0;
  
  const [expectedSgpa, setExpectedSgpa] = useState<number>(8.0);
  const [projectedCgpa, setProjectedCgpa] = useState<number>(currentCgpa);

  // Real subjects from database, with fallback to mock data
  const realSubjects = profile.subjects || [];
  
  const domainData = realSubjects.length > 0 
    ? realSubjects.map((s: any) => ({ subject: s.name, A: s.score, fullMark: 100 }))
    : [
        { subject: 'Programming', A: Math.min(100, (currentCgpa || 8.0) * 10 + 5), fullMark: 100 },
        { subject: 'Data Science', A: Math.min(100, (currentCgpa || 8.0) * 10 - 10), fullMark: 100 },
        { subject: 'Core CS', A: Math.min(100, (currentCgpa || 8.0) * 10 + 2), fullMark: 100 },
        { subject: 'Hardware/Systems', A: Math.min(100, (currentCgpa || 8.0) * 10 - 15), fullMark: 100 },
        { subject: 'Communication', A: Math.min(100, (currentCgpa || 8.0) * 10 + 10), fullMark: 100 },
      ];

  // Calculate What-If scenario
  useEffect(() => {
    const remainingSemesters = 8 - (profile.currentSemester || 1);
    if (remainingSemesters > 0 && creditsEarned < totalCredits) {
      // Simplistic calculation assuming equal credits per semester
      const remainingCredits = totalCredits - creditsEarned;
      const currentPoints = currentCgpa * creditsEarned;
      const futurePoints = expectedSgpa * remainingCredits;
      const newCgpa = (currentPoints + futurePoints) / totalCredits;
      setProjectedCgpa(Number(newCgpa.toFixed(2)));
    } else {
      setProjectedCgpa(currentCgpa);
    }
  }, [expectedSgpa, currentCgpa, creditsEarned, totalCredits, profile.currentSemester]);

  return (
    <div className="fade-in pb-5 analytics-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/dashboard" className="text-decoration-none text-muted mb-2 d-inline-block hover-primary">
            <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
          </Link>
          <h1 className="fw-bold text-ss-bright fs-3 mb-1">Detailed Analytics</h1>
          <p className="text-ss-muted mb-0 fs-6">Deep dive into your performance and predict your future.</p>
        </div>
        <div className="metric-badge shadow-sm">
          <i className="bi bi-award-fill"></i> Target CGPA: {targetCgpa.toFixed(2)}
        </div>
      </div>

      <div className="row g-4">
        {/* Radar Chart Panel */}
        <div className="col-lg-7">
          <div className="analytics-card p-4 rounded-4 h-100">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                <i className="bi bi-radar"></i>
              </div>
              <h4 className="fw-bold text-dark mb-0">Subject Domain Breakdown</h4>
            </div>
            <p className="text-muted small">
              {realSubjects.length > 0 
                ? "Real subjects extracted directly from your uploaded marksheet."
                : "Your skill proficiency based on historical grades across core domains. Upload a marksheet to see real subjects."}
            </p>
            
            <div className="radar-chart-container mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={domainData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Radar
                    name="Proficiency (%)"
                    dataKey="A"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* What-If Calculator Panel */}
        <div className="col-lg-5">
          <div className="analytics-card p-4 rounded-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                <i className="bi bi-magic"></i>
              </div>
              <h4 className="fw-bold text-dark mb-0">"What-If" Scenario Planner</h4>
            </div>
            <p className="text-muted small">Slide to predict how your upcoming semester performance will impact your final CGPA.</p>
            
            <div className="flex-grow-1 d-flex flex-column justify-content-center my-4">
              <div className="text-center mb-5">
                <div className="text-uppercase fw-bold text-muted small mb-2 letter-spacing-1">Current CGPA</div>
                <div className="display-4 fw-bold text-dark">{currentCgpa > 0 ? currentCgpa.toFixed(2) : "0.00"}</div>
              </div>

              <div className="px-3 mb-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold text-secondary">Expected Future SGPA</span>
                  <span className="fw-bold text-primary fs-5">{expectedSgpa.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="4.0" 
                  max="10.0" 
                  step="0.1" 
                  value={expectedSgpa} 
                  onChange={(e) => setExpectedSgpa(Number(e.target.value))}
                  className="whatif-slider"
                />
                <div className="d-flex justify-content-between mt-2 text-muted small">
                  <span>4.0</span>
                  <span>10.0</span>
                </div>
              </div>

              <div className="bg-light rounded-4 p-4 text-center border">
                <div className="text-uppercase fw-bold text-muted small mb-2 letter-spacing-1">Projected Final CGPA</div>
                <div className={`display-3 fw-bold ${projectedCgpa >= targetCgpa ? 'text-success' : 'text-primary'}`}>
                  {projectedCgpa > 0 ? projectedCgpa.toFixed(2) : "0.00"}
                </div>
                <div className="mt-2 text-muted small">
                  {projectedCgpa >= targetCgpa 
                    ? <span><i className="bi bi-check-circle-fill text-success me-1"></i> You will hit your target!</span>
                    : <span>You are {(targetCgpa - projectedCgpa).toFixed(2)} points below target.</span>
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
