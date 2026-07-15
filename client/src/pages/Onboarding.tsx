import React, { useState } from "react";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Step 1 State
  const [currentCgpa, setCurrentCgpa] = useState("");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [totalCredits, setTotalCredits] = useState("");
  const [creditsEarned, setCreditsEarned] = useState("");
  const [currentSemester, setCurrentSemester] = useState("1");

  // Step 2 State
  const [classes, setClasses] = useState([
    { courseName: "", dayOfWeek: "Monday", startTime: "09:00", endTime: "10:30", location: "" }
  ]);

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Final Submit
      try {
        // Save Profile
        const response = await api.put("/profile/setup", {
          currentCgpa,
          targetCgpa,
          creditsEarned,
          totalCredits,
          currentSemester
        });

        // Filter empty classes
        const validClasses = classes.filter(c => c.courseName.trim() !== "");

        // Save Schedule
        if (validClasses.length > 0) {
          await api.post("/schedule/save", { classes: validClasses });
        }

        // Update auth state (trigger re-fetch of user to get isProfileComplete)
        if (response.data && response.data.user) {
          updateUser(response.data.user);
        } else if (user) {
          updateUser({ ...user, isProfileComplete: true });
        }

        navigate("/dashboard"); 
      } catch (error) {
        console.error("Failed to complete onboarding", error);
        alert("An error occurred during setup. Please try again.");
      }
    }
  };

  const addClass = () => {
    setClasses([...classes, { courseName: "", dayOfWeek: "Monday", startTime: "09:00", endTime: "10:30", location: "" }]);
  };

  const updateClass = (index: number, field: string, value: string) => {
    const newClasses = [...classes];
    newClasses[index] = { ...newClasses[index], [field]: value };
    setClasses(newClasses);
  };

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index));
  };

  return (
    <div className="auth-page fade-in ob-page-layout">
      <div className="auth-card ob-card-container">
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 ob-icon-wrapper">
            <i className="bi bi-rocket-takeoff fs-2"></i>
          </div>
          <h2 className="fw-bold text-dark mb-2">Welcome to Shiksha Setu!</h2>
          <p className="text-secondary">Let's set up your academic profile to personalize your dashboard.</p>
          
          <div className="d-flex justify-content-center gap-2 mt-4">
            <div className={`rounded-pill ${step === 1 ? 'bg-primary' : 'bg-success'} ob-progress-step`}></div>
            <div className={`rounded-pill ${step === 2 ? 'bg-primary' : 'bg-light'} ob-progress-step`}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="fade-in">
            <h5 className="fw-bold mb-3">Academic Details</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-secondary ob-text-sm">Current CGPA</label>
                <input type="number" step="0.01" className="form-control auth-input" placeholder="e.g. 8.45" value={currentCgpa} onChange={e => setCurrentCgpa(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary ob-text-sm">Target CGPA</label>
                <input type="number" step="0.01" className="form-control auth-input" placeholder="e.g. 9.00" value={targetCgpa} onChange={e => setTargetCgpa(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary ob-text-sm">Credits Earned</label>
                <input type="number" className="form-control auth-input" placeholder="e.g. 45" value={creditsEarned} onChange={e => setCreditsEarned(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary ob-text-sm">Total Degree Credits</label>
                <input type="number" className="form-control auth-input" placeholder="e.g. 160" value={totalCredits} onChange={e => setTotalCredits(e.target.value)} required />
              </div>
              <div className="col-md-12">
                <label className="form-label text-secondary ob-text-sm">Current Semester</label>
                <select className="form-select auth-input" value={currentSemester} onChange={e => setCurrentSemester(e.target.value)}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h5 className="fw-bold mb-3">Weekly Timetable</h5>
            <p className="text-secondary ob-text-sm">Add your current semester classes.</p>
            
            {classes.map((cls, index) => (
              <div key={index} className="d-flex flex-column flex-md-row gap-2 mb-2 align-items-md-center bg-light p-2 rounded-3 border">
                <input type="text" className="form-control form-control-sm border-0 w-100" placeholder="Course Name" value={cls.courseName} onChange={e => updateClass(index, 'courseName', e.target.value)} />
                <select className="form-select form-select-sm border-0 ob-day-select w-100" value={cls.dayOfWeek} onChange={e => updateClass(index, 'dayOfWeek', e.target.value)}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="d-flex gap-2 w-100">
                  <input type="time" className="form-control form-control-sm border-0 w-100" value={cls.startTime} onChange={e => updateClass(index, 'startTime', e.target.value)} />
                  <input type="time" className="form-control form-control-sm border-0 w-100" value={cls.endTime} onChange={e => updateClass(index, 'endTime', e.target.value)} />
                </div>
                <button className="btn btn-sm text-danger w-100 mt-2 mt-md-0" onClick={() => removeClass(index)}><i className="bi bi-x-circle-fill"></i> Remove</button>
              </div>
            ))}
            
            <button className="btn btn-sm btn-outline-primary mt-2 rounded-pill" onClick={addClass}><i className="bi bi-plus"></i> Add Class</button>
          </div>
        )}

        <div className="mt-5 d-flex justify-content-between">
          {step > 1 ? (
            <button className="btn btn-light border" onClick={() => setStep(step - 1)}>Back</button>
          ) : <div></div>}
          <button className="btn btn-primary px-4" onClick={handleNext}>
            {step === 1 ? "Next: Schedule" : "Complete Setup"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
