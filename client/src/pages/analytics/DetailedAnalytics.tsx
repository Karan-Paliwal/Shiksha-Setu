import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./DetailedAnalytics.css";

const DetailedAnalytics: React.FC = () => {
  const { user } = useAuth();

  const profile = user?.academicProfile ?? {
    currentCgpa: 0,
    targetCgpa: 9.0,
    creditsEarned: 0,
    totalCredits: 160,
    currentSemester: 1,
    subjects: [],
  };

  // What-If Calculator State
  const currentCgpa = profile.currentCgpa || 0;
  const creditsEarned = profile.creditsEarned || 0;
  const totalCredits = profile.totalCredits || 160;
  const targetCgpa = profile.targetCgpa || 9.0;

  const [expectedSgpa, setExpectedSgpa] = useState<number>(8.0);
  const [projectedCgpa, setProjectedCgpa] = useState<number>(currentCgpa);

  // Real subjects from database, with fallback to mock data
  const realSubjects = profile.subjects || [];

  // SGPA Trend Data & Critical Semester Logic
  const semesterGpas = profile.semesterGpas && profile.semesterGpas.length > 0 
    ? profile.semesterGpas 
    : [7.5, 8.2, 6.8, 8.5, 8.1]; // Mock data if empty
    
  const trendData = semesterGpas.map((sgpa, index) => ({
    name: `Sem ${index + 1}`,
    sgpa: sgpa
  }));

  // Identify Critical Semester (lowest SGPA)
  const lowestSgpa = Math.min(...semesterGpas);
  const criticalSemIndex = semesterGpas.indexOf(lowestSgpa);

  // Placement Readiness Logic
  const getPlacementTier = (cgpa: number, backlogs: boolean) => {
    if (cgpa >= 8.5 && !backlogs) return {
      tier: "Super Dream (FAANG / Top Tech)",
      color: "text-success",
      bg: "bg-success",
      companies: "Google, Microsoft, Amazon, Atlassian, DE Shaw",
      advice: [
        "Master Advanced Data Structures & Algorithms (Graphs, DP, Trees)",
        "Build 2-3 complex full-stack/system design projects",
        "Participate heavily in LeetCode/Codeforces contests",
        "Prepare for Low-Level and High-Level System Design rounds"
      ]
    };
    if (cgpa >= 7.5 && !backlogs) return {
      tier: "Dream (Top Startups & Mid-Tier)",
      color: "text-primary",
      bg: "bg-primary",
      companies: "Paytm, Swiggy, Zomato, Oracle, Cisco",
      advice: [
        "Ensure strong fundamentals in DSA (Arrays, Strings, Linked Lists)",
        "Have 1-2 solid projects using modern frameworks (React, Node.js)",
        "Focus on Core CS subjects (OS, DBMS, Computer Networks)",
        "Target maintaining CGPA above 8.0 for safety"
      ]
    };
    if (cgpa >= 6.5) return {
      tier: "Mass Recruiters & IT Services",
      color: "text-warning",
      bg: "bg-warning",
      companies: "TCS, Infosys, Wipro, Cognizant, Accenture",
      advice: [
        "Focus on Quantitative Aptitude & Logical Reasoning",
        "Clear basic programming concepts in Java/C++/Python",
        "Clear any active backlogs immediately before placement season",
        "Work on pushing CGPA above 7.5 to unlock more opportunities"
      ]
    };
    return {
      tier: "Needs Improvement",
      color: "text-danger",
      bg: "bg-danger",
      companies: "Currently ineligible for most on-campus drives",
      advice: [
        "PRIORITY 1: Clear all active backlogs",
        "Focus on improving CGPA to at least 6.5 minimum",
        "Start with basic programming logic and syntax",
        "Seek peer tutoring or extra classes for weak subjects"
      ]
    };
  };

  const hasBacklogs = (profile as any).hasActiveBacklogs || false;
  const placementData = getPlacementTier(currentCgpa, hasBacklogs);

  const uploadedMarksheetsCount = profile.semesterGpas ? profile.semesterGpas.filter(g => g > 0).length : 0;
  const remainingSemesters = Math.max(0, 8 - uploadedMarksheetsCount);

  // Calculate What-If scenario
  useEffect(() => {
    if (remainingSemesters > 0) {
      let newCgpa = currentCgpa;
      
      if (creditsEarned > 0 && creditsEarned < totalCredits) {
        // High accuracy: Use actual extracted credits
        const remainingCredits = totalCredits - creditsEarned;
        const currentPoints = currentCgpa * creditsEarned;
        const futurePoints = expectedSgpa * remainingCredits;
        newCgpa = (currentPoints + futurePoints) / totalCredits;
      } else if (uploadedMarksheetsCount > 0) {
        // Fallback: Use semester-weight equality
        const currentPoints = currentCgpa * uploadedMarksheetsCount;
        const futurePoints = expectedSgpa * remainingSemesters;
        newCgpa = (currentPoints + futurePoints) / 8;
      } else {
        // No marksheets uploaded yet
        newCgpa = expectedSgpa;
      }
      
      setProjectedCgpa(Number(newCgpa.toFixed(2)));
    } else {
      setProjectedCgpa(currentCgpa);
    }
  }, [expectedSgpa, currentCgpa, creditsEarned, totalCredits, uploadedMarksheetsCount, remainingSemesters]);

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
        {/* Performance Trend & Critical Semester */}
        <div className="col-lg-7">
          <div className="analytics-card p-4 rounded-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-graph-up"></i>
              </div>
              <h4 className="fw-bold text-dark mb-0">SGPA Trend & Critical Semester</h4>
            </div>
            
            <div className="mb-4 d-flex justify-content-between align-items-center bg-light rounded-3 p-3 border-start border-danger border-4">
               <div>
                 <span className="text-muted d-block small fw-bold text-uppercase mb-1">Critical Semester Identified</span>
                 <span className="text-dark fw-bold">Semester {criticalSemIndex + 1}</span> 
                 <span className="text-muted ms-2">(SGPA: {lowestSgpa.toFixed(2)})</span>
               </div>
               <div className="text-end">
                 <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill border border-danger">Requires Attention</span>
               </div>
            </div>

            <p className="text-muted small mb-4">
              Your semester-by-semester performance trend. Semester {criticalSemIndex + 1} had the lowest performance and may require a review of past study habits or foundational concepts from that period.
            </p>

            <div className="flex-grow-1 mt-2" style={{ minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ss-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--ss-text-muted)', fontSize: 12}} dy={10} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: 'var(--ss-text-muted)', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--ss-bg-card)', color: 'var(--ss-text-bright)', borderRadius: '8px', border: '1px solid var(--ss-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    itemStyle={{ color: '#198754', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sgpa" 
                    name="SGPA" 
                    stroke="#198754" 
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: '#198754', stroke: '#fff', strokeWidth: 2 }}
                    dot={{ r: 4, fill: '#fff', stroke: '#198754', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* What-If Calculator Panel */}
        <div className="col-lg-5">
          <div className="analytics-card p-4 rounded-4 h-100 d-flex flex-column">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-magic"></i>
              </div>
              <h4 className="fw-bold text-dark mb-0">"What-If" Scenario Planner</h4>
            </div>
            <p className="text-muted small">Slide to predict how your performance across your remaining {remainingSemesters} semester{remainingSemesters !== 1 ? 's' : ''} will impact your final CGPA.</p>

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

      {/* Placement Readiness Tracker */}
      <div className="mt-5">
        <div className="d-flex align-items-center mb-4">
          <div className={`bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 ${placementData.bg} ${placementData.color}`} style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-briefcase-fill"></i>
          </div>
          <h4 className="fw-bold text-dark mb-0">Career & Placement Readiness</h4>
        </div>
        
        <div className="analytics-card p-4 rounded-4 border shadow-sm">
          <div className="row g-4 align-items-center">
            <div className="col-md-5" style={{ borderRight: '1px solid var(--ss-border)' }}>
              <h6 className="text-muted text-uppercase small fw-bold letter-spacing-1 mb-2">Current Eligibility Tier</h6>
              <h3 className={`fw-bold mb-3 ${placementData.color}`}>{placementData.tier}</h3>
              
              <div className="mb-3">
                <span className="text-muted small d-block mb-1">Target Companies:</span>
                <span className="fw-semibold text-dark">{placementData.companies}</span>
              </div>
              
              <div className="d-flex align-items-center gap-3 mt-4">
                <div className="text-center">
                  <div className="h4 fw-bold text-dark mb-0">{currentCgpa.toFixed(2)}</div>
                  <div className="text-muted small">CGPA</div>
                </div>
                <div className="text-center border-start ps-3">
                  <div className={`h4 fw-bold mb-0 ${hasBacklogs ? 'text-danger' : 'text-success'}`}>{hasBacklogs ? 'Yes' : '0'}</div>
                  <div className="text-muted small">Active Backlogs</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-7 ps-md-4">
              <h6 className="fw-bold text-dark mb-3">Actionable Roadmap to Top Tech</h6>
              <ul className="list-unstyled mb-0">
                {placementData.advice.map((tip, idx) => (
                  <li key={idx} className="d-flex mb-3 align-items-start">
                    <i className={`bi bi-check-circle-fill me-3 mt-1 ${placementData.color}`}></i>
                    <span className="text-secondary">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DetailedAnalytics;
