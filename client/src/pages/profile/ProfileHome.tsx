import React, { useState, useEffect } from "react";
import "./ProfileHome.css";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, saveProfile } from "../../services/profileService";

const ProfileHome: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    semester: "",
    targetCgpa: "",
    category: "",
    income: "",
    interests: "",
    marksheets: {} as Record<number, File | { name: string, url: string } | null>,
  });

  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          const fetchedMarksheets: Record<number, { name: string, url: string }> = {};
          if (data.documents?.marksheets) {
            Object.keys(data.documents.marksheets).forEach(sem => {
              const url = data.documents.marksheets[sem];
              let fileName = `Semester ${sem} Marksheet`;
              if (url) {
                const parts = url.split('/');
                const lastPart = parts[parts.length - 1];
                if (lastPart) {
                  fileName = decodeURIComponent(lastPart);
                }
              }
              fetchedMarksheets[Number(sem)] = { name: fileName, url };
            });
          }

          setFormData({
            semester: data.academicProfile?.currentSemester?.toString() || "",
            targetCgpa: data.academicProfile?.targetCgpa?.toString() || "",
            category: data.profileDetails?.category || "",
            income: data.profileDetails?.income || "",
            interests: data.profileDetails?.interests || "",
            marksheets: fetchedMarksheets,
          });
          if (data.profilePicture) {
            setProfilePicPreview(data.profilePicture);
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    let score = 50; // Base 50% for Name, Email and Implicit CGPA
    if (formData.category) score += 15;
    if (formData.income) score += 10;
    if (formData.interests) score += 10;

    const currentSemester = parseInt(formData.semester) || 0;
    const numMarksheetsRequired = Math.max(0, currentSemester - 1);
    let uploadedMarksheets = 0;
    for (let i = 1; i <= numMarksheetsRequired; i++) {
      if (formData.marksheets[i]) uploadedMarksheets++;
    }

    if (currentSemester === 1) {
      score += 15;
    } else if (numMarksheetsRequired > 0 && uploadedMarksheets === numMarksheetsRequired) {
      score += 15;
    } else if (numMarksheetsRequired > 0 && uploadedMarksheets > 0) {
      score += Math.floor(15 * (uploadedMarksheets / numMarksheetsRequired));
    }

    setProgress(score);
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleMarksheetChange = (e: React.ChangeEvent<HTMLInputElement>, semIndex: number) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        marksheets: { ...formData.marksheets, [semIndex]: e.target.files[0] }
      });
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getMissingFieldsText = () => {
    const missing = [];
    if (!formData.category) missing.push("Category");

    const currentSemester = parseInt(formData.semester) || 0;
    const numMarksheetsRequired = Math.max(0, currentSemester - 1);
    let uploadedMarksheets = 0;
    for (let i = 1; i <= numMarksheetsRequired; i++) {
      if (formData.marksheets[i]) uploadedMarksheets++;
    }

    if (currentSemester > 1 && uploadedMarksheets < numMarksheetsRequired) missing.push("All Previous Marksheets");
    else if (currentSemester === 0) missing.push("Marksheets");

    if (missing.length === 0) return "Your profile is 100% complete! Outstanding!";
    return `Add your ${missing[0]} to increase your profile strength.`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      if (formData.semester) data.append("currentSemester", formData.semester);
      if (formData.targetCgpa) data.append("targetCgpa", formData.targetCgpa);
      if (formData.category) data.append("category", formData.category);
      if (formData.income) data.append("income", formData.income);
      if (formData.interests) data.append("interests", formData.interests);

      Object.keys(formData.marksheets).forEach(sem => {
        const file = formData.marksheets[Number(sem)];
        if (file instanceof File) {
          data.append(`marksheet_${sem}`, file);
        }
      });

      if (profilePicFile) {
        data.append("profilePicture", profilePicFile);
      }

      const response = await saveProfile(data);
      if (response && response.user) {
        updateUser(response.user);
      }
      alert("Profile data saved successfully!");
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Error saving profile data.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="position-relative">
            <img
              src={profilePicPreview || user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&rounded=true&size=100`}
              alt="Profile"
              className="shadow-sm border border-3 border-white rounded-circle mb-2 ph-profile-pic"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </div>
          <button
            className="btn btn-sm btn-outline-primary rounded-pill fw-medium text-nowrap mt-1 ph-text-xs"
            onClick={() => document.getElementById('profilePicUpload')?.click()}
          >
            <i className="bi bi-camera"></i> Add Profile Picture
          </button>
          <input
            type="file"
            id="profilePicUpload"
            className="d-none"
            accept=".jpg,.jpeg,.png"
            onChange={handleProfilePicChange}
          />
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
                <label className="form-label text-dark fw-semibold ph-text-sm">Current Semester <span className="text-danger">*</span></label>
                <select
                  className="form-select auth-input border-0 shadow-sm"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  <option value="">Select Semester...</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold ph-text-sm">Target CGPA <span className="text-danger">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="10.0"
                  className="form-control auth-input border-0 shadow-sm"
                  placeholder="e.g., 9.0"
                  value={formData.targetCgpa}
                  onChange={(e) => setFormData({ ...formData, targetCgpa: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold ph-text-sm">Category <span className="text-danger">*</span></label>
                <select
                  className="form-select auth-input border-0 shadow-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
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

            {/* Marksheet Uploads */}
            <div className="mb-4">
              <label className="form-label text-dark fw-bold mb-2 d-flex justify-content-between">
                <span>Previous Semester Marksheets <span className="text-danger">*</span></span>
              </label>

              {parseInt(formData.semester) > 1 ? (
                Array.from({ length: parseInt(formData.semester) - 1 }, (_, i) => i + 1).map((sem) => (
                  <div key={sem} className="mb-3">
                    <label className="form-label text-muted fw-semibold ph-text-sm d-flex justify-content-between">
                      <span>Semester {sem} Marksheet</span>
                      {formData.marksheets[sem] && <i className="bi bi-check-circle-fill text-success"></i>}
                    </label>
                    <div className={`border border-2 border-dashed rounded-4 p-3 text-center cursor-pointer transition hover-shadow bg-white ${formData.marksheets[sem] ? 'border-success' : 'border-primary border-opacity-50'}`} onClick={() => document.getElementById(`marksheetUpload${sem}`)?.click()}>
                      <input
                        type="file"
                        id={`marksheetUpload${sem}`}
                        className="d-none"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleMarksheetChange(e, sem)}
                      />
                      <i className={`bi ${formData.marksheets[sem] ? 'bi-file-earmark-check text-success' : 'bi-cloud-arrow-up text-primary'} fs-3 mb-1`}></i>
                      <h6 className="fw-bold text-dark mb-1 fs-6">{formData.marksheets[sem] ? formData.marksheets[sem]?.name : `Upload Sem ${sem} Marksheet`}</h6>
                      {!formData.marksheets[sem] && <p className="text-muted mb-0 ph-text-xxs"> JPG, PNG (Max 5MB)</p>}
                    </div>
                  </div>
                ))
              ) : parseInt(formData.semester) === 1 ? (
                <div className="alert alert-success text-center py-2 ph-text-sm">
                  No marksheets required for first semester.
                </div>
              ) : (
                <div className="alert alert-info text-center py-2 ph-text-sm">
                  Please enter your current semester to upload marksheets.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHome;
