import React, { useEffect, useMemo, useState } from "react";
import { InterviewAttempt, InterviewMock, InterviewPost } from "../../types";
import {
  createInterviewPost,
  getInterviewDashboard,
  markInterviewPostHelpful,
  recordInterviewAttempt,
  scheduleMockInterview,
  searchInterviewQuestions,
  updateMockInterview,
} from "../../services/interviewService";
import "./InterviewPrepHome.css";

interface InterviewQuestionItem {
  id: string;
  type: "coding" | "behavioral";
  title: string;
  difficulty: string;
  category: string;
  prompt: string;
  starterCode?: string;
  hints?: string[];
  tip?: string;
}

interface PrepResource {
  title: string;
  type: string;
  category: string;
  url: string;
}

interface InterviewDashboard {
  userName: string;
  problemOfTheDay: InterviewQuestionItem;
  questionBank: InterviewQuestionItem[];
  categories: string[];
  resources: PrepResource[];
  attempts: InterviewAttempt[];
  mocks: InterviewMock[];
  posts: InterviewPost[];
  skills: {
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
  };
}

const formatWhen = (date: string) => new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
}).format(new Date(date));

const InterviewPrepHome: React.FC = () => {
  const [dashboard, setDashboard] = useState<InterviewDashboard | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [postText, setPostText] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [company, setCompany] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [lastAttempt, setLastAttempt] = useState<InterviewAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");
      const data = await getInterviewDashboard();
      setDashboard(data);
      setQuestions(data.questionBank);
      setSelectedQuestionId(data.problemOfTheDay.id);
      setAnswer(data.problemOfTheDay.starterCode || "");
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to load interview prep data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId) || dashboard?.problemOfTheDay,
    [dashboard, questions, selectedQuestionId]
  );

  const handleSelectQuestion = (questionId: string) => {
    const nextQuestion = questions.find((question) => question.id === questionId);
    setSelectedQuestionId(questionId);
    setLastAttempt(null);
    setAnswer(nextQuestion?.type === "coding" ? nextQuestion.starterCode || "" : "");
  };

  const handleSearch = async () => {
    const response = await searchInterviewQuestions({ q: query, difficulty, category, type });
    setQuestions(response.questions);
    if (response.questions.length && !response.questions.some((question: InterviewQuestionItem) => question.id === selectedQuestionId)) {
      handleSelectQuestion(response.questions[0].id);
    }
  };

  const handleSubmitAttempt = async () => {
    if (!selectedQuestion) return;

    try {
      setSubmitting(true);
      setError("");
      const result = await recordInterviewAttempt({
        problemId: selectedQuestion.id,
        mode: selectedQuestion.type,
        answer,
        language,
      });

      setLastAttempt(result.attempt);
      setDashboard((current) => current ? {
        ...current,
        attempts: [result.attempt, ...current.attempts].slice(0, 8),
        skills: result.skills,
      } : current);
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to submit attempt.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleMock = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!scheduledAt) return;

    const mock = await scheduleMockInterview({
      mentorName: mentorName || "Assigned Mentor",
      company: company || "Mentor Network",
      scheduledAt,
    });

    setDashboard((current) => current ? { ...current, mocks: [...current.mocks, mock].slice(-8) } : current);
    setMentorName("");
    setCompany("");
    setScheduledAt("");
  };

  const handleUpdateMock = async (mock: InterviewMock, status: "completed" | "cancelled") => {
    if (!mock._id) return;
    const updated = await updateMockInterview(mock._id, status);
    setDashboard((current) => current ? {
      ...current,
      mocks: current.mocks.map((item) => (item._id === updated._id ? updated : item)),
    } : current);
  };

  const handleCreatePost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!postText.trim()) return;

    const post = await createInterviewPost(postText);
    setDashboard((current) => current ? { ...current, posts: [post, ...current.posts].slice(0, 6) } : current);
    setPostText("");
  };

  const handleHelpful = async (post: InterviewPost) => {
    if (!post._id) return;
    const updated = await markInterviewPostHelpful(post._id);
    setDashboard((current) => current ? {
      ...current,
      posts: current.posts.map((item) => (item._id === updated._id ? updated : item)),
    } : current);
  };

  if (loading) {
    return <div className="fade-in pb-5 text-secondary">Loading interview prep...</div>;
  }

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-2 ip-title">Interview Prep</h1>
          <p className="text-secondary fs-6 mb-0 ip-subtitle">
            Practice real questions, submit answers for feedback, schedule mocks, and track readiness.
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 fw-medium shadow-sm" onClick={handleSubmitAttempt} disabled={submitting}>
          <i className="bi bi-send"></i>{submitting ? "Reviewing..." : "Submit Answer"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border shadow-sm rounded-4 mb-4 overflow-hidden">
            <div className="p-4 border-bottom">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <div className="position-relative">
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input className="form-control ps-5" placeholder="Search questions" value={query} onChange={(event) => setQuery(event.target.value)} />
                  </div>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={type} onChange={(event) => setType(event.target.value)}>
                    <option>All</option>
                    <option value="coding">Coding</option>
                    <option value="behavioral">Behavioral</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                    <option>All</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option>All</option>
                    {dashboard?.categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div className="col-md-1 d-grid">
                  <button className="btn btn-light border" onClick={handleSearch} aria-label="Apply filters"><i className="bi bi-funnel"></i></button>
                </div>
              </div>
            </div>

            <div className="row g-0">
              <div className="col-md-4 border-end bg-light ip-question-list">
                {questions.map((question) => (
                  <button
                    className={`btn text-start w-100 rounded-0 p-3 border-bottom ${selectedQuestionId === question.id ? "bg-white" : ""}`}
                    key={question.id}
                    onClick={() => handleSelectQuestion(question.id)}
                  >
                    <div className="fw-bold text-dark ip-text-base">{question.title}</div>
                    <div className="text-secondary ip-text-xs">{question.category} | {question.difficulty} | {question.type}</div>
                  </button>
                ))}
                {!questions.length && <div className="p-4 text-secondary ip-text-sm">No matching questions found.</div>}
              </div>

              <div className="col-md-8">
                <div className="p-4 border-bottom bg-white">
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill mb-3 px-3 py-2 fw-semibold border border-primary border-opacity-25">
                    {selectedQuestion?.difficulty} | {selectedQuestion?.category}
                  </span>
                  <h5 className="fw-bold text-dark mb-2">{selectedQuestion?.title}</h5>
                  <p className="text-secondary mb-3 ip-text-body">{selectedQuestion?.prompt}</p>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedQuestion?.hints?.map((hint) => (
                      <span className="badge bg-light border text-dark fw-normal" key={hint}>{hint}</span>
                    ))}
                    {selectedQuestion?.tip && <span className="badge bg-light border text-dark fw-normal">{selectedQuestion.tip}</span>}
                  </div>
                </div>

                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="fw-bold text-dark">Your Answer</label>
                    {selectedQuestion?.type === "coding" && (
                      <select className="form-select form-select-sm ip-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>SQL</option>
                      </select>
                    )}
                  </div>
                  <textarea
                    className="form-control font-monospace ip-answer-box"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={selectedQuestion?.type === "coding" ? "Write your solution or design approach..." : "Write your STAR answer..."}
                  />
                  <button className="btn btn-primary mt-3 fw-medium" onClick={handleSubmitAttempt} disabled={submitting}>
                    <i className="bi bi-send me-2"></i>{submitting ? "Reviewing..." : "Submit for Feedback"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {lastAttempt && (
            <div className="card border shadow-sm rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="fw-bold text-dark mb-1">Latest Feedback</h5>
                  <p className="text-secondary mb-0 ip-text-sm">{lastAttempt.feedback}</p>
                </div>
                <span className="badge bg-primary rounded-pill fs-6 px-3 py-2">{lastAttempt.score}%</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="fw-bold text-dark mb-2">Strengths</div>
                  {(lastAttempt.strengths || []).map((item) => <div className="text-secondary ip-text-sm mb-1" key={item}><i className="bi bi-check-circle text-success me-2"></i>{item}</div>)}
                </div>
                <div className="col-md-6">
                  <div className="fw-bold text-dark mb-2">Improve Next</div>
                  {(lastAttempt.improvements || []).map((item) => <div className="text-secondary ip-text-sm mb-1" key={item}><i className="bi bi-arrow-up-circle text-primary me-2"></i>{item}</div>)}
                </div>
              </div>
            </div>
          )}

          <div className="row g-4">
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">Resources</h5>
              <div className="card border shadow-sm rounded-4 p-4 d-flex flex-column gap-3">
                {dashboard?.resources.map((resource) => (
                  <a className="d-flex align-items-center gap-3 text-decoration-none" href={resource.url} target="_blank" rel="noreferrer" key={resource.title}>
                    <div className="bg-light border rounded p-2 text-dark"><i className="bi bi-box-arrow-up-right fs-5"></i></div>
                    <div>
                      <div className="fw-bold text-dark ip-text-base">{resource.title}</div>
                      <div className="text-secondary ip-text-xs">{resource.category} | {resource.type}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <h5 className="fw-bold mb-3">Community Insights</h5>
              <div className="card border shadow-sm rounded-4 p-4">
                <form onSubmit={handleCreatePost} className="mb-3">
                  <textarea className="form-control bg-light border-0 rounded-4 p-3 shadow-sm mb-2" rows={3} placeholder="Share a useful interview tip..." value={postText} onChange={(event) => setPostText(event.target.value)} />
                  <button className="btn btn-primary btn-sm px-4 rounded-pill fw-medium shadow-sm" type="submit">Post</button>
                </form>
                {dashboard?.posts.map((post) => (
                  <div className="pt-3 border-top" key={post._id || `${post.authorName}-${post.createdAt}`}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark ip-text-base">{post.authorName}</span>
                      <span className="text-muted ip-time-text">{formatWhen(post.createdAt)}</span>
                    </div>
                    <p className="text-dark mb-2 ip-comment-text">{post.text}</p>
                    <button className="btn btn-link p-0 text-primary fw-medium ip-text-sm" onClick={() => handleHelpful(post)}>
                      <i className="bi bi-hand-thumbs-up me-1"></i>Helpful ({post.helpfulCount})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge text-primary fs-5"></i> Readiness
            </h6>
            {[
              ["Technical Accuracy", dashboard?.skills.technicalAccuracy || 0],
              ["Communication", dashboard?.skills.communication || 0],
              ["Problem Solving", dashboard?.skills.problemSolving || 0],
            ].map(([label, value]) => (
              <div className="mb-4" key={label}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-dark ip-text-sm">{label}</span>
                  <span className="fw-bold text-dark ip-text-sm">{value}%</span>
                </div>
                <div className="progress rounded-pill bg-light ip-progress-bg">
                  <div className="progress-bar bg-primary" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold text-dark mb-4">Recent Attempts</h6>
            {dashboard?.attempts.map((attempt) => (
              <div className="mb-4" key={attempt._id || `${attempt.title}-${attempt.createdAt}`}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-dark ip-text-base">{attempt.title}</span>
                  <span className="fw-bold text-dark">{attempt.score}%</span>
                </div>
                <div className="text-muted mb-2 ip-time-text">{attempt.mode} | {formatWhen(attempt.createdAt)}</div>
                <div className="progress rounded-pill bg-light ip-progress-bg">
                  <div className="progress-bar bg-primary" style={{ width: `${attempt.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border shadow-sm rounded-4 p-4">
            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-calendar2-event text-primary fs-5"></i> Mock Interviews
            </h6>
            <form onSubmit={handleScheduleMock} className="mb-4">
              <input className="form-control mb-2" placeholder="Mentor name" value={mentorName} onChange={(event) => setMentorName(event.target.value)} />
              <input className="form-control mb-2" placeholder="Company / role" value={company} onChange={(event) => setCompany(event.target.value)} />
              <input className="form-control mb-3" type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
              <button className="btn btn-light border w-100 fw-medium" type="submit">Schedule Mock</button>
            </form>

            {dashboard?.mocks.length ? dashboard.mocks.map((mock) => (
              <div className="position-relative border-start border-2 border-primary ms-2 ps-3 mb-4 py-1" key={mock._id || `${mock.mentorName}-${mock.scheduledAt}`}>
                <div className="position-absolute rounded-circle bg-primary ip-timeline-dot"></div>
                <div className="fw-bold text-dark fs-6 mb-1">{mock.mentorName}</div>
                <div className="text-secondary ip-text-xs mb-2">{mock.company} | {formatWhen(mock.scheduledAt)} | {mock.status}</div>
                {mock.status === "scheduled" && (
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => handleUpdateMock(mock, "completed")}>Complete</button>
                    <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleUpdateMock(mock, "cancelled")}>Cancel</button>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-secondary ip-text-sm">No mocks booked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepHome;
