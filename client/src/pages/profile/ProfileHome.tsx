import React, { useState, useEffect } from "react";
import "./ProfileHome.css";
import { useAuth } from "../../hooks/useAuth";

const ProfileHome: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    cgpa: "",
    category: "",
    income: "",
    interests: "",
    marksheet: null as File | null,
    timetable: null as File | null,
  });

  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let score = 20; // Base 20% for Name and Email
    if (formData.cgpa) score += 15;
    if (formData.category) score += 15;
    if (formData.income) score += 10;
    if (formData.interests) score += 10;
    if (formData.marksheet) score += 15;
    if (formData.timetable) score += 15;
    setProgress(score);
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const getMissingFieldsText = () => {
    const missing = [];
    if (!formData.cgpa) missing.push("CGPA");
    if (!formData.category) missing.push("Category");
    if (!formData.marksheet) missing.push("Marksheet");
    if (!formData.timetable) missing.push("Class Timetable");

    if (missing.length === 0) return "Your profile is 100% complete! Outstanding!";
    return `Add your ${missing[0]} to increase your profile strength.`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Profile data saved successfully!");
    }, 1200);
  };

  return (
    <div className="fade-in pb-5">
      {/* Header & Completion Bar */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="fw-bold text-ss-bright fs-3 mb-1">My Profile</h1>
          <p className="text-ss-muted mb-0 fs-6">Manage your academic details and documents.</p>
        </div>
        <button onClick={handleSave} className="btn btn-ss-primary px-4 shadow-sm d-flex align-items-center gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...</>
          ) : (
            <><i className="bi bi-floppy"></i> Save Profile</>
          )}
        </button>
      </div>

      <div className="glass-panel p-4 rounded-4 mb-5 shadow-sm d-flex flex-column flex-md-row align-items-center gap-4">
        
        {/* Profile Picture Section */}
        <div className="d-flex flex-column align-items-center">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&rounded=true&size=100`} 
            alt="Profile" 
            className="shadow-sm border border-3 border-white rounded-circle mb-2 ph-profile-pic"
          />
          <button className="btn btn-sm btn-outline-primary rounded-pill fw-medium text-nowrap mt-1 ph-text-xs">
            <i className="bi bi-camera"></i> Add Profile Picture
          </button>
        </div>

        {/* Profile Strength Section */}
        <div className="flex-grow-1 w-100 border-start ps-md-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-success"></i> Profile Strength
            </h5>
            <span className="text-primary fw-bold fs-5">{progress}%</span>
          </div>
          <div className="progress mb-3 bg-light ph-progress-container">
            <div 
              className="progress-bar bg-success rounded-pill transition ph-progress-bar" style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-muted mb-0 fs-6 ph-text-sm">
            {getMissingFieldsText()}
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Section A: Personal & Academic Details */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 rounded-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2 border-bottom pb-3">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center ph-icon-wrapper">
                <i className="bi bi-person"></i>
              </div>
              Basic Details
            </h5>

            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold ph-text-sm">Full Name</label>
                <input type="text" className="form-control auth-input bg-light border-0" value={user?.name || "Student Name"} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold ph-text-sm">Email Address</label>
                <input type="email" className="form-control auth-input bg-light border-0" value={user?.email || "student@example.com"} readOnly />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold ph-text-sm">Current CGPA <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10" 
                  className="form-control auth-input border-0 shadow-sm" 
                  placeholder="e.g., 8.5" 
                  value={formData.cgpa}
                  onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold ph-text-sm">Category <span className="text-danger">*</span></label>
                <select 
                  className="form-select auth-input border-0 shadow-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold ph-text-sm">Annual Family Income</label>
                <select 
                  className="form-select auth-input border-0 shadow-sm"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                >
                  <option value="">Select Income Bracket...</option>
                  <option value="< 1 Lakh">Less than ₹1 Lakh</option>
                  <option value="1-3 Lakhs">₹1 Lakh - ₹3 Lakhs</option>
                  <option value="3-5 Lakhs">₹3 Lakhs - ₹5 Lakhs</option>
                  <option value="> 5 Lakhs">More than ₹5 Lakhs</option>
                </select>
                <div className="form-text mt-1 ph-text-xxs">Required for scholarship eligibility mapping.</div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold ph-text-sm">Areas of Interest</label>
                <input 
                  type="text" 
                  className="form-control auth-input border-0 shadow-sm" 
                  placeholder="e.g., Machine Learning, Web Dev" 
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Document Uploads */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 rounded-4 shadow-sm h-100 bg-ss-primary bg-opacity-10 border border-primary border-opacity-25">
            <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2 border-bottom border-primary border-opacity-25 pb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center ph-icon-wrapper">
                <i className="bi bi-file-earmark-arrow-up"></i>
              </div>
              Required Documents
            </h5>

            {/* Marksheet Upload */}
            <div className="mb-4">
              <label className="form-label text-dark fw-bold mb-2 d-flex justify-content-between">
                <span>Current Semester Marksheet <span className="text-danger">*</span></span>
                {formData.marksheet && <i className="bi bi-check-circle-fill text-success"></i>}
              </label>
              <div className={`border border-2 border-dashed rounded-4 p-4 text-center cursor-pointer transition hover-shadow bg-white ${formData.marksheet ? 'border-success' : 'border-primary border-opacity-50'}`} onClick={() => document.getElementById('marksheetUpload')?.click()}>
                <input 
                  type="file" 
                  id="marksheetUpload" 
                  className="d-none" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={(e) => handleFileChange(e, "marksheet")} 
                />
                <i className={`bi ${formData.marksheet ? 'bi-file-earmark-check text-success' : 'bi-cloud-arrow-up text-primary'} fs-1 mb-2`}></i>
                <h6 className="fw-bold text-dark">{formData.marksheet ? formData.marksheet.name : 'Click to upload marksheet'}</h6>
                <p className="text-muted mb-0 ph-text-xs">PDF, JPG, or PNG (Max 5MB)</p>
              </div>
            </div>

            {/* Timetable Upload */}
            <div className="mb-2">
              <label className="form-label text-dark fw-bold mb-2 d-flex justify-content-between">
                <span>Class Timetable <span className="text-danger">*</span></span>
                {formData.timetable && <i className="bi bi-check-circle-fill text-success"></i>}
              </label>
              <div className={`border border-2 border-dashed rounded-4 p-4 text-center cursor-pointer transition hover-shadow bg-white ${formData.timetable ? 'border-success' : 'border-primary border-opacity-50'}`} onClick={() => document.getElementById('timetableUpload')?.click()}>
                <input 
                  type="file" 
                  id="timetableUpload" 
                  className="d-none" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={(e) => handleFileChange(e, "timetable")} 
                />
                <i className={`bi ${formData.timetable ? 'bi-calendar-check text-success' : 'bi-calendar-plus text-primary'} fs-1 mb-2`}></i>
                <h6 className="fw-bold text-dark">{formData.timetable ? formData.timetable.name : 'Click to upload timetable'}</h6>
                <p className="text-muted mb-0 ph-text-xs">Helps us notify you about upcoming classes</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHome;
