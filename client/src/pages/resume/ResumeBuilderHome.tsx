import React, { useState } from "react";
import "./ResumeBuilderHome.css";
import ATSResumeTemplate, { ResumeData } from "../../components/ATSResumeTemplate";
import api from "../../services/api";

const ResumeBuilderHome: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFresher, setIsFresher] = useState(false);

  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: ""
  });

  const [education, setEducation] = useState([
    { institution: "", degree: "", startDate: "", endDate: "", score: "" }
  ]);

  const [experience, setExperience] = useState([
    { jobTitle: "", company: "", startDate: "", endDate: "", description: "" }
  ]);

  const [projects, setProjects] = useState([
    { title: "", technologies: "", description: "" }
  ]);

  const [skills, setSkills] = useState({
    languages: "",
    frameworks: "",
    tools: "",
    softSkills: ""
  });

  // Dynamic Handlers
  const handleAddEducation = () => setEducation([...education, { institution: "", degree: "", startDate: "", endDate: "", score: "" }]);
  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setEducation(newEdu);
  };

  const handleAddExperience = () => setExperience([...experience, { jobTitle: "", company: "", startDate: "", endDate: "", description: "" }]);
  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExp = [...experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setExperience(newExp);
  };

  const handleAddProject = () => setProjects([...projects, { title: "", technologies: "", description: "" }]);
  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProj = [...projects];
    newProj[index] = { ...newProj[index], [field]: value };
    setProjects(newProj);
  };

  const enhanceWithAI = async (text: string, type: 'experience' | 'project') => {
    try {
      const prompt = `Rewrite the following ${type} description as professional resume bullet points using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]). Keep it concise, ATS-friendly, and use strong action verbs. Do not include any conversational text, just the bullet points starting with bullet characters or hyphens.\n\nOriginal Text:\n${text}`;
      const response = await api.post('/ai/chat', { prompt, mode: 'default' });
      // The API response structure depends on the backend, typically response.data.text or response.data.response
      const enhancedText = response.data.response || response.data.text || response.data;
      return enhancedText.trim();
    } catch (error) {
      console.error("Failed to enhance text with AI", error);
      return text;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // AI Enhancement Step
      if (!isFresher) {
        const enhancedExperience = await Promise.all(
          experience.map(async (exp) => {
            if (exp.description) {
              const enhanced = await enhanceWithAI(exp.description, 'experience');
              return { ...exp, description: enhanced };
            }
            return exp;
          })
        );
        setExperience(enhancedExperience);
      }

      const enhancedProjects = await Promise.all(
        projects.map(async (proj) => {
          if (proj.description) {
            const enhanced = await enhanceWithAI(proj.description, 'project');
            return { ...proj, description: enhanced };
          }
          return proj;
        })
      );
      setProjects(enhancedProjects);

      setIsPreviewMode(true);
    } catch (error) {
      alert("Something went wrong while drafting the resume.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resumeData: ResumeData = {
    personalInfo,
    education,
    experience,
    projects,
    skills,
    isFresher
  };

  if (isPreviewMode) {
    return (
      <div className="resume-preview-wrapper pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4 no-print">
          <div>
            <h1 className="fw-bold text-ss-bright fs-3 mb-1">Preview Your Resume</h1>
            <p className="text-ss-muted mb-0 fs-6">Review your ATS-friendly resume before downloading.</p>
          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-ss-outline bg-white px-4 py-2" onClick={() => setIsPreviewMode(false)}>
              <i className="bi bi-pencil me-2"></i> Edit
            </button>
            <button className="btn btn-ss-primary px-4 py-2" onClick={handlePrint}>
              <i className="bi bi-file-earmark-pdf me-2"></i> Download PDF
            </button>
          </div>
        </div>
        <div className="resume-paper-container shadow-lg bg-white">
          <ATSResumeTemplate data={resumeData} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in pb-5 resume-builder-form-container">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-ss-bright fs-3 mb-1">AI Resume Builder</h1>
          <p className="text-ss-muted mb-0 fs-6">Enter your details. We'll use AI to enhance your bullet points and generate an ATS-friendly resume.</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="form-check form-switch fs-5">
            <input 
              className="form-check-input shadow-sm" 
              type="checkbox" 
              id="fresherSwitch" 
              checked={isFresher}
              onChange={(e) => setIsFresher(e.target.checked)}
            />
            <label className="form-check-label ms-2 text-dark fw-medium fs-6" htmlFor="fresherSwitch">
              I am a Fresher (No Work Experience)
            </label>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <form onSubmit={handleSubmit}>
            {/* 1. Personal Details */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                  <i className="bi bi-person-badge fs-5"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Personal Information</h5>
                  <span className="text-muted rb-text-sm">Basic details for recruiters to contact you.</span>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Full Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Aditya Sharma" required value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Email Address <span className="text-danger">*</span></label>
                  <input type="email" className="form-control auth-input bg-light border-0" placeholder="e.g., aditya@example.com" required value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Phone Number <span className="text-danger">*</span></label>
                  <input type="tel" className="form-control auth-input bg-light border-0" placeholder="e.g., +91 98765 43210" required value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Location (City, Country)</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., New Delhi, India" value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Professional Summary</label>
                  <textarea className="form-control auth-input bg-light border-0" rows={3} placeholder="A brief summary of your background, skills, and career goals..." value={personalInfo.summary} onChange={e => setPersonalInfo({...personalInfo, summary: e.target.value})}></textarea>
                </div>
              </div>
            </div>

            {/* 2. Education */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                    <i className="bi bi-mortarboard fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">Education</h5>
                    <span className="text-muted rb-text-sm">Your academic background and achievements.</span>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-light border fw-medium text-muted rounded-pill px-3" onClick={handleAddEducation}>
                  <i className="bi bi-plus"></i> Add
                </button>
              </div>

              {education.map((edu, index) => (
                <div key={index} className="border border-dashed rounded-4 p-4 bg-light bg-opacity-50 position-relative mb-3">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold rb-text-sm">Institution / University <span className="text-danger">*</span></label>
                      <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., IIT Delhi" required value={edu.institution} onChange={e => handleEducationChange(index, 'institution', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold rb-text-sm">Degree / Program <span className="text-danger">*</span></label>
                      <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., B.Tech Computer Science" required value={edu.degree} onChange={e => handleEducationChange(index, 'degree', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted fw-semibold rb-text-sm">Start Date</label>
                      <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" value={edu.startDate} onChange={e => handleEducationChange(index, 'startDate', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted fw-semibold rb-text-sm">End Date / Expected</label>
                      <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" value={edu.endDate} onChange={e => handleEducationChange(index, 'endDate', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted fw-semibold rb-text-sm">CGPA / Score</label>
                      <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., 8.9/10" value={edu.score} onChange={e => handleEducationChange(index, 'score', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Work Experience */}
            {!isFresher && (
              <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                      <i className="bi bi-briefcase fs-5"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">Work Experience</h5>
                      <span className="text-muted rb-text-sm">Internships, part-time, or full-time roles.</span>
                    </div>
                  </div>
                  <button type="button" className="btn btn-sm btn-light border fw-medium text-muted rounded-pill px-3" onClick={handleAddExperience}>
                    <i className="bi bi-plus"></i> Add
                  </button>
                </div>

                {experience.map((exp, index) => (
                  <div key={index} className="border border-dashed rounded-4 p-4 bg-light bg-opacity-50 position-relative mb-3">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted fw-semibold rb-text-sm">Job Title <span className="text-danger">*</span></label>
                        <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., Software Engineering Intern" required value={exp.jobTitle} onChange={e => handleExperienceChange(index, 'jobTitle', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted fw-semibold rb-text-sm">Company / Organization <span className="text-danger">*</span></label>
                        <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., Google" required value={exp.company} onChange={e => handleExperienceChange(index, 'company', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted fw-semibold rb-text-sm">Start Date</label>
                        <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" value={exp.startDate} onChange={e => handleExperienceChange(index, 'startDate', e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted fw-semibold rb-text-sm">End Date (Leave blank if present)</label>
                        <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" value={exp.endDate} onChange={e => handleExperienceChange(index, 'endDate', e.target.value)} />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted fw-semibold d-flex justify-content-between align-items-center rb-text-sm">
                          <span>Key Accomplishments & Responsibilities</span>
                          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill"><i className="bi bi-stars"></i> AI Enhanced</span>
                        </label>
                        <textarea className="form-control auth-input bg-white border-0 shadow-sm" rows={4} placeholder="Describe what you did... AI will convert this to XYZ format." value={exp.description} onChange={e => handleExperienceChange(index, 'description', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Projects */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                    <i className="bi bi-laptop fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">Key Projects</h5>
                    <span className="text-muted rb-text-sm">Showcase your practical applications and side projects.</span>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-light border fw-medium text-muted rounded-pill px-3" onClick={handleAddProject}>
                  <i className="bi bi-plus"></i> Add
                </button>
              </div>

              {projects.map((proj, index) => (
                <div key={index} className="border border-dashed rounded-4 p-4 bg-light bg-opacity-50 position-relative mb-3">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold rb-text-sm">Project Title <span className="text-danger">*</span></label>
                      <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., E-Learning Dashboard" required value={proj.title} onChange={e => handleProjectChange(index, 'title', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold rb-text-sm">Technologies / Stack</label>
                      <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., React, Node.js, MongoDB" value={proj.technologies} onChange={e => handleProjectChange(index, 'technologies', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold d-flex justify-content-between align-items-center rb-text-sm">
                        <span>Description & Impact</span>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill"><i className="bi bi-stars"></i> AI Enhanced</span>
                      </label>
                      <textarea className="form-control auth-input bg-white border-0 shadow-sm" rows={3} placeholder="Describe what you built... AI will convert this to XYZ format." value={proj.description} onChange={e => handleProjectChange(index, 'description', e.target.value)}></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Skills */}
            <div className="glass-panel p-4 rounded-4 mb-5 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                  <i className="bi bi-tools fs-5"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Technical Skills</h5>
                  <span className="text-muted rb-text-sm">List your core technical proficiencies.</span>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Programming Languages</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Java, Python, C++" value={skills.languages} onChange={e => setSkills({...skills, languages: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Frameworks & Libraries</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., React, Spring Boot, Express" value={skills.frameworks} onChange={e => setSkills({...skills, frameworks: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Tools & Platforms</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Git, Docker, AWS" value={skills.tools} onChange={e => setSkills({...skills, tools: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Soft Skills</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Leadership, Agile, Communication" value={skills.softSkills} onChange={e => setSkills({...skills, softSkills: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="d-flex justify-content-end gap-3 mb-5">
              <button type="submit" className="btn btn-ss-primary px-5 py-2 fs-6 shadow-sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Generating & Enhancing...</>
                ) : (
                  <>Draft & Enhance my resume <i className="bi bi-stars ms-2"></i></>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderHome;
