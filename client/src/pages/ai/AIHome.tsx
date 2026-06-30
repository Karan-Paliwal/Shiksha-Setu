import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../../services/api";
import "./AIHome.css";

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  time: string;
}

interface Session {
  id: string;
  name: string;
  time: string;
  messages: Message[];
  insights?: { takeaways: string[]; recommendations: string[] };
  mode?: string;
}

const modeDetails: Record<string, { title: string; desc: string; icon: string; suggestions: string[] }> = {
  default: {
    title: "AI B.Tech Study Assistant",
    desc: "Ask any academic doubt, solve engineering problems, paste code, or analyze study materials.",
    icon: "bi-robot",
    suggestions: [
      "Explain quantum physics simply",
      "Generate a 5-question quiz on data structures",
      "Help me debug this React code",
    ]
  },
  computer_science: {
    title: "Computer Science & Coding Mode",
    desc: "Deep knowledge in algorithms, DSA, software engineering, databases, and system design. Ask me to write, optimize, or debug complex programs.",
    icon: "bi-laptop",
    suggestions: [
      "Explain Dijkstra's algorithm step-by-step",
      "Design a URL shortener database schema",
      "Compare Quick Sort vs Merge Sort complexity"
    ]
  },
  mathematics: {
    title: "Engineering Mathematics Mode",
    desc: "Deep knowledge in Calculus, Linear Algebra, Probability, Discrete Maths, and numerical methods. Break down derivations and proofs step-by-step.",
    icon: "bi-calculator",
    suggestions: [
      "Solve equations using Gauss-Seidel method",
      "Explain eigenvalues and eigenvectors intuitively",
      "Derive Fourier series for a square wave"
    ]
  },
  engineering_physics: {
    title: "Core Engineering & Physics Mode",
    desc: "Deep knowledge in circuit analysis, thermodynamics, semiconductor physics, electromagnetism, and classical mechanics. Analyze physical laws and circuit theorems.",
    icon: "bi-lightning",
    suggestions: [
      "Explain Thevenin's theorem with an example",
      "Derive Maxwell's electromagnetic equations",
      "Analyze the Carnot thermodynamic cycle efficiency"
    ]
  },
  exam_prep: {
    title: "Placement & GATE Prep Mode",
    desc: "Tailored for campus placement coding rounds, GATE syllabus, operating systems, DBMS, networks, and technical interviews. Practice with mock quizzes.",
    icon: "bi-journal-check",
    suggestions: [
      "Conduct a mock software engineer interview",
      "GATE quiz: CPU scheduling algorithms",
      "Explain TCP 3-way handshake in detail"
    ]
  }
};

const formatClockTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const AIHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<string>("default");
  const [insights, setInsights] = useState<{ takeaways: string[]; recommendations: string[] }>({
    takeaways: [],
    recommendations: [],
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [customDuration, setCustomDuration] = useState(25);
  const [isEditingTimer, setIsEditingTimer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsTimerRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isTimerRunning]);

  // Fetch saved chat sessions from backend on mount
  useEffect(() => {
    const fetchSavedSessions = async () => {
      try {
        const response = await api.get("/ai/sessions");
        if (response.data && Array.isArray(response.data.sessions)) {
          const mappedSessions: Session[] = response.data.sessions.map((s: any) => ({
            id: s.sessionId,
            name: s.name,
            time: new Date(s.updatedAt).toLocaleDateString() + " " + new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: s.messages,
            insights: s.insights,
            mode: s.mode || "default",
          }));
          setRecentSessions(mappedSessions);
        }
      } catch (error) {
        console.error("Failed to fetch saved chat sessions:", error);
      }
    };
    fetchSavedSessions();
  }, []);

  const syncSessionToBackend = async (
    sessionId: string,
    name: string,
    currentMessages: Message[],
    currentInsights: { takeaways: string[]; recommendations: string[] },
    mode: string
  ) => {
    try {
      await api.post("/ai/sessions/save", {
        sessionId,
        name,
        messages: currentMessages,
        insights: currentInsights,
        mode,
      });
    } catch (error) {
      console.error("Error syncing session to backend:", error);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/sessions/${sessionId}`);
      setRecentSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        startNewSession();
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const startNewSession = () => {
    setMessages([]);
    setInputValue("");
    setSelectedFile(null);
    setInsights({ takeaways: [], recommendations: [] });
    setActiveSessionId(null);
    setChatMode("default");
  };

  const loadSession = (session: Session) => {
    setMessages(session.messages);
    setInsights(session.insights || { takeaways: [], recommendations: [] });
    setActiveSessionId(session.id);
    setChatMode(session.mode || "default");
  };

  const handleCategoryClick = (mode: string) => {
    setMessages([]);
    setInputValue("");
    setSelectedFile(null);
    setInsights({ takeaways: [], recommendations: [] });
    setActiveSessionId(null);
    setChatMode(mode);
  };

  const changeDurationPreset = (mins: number) => {
    setIsTimerRunning(false);
    setCustomDuration(mins);
    setTimeLeft(mins * 60);
  };

  const saveCustomDuration = () => {
    setIsEditingTimer(false);
    setTimeLeft(customDuration * 60);
    setIsTimerRunning(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const prompt = inputValue.trim();
    if (!prompt && !selectedFile) return;

    const displayText = prompt || `Please analyze this file: ${selectedFile?.name}`;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: selectedFile ? `${displayText}\n\nAttached: ${selectedFile.name}` : displayText,
      isAi: false,
      time: formatClockTime(),
    };

    // Determine session ID
    const currentSessionId = activeSessionId || Date.now().toString();
    if (!activeSessionId) {
      setActiveSessionId(currentSessionId);
    }

    const updatedMessagesWithUser = [...messages, newUserMsg];
    setMessages(updatedMessagesWithUser);
    setInputValue("");
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("prompt", displayText);
      formData.append("mode", chatMode);
      if (selectedFile) formData.append("file", selectedFile);

      const response = await api.post("/ai/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response || "I could not generate a response for that prompt.",
        isAi: true,
        time: formatClockTime(),
      };
      const finalMessages = [...updatedMessagesWithUser, newAiMsg];
      setMessages(finalMessages);
      setSelectedFile(null);

      // Determine insights
      let updatedInsights = { ...insights };
      if (response.data.insights) {
        const newTakeaways = response.data.insights.takeaways || [];
        const newRecommendations = response.data.insights.recommendations || [];

        const combinedTakeaways = Array.from(new Set([...insights.takeaways, ...newTakeaways]));
        const combinedRecs = Array.from(new Set([...insights.recommendations, ...newRecommendations]));

        updatedInsights = {
          takeaways: combinedTakeaways,
          recommendations: combinedRecs,
        };
        setInsights(updatedInsights);
      }

      // Sync to backend automatically
      const firstUserMessage = finalMessages.find((m) => !m.isAi);
      const sessionName = firstUserMessage?.text.slice(0, 42) || "Study session";
      await syncSessionToBackend(currentSessionId, sessionName, finalMessages, updatedInsights, chatMode);

      // Update recent sessions list locally
      setRecentSessions((prev) => {
        const existingSessionIdx = prev.findIndex((s) => s.id === currentSessionId);
        const nowStr = "Just now";
        const sessionObj: Session = {
          id: currentSessionId,
          name: sessionName,
          time: nowStr,
          messages: finalMessages,
          insights: updatedInsights,
          mode: chatMode,
        };

        if (existingSessionIdx >= 0) {
          // Move to top and update
          const updated = [...prev];
          updated.splice(existingSessionIdx, 1);
          return [sessionObj, ...updated];
        } else {
          return [sessionObj, ...prev.slice(0, 4)];
        }
      });

    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I could not connect to the AI assistant. Please check the backend and GEMINI_API_KEY configuration.",
        isAi: true,
        time: formatClockTime(),
      };
      const finalMessagesWithError = [...updatedMessagesWithUser, errorMsg];
      setMessages(finalMessagesWithError);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    e.target.value = "";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };



  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(customDuration * 60);
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(customDuration * 60);
  };

  const canSend = (!!inputValue.trim() || !!selectedFile) && !isTyping;

  return (
    <div className="fade-in ai-page-wrapper">
      <div className="row g-0 border rounded-4 bg-white shadow-sm ai-chat-container">
        <div className="col-lg-3 border-end bg-white d-flex flex-column">
          <div className="p-4 border-bottom">
            <button
              className="btn btn-ss-primary w-100 py-3 rounded-pill fw-bold d-flex justify-content-center align-items-center gap-2 shadow-sm transition hover-shadow"
              onClick={startNewSession}
            >
              <i className="bi bi-plus-lg"></i> New Doubt Session
            </button>
          </div>

          <div className="flex-grow-1">
            <div className="p-4 border-bottom">
              <h6 className="text-muted fw-bold mb-3 ai-text-xs-spacing">DIVE INTO MORE TOPICS</h6>
              <div className="d-flex flex-column gap-1">
                {[
                  { name: "General AI Assistant", mode: "default", icon: "bi-robot" },
                  { name: "Computer Science & Coding", mode: "computer_science", icon: "bi-laptop" },
                  { name: "Engineering Mathematics", mode: "mathematics", icon: "bi-calculator" },
                  { name: "Core Engineering & Physics", mode: "engineering_physics", icon: "bi-lightning" },
                  { name: "Placement & GATE Prep", mode: "exam_prep", icon: "bi-journal-check" },
                ].map((cat) => {
                  const isActive = chatMode === cat.mode;
                  return (
                    <button
                      key={cat.mode}
                      type="button"
                      className={`btn text-start d-flex justify-content-between align-items-center p-2.5 rounded-3 transition ${
                        isActive ? "ai-sidebar-active text-primary" : "text-dark hover-bg-light"
                      }`}
                      onClick={() => handleCategoryClick(cat.mode)}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <i className={`bi ${cat.icon}`}></i> {cat.name}
                      </span>
                      {isActive && <i className="bi bi-chevron-right small text-primary"></i>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4">
              <h6 className="text-muted fw-bold mb-3 ai-text-xs-spacing">RECENT SESSIONS</h6>
              {recentSessions.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`d-flex justify-content-between align-items-center p-2 rounded-3 hover-bg-light transition ${activeSessionId === session.id ? "bg-light border border-primary-subtle" : ""
                        }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => loadSession(session)}
                    >
                      <div className="d-flex gap-3 align-items-start overflow-hidden flex-grow-1">
                        <i className="bi bi-chat-left-text text-primary mt-1"></i>
                        <span className="overflow-hidden">
                          <span className="d-block fw-medium text-dark text-truncate ai-text-base" style={{ maxWidth: '140px' }} title={session.name}>
                            {session.name}
                          </span>
                          <span className="d-block text-muted ai-text-xs">{session.time}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link text-muted p-1 hover-text-danger border-0 d-flex align-items-center justify-content-center rounded-circle transition"
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        title="Delete Session"
                      >
                        <i className="bi bi-trash small"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted p-4 bg-light rounded-4 ai-text-sm border">
                  No recent sessions. Start a new chat.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6 d-flex flex-column position-relative bg-white">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white z-1 shadow-sm">
            <h5 className="mb-0 fw-bold fs-5 d-flex align-items-center gap-2 text-dark">
              {messages.length === 0 ? "New Study Session" : "Active Session"}
            </h5>
            {messages.length > 0 && (
              <button
                className="btn btn-sm btn-outline-success rounded-pill fw-medium px-4 py-2 d-flex align-items-center gap-2 transition hover-shadow"
                onClick={startNewSession}
              >
                <i className="bi bi-check-circle"></i> Mark Solved
              </button>
            )}
          </div>

          <div className="flex-grow-1 p-4 d-flex flex-column gap-4 ai-chat-bg">
            {messages.length === 0 ? (
              <div className="d-flex align-items-center justify-content-center h-100 p-4">
                <div className="d-flex flex-column align-items-center text-center fade-in ai-cyber-welcome-card border">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-4 ai-icon-lg shadow-sm">
                    <i className={`bi ${(modeDetails[chatMode] || modeDetails.default).icon} ai-icon-text-lg`}></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-2">{(modeDetails[chatMode] || modeDetails.default).title}</h3>
                  <p className="text-primary fw-medium mb-3 small bg-primary bg-opacity-10 px-3 py-1.5 rounded-pill shadow-sm" style={{ letterSpacing: '0.3px' }}>
                    <i className="bi bi-stars me-1 text-warning"></i> B.Tech Specialized Persona Active
                  </p>
                  <p className="text-muted mb-4 small" style={{ maxWidth: '400px', lineHeight: '1.5' }}>
                    {(modeDetails[chatMode] || modeDetails.default).desc}
                  </p>
                  
                  <div className="border-top w-100 my-2 pt-3">
                    <span className="d-block text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                      Try asking these topics:
                    </span>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {((modeDetails[chatMode] || modeDetails.default).suggestions).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          className="btn btn-sm btn-white border rounded-pill text-dark fw-medium px-3 py-2 hover-shadow transition d-flex align-items-center gap-2 shadow-sm"
                          style={{ fontSize: '0.78rem' }}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <i className="bi bi-stars text-primary"></i> {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex flex-column w-100 fade-in ${msg.isAi ? "align-items-start" : "align-items-end"}`}
                  >
                    {msg.isAi && (
                      <div className="d-flex align-items-center gap-2 mb-2 ms-2">
                        <i className="bi bi-stars text-primary fs-5"></i>
                        <span className="fw-bold text-primary ai-text-xs-alt-spacing">SHIKSHA AI</span>
                      </div>
                    )}
                    <div
                      className={`p-4 shadow-sm ${msg.isAi
                          ? "bg-white border text-dark rounded-4 rounded-top-0"
                          : "bg-ss-primary text-white rounded-4 rounded-end-0"
                        } ai-max-w-85`}
                    >
                      <div className="mb-0 ai-text-md-lh">
                        {msg.isAi ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        ) : (
                          <p className="mb-0">{msg.text}</p>
                        )}
                      </div>
                    </div>
                    <div className={`text-muted mt-2 px-2 ai-text-xxs ${!msg.isAi ? "me-2" : "ms-2"}`}>
                      {msg.time}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="d-flex align-items-start gap-3 w-100 fade-in">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2 ms-2">
                        <i className="bi bi-stars text-primary fs-5"></i>
                        <span className="fw-bold text-primary ai-text-xs-alt-spacing">SHIKSHA AI</span>
                      </div>
                      <div className="bg-white border rounded-4 rounded-top-0 p-4 shadow-sm d-inline-block">
                        <div className="spinner-grow spinner-grow-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm text-primary me-2 ai-delay-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm text-primary me-2 ai-delay-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white z-1 border-top">
            {selectedFile && (
              <div className="mb-3 ms-3 d-inline-flex align-items-center bg-light border rounded-pill px-3 py-2 shadow-sm">
                <span className="small text-truncate fw-medium" style={{ maxWidth: "250px" }}>
                  <i className="bi bi-file-earmark me-2 text-primary"></i>
                  {selectedFile.name}
                </span>
                <button
                  type="button"
                  className="btn-close ms-3"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => setSelectedFile(null)}
                ></button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="ai-input-wrapper rounded-pill p-2 d-flex align-items-center">
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                className="btn btn-link text-muted p-2 rounded-circle hover-bg-light ms-2 transition d-flex align-items-center justify-content-center"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
              >
                <i className="bi bi-paperclip fs-5"></i>
              </button>
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none px-3 py-2 ai-text-md"
                placeholder="Ask a doubt, paste a math problem, or share your notes..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className={`btn btn-ss-primary text-white rounded-circle d-flex align-items-center justify-content-center me-1 transition shadow-sm ai-icon-sm ${!canSend ? "opacity-50" : ""
                  }`}
                disabled={!canSend}
                aria-label="Send message"
              >
                <i className="bi bi-send-fill fs-5"></i>
              </button>
            </form>
            <div className="text-center mt-3 text-muted ai-text-xs">
              AI assistant may occasionally generate inaccurate info. Cross-verify critical exam data.
            </div>
          </div>
        </div>

        <div className="col-lg-3 bg-white p-4 border-start">
          <div className="p-4 text-center mb-5 ai-timer-card border transition hover-shadow">
            <div className="text-info fw-bold mb-2 d-flex align-items-center justify-content-center gap-2 ai-text-xs-spacing" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-stopwatch-fill"></i> B.TECH REVISION TIMER
            </div>
            
            {isEditingTimer ? (
              <div className="d-flex align-items-center justify-content-center gap-2 my-3">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Math.max(1, Math.min(180, Number(e.target.value))))}
                  className="form-control text-center fw-bold fs-4 p-1 shadow-sm border-primary ai-input-edit-cyber"
                  style={{ width: "80px", borderRadius: "10px" }}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-info rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: "36px", height: "36px" }}
                  onClick={saveCustomDuration}
                >
                  <i className="bi bi-check-lg text-dark"></i>
                </button>
              </div>
            ) : (
              <div className="my-3 ai-timer-text-cyber d-flex align-items-center justify-content-center gap-2">
                <span>{formatTime(timeLeft)}</span>
                {!isTimerRunning && (
                  <button
                    type="button"
                    className="btn btn-link text-info p-1 hover-text-white border-0 d-flex align-items-center justify-content-center transition"
                    onClick={() => setIsEditingTimer(true)}
                    title="Edit duration"
                  >
                    <i className="bi bi-pencil-square" style={{ fontSize: '1rem' }}></i>
                  </button>
                )}
              </div>
            )}

            <div className="d-flex gap-1.5 justify-content-center mb-3 flex-wrap">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  disabled={isTimerRunning}
                  className={`btn ai-preset-btn ${customDuration === mins ? "active" : ""}`}
                  onClick={() => changeDurationPreset(mins)}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <div className="text-secondary fst-italic mb-3 small">
              {isTimerRunning ? "⚡ Focus session running..." : "🤖 Mode Ready"}
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button
                className={`btn ${isTimerRunning ? "btn-warning text-dark" : "btn-info text-dark"} rounded-pill px-4 fw-bold shadow-sm transition`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? "Pause" : "Start"}
              </button>
              <button
                className="btn btn-outline-light rounded-pill px-4 fw-medium transition"
                onClick={resetTimer}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 fade-in">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <i className="bi bi-lightbulb-fill text-warning fs-5"></i>
              <h6 className="fw-bold text-dark mb-0">Smart Insights</h6>
            </div>

            {insights.takeaways.length === 0 && insights.recommendations.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-4 border px-3">
                <div className="text-muted mb-2 opacity-50">
                  <i className="bi bi-chat-dots fs-3"></i>
                </div>
                <p className="text-muted small mb-0">
                  As you chat with the AI, key takeaways and exam prep recommendations will appear here.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {insights.takeaways.length > 0 && (
                  <div>
                    <span className="badge ai-badge-takeaways mb-2 fw-semibold px-2.5 py-1.5 rounded-pill text-uppercase" style={{ fontSize: '0.7rem' }}>
                      Key Takeaways
                    </span>
                    <ul className="list-group list-group-flush gap-1">
                      {insights.takeaways.map((takeaway, idx) => (
                        <li key={idx} className="list-group-item bg-transparent border-0 px-0 py-1 d-flex align-items-start gap-2 small text-dark">
                          <i className="bi bi-check-circle-fill text-success mt-0.5" style={{ fontSize: '0.85rem' }}></i>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.recommendations.length > 0 && (
                  <div>
                    <span className="badge ai-badge-recs mb-2 fw-semibold px-2.5 py-1.5 rounded-pill text-uppercase" style={{ fontSize: '0.7rem' }}>
                      Recommended Actions
                    </span>
                    <ul className="list-group list-group-flush gap-1">
                      {insights.recommendations.map((rec, idx) => (
                        <li key={idx} className="list-group-item bg-transparent border-0 px-0 py-1 d-flex align-items-start gap-2 small text-dark">
                          <i className="bi bi-stars text-warning mt-0.5" style={{ fontSize: '0.85rem' }}></i>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHome;
