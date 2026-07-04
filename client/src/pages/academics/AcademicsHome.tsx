import React, { useEffect, useMemo, useState } from "react";
import { AcademicProfile, AcademicResource, AcademicTask, StudyPlan } from "../../types";
import { createAcademicTask, createStudyPlan, getAcademicDashboard, updateAcademicTask } from "../../services/academicsService";
import "./AcademicsHome.css";

interface AcademicDashboard {
  academicProfile?: AcademicProfile;
  resources: AcademicResource[];
  courseOptions: string[];
  recommendedPrograms: string[];
  userCourses: string[];
  tasks: AcademicTask[];
  studyPlans: StudyPlan[];
}

const formatDueDate = (dueDate?: string) => {
  if (!dueDate) return "No due date";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(dueDate));
};

const AcademicsHome: React.FC = () => {
  const [dashboard, setDashboard] = useState<AcademicDashboard | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [course, setCourse] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");
      const data = await getAcademicDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to load academic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const profile = dashboard?.academicProfile;
  const semester = profile?.currentSemester || 1;
  const completedTasks = useMemo(
    () => dashboard?.tasks.filter((task) => task.completed).length || 0,
    [dashboard?.tasks]
  );
  const resourcePrograms = dashboard?.courseOptions || [];
  const recommendedResources = useMemo(() => {
    if (!dashboard?.recommendedPrograms.length) return [];
    return dashboard.resources.filter((resource) => dashboard.recommendedPrograms.includes(resource.program));
  }, [dashboard]);
  const filteredResources = useMemo(() => {
    if (!dashboard) return [];
    if (selectedProgram === "Recommended") {
      return recommendedResources.length ? recommendedResources : dashboard.resources;
    }
    if (selectedProgram === "All") return dashboard.resources;
    return dashboard.resources.filter((resource) => resource.program === selectedProgram);
  }, [dashboard, recommendedResources, selectedProgram]);

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;

    const task = await createAcademicTask({
      title: taskTitle,
      course: course || "General",
      priority: "medium",
    });

    setDashboard((current) => current ? { ...current, tasks: [task, ...current.tasks] } : current);
    setTaskTitle("");
    setCourse("");
  };

  const handleToggleTask = async (task: AcademicTask) => {
    const updated = await updateAcademicTask(task._id, { completed: !task.completed });
    setDashboard((current) =>
      current
        ? { ...current, tasks: current.tasks.map((item) => (item._id === updated._id ? updated : item)) }
        : current
    );
  };

  const handleCreatePlan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!planTitle.trim()) return;

    const plan = await createStudyPlan({
      title: planTitle,
      description: `Focused plan for Semester ${semester}`,
    });
    setDashboard((current) => current ? { ...current, studyPlans: [plan, ...current.studyPlans] } : current);
    setPlanTitle("");
  };

  if (loading) {
    return <div className="fade-in pb-5 text-ss-muted">Loading academic hub...</div>;
  }

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-book text-ss-primary"></i>
            <span className="text-ss-primary fw-bold text-uppercase ah-text-xs-spacing">Academic Hub</span>
          </div>
          <h1 className="fw-bold text-ss-bright fs-2 mb-1">Semester {semester} Overview</h1>
          <p className="text-ss-muted mb-0 fs-6">
            CGPA {profile?.currentCgpa || 0} / 10 | Credits {profile?.creditsEarned || 0}/{profile?.totalCredits || 0}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="ss-card p-4">
            <div className="text-ss-muted ah-text-sm">Predicted CGPA</div>
            <div className="fw-bold fs-3 text-dark">{profile?.predictedCgpa || profile?.currentCgpa || 0}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ss-card p-4">
            <div className="text-ss-muted ah-text-sm">Highest Semester GPA</div>
            <div className="fw-bold fs-3 text-dark">{profile?.highestCgpa || 0}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ss-card p-4">
            <div className="text-ss-muted ah-text-sm">Tasks Completed</div>
            <div className="fw-bold fs-3 text-dark">{completedTasks}/{dashboard?.tasks.length || 0}</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3 mt-2">
            <h5 className="fw-bold mb-0 d-flex align-items-center">
              <i className="bi bi-link-45deg text-primary me-2"></i>University Course Links
            </h5>
            <select className="form-select form-select-sm ah-program-select" value={selectedProgram} onChange={(event) => setSelectedProgram(event.target.value)}>
              <option value="All">All Courses</option>
              <option value="Recommended">For My Timetable</option>
              {resourcePrograms.map((program) => (
                <option value={program} key={program}>{program}</option>
              ))}
            </select>
          </div>
          {dashboard?.userCourses.length ? (
            <div className="alert alert-light border d-flex align-items-center gap-2 py-2 mb-3">
              <i className="bi bi-stars text-primary"></i>
              <span className="ah-text-sm">Matched from your timetable: {dashboard.userCourses.slice(0, 4).join(", ")}</span>
            </div>
          ) : null}

          <div className="row g-3 mb-4">
            {filteredResources.map((resource) => (
              <div className="col-md-6" key={resource.id}>
                <a className="ss-card p-3 d-flex align-items-center gap-3 cursor-pointer hover-primary text-decoration-none" href={resource.url} target="_blank" rel="noreferrer">
                  <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-flex align-items-center justify-content-center">
                    <i className={`bi ${resource.type === "Course" ? "bi-mortarboard" : "bi-file-earmark-text"} fs-4`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark fs-6 text-truncate ah-max-w-150">{resource.title}</div>
                    <div className="text-ss-muted ah-text-xs">{resource.program} | {resource.university}</div>
                    <div className="text-ss-muted ah-text-xs">{resource.subject} | {resource.size}</div>
                  </div>
                  <i className="bi bi-box-arrow-up-right text-muted hover-primary"></i>
                </a>
              </div>
            ))}
            {filteredResources.length === 0 && (
              <div className="col-12">
                <div className="ss-card p-4 text-ss-muted ah-text-sm">No links found for this course yet.</div>
              </div>
            )}
          </div>

          <div className="bg-dark rounded-4 p-4 text-white d-flex justify-content-between align-items-center position-relative overflow-hidden">
            <i className="bi bi-graph-up-arrow position-absolute opacity-25 ah-icon-xl"></i>
            <div className="position-relative z-1 w-75">
              <h4 className="fw-bold mb-2">Study Plans</h4>
              <p className="mb-0 text-white-50 ah-text-base">
                {dashboard?.studyPlans[0]?.title || "Create a focused study plan for upcoming exams and submissions."}
              </p>
            </div>
            <form className="d-flex gap-2 position-relative z-1" onSubmit={handleCreatePlan}>
              <input className="form-control" placeholder="Plan title" value={planTitle} onChange={(event) => setPlanTitle(event.target.value)} />
              <button className="btn btn-light fw-bold text-dark" type="submit">Add</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="ss-card">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <i className="bi bi-journal-text text-primary me-2"></i>Academic Tasks
            </h5>

            {dashboard?.tasks.length ? dashboard.tasks.map((task) => (
              <button key={task._id} className="btn text-start w-100 p-0 mb-4" onClick={() => handleToggleTask(task)}>
                <div className="d-flex gap-3">
                  <i className={`bi ${task.completed ? "bi-check-circle-fill text-primary" : "bi-circle text-muted"} fs-5 mt-1`}></i>
                  <div>
                    <div className={`fw-bold fs-6 ${task.completed ? "text-decoration-line-through text-muted" : "text-dark"}`}>{task.title}</div>
                    <div className="text-ss-muted ah-text-sm-alt">{task.course} | {formatDueDate(task.dueDate)}</div>
                  </div>
                </div>
              </button>
            )) : (
              <p className="text-ss-muted ah-text-sm-alt">No tasks yet. Add the next thing before it vanishes from your brain.</p>
            )}

            <form onSubmit={handleCreateTask}>
              <input className="form-control mb-2" placeholder="Task title" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} />
              <input className="form-control mb-3" placeholder="Course" value={course} onChange={(event) => setCourse(event.target.value)} />
              <button className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center border-dashed py-2" type="submit">
                <i className="bi bi-plus-circle me-2"></i><span className="ah-text-sm">Add Task</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsHome;
