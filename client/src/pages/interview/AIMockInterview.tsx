import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../../services/api";

type ViewState = "SETUP" | "INTERVIEWING" | "SCORECARD";
type Mode = "behavioral" | "coding";

interface Message {
  role: "user" | "model";
  text: string;
}

const AIMockInterview: React.FC = () => {
  const [view, setView] = useState<ViewState>("SETUP");
  const [mode, setMode] = useState<Mode>("behavioral");
  const [resumeText, setResumeText] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("// Write your solution here\n");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [answer, setAnswer] = useState("");
  const [scorecard, setScorecard] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/mock/start", { history: [], mode, resumeText });
      setHistory([{ role: "model", text: res.data.question }]);
      setView("INTERVIEWING");
    } catch (err) {
      console.error(err);
      alert("Failed to start mock interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() && mode === "behavioral") return;
    
    setLoading(true);
    const userText = answer.trim() ? answer : "Submitted code.";
    const newHistory: Message[] = [...history, { role: "user", text: userText }];
    setHistory(newHistory);
    setAnswer("");

    try {
      const evalRes = await api.post("/ai/mock/chat", {
        history: history, // evaluate based on what was asked
        answer: userText,
        code: mode === "coding" ? code : undefined,
        mode
      });
      
      const feedbackMsg: Message = { 
        role: "model", 
        text: `**Feedback (Score: ${evalRes.data.score}/10):**\n${evalRes.data.feedback}` 
      };
      let updatedHistory = [...newHistory, feedbackMsg];
      setHistory(updatedHistory);

      if (evalRes.data.isGoodEnoughToMoveOn) {
        const nextQRes = await api.post("/ai/mock/start", { history: updatedHistory, mode });
        setHistory([...updatedHistory, { role: "model", text: nextQRes.data.question }]);
      } else {
        setHistory([...updatedHistory, { role: "model", text: "Please clarify or improve your answer based on the feedback." }]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/mock/finish", { history });
      setScorecard(res.data);
      setView("SCORECARD");
    } catch (err) {
      console.error(err);
      alert("Failed to generate scorecard.");
    } finally {
      setLoading(false);
    }
  };

  if (view === "SETUP") {
    return (
      <div className="container py-5 fade-in">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-person-video3 fs-2"></i>
                </div>
                <h3 className="fw-bold text-dark">AI Mock Interviewer</h3>
                <p className="text-muted">Practice with a realistic AI technical interviewer.</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Select Interview Mode</label>
                <div className="d-flex gap-3">
                  <button 
                    className={`btn flex-grow-1 py-3 border rounded-3 ${mode === 'behavioral' ? 'btn-primary' : 'btn-light text-dark'}`}
                    onClick={() => setMode('behavioral')}
                  >
                    <i className="bi bi-people-fill d-block fs-4 mb-2"></i>
                    Behavioral (STAR)
                  </button>
                  <button 
                    className={`btn flex-grow-1 py-3 border rounded-3 ${mode === 'coding' ? 'btn-primary' : 'btn-light text-dark'}`}
                    onClick={() => setMode('coding')}
                  >
                    <i className="bi bi-code-slash d-block fs-4 mb-2"></i>
                    Coding & DSA
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Resume Text (Optional)</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  placeholder="Paste your resume text here to get tailored questions..."
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                ></textarea>
                <div className="form-text">If provided, the first question will be based on your experience.</div>
              </div>

              <button 
                className="btn btn-primary w-100 py-3 fw-bold rounded-pill"
                onClick={handleStart}
                disabled={loading}
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : "Start Mock Interview"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "SCORECARD") {
    return (
      <div className="container py-5 fade-in">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
              <i className="bi bi-trophy-fill text-warning fs-1 mb-3"></i>
              <h2 className="fw-bold mb-4">Interview Scorecard</h2>
              
              <div className="row g-4 mb-5 text-start">
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border">
                    <h1 className="fw-bold text-primary mb-0">{scorecard.overallScore}/10</h1>
                    <small className="text-muted text-uppercase fw-bold">Overall</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border">
                    <h3 className="fw-bold text-dark mb-0">{scorecard.technicalAccuracy}/10</h3>
                    <small className="text-muted text-uppercase fw-bold">Technical</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border">
                    <h3 className="fw-bold text-dark mb-0">{scorecard.communication}/10</h3>
                    <small className="text-muted text-uppercase fw-bold">Comm.</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center border">
                    <h3 className="fw-bold text-dark mb-0">{scorecard.problemSolving}/10</h3>
                    <small className="text-muted text-uppercase fw-bold">Problem Solving</small>
                  </div>
                </div>
              </div>

              <div className="row text-start mb-4">
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-success"><i className="bi bi-check-circle-fill me-2"></i>Strengths</h6>
                  <ul className="list-group list-group-flush border rounded-3">
                    {scorecard.strengths?.map((s: string, i: number) => (
                      <li key={i} className="list-group-item bg-transparent text-muted small">{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>Areas for Improvement</h6>
                  <ul className="list-group list-group-flush border rounded-3">
                    {scorecard.areasForImprovement?.map((a: string, i: number) => (
                      <li key={i} className="list-group-item bg-transparent text-muted small">{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-primary bg-opacity-10 rounded-3 text-start">
                <h6 className="fw-bold text-primary">Final Verdict</h6>
                <p className="mb-0 text-dark">{scorecard.finalVerdict}</p>
              </div>

              <div className="mt-4">
                <button className="btn btn-outline-primary px-4 rounded-pill fw-bold" onClick={() => window.location.reload()}>
                  Start New Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INTERVIEWING VIEW
  return (
    <div className="container-fluid py-3 h-100 fade-in" style={{ maxHeight: 'calc(100vh - 70px)' }}>
      <div className="row h-100 g-3">
        {/* Chat Pane */}
        <div className={`col-lg-${mode === 'coding' ? '5' : '8'} mx-auto h-100 d-flex flex-column`}>
          <div className="card shadow-sm border-0 rounded-4 flex-grow-1 d-flex flex-column overflow-hidden">
            <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-robot text-primary"></i> AI Interviewer
              </h5>
              <button className="btn btn-sm btn-danger rounded-pill fw-medium px-3" onClick={handleFinish} disabled={loading}>
                End Interview
              </button>
            </div>
            
            <div className="flex-grow-1 p-4 overflow-auto bg-light" style={{ maxHeight: '60vh' }}>
              {history.map((msg, idx) => (
                <div key={idx} className={`d-flex flex-column w-100 mb-4 ${msg.role === 'model' ? "align-items-start" : "align-items-end"}`}>
                  {msg.role === 'model' && (
                    <div className="d-flex align-items-center gap-2 mb-1 ms-1">
                      <span className="fw-bold text-primary small">INTERVIEWER</span>
                    </div>
                  )}
                  <div className={`p-3 shadow-sm ${msg.role === 'model' ? "bg-white border text-dark rounded-4 rounded-top-0" : "bg-primary text-white rounded-4 rounded-end-0"}`} style={{ maxWidth: '85%' }}>
                    {msg.role === 'model' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    ) : (
                      <p className="mb-0">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="d-flex align-items-start gap-3 w-100 fade-in mb-4">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1 ms-1">
                      <span className="fw-bold text-primary small">INTERVIEWER</span>
                    </div>
                    <div className="bg-white border rounded-4 rounded-top-0 p-3 shadow-sm d-inline-block">
                      <div className="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
                      <div className="spinner-grow spinner-grow-sm text-primary me-1" style={{ animationDelay: '0.2s'}} role="status"></div>
                      <div className="spinner-grow spinner-grow-sm text-primary" style={{ animationDelay: '0.4s'}} role="status"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-top bg-white">
              <label className="form-label fw-bold text-muted small">Your Answer / Thought Process</label>
              <textarea 
                className="form-control mb-2" 
                rows={mode === 'coding' ? 2 : 4} 
                placeholder="Explain your approach..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
              ></textarea>
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                  onClick={handleSubmitAnswer}
                  disabled={loading || (!answer.trim() && mode === 'behavioral')}
                >
                  <i className="bi bi-send-fill me-2"></i>Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Pane (Only if coding mode) */}
        {mode === 'coding' && (
          <div className="col-lg-7 h-100 d-flex flex-column">
            <div className="card shadow-sm border-0 rounded-4 flex-grow-1 overflow-hidden d-flex flex-column">
              <div className="p-3 border-bottom bg-dark text-white d-flex align-items-center justify-content-between">
                <h6 className="mb-0 fw-bold"><i className="bi bi-code-slash me-2"></i>Code Workspace</h6>
                <select 
                  className="form-select form-select-sm w-auto bg-dark text-white border-secondary"
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              <div className="flex-grow-1 position-relative bg-dark" style={{ minHeight: '500px' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  <Editor
                    height="100%"
                    language={codeLanguage}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMockInterview;
