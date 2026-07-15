import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import CertificateViewerModal from "../../components/CertificateViewerModal";
import "./SkillDevHome.css";

interface InternshipAlert {
  id: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  stipend: string;
  stream: string;
  applyUrl: string;
}

const internshipAlerts: InternshipAlert[] = [
  {
    id: "google-frontend",
    title: "Frontend Engineering Intern",
    company: "Google",
    location: "Bangalore",
    deadline: "2026-07-02T23:59:59.000Z",
    stipend: "Competitive",
    stream: "Engineering",
    applyUrl: "https://buildyourfuture.withgoogle.com/internships",
  },
  {
    id: "zomato-product-design",
    title: "Product Design Intern",
    company: "Zomato",
    location: "Gurugram",
    deadline: "2026-07-05T23:59:59.000Z",
    stipend: "INR 25,000/month",
    stream: "Design",
    applyUrl: "https://www.zomato.com/careers",
  },
  {
    id: "meity-digital-india",
    title: "Digital India Internship",
    company: "MeitY",
    location: "New Delhi / Remote",
    deadline: "2026-07-12T23:59:59.000Z",
    stipend: "Government norms",
    stream: "CS / IT",
    applyUrl: "https://www.meity.gov.in/",
  },
  {
    id: "microsoft-swe",
    title: "Software Engineering Intern",
    company: "Microsoft",
    location: "Hyderabad",
    deadline: "2026-07-15T23:59:59.000Z",
    stipend: "Competitive",
    stream: "Computer Science",
    applyUrl: "https://careers.microsoft.com/students/us/en",
  },
  {
    id: "amazon-sde",
    title: "SDE Intern",
    company: "Amazon",
    location: "Bangalore",
    deadline: "2026-07-20T23:59:59.000Z",
    stipend: "INR 80,000/month",
    stream: "Engineering",
    applyUrl: "https://www.amazon.jobs/en/teams/internships-for-students",
  },
  {
    id: "infosys-instep",
    title: "InStep Internship",
    company: "Infosys",
    location: "Bangalore",
    deadline: "2026-07-30T23:59:59.000Z",
    stipend: "Competitive",
    stream: "IT / Business",
    applyUrl: "https://www.infosys.com/instep.html",
  },
];

