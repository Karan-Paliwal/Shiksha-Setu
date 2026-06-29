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
}

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
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  const saveCurrentSession = () => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find((message) => !message.isAi);
    const name = firstUserMessage?.text.slice(0, 42) || "Study session";

    setRecentSessions((prev) => [
      {
        id: Date.now().toString(),
        name,
        time: "Just now",
        messages,
      },
      ...prev.slice(0, 4),
    ]);
  };

  const startNewSession = () => {
    saveCurrentSession();
    setMessages([]);
    setInputValue("");
    setSelectedFile(null);
  };

  const loadSession = (session: Session) => {
    setMessages(session.messages);
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

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("prompt", displayText);
      formData.append("mode", "default");
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
      setMessages((prev) => [...prev, newAiMsg]);
      setSelectedFile(null);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I could not connect to the AI assistant. Please check the backend and GEMINI_API_KEY configuration.",
          isAi: true,
          time: formatClockTime(),
        },
      ]);
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

  const handleCategoryClick = (category: string) => {
    setInputValue(`I need help with ${category}. `);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) setTimeLeft(25 * 60);
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(25 * 60);
  };

  const canSend = (!!inputValue.trim() || !!selectedFile) && !isTyping;

  return (
    <div className="fade-in ai-page-wrapper">
      <div className="row g-0 border rounded-4 bg-white shadow-sm overflow-hidden h-100 ai-chat-container">
        <div className="col-lg-3 border-end bg-white d-flex flex-column h-100">
          <div className="p-4 border-bottom">
            <button
              className="btn btn-ss-primary w-100 py-3 rounded-pill fw-bold d-flex justify-content-center align-items-center gap-2 shadow-sm transition hover-shadow"
              onClick={startNewSession}
            >
              <i className="bi bi-plus-lg"></i> New Doubt Session
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="p-4 border-bottom">
              <h6 className="text-muted fw-bold mb-3 ai-text-xs-spacing">DIVE INTO MORE TOPICS</h6>
              <div className="d-flex flex-column gap-1">
                {[
                  ["General AI Assistant", "bi-robot"],
                  ["Computer Science", "bi-laptop"],
                  ["Mathematics", "bi-calculator"],
                  ["Physics", "bi-lightning"],
                  ["Exam Revision", "bi-journal-check"],
                ].map(([category, icon], index) => (
                  <button
                    key={category}
                    type="button"
                    className={`btn text-start d-flex justify-content-between align-items-center p-2 rounded-3 transition ${
                      index === 0 ? "bg-primary bg-opacity-10 text-primary fw-medium" : "text-dark hover-bg-light"
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className={`bi ${icon}`}></i> {category}
                    </span>
                    {index === 0 && <i className="bi bi-chevron-right small"></i>}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h6 className="text-muted fw-bold mb-3 ai-text-xs-spacing">RECENT SESSIONS</h6>
              {recentSessions.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {recentSessions.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      className="btn text-start d-flex gap-3 p-2 rounded-3 hover-bg-light transition align-items-start"
                      onClick={() => loadSession(session)}
                    >
                      <i className="bi bi-chat-left-text text-primary mt-1"></i>
                      <span className="overflow-hidden">
                        <span className="d-block fw-medium text-dark text-truncate ai-text-base" title={session.name}>
                          {session.name}
                        </span>
                        <span className="d-block text-muted ai-text-xs">{session.time}</span>
                      </span>
                    </button>
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

        <div className="col-lg-6 d-flex flex-column position-relative bg-white h-100">
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

          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4 ai-chat-bg">
            {messages.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center fade-in">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-4 ai-icon-lg shadow-sm">
                  <i className="bi bi-robot ai-icon-text-lg"></i>
                </div>
                <h3 className="fw-bold text-dark mb-3">How can I help you study today?</h3>
                <p className="text-muted mb-5 fs-6 ai-max-w-500">
                  I can summarize topics, solve problems, explain code, or analyze an uploaded document.
                </p>

                <div className="d-flex flex-wrap gap-3 justify-content-center ai-max-w-500">
                  {[
                    "Explain quantum physics simply",
                    "Generate a 5-question quiz on data structures",
                    "Help me debug this React code",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="btn btn-white border rounded-pill text-dark fw-medium px-4 py-2 hover-shadow transition d-flex align-items-center gap-2 shadow-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <i className="bi bi-stars text-primary"></i> {suggestion}
                    </button>
                  ))}
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
                      className={`p-4 shadow-sm ${
                        msg.isAi
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
                className={`btn btn-ss-primary text-white rounded-circle d-flex align-items-center justify-content-center me-1 transition shadow-sm ai-icon-sm ${
                  !canSend ? "opacity-50" : ""
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

        <div className="col-lg-3 bg-white p-4 overflow-auto border-start">
          <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 p-4 text-center mb-5 shadow-sm transition hover-shadow">
            <div className="text-primary fw-bold mb-2 d-flex align-items-center justify-content-center gap-2 ai-text-xs-spacing">
              <i className="bi bi-stopwatch"></i> REVISION TIMER
            </div>
            <div className="fw-black text-dark my-3 ai-timer-text">{formatTime(timeLeft)}</div>
            <div className="text-muted fst-italic mb-3 ai-text-xs-alt">
              {isTimerRunning ? "Focus session in progress" : "Pomodoro session ready"}
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button
                className={`btn ${isTimerRunning ? "btn-warning text-dark" : "btn-primary"} rounded-pill px-4 fw-medium shadow-sm transition`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? "Pause" : "Start"}
              </button>
              <button
                className="btn btn-light border rounded-pill px-4 fw-medium text-dark bg-white transition hover-bg-light"
                onClick={resetTimer}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="text-center mt-5 fade-in">
            <div className="text-muted mb-3 opacity-50">
              <i className="bi bi-lightbulb ai-icon-xl"></i>
            </div>
            <h6 className="fw-bold text-dark">Smart Insights</h6>
            <p className="text-muted ai-text-sm">
              As you chat with the AI, key takeaways and exam prep recommendations will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHome;
