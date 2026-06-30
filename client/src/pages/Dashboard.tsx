import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const { user, token, login } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [academicProfile, setAcademicProfile] = useState<any>(null);

  // Schedule Form State
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newDayOfWeek, setNewDayOfWeek] = useState("Monday");
  const [newStartTime, setNewStartTime] = useState("09:00 AM");
  const [newEndTime, setNewEndTime] = useState("10:00 AM");
  const [newLocation, setNewLocation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // AI Marksheet Upload/Scanning State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [aiUsed, setAiUsed] = useState<boolean | null>(null);
  const [isSem1Upload, setIsSem1Upload] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await api.get("/schedule/my-schedule");
        if (data && data.classes) setSchedule(data.classes);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        if (data) {
          if (data.academicProfile) {
            setAcademicProfile(data.academicProfile);
          }
          if (token) {
            login(data, token);
          }
        }
      } catch (err) {
        console.error("Failed to fetch academic profile", err);
      }
    };

    fetchSchedule();
    fetchProfile();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setUploadError(null);
    setUploadSuccess(false);
    setAiUsed(null);
    setAnalysisProgress(10);
    setAnalysisStep("Uploading marksheet to Cloudinary secure storage...");

    const steps = [
      { progress: 25, step: "Cloudinary: File uploaded and secured in cloud storage..." },
      { progress: 50, step: "AI Vision: Reading text, tables, and grade data from document..." },
      { progress: 75, step: "AI Analysis: Extracting semester-wise SGPAs and cumulative CGPA..." },
      { progress: 90, step: "Predictive Model: Computing degree CGPA projection..." },
      { progress: 100, step: "Finalizing: Saving AI-verified academic data to your profile..." }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setAnalysisProgress(steps[stepIndex].progress);
        setAnalysisStep(steps[stepIndex].step);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        // Wait at least 5s — Cloudinary + Gemini AI takes time
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const response = await api.post("/academics/upload-marksheet", {
          fileName: file.name,
          fileType: file.type,
          fileData: base64Data
        });

        const updatedProfile = response.data.academicProfile;
        setAcademicProfile(updatedProfile);
        setAiUsed(response.data.aiUsed ?? false);
        setIsSem1Upload(response.data.isSem1 ?? false);

        // Update global auth context user profile
        if (token) {
          login(response.data.user, token);
        }

        setUploadSuccess(true);
      } catch (err: any) {
        console.error(err);
        setUploadError(err.response?.data?.error || "Failed to analyze marksheet document.");
      } finally {
        setIsAnalyzing(false);
        clearInterval(interval);
      }
    };

    reader.onerror = () => {
      setUploadError("Error reading marksheet file.");
      setIsAnalyzing(false);
      clearInterval(interval);
    };

    reader.readAsDataURL(file);
  };

  const handleAddScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newCourseName.trim()) {
      setFormError("Course name is required");
      return;
    }

    const newClass = {
      courseName: newCourseName.trim(),
      dayOfWeek: newDayOfWeek,
      startTime: newStartTime.trim(),
      endTime: newEndTime.trim(),
      location: newLocation.trim() || "TBA"
    };

    const updatedClasses = [...schedule, newClass];

    try {
      const response = await api.post("/schedule/save", { classes: updatedClasses });
      if (response.data && response.data.schedule) {
        setSchedule(response.data.schedule.classes);
        setShowAddScheduleModal(false);
        // Clear form
        setNewCourseName("");
        setNewLocation("");
        setNewStartTime("09:00 AM");
        setNewEndTime("10:00 AM");
        setNewDayOfWeek("Monday");
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.error || "Failed to add class to schedule");
    }
  };

  // ── Real data only — no hardcoded defaults ──────────────────────────────────
  const profile = academicProfile || user?.academicProfile || {};
  const currentCgpa = profile.currentCgpa || 0;
  const targetCgpa = profile.targetCgpa || 9.0;
  const creditsEarned = profile.creditsEarned || 0;
  const totalCredits = profile.totalCredits || 160;
  const currentSemester = profile.currentSemester || 1;

  const displayPredictedCgpa = profile.predictedCgpa || 0;

  // Use ONLY completed semesters' GPA data (less than currentSemester)
  const rawSemesterGpas: number[] = (profile.semesterGpas && profile.semesterGpas.length > 0)
    ? profile.semesterGpas.slice(0, currentSemester - 1)
    : [];

  // Compute valid GPAs (non-zero entries only)
  const validSemesterGpas = rawSemesterGpas.filter((g: number) => g > 0);
  const hasRealData = validSemesterGpas.length > 0;

  // Derive stats from real data only
  const displayAverageCgpa = hasRealData
    ? (profile.averageCgpa || Number((validSemesterGpas.reduce((a: number, b: number) => a + b, 0) / validSemesterGpas.length).toFixed(2)))
    : 0;
  const displayHighestCgpa = hasRealData
    ? (profile.highestCgpa || Math.max(...validSemesterGpas))
    : 0;

  // Find which semester achieved the highest CGPA
  const highestSemesterIndex = hasRealData
    ? rawSemesterGpas.indexOf(Math.max(...validSemesterGpas))
    : -1;
  const highestSemesterNumber = highestSemesterIndex >= 0 ? highestSemesterIndex + 1 : 0;

  let improvementRate = 0;
  if (validSemesterGpas.length >= 2) {
    const lastGpa = validSemesterGpas[validSemesterGpas.length - 1];
    const prevGpa = validSemesterGpas[validSemesterGpas.length - 2];
    improvementRate = ((lastGpa - prevGpa) / prevGpa) * 100;
  }

  const displayImprovementRate = `${improvementRate >= 0 ? '+' : ''}${improvementRate.toFixed(1)}%`;
  const improvementRateClass = improvementRate >= 0 ? "text-success" : "text-danger";
  const improvementRateIconClass = improvementRate >= 0 ? "bg-success text-success" : "bg-danger text-danger";
  const improvementRateIcon = improvementRate >= 0 ? "bi-graph-up-arrow" : "bi-graph-down-arrow";

  const progressPercent = totalCredits > 0 ? (creditsEarned / totalCredits) * 100 : 0;

  // Chart coordinates mapping (SVG dimensions: 1000 x 270)
  const getY = (gpa: number) => Math.max(0, Math.min(270, (10.0 - gpa) * 90));

  // Build graph data from real semester GPAs only — show all semesters with valid GPAs
  const graphData = rawSemesterGpas
    .map((gpa: number, index: number) => ({ semNumber: index + 1, gpa }))
    .filter((data: any) => data.gpa > 0);

  // No fallback to fake data — graphData is empty if no real data exists
  const finalGraphData = graphData;

  const points = finalGraphData.map((data: any, i: number) => {
    const x = finalGraphData.length > 1
      ? (i / (finalGraphData.length - 1)) * 1000
      : 500;
    const y = getY(data.gpa);
    return { x, y, gpa: data.gpa, semNumber: data.semNumber };
  });

  return (
    <div className="fade-in pb-5">
      {/* AI Scanning Loader Overlay */}
      {isAnalyzing && (
        <div className="db-scanner-overlay">
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: "3.5rem", height: "3.5rem" }}>
            <span className="visually-hidden">Scanning...</span>
          </div>
          <h4 className="fw-bold text-dark mb-2 db-pulse">AI is deeply analyzing your marksheet...</h4>
          <p className="text-muted db-text-sm mb-4 text-center px-3" style={{ maxWidth: "450px" }}>
            {analysisStep}
          </p>
          <div className="progress w-25" style={{ height: "6px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Header and Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-ss-bright fs-3 mb-1">Academic Overview, {user?.name.split(" ")[0] || 'Aditya'}</h1>
          <p className="text-ss-muted mb-0 fs-6">Track your trajectory, credits, and career readiness.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <input
            type="file"
            id="db-marksheet-file"
            className="d-none"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileUpload}
          />
          <label htmlFor="db-marksheet-file" className="btn btn-ss-outline bg-white shadow-sm cursor-pointer mb-0">
            <i className="bi bi-cloud-upload me-2 text-primary"></i>Upload Marksheet (JPG/PNG only)
          </label>
          <Link to="/dashboard/analytics">
            <button className="btn btn-ss-primary shadow-sm"><i className="bi bi-graph-up-arrow me-2"></i>Detailed Analytics</button>
          </Link>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {uploadSuccess && (
        <div className="alert alert-success alert-dismissible fade show mb-4 rounded-3" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Success!</strong>{" "}
          {aiUsed
            ? isSem1Upload
              ? <>Your Semester 1 marksheet was <span className="badge bg-success ms-1 me-1">AI Successfully Analyzed</span> — your <strong>SGPA: {currentCgpa > 0 ? currentCgpa.toFixed(2) : "—"}</strong> has been extracted and displayed on your dashboard.</>
              : <>Your marksheet was <span className="badge bg-success ms-1 me-1">AI Successfully Analyzed</span> — semester GPA data extracted from your actual document.</>
            : <>Your marksheet was uploaded but <span className="badge bg-warning text-dark ms-1 me-1">AI could not extract grades</span> from this document. Your existing data has been preserved. Please try uploading a clearer image of your actual marksheet.</>
          }
          <button type="button" className="btn-close" onClick={() => setUploadSuccess(false)}></button>
        </div>
      )}
      {uploadError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4 rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error!</strong> {uploadError}
          <button type="button" className="btn-close" onClick={() => setUploadError(null)}></button>
        </div>
      )}

      {/* Row 1: Academic Overview (Glassmorphism Metric Cards) */}
      <div className="row g-4 mb-5">
        {/* Current CGPA / Sem-1 SGPA card */}
        <div className="col-md-3">
          <div className="glass-panel p-4 h-100 rounded-4 position-relative overflow-hidden transition hover-shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-award-fill text-primary db-icon-bg"></i>
            </div>
            <div className="text-ss-muted fw-semibold mb-2 text-uppercase db-text-xs-spacing">
              {currentSemester === 1 ? "Semester 1 SGPA" : "Current CGPA"}
            </div>
            <div className="fs-1 fw-bold text-ss-bright mb-2 d-flex align-items-center gap-2">
              {currentCgpa > 0 ? currentCgpa.toFixed(2) : "0.00"} <i className="bi bi-arrow-up-right-circle-fill text-success fs-5"></i>
            </div>
            {currentSemester === 1 ? (
              <div className="d-inline-block badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-1 db-text-xs">
                <i className="bi bi-stars me-1"></i>AI Extracted from Marksheet
              </div>
            ) : (
              <div className="d-inline-block badge bg-success-light text-success border border-success border-opacity-25 rounded-pill px-2 py-1 db-text-xs">
                Target: {targetCgpa.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Credits Earned */}
        <div className="col-md-3">
          <div className="glass-panel p-4 h-100 rounded-4 position-relative overflow-hidden transition hover-shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-journal-bookmark-fill text-primary db-icon-bg"></i>
            </div>
            <div className="text-ss-muted fw-semibold mb-2 text-uppercase db-text-xs-spacing">Credits Earned</div>
            <div className="fs-1 fw-bold text-ss-bright mb-2">
              {creditsEarned} <span className="text-muted fs-4">/ {totalCredits}</span>
            </div>
            <div className="progress mt-3 db-progress-bg">
              <div className="progress-bar bg-primary" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Academic Progress */}
        <div className="col-md-3">
          <div className="glass-panel p-4 h-100 rounded-4 d-flex align-items-center gap-4 transition hover-shadow">
            <div className="position-relative d-flex justify-content-center align-items-center db-chart-container">
              <svg viewBox="0 0 36 36" className="w-100 h-100 position-absolute top-0 start-0 db-chart-svg">
                <path className="text-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progressPercent}, 100`} />
              </svg>
              <div className="fw-bold fs-4 text-dark position-relative z-1">{Math.round(progressPercent)}%</div>
            </div>
            <div>
              <div className="text-ss-muted fw-semibold mb-1 text-uppercase db-text-xs-spacing">Degree Progress</div>
              <div className="fs-5 fw-bold text-ss-bright">On Track</div>
              <div className="text-muted db-text-xs-alt">Sem {currentSemester} of 8</div>
            </div>
          </div>
        </div>

        {/* Predicted CGPA */}
        <div className="col-md-3">
          <div className="glass-panel-accent p-4 h-100 rounded-4 position-relative overflow-hidden transition hover-shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-stars text-primary db-icon-bg"></i>
            </div>
            <div className="text-primary fw-bold mb-2 text-uppercase d-flex align-items-center gap-2 db-text-xs-spacing">
              <i className="bi bi-lightning-charge-fill"></i> Predicted CGPA
            </div>
            <div className="fs-1 fw-bold text-dark mb-2">
              {displayPredictedCgpa.toFixed(2)}
            </div>
            <div className="text-dark opacity-75 db-text-sm">
              Projected upon graduation if current trend continues.
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Interactive Analytics Hub */}
      <h4 className="fw-bold text-ss-bright mb-4">Interactive Analytics Hub</h4>
      <div className="row g-4 mb-5">

        {/* Main Graph */}
        <div className="col-lg-9">
          <div className="glass-panel p-4 h-100 rounded-4 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">
                  {currentSemester === 1
                    ? "Semester 1 SGPA Result"
                    : "Semester-wise CGPA Trend"}
                </h5>
                <div className="text-ss-muted db-text-sm">
                  {currentSemester === 1
                    ? "Your Semester 1 grade as extracted from your marksheet by AI."
                    : "Your academic performance across completed semesters."}
                </div>
              </div>
              <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 fw-medium">
                {currentSemester === 1 ? `SGPA: ${currentCgpa > 0 ? currentCgpa.toFixed(2) : "—"}` : (hasRealData ? `Overall Average: ${displayAverageCgpa.toFixed(2)}` : "No data yet")}
              </div>
            </div>

            <div className="w-100 position-relative mt-4 db-chart-area-container">

              {points.length > 0 ? (
                <>
                  {/* Y-Axis Labels */}
                  <div className="position-absolute h-100 d-flex flex-column justify-content-between text-muted db-chart-y-axis">
                    <span>10.0</span>
                    <span>9.0</span>
                    <span>8.0</span>
                    <span>7.0</span>
                  </div>

                  {/* Chart Area */}
                  <div className="position-absolute h-100 border-start border-bottom db-chart-main-area">

                    {/* Grid Lines */}
                    <div className="w-100 border-top position-absolute db-chart-grid-1"></div>
                    <div className="w-100 border-top position-absolute db-chart-grid-2"></div>

                    {/* SVG Line Chart (Circle Dot Points connected with straight lines) */}
                    <svg viewBox="0 0 1000 270" width="100%" height="100%" preserveAspectRatio="none" className="position-absolute top-0 start-0 overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(14, 165, 233, 0.4)" />
                          <stop offset="100%" stopColor="rgba(14, 165, 233, 0.0)" />
                        </linearGradient>
                      </defs>

                      {/* Fill area under the straight lines */}
                      {points.length > 0 && (
                        <path
                          d={`M ${points[0].x},270 ` + points.map((p: any) => `L ${p.x},${p.y}`).join(" ") + ` L ${points[points.length - 1].x},270 Z`}
                          fill="url(#chartGradient)"
                        />
                      )}

                      {/* Straight lines connecting points */}
                      {points.length > 0 && (
                        <polyline
                          fill="none"
                          stroke="var(--ss-primary)"
                          strokeWidth="4"
                          points={points.map((p: any) => `${p.x},${p.y}`).join(" ")}
                        />
                      )}

                      {/* Circle dot points representing CGPA with values above */}
                      {points.map((p: any, idx: number) => (
                        <g key={idx}>
                          {/* Outer shadow circle */}
                          <circle cx={p.x} cy={p.y} r="8" fill="rgba(37, 99, 235, 0.2)" />
                          {/* Inner circle dot */}
                          <circle cx={p.x} cy={p.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          {/* CGPA Text value label */}
                          <text
                            x={p.x}
                            y={p.y - 12}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="#0f172a"
                          >
                            {p.gpa.toFixed(2)}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className="position-absolute w-100 d-flex justify-content-between text-muted mt-2 db-chart-x-axis">
                      {finalGraphData.map((data: any, i: number) => (
                        <span key={i} className={i === finalGraphData.length - 1 ? "text-primary fw-bold" : ""}>
                          Sem {data.semNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state — no real semester data yet */
                <div className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: "220px" }}>
                  <i className="bi bi-graph-up text-primary opacity-25" style={{ fontSize: "3rem" }}></i>
                  <h6 className="fw-bold text-dark mt-3 mb-1">No Semester Data Yet</h6>
                  <p className="text-muted mb-0" style={{ maxWidth: "360px" }}>
                    Upload your marksheets from the <strong>Profile</strong> page or use the <strong>Upload Marksheet</strong> button above. AI will extract your real semester GPAs and plot them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Analytics Panel */}
        <div className="col-lg-3">
          <div className="d-flex flex-column gap-4 h-100">

            {/* Highest CGPA */}
            <div className="glass-panel p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center transition hover-shadow">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                  <i className="bi bi-trophy-fill fs-5"></i>
                </div>
                <div>
                  <div className="text-ss-muted fw-semibold text-uppercase db-text-xxs-spacing">Highest CGPA</div>
                  <div className="fw-bold fs-4 text-dark">{hasRealData ? displayHighestCgpa.toFixed(2) : "—"}</div>
                </div>
              </div>
              <div className="text-muted ms-5 ps-1 db-text-xs-alt">
                {hasRealData ? `Achieved in Semester ${highestSemesterNumber}` : "Upload marksheets to see"}
              </div>
            </div>

            {/* Average CGPA */}
            <div className="glass-panel p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center transition hover-shadow">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                  <i className="bi bi-calculator-fill fs-5"></i>
                </div>
                <div>
                  <div className="text-ss-muted fw-semibold text-uppercase db-text-xxs-spacing">Average CGPA</div>
                  <div className="fw-bold fs-4 text-dark">{hasRealData ? displayAverageCgpa.toFixed(2) : "—"}</div>
                </div>
              </div>
              <div className="text-muted ms-5 ps-1 db-text-xs-alt">{hasRealData ? `Across ${validSemesterGpas.length} semester${validSemesterGpas.length !== 1 ? 's' : ''}` : "No data yet"}</div>
            </div>

            {/* Improvement Rate */}
            <div className="glass-panel p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center transition hover-shadow">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className={`${improvementRateIconClass.replace('text', 'bg-opacity-10 text')} rounded-circle d-flex align-items-center justify-content-center db-icon-sm`}>
                  <i className={`bi ${improvementRateIcon} fs-5`}></i>
                </div>
                <div>
                  <div className="text-ss-muted fw-semibold text-uppercase db-text-xxs-spacing">Improvement Rate</div>
                  <div className={`fw-bold fs-4 ${improvementRateClass}`}>{displayImprovementRate}</div>
                </div>
              </div>
              <div className="text-muted ms-5 ps-1 db-text-xs-alt">Semester-over-semester</div>
            </div>

          </div>
        </div>
      </div>

      {/* Row 3: Weekly Schedule */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h4 className="fw-bold text-ss-bright mb-0">My Weekly Schedule</h4>
      </div>
      <div className="card border shadow-sm rounded-4 p-4 mb-5">
        {schedule.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Course Name</th>
                    <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Day</th>
                    <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Time</th>
                    <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((cls, idx) => (
                    <tr key={idx} className="border-bottom">
                      <td className="fw-bold text-dark py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                            <i className="bi bi-book"></i>
                          </div>
                          {cls.courseName}
                        </div>
                      </td>
                      <td className="text-secondary fw-medium py-3">{cls.dayOfWeek}</td>
                      <td className="text-secondary py-3">
                        <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-medium">
                          {cls.startTime} - {cls.endTime}
                        </span>
                      </td>
                      <td className="text-secondary py-3">{cls.location || "TBA"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button
                id="btn-add-schedule-trigger"
                className="db-add-schedule-btn"
                onClick={() => setShowAddScheduleModal(true)}
                title="Add Class to Schedule"
              >
                <i className="bi bi-plus-lg fs-4"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="text-muted mb-3"><i className="bi bi-calendar-x fs-1"></i></div>
            <h6 className="fw-bold text-dark">No classes scheduled</h6>
            <p className="text-secondary db-text-base mb-4">Update your profile to add classes to your timetable.</p>
            <button
              id="btn-add-schedule-trigger"
              className="db-add-schedule-btn mx-auto"
              onClick={() => setShowAddScheduleModal(true)}
              title="Add Class to Schedule"
            >
              <i className="bi bi-plus-lg fs-4"></i>
            </button>
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold text-ss-bright fs-5">Add New Class Schedule</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddScheduleModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleAddScheduleSubmit}>
                <div className="modal-body py-3 px-4">
                  {formError && (
                    <div className="alert alert-danger py-2 mb-3 small">{formError}</div>
                  )}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small mb-1">Course Name</label>
                    <input
                      type="text"
                      id="input-course-name"
                      className="form-control rounded-3"
                      placeholder="e.g. Operating Systems"
                      value={newCourseName}
                      onChange={e => setNewCourseName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-secondary small mb-1">Weekday</label>
                      <select
                        id="select-weekday"
                        className="form-select rounded-3"
                        value={newDayOfWeek}
                        onChange={e => setNewDayOfWeek(e.target.value)}
                        required
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-secondary small mb-1">Location</label>
                      <input
                        type="text"
                        id="input-location"
                        className="form-control rounded-3"
                        placeholder="e.g. Room 402"
                        value={newLocation}
                        onChange={e => setNewLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-secondary small mb-1">Start Time</label>
                      <input
                        type="text"
                        id="input-start-time"
                        className="form-control rounded-3"
                        placeholder="e.g. 09:00 AM"
                        value={newStartTime}
                        onChange={e => setNewStartTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-secondary small mb-1">End Time</label>
                      <input
                        type="text"
                        id="input-end-time"
                        className="form-control rounded-3"
                        placeholder="e.g. 10:00 AM"
                        value={newEndTime}
                        onChange={e => setNewEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pb-4 px-4 gap-2 pt-0">
                  <button type="button" className="btn btn-ss-outline px-4 rounded-pill" onClick={() => setShowAddScheduleModal(false)}>Cancel</button>
                  <button type="submit" id="btn-submit-schedule" className="btn btn-ss-primary px-4 rounded-pill">Add Class</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