const getDaysLeft = (value: string) => {
  const today = new Date();
  const deadline = new Date(value);
  const diff = deadline.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const openUrl = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const SkillDevHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);

  // Certification states
  const [certifications, setCertifications] = useState<any[]>([]);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [credlyUrl, setCredlyUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [certError, setCertError] = useState("");
  const [certSuccess, setCertSuccess] = useState("");

  // States for viewing certificate
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [showViewerModal, setShowViewerModal] = useState(false);

  // Verified Skills states
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [editedSkills, setEditedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSavingSkills, setIsSavingSkills] = useState(false);

  // Learning stats states
  const [learningStats, setLearningStats] = useState({
    dailyLearningGoal: 60,
    todayLearningTime: 0,
    learningStreak: 0,
  });

  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [showAllInternships, setShowAllInternships] = useState(false);
  
  const topInternships = useMemo(() => [...internshipAlerts].sort((first, second) => getDaysLeft(first.deadline) - getDaysLeft(second.deadline)), []);

  const toggleInternshipSave = (internshipId: string) => {
    setSavedInternships((current) =>
      current.includes(internshipId) ? current.filter((id) => id !== internshipId) : [...current, internshipId]
    );
  };

  useEffect(() => {
    fetchActiveCourses();
    fetchSavedCourses();
    fetchCertifications();
    fetchLearningStats();
  }, []);

  useEffect(() => {
    if (user?.skills) {
      setEditedSkills([...user.skills]);
    }
  }, [showEditSkillsModal, user]);

  const fetchActiveCourses = async () => {
    try {
      const res = await api.get('/courses/active');
      setActiveCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch active courses:", error);
    }
  };

  const fetchSavedCourses = async () => {
    try {
      const res = await api.get('/courses/saved');
      setSavedCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch saved courses:", error);
    }
  };

  const fetchCertifications = async () => {
    try {
      const res = await api.get('/certifications');
      setCertifications(res.data);
    } catch (error) {
      console.error("Failed to fetch certifications:", error);
    }
  };

  const handleAddCredly = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setCertError("");
    setCertSuccess("");
    try {
      const res = await api.post('/certifications/verify-credly', { credentialUrl: credlyUrl });
      setCertSuccess(res.data.message || "Credential verified successfully!");
      setCredlyUrl("");
      fetchCertifications();
      setTimeout(() => {
        setShowAddCertModal(false);
        setCertSuccess("");
      }, 1500);
    } catch (err: any) {
      setCertError(err.response?.data?.message || err.message || "Failed to verify credential");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCertClick = (cert: any) => {
    if (cert.type === 'internal') {
      setSelectedCert({
        title: cert.title,
        issuer: cert.issuer,
        issueDate: cert.issueDate,
        credentialId: cert.credentialId,
        userName: user?.name || "Student"
      });
      setShowViewerModal(true);
    } else {
      if (cert.credentialUrl) {
        window.open(cert.credentialUrl, '_blank');
      }
    }
  };

  const fetchLearningStats = async () => {
    try {
      const res = await api.get('/courses/learning-stats');
      setLearningStats(res.data);
    } catch (error) {
      console.error("Failed to fetch learning stats:", error);
    }
  };

  const handleRemoveSkillItem = (skillToRemove: string) => {
    setEditedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddSkillItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !editedSkills.includes(newSkillInput.trim())) {
      setEditedSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const handleSaveSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSkills(true);
    try {
      const res = await api.put('/profile/skills', { skills: editedSkills });
      if (updateUser) {
        updateUser(res.data.user || { ...user, skills: editedSkills });
      }
      setShowEditSkillsModal(false);
    } catch (err) {
      console.error("Failed to save skills:", err);
      alert("Failed to update skills list");
    } finally {
      setIsSavingSkills(false);
    }
  };

  const toggleSaveCourse = async (courseData: any) => {
    try {
      await api.post('/courses/save', courseData);
      fetchSavedCourses();
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  const isSaved = (playlistId: string) => savedCourses.some(c => c.playlistId === playlistId);

  const handleAction = (action: string) => {
    if (action === 'Saved Paths') {
      setShowSavedModal(true);
      return;
    }
    alert(`${action} feature coming soon!`);
  };

  return (
    <div className="fade-in pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-2 sd-hub-title">Skill Development Hub</h1>
          <p className="text-secondary fs-6 mb-0 sd-hub-subtitle">
            Master industry-relevant skills, track your learning journey, and earn verified certifications.
          </p>
        </div>
        <div className="d-flex gap-2 w-100 w-md-auto">
          <button onClick={() => handleAction('Saved Paths')} className="btn btn-light border d-flex align-items-center justify-content-center gap-2 fw-medium shadow-sm flex-grow-1 flex-md-grow-0">
            <i className="bi bi-bookmark"></i> Saved Paths
          </button>
          <button onClick={() => navigate('/dashboard/skill-dev/explore')} className="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-medium shadow-sm flex-grow-1 flex-md-grow-0">
            <i className="bi bi-compass"></i> Explore Courses
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Area (Left) */}
        <div className="col-lg-8 pe-lg-4 order-2 order-lg-1">
          
          {/* Ongoing Learning */}
          <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
            <h5 className="fw-bold mb-0">Ongoing Learning</h5>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/skill-dev/explore'); }} className="text-primary text-decoration-none fw-medium sd-view-all">View All</a>
          </div>

          {activeCourses.length === 0 ? (
            <div className="card border shadow-sm rounded-4 p-5 text-center text-secondary mb-5">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-play-circle text-primary fs-1"></i>
              </div>
              <h6 className="fw-bold text-dark">No courses started yet</h6>
              <p className="text-secondary small mb-3">Jump start your skills by enrolling in a new course from our catalog.</p>
              <button 
                onClick={() => navigate('/dashboard/skill-dev/explore')} 
                className="btn btn-primary rounded-pill px-4 fw-medium shadow-sm d-inline-flex align-items-center gap-2 mx-auto"
              >
                <i className="bi bi-compass"></i> Explore Courses
              </button>
            </div>
          ) : (
            <div className="row g-4 mb-5">
              {activeCourses.slice(0, 4).map((course) => {
                const tagColor = course.playlistId === 'PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3' ? 'primary' : 'success';
                const tagLabel = course.playlistId === 'PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3' ? 'Frontend' : 'Development';
                
                return (
                  <div key={course.playlistId} className="col-md-6">
                    <div className="card border shadow-sm rounded-4 h-100 p-4 hover-shadow transition d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className={`bg-${tagColor} bg-opacity-10 text-${tagColor} rounded-3 d-flex align-items-center justify-content-center sd-course-icon-wrapper`}>
                          <i className="bi bi-play-circle-fill fs-4"></i>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaveCourse({ playlistId: course.playlistId, title: course.title, description: course.description, thumbnailUrl: course.thumbnailUrl, channelTitle: course.channelTitle }); }} 
                            className={`btn btn-sm ${isSaved(course.playlistId) ? 'btn-primary' : 'btn-outline-primary'} border rounded-pill d-flex align-items-center`}
                          >
                            <i className={`bi ${isSaved(course.playlistId) ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                          </button>
                          <span className="badge bg-light text-dark border rounded-pill py-2">{tagLabel}</span>
                        </div>
                      </div>
                      <h5 className="fw-bold text-dark mb-1 text-truncate-2" title={course.title} style={{ height: '48px', overflow: 'hidden' }}>{course.title}</h5>
                      <p className="text-secondary mb-4 sd-course-module text-truncate">{course.channelTitle} • {course.totalCount} modules</p>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-medium text-dark sd-progress-label">Progress</span>
                          <span className="fw-bold text-primary sd-progress-value">{course.progress}%</span>
                        </div>
                        <div className="progress rounded-pill bg-light mb-3 sd-progress-container">
                          <div className="progress-bar bg-primary" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <button onClick={() => navigate(`/dashboard/skill-dev/course/${course.playlistId}`)} className="btn btn-primary w-100 fw-medium shadow-sm">Continue Learning</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Skill Assessments */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">Skill Assessments</h5>
              <p className="text-secondary mb-0 sd-assessment-subtitle">Take quizzes to validate your skills and earn profile badges.</p>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                <i className="bi bi-filetype-sql text-primary mb-3 sd-assessment-icon"></i>
                <h6 className="fw-bold text-dark mb-2">SQL Mastery</h6>
                <p className="text-secondary mb-3 sd-assessment-meta">20 questions • 30 mins</p>
                <button onClick={() => window.open('https://www.w3schools.com/quiztest/quiztest.asp?qtest=SQL', '_blank')} className="btn btn-light border w-100 fw-medium text-primary mt-auto">Take Quiz</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                <i className="bi bi-git text-danger mb-3 sd-assessment-icon"></i>
                <h6 className="fw-bold text-dark mb-2">Git & Version Control</h6>
                <p className="text-secondary mb-3 sd-assessment-meta">15 questions • 20 mins</p>
                <button onClick={() => window.open('https://www.w3schools.com/quiztest/quiztest.asp?qtest=GIT', '_blank')} className="btn btn-light border w-100 fw-medium text-danger mt-auto">Take Quiz</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                <i className="bi bi-terminal text-dark mb-3 sd-assessment-icon"></i>
                <h6 className="fw-bold text-dark mb-2">Linux Fundamentals</h6>
                <p className="text-secondary mb-3 sd-assessment-meta">25 questions • 40 mins</p>
                <button onClick={() => window.open('https://www.proprofs.com/quiz-school/story.php?title=commands-linux', '_blank')} className="btn btn-light border w-100 fw-medium text-dark mt-auto">Take Quiz</button>
              </div>
            </div>
            
            {showAllQuizzes && (
              <>
                {/* New Quiz 1 */}
                <div className="col-md-4">
                  <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                    <i className="bi bi-database text-info mb-3 sd-assessment-icon"></i>
                    <h6 className="fw-bold text-dark mb-2">W3Schools - SQL Quiz</h6>
                    <p className="text-secondary small mb-3">Focus: Database & SQL Mastery. A classic, direct quiz testing essential SQL commands, queries, and syntax basics.</p>
                    <button onClick={() => window.open('https://www.w3schools.com/sql/sql_quiz.asp', '_blank')} className="btn btn-light border w-100 fw-medium text-info mt-auto">Take Quiz</button>
                  </div>
                </div>

                {/* New Quiz 2 */}
                <div className="col-md-4">
                  <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                    <i className="bi bi-git text-danger mb-3 sd-assessment-icon"></i>
                    <h6 className="fw-bold text-dark mb-2">TutorialsPoint - Git Basic Concepts</h6>
                    <p className="text-secondary small mb-3">Focus: Git & Version Control. Evaluates foundational understanding of repositories, commits, branches, and general workflows.</p>
                    <button onClick={() => window.open('https://www.tutorialspoint.com/git/quiz_on_git_basic_concepts.htm', '_blank')} className="btn btn-light border w-100 fw-medium text-danger mt-auto">Take Quiz</button>
                  </div>
                </div>

                {/* New Quiz 3 */}
                <div className="col-md-4">
                  <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                    <i className="bi bi-pc-display text-dark mb-3 sd-assessment-icon"></i>
                    <h6 className="fw-bold text-dark mb-2">Guru99 - OS Mock Test</h6>
                    <p className="text-secondary small mb-3">Focus: Linux & OS Fundamentals. A clean, multi-question online certification test to enhance operating system knowledge.</p>
                    <button onClick={() => window.open('https://career.guru99.com/operating-system-quiz/', '_blank')} className="btn btn-light border w-100 fw-medium text-dark mt-auto">Take Quiz</button>
                  </div>
                </div>

                {/* New Quiz 4 */}
                <div className="col-md-4">
                  <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                    <i className="bi bi-filetype-py text-warning mb-3 sd-assessment-icon"></i>
                    <h6 className="fw-bold text-dark mb-2">W3Schools - Python Quiz</h6>
                    <p className="text-secondary small mb-3">Focus: Python Programming. A widely accepted 25-question quiz to test fundamental Python programming concepts.</p>
                    <button onClick={() => window.open('https://www.w3schools.com/python/python_quiz.asp', '_blank')} className="btn btn-light border w-100 fw-medium text-warning mt-auto">Take Quiz</button>
                  </div>
                </div>

                {/* New Quiz 5 */}
                <div className="col-md-4">
                  <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                    <i className="bi bi-cup-hot text-danger mb-3 sd-assessment-icon"></i>
                    <h6 className="fw-bold text-dark mb-2">W3Schools - Java Quiz</h6>
                    <p className="text-secondary small mb-3">Focus: Java Programming. A quick practical assessment for checking syntax and core programming logic in Java.</p>
                    <button onClick={() => window.open('https://www.w3schools.com/java/java_quiz.asp', '_blank')} className="btn btn-light border w-100 fw-medium text-danger mt-auto">Take Quiz</button>
                  </div>
                </div>

                {/* New Quiz 6 */}
                <div className="col-md-4">
                  <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                    <i className="bi bi-github text-dark mb-3 sd-assessment-icon"></i>
                    <h6 className="fw-bold text-dark mb-2">TutorialsPoint - Git Intro Quiz</h6>
                    <p className="text-secondary small mb-3">Focus: Version Control Basics. Perfect for beginners to validate their basic understanding of distributed version control systems.</p>
                    <button onClick={() => window.open('https://www.tutorialspoint.com/git/quiz_on_git-introduction.htm', '_blank')} className="btn btn-light border w-100 fw-medium text-dark mt-auto">Take Quiz</button>
                  </div>
                </div>
              </>
            )}

          </div>

          <div className="text-center mb-5 mt-3">
            <button 
              onClick={() => setShowAllQuizzes(!showAllQuizzes)} 
              className="btn btn-outline-primary rounded-pill px-4 fw-medium shadow-sm"
            >
              {showAllQuizzes ? (
                <><i className="bi bi-chevron-up"></i> Show Less</>
              ) : (
                <><i className="bi bi-chevron-down"></i> See More Assessments</>
              )}
            </button>
          </div>

          {/* Top Internship Alerts */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
            <div>
              <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-briefcase text-primary fs-4"></i> Top Internship Alerts
              </h5>
              <p className="text-secondary mb-0 sd-assessment-subtitle">
                Apply for hand-picked internship opportunities tailored to your skills.
              </p>
            </div>
          </div>
          
          <div className="row g-4 mb-4">
            {topInternships.slice(0, showAllInternships ? topInternships.length : 2).map((internship) => {
              const daysLeft = getDaysLeft(internship.deadline);
              const isSaved = savedInternships.includes(internship.id);
              return (
                <div className="col-md-6" key={internship.id}>
                  <div className="card border shadow-sm rounded-4 p-4 h-100 hover-shadow transition d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded d-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px' }}>
                        <i className="bi bi-briefcase-fill fs-4"></i>
                      </div>
                      <span className={`badge rounded-pill ${daysLeft <= 3 ? "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" : "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25"}`}>
                        {daysLeft} days left
                      </span>
                    </div>
                    <div className="fw-bold text-dark mb-1 fs-6">{internship.title}</div>
                    <div className="text-secondary small mb-3">
                      <i className="bi bi-building me-1"></i>{internship.company} • <i className="bi bi-geo-alt me-1"></i>{internship.location}
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <span className="badge bg-light text-dark border fw-medium"><i className="bi bi-cash text-success me-1"></i>{internship.stipend}</span>
                      <span className="badge bg-light text-dark border fw-medium"><i className="bi bi-mortarboard text-primary me-1"></i>{internship.stream}</span>
                    </div>
                    <div className="d-flex gap-2 mt-auto">
                      <button className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-light border'} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '36px', height: '36px' }} onClick={() => toggleInternshipSave(internship.id)} aria-label={isSaved ? "Unsave internship" : "Save internship"}>
                        <i className={`bi ${isSaved ? "bi-bookmark-fill" : "bi-bookmark text-secondary"}`}></i>
                      </button>
                      <button className="btn btn-sm btn-primary rounded-pill px-4 fw-medium flex-grow-1" onClick={() => openUrl(internship.applyUrl)}>Apply Now</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-5 mt-3">
            <button 
              onClick={() => setShowAllInternships(!showAllInternships)} 
              className="btn btn-outline-primary rounded-pill px-4 fw-medium shadow-sm"
            >
              {showAllInternships ? (
                <><i className="bi bi-chevron-up"></i> Show Less</>
              ) : (
                <><i className="bi bi-chevron-down"></i> See More Internships</>
              )}
            </button>
          </div>

          {/* Certifications Earned Section */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
            <div>
              <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-award text-warning fs-4"></i> Earned Certifications
              </h5>
              <p className="text-secondary mb-0 sd-assessment-subtitle">
                Showcase your verified industry credentials and ShikshaSetu learning course certificates.
              </p>
            </div>
            <button 
              onClick={() => setShowAddCertModal(true)} 
              className="btn btn-primary rounded-pill px-4 shadow-sm fw-medium d-flex align-items-center gap-2"
            >
              <i className="bi bi-plus-lg"></i> Add Certification
            </button>
          </div>

          {certifications.length === 0 ? (
            <div className="card border shadow-sm rounded-4 p-5 text-center text-secondary mb-5 bg-light">
              <i className="bi bi-award fs-1 mb-3 text-secondary opacity-50"></i>
              <h6 className="fw-bold text-dark">No certifications added yet</h6>
              <p className="text-secondary small mb-0">Complete playlist courses or verify your external Credly badges to showcase your credentials here.</p>
            </div>
          ) : (
            <div className="row g-4 mb-5">
              {certifications.map((cert) => {
                const isInternal = cert.type === 'internal';
                return (
                  <div key={cert._id} className="col-md-6 col-xl-4">
                    <div 
                      onClick={() => handleCertClick(cert)}
                      className="card border shadow-sm rounded-4 p-4 h-100 hover-shadow transition cursor-pointer d-flex flex-column"
                    >
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="bg-white rounded p-2 border text-primary d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                          {isInternal ? (
                            <i className="bi bi-award-fill text-warning fs-4"></i>
                          ) : cert.issuer.toLowerCase().includes('microsoft') ? (
                            <i className="bi bi-microsoft text-info fs-4"></i>
                          ) : cert.issuer.toLowerCase().includes('google') ? (
                            <i className="bi bi-google text-primary fs-4"></i>
                          ) : (
                            <i className="bi bi-shield-check text-success fs-4"></i>
                          )}
                        </div>
                        {cert.isVerified && (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2.5 py-1" style={{ fontSize: '0.65rem' }}>
                            <i className="bi bi-patch-check-fill me-1"></i>Verified
                          </span>
                        )}
                      </div>
                      <h6 className="fw-bold text-dark mb-1 fs-6 flex-grow-0" title={cert.title} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '42px', lineHeight: '21px' }}>
                        {cert.title}
                      </h6>
                      <p className="text-secondary small mb-3">{cert.issuer}</p>
                      
                      <div className="mt-auto d-flex justify-content-between align-items-center text-muted small border-top pt-3">
                        <span>Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        <span className="text-primary fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                          {isInternal ? 'View' : 'Verify'} <i className="bi bi-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Sidebar (col-lg-4) */}
        <div className="col-lg-4 order-1 order-lg-2">
          
          {/* Daily Goal */}
          <div className="glass-panel-accent border shadow-sm rounded-4 p-4 mb-4 text-center position-relative overflow-hidden">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-lightning-charge-fill text-primary sd-daily-icon"></i>
            </div>
            <h6 className="fw-bold text-primary mb-1 position-relative z-1 text-uppercase sd-daily-title">Daily Learning Goal</h6>
            <div className="text-dark mb-4 position-relative z-1 sd-daily-time">{learningStats.todayLearningTime} mins / {learningStats.dailyLearningGoal} mins</div>
            
            {(() => {
              const goalPercent = Math.min(100, Math.round((learningStats.todayLearningTime / learningStats.dailyLearningGoal) * 100));
              return (
                <div className="position-relative d-inline-flex justify-content-center align-items-center mb-2 sd-daily-chart-wrapper">
                  <svg viewBox="0 0 36 36" className="w-100 h-100 position-absolute top-0 start-0 sd-daily-chart-svg">
                    <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="3" strokeDasharray="100, 100" />
                    <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${goalPercent}, 100`} strokeLinecap="round" />
                  </svg>
                  <div className="fw-bold fs-2 text-dark position-relative z-1">{goalPercent}%</div>
                </div>
              );
            })()}
            <p className="text-secondary mt-3 mb-0 sd-daily-streak">
              {learningStats.learningStreak > 0 
                ? `You're on a ${learningStats.learningStreak}-day streak! 🔥` 
                : 'Start your learning streak today! 🚀'}
            </p>
          </div>

          {/* Saved Internships Stat */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4 d-flex flex-row align-items-center gap-4 hover-shadow transition">
            <div className="bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-circle d-flex justify-content-center align-items-center" style={{ width: '56px', height: '56px', minWidth: '56px' }}>
              <i className="bi bi-briefcase-fill fs-4"></i>
            </div>
            <div>
              <div className="text-secondary mb-1 small fw-medium text-uppercase">Saved Internships</div>
              <div className="fw-bold fs-3 text-dark">{savedInternships.length.toString().padStart(2, "0")}</div>
            </div>
          </div>

          {/* Verified Skills */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success fs-5"></i> Verified Skills
              </h6>
              <button onClick={() => setShowEditSkillsModal(true)} className="btn btn-link text-primary p-0 border-0 text-decoration-none sd-verified-edit">Edit</button>
            </div>
            
            <div className="d-flex flex-wrap gap-2">
              {(user?.skills && user.skills.length > 0) ? (
                user.skills.map((skill, idx) => (
                  <span key={idx} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 fw-medium">
                    <i className="bi bi-check2-circle me-1"></i> {skill}
                  </span>
                ))
              ) : (
                <div className="text-secondary small py-2">No skills added yet. Click edit to start showcasing your skills.</div>
              )}
            </div>
          </div>

          {/* Explore Courses */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-play-btn-fill text-danger fs-5"></i> Trending Courses
              </h6>
              <button onClick={() => navigate('/dashboard/skill-dev/explore')} className="btn btn-sm btn-light border rounded-pill">View All</button>
            </div>
            
            <div className="list-group list-group-flush">
              <button onClick={() => navigate('/dashboard/skill-dev/course/PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3')} className="list-group-item list-group-item-action px-0 py-3 border-bottom d-flex align-items-center gap-3">
                <div className="bg-light rounded p-2 text-danger border shadow-sm">
                  <i className="bi bi-youtube fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 fs-6 text-dark">ReactJS Tutorial for Beginners</h6>
                  <small className="text-secondary">Codevolution</small>
                </div>
              </button>
              
              <button onClick={() => navigate('/dashboard/skill-dev/course/PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU')} className="list-group-item list-group-item-action px-0 py-3 border-bottom d-flex align-items-center gap-3">
                <div className="bg-light rounded p-2 text-danger border shadow-sm">
                  <i className="bi bi-youtube fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 fs-6 text-dark">Python OOP Tutorials</h6>
                  <small className="text-secondary">Corey Schafer</small>
                </div>
              </button>

              <button onClick={() => navigate('/dashboard/skill-dev/explore')} className="list-group-item list-group-item-action px-0 py-3 d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 rounded p-2 text-primary border border-primary border-opacity-25">
                  <i className="bi bi-search fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-primary mb-0 fs-6">Explore Courses</h6>
                </div>
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Saved Paths Modal */}
      {showSavedModal && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      )}
      <div className={`modal fade ${showSavedModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ zIndex: 1050 }} onClick={() => setShowSavedModal(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header border-bottom-0 bg-light p-4">
              <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                <i className="bi bi-bookmark-fill text-primary"></i> Saved Learning Paths
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowSavedModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              {savedCourses.length === 0 ? (
                <div className="text-center py-5">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-bookmark text-secondary fs-1"></i>
                  </div>
                  <h6 className="fw-bold text-dark">No saved paths yet</h6>
                  <p className="text-secondary mb-0">Bookmark courses to build your personal learning library.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {savedCourses.map((course) => (
                    <div key={course.playlistId} className="col-md-6">
                      <div className="card h-100 border shadow-sm rounded-4 hover-shadow transition overflow-hidden">
                        <img src={course.thumbnailUrl || 'https://via.placeholder.com/640x360?text=Course'} className="card-img-top object-fit-cover" alt={course.title} style={{ height: '160px' }} />
                        <div className="card-body p-4">
                          <h6 className="fw-bold text-dark mb-1 text-truncate" title={course.title}>{course.title}</h6>
                          <p className="text-secondary small mb-3">{course.channelTitle}</p>
                          <div className="d-flex gap-2">
                            <button onClick={() => navigate(`/dashboard/skill-dev/course/${course.playlistId}`)} className="btn btn-primary btn-sm flex-grow-1 fw-medium rounded-pill">
                              <i className="bi bi-play-fill me-1"></i> Resume
                            </button>
                            <button onClick={() => toggleSaveCourse(course)} className="btn btn-light border btn-sm rounded-pill text-danger px-3">
                              <i className="bi bi-bookmark-x-fill"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Certification Modal */}
      {showAddCertModal && (
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
              <div className="modal-header border-bottom-0 bg-light p-4">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-patch-check-fill text-primary"></i> Add Verified Credential
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddCertModal(false); setCertError(""); setCertSuccess(""); setCredlyUrl(""); }}></button>
              </div>
              <form onSubmit={handleAddCredly}>
                <div className="modal-body p-4 bg-white">
                  <p className="text-secondary small mb-4">
                    Earned a certification on Microsoft Learn, Google, or other platforms? Paste your public **Credly Badge URL** below. We will verify the badge details and sync it to your profile.
                  </p>
                  
                  <div className="mb-3">
                    <label htmlFor="credlyUrl" className="form-label fw-semibold text-dark small">Credly Badge URL</label>
                    <input 
                      type="url" 
                      className="form-control rounded-3 py-2 px-3 border" 
                      id="credlyUrl" 
                      placeholder="e.g. https://www.credly.com/badges/your-badge-id"
                      value={credlyUrl}
                      onChange={(e) => setCredlyUrl(e.target.value)}
                      required
                    />
                    <div className="form-text text-muted small mt-2">
                      Ensure your badge is set to "Public" in your Credly settings so we can verify it.
                    </div>
                  </div>

                  {certError && (
                    <div className="alert alert-danger rounded-3 p-3 mt-3 d-flex align-items-start gap-2 fs-6">
                      <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
                      <div>{certError}</div>
                    </div>
                  )}

                  {certSuccess && (
                    <div className="alert alert-success rounded-3 p-3 mt-3 d-flex align-items-start gap-2 fs-6">
                      <i className="bi bi-check-circle-fill text-success fs-5"></i>
                      <div>{certSuccess}</div>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top-0 bg-light p-3 d-flex gap-2 justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-light border px-4 rounded-pill fw-medium" 
                    onClick={() => { setShowAddCertModal(false); setCertError(""); setCertSuccess(""); setCredlyUrl(""); }}
                    disabled={isVerifying}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 rounded-pill fw-medium d-flex align-items-center gap-2"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : (
                      <>Verify & Add</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal 
        show={showViewerModal}
        onClose={() => { setShowViewerModal(false); setSelectedCert(null); }}
        certData={selectedCert}
      />

      {/* Edit Verified Skills Modal */}
      {showEditSkillsModal && (
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-white">
              <div className="modal-header border-bottom-0 bg-light p-4">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-success"></i> Edit Verified Skills
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditSkillsModal(false); setNewSkillInput(""); }}></button>
              </div>
              <div className="modal-body p-4 bg-white">
                <p className="text-secondary small mb-3">
                  Manage the skills shown on your Skill Development profile. Add new topics or remove existing ones.
                </p>
                
                {/* Active Skills List */}
                <div className="d-flex flex-wrap gap-2 mb-4 border rounded-3 p-3 bg-light" style={{ minHeight: '80px' }}>
                  {editedSkills.length === 0 ? (
                    <div className="text-secondary text-center w-100 my-auto small">No skills in your list. Add one below!</div>
                  ) : (
                    editedSkills.map((skill, idx) => (
                      <span key={idx} className="badge bg-white text-dark border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkillItem(skill)} 
                          className="btn-close text-danger" 
                          style={{ fontSize: '0.65rem', padding: 0 }}
                          aria-label="Remove"
                        ></button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Skill Form */}
                <form onSubmit={handleAddSkillItem} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control rounded-3 py-2 px-3 border" 
                    placeholder="Type a skill (e.g. ReactJS, Node.js)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline-primary px-3 rounded-pill fw-medium flex-shrink-0">
                    <i className="bi bi-plus-lg"></i> Add
                  </button>
                </form>
              </div>
              <div className="modal-footer border-top-0 bg-light p-3 d-flex gap-2 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-light border px-4 rounded-pill fw-medium" 
                  onClick={() => { setShowEditSkillsModal(false); setNewSkillInput(""); }}
                  disabled={isSavingSkills}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveSkills} 
                  className="btn btn-primary px-4 rounded-pill fw-medium"
                  disabled={isSavingSkills}
                >
                  {isSavingSkills ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SkillDevHome;
