import React, { useState, useRef, useEffect } from "react";
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

const AIHome: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer states
  const POMODORO_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(POMODORO_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputValue || (selectedFile ? `[Attached File: ${selectedFile.name}]` : ""),
      isAi: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const formData = new FormData();
      if (inputValue.trim()) {
        formData.append("prompt", inputValue);
      } else {
        formData.append("prompt", `Please analyze this file: ${selectedFile?.name}`);
      }
      
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      
      setSelectedFile(null);

      const response = await api.post("/ai/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isAi: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error connecting to the AI assistant.",
        isAi: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleCategoryClick = (category: string) => {
    setInputValue(`I need help with ${category}. `);
  };

  return (
    <div className="fade-in h-100 ai-page-pb">
      <div className="row g-0 border rounded-4 bg-white shadow-sm overflow-hidden h-100 ai-chat-container">
        
        {/* Left Sidebar */}
        <div className="col-lg-3 border-end bg-white d-flex flex-column">
          <div className="p-4 border-bottom">
            <button 
              className="btn btn-ss-primary w-100 py-3 rounded-3 fw-bold d-flex justify-content-center align-items-center gap-2 shadow-sm transition hover-shadow"
              onClick={() => setMessages([])}
            >
              <i className="bi bi-plus-lg"></i> New Doubt Session
            </button>
          </div>
          
          <div className="flex-grow-1 overflow-auto">
            {/* Doubt Categories */}
            <div className="p-4 border-bottom">
              <h6 className="text-muted fw-bold mb-3 ai-text-xs-spacing">DOUBT CATEGORIES</h6>
              <div className="d-flex flex-column gap-1">
                <div 
                  className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-primary bg-opacity-10 text-primary cursor-pointer fw-medium transition"
                  onClick={() => handleCategoryClick("General AI")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-robot"></i> General AI Assistant
                  </div>
                  <i className="bi bi-chevron-right small"></i>
                </div>
                <div 
                  className="d-flex justify-content-between align-items-center p-2 rounded-3 text-dark hover-bg-light cursor-pointer transition"
                  onClick={() => handleCategoryClick("Computer Science")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-laptop"></i> Computer Science
                  </div>
                </div>
                <div 
                  className="d-flex justify-content-between align-items-center p-2 rounded-3 text-dark hover-bg-light cursor-pointer transition"
                  onClick={() => handleCategoryClick("Mathematics")}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-calculator"></i> Mathematics
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="p-4">
              <h6 className="text-muted fw-bold mb-3 ai-text-xs-spacing">RECENT SESSIONS</h6>
              {messages.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-3 cursor-pointer p-2 rounded hover-bg-light transition" onClick={() => {}}>
                    <i className="bi bi-chat-left-text text-primary mt-1"></i>
                    <div>
                      <div className="fw-medium text-dark text-truncate ai-text-base">Current Session</div>
                      <div className="text-muted ai-text-xs">Just now</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted p-3 border border-dashed rounded-3 ai-text-sm">
                  No recent sessions. Start a new chat!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="col-lg-6 border-end d-flex flex-column position-relative bg-white">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white z-1 shadow-sm">
            <h5 className="mb-0 fw-bold fs-6 d-flex align-items-center gap-2 text-dark">
              {messages.length === 0 ? "New Study Session" : "Active Session"}
            </h5>
            {messages.length > 0 && (
              <button 
                className="btn btn-sm btn-outline-success rounded-pill fw-medium px-3 d-flex align-items-center gap-1 transition"
                onClick={() => setMessages([])}
              >
                <i className="bi bi-check-circle"></i> Mark Solved
              </button>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4 ai-chat-bg">
            
            {messages.length === 0 ? (
              // Empty State
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center fade-in">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3 ai-icon-lg">
                  <i className="bi bi-robot ai-icon-text-lg"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">How can I help you study today?</h4>
                <p className="text-muted mb-4 ai-max-w-400">I can summarize complex topics, solve math problems, or quiz you for your next exam. Let's get started!</p>
                
                <div className="d-flex flex-wrap gap-2 justify-content-center ai-max-w-500">
                  <button className="btn btn-light border rounded-pill text-dark fw-medium px-4 py-2 hover-shadow transition d-flex align-items-center gap-2" onClick={() => handleSuggestionClick("Explain Quantum Physics simply")}>
                    <i className="bi bi-stars text-primary"></i> Explain Quantum Physics
                  </button>
                  <button className="btn btn-light border rounded-pill text-dark fw-medium px-4 py-2 hover-shadow transition d-flex align-items-center gap-2" onClick={() => handleSuggestionClick("Generate a 5-question quiz on Data Structures")}>
                    <i className="bi bi-ui-checks text-success"></i> Quiz on Data Structures
                  </button>
                  <button className="btn btn-light border rounded-pill text-dark fw-medium px-4 py-2 hover-shadow transition d-flex align-items-center gap-2" onClick={() => handleSuggestionClick("Help me debug this React code")}>
                    <i className="bi bi-code-slash text-danger"></i> Debug React Code
                  </button>
                </div>
              </div>
            ) : (
              // Chat History
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`d-flex flex-column w-100 fade-in ${msg.isAi ? 'align-items-start' : 'align-items-end'}`}>
                    {msg.isAi && (
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-stars text-primary fs-5"></i>
                        <span className="fw-bold text-primary ai-text-xs-alt-spacing">SHIKSHA AI</span>
                      </div>
                    )}
                    <div 
                      className={`p-4 shadow-sm ${msg.isAi ? 'bg-white border text-dark rounded-4 rounded-top-0' : 'bg-ss-primary text-white rounded-4 rounded-end-0'} ai-max-w-85`}
                    >
                      <div className="mb-0 ai-text-md-lh">
                        {msg.isAi ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        ) : (
                          <p className="mb-0">{msg.text}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-muted mt-1 px-2 ai-text-xxs">{msg.time}</div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="d-flex align-items-start gap-3 w-100 fade-in">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-stars text-primary fs-5"></i>
                        <span className="fw-bold text-primary ai-text-xs-alt-spacing">SHIKSHA AI</span>
                      </div>
                      <div className="bg-white border rounded-4 rounded-top-0 p-3 shadow-sm d-inline-block">
                        <div className="spinner-grow spinner-grow-sm text-primary me-1" role="status"><span className="visually-hidden">Loading...</span></div>
                        <div className="spinner-grow spinner-grow-sm text-primary me-1 ai-delay-1" role="status"><span className="visually-hidden">Loading...</span></div>
                        <div className="spinner-grow spinner-grow-sm text-primary ai-delay-2" role="status"><span className="visually-hidden">Loading...</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-top bg-white z-1 shadow-sm">
            {selectedFile && (
              <div className="mb-2 ms-3 d-inline-flex align-items-center bg-light border rounded-pill px-3 py-1">
                <span className="small text-truncate" style={{ maxWidth: '200px' }}>
                  <i className="bi bi-file-earmark me-2 text-primary"></i>
                  {selectedFile.name}
                </span>
                <button type="button" className="btn-close ms-2" style={{ fontSize: '0.65rem' }} onClick={() => setSelectedFile(null)}></button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="border rounded-pill p-2 d-flex align-items-center bg-white shadow-sm hover-shadow transition">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleFileChange} 
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button 
                type="button" 
                className="btn btn-link text-muted p-2 rounded-circle hover-bg-light ms-1 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="bi bi-paperclip fs-5"></i>
              </button>
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none px-3 ai-text-md" placeholder="Ask a doubt or paste a math problem..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button 
                type="submit" 
                className={`btn btn-ss-primary text-white rounded-circle d-flex align-items-center justify-content-center me-1 transition ${(!inputValue.trim() && !selectedFile) ? 'opacity-50' : ''} ai-icon-sm`}
                disabled={(!inputValue.trim() && !selectedFile) || isTyping}
              >
                <i className="bi bi-send-fill fs-6"></i>
              </button>
            </form>
            <div className="text-center mt-2 text-muted ai-text-xxs-alt">
              AI assistant may occasionally generate inaccurate info. Cross-verify critical exam data.
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-3 bg-white p-4 overflow-auto">
          
          {/* Revision Timer */}
          <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 p-4 text-center mb-5 shadow-sm transition hover-shadow">
            <div className="text-primary fw-bold mb-2 d-flex align-items-center justify-content-center gap-2 ai-text-xs-spacing">
              <i className="bi bi-stopwatch"></i> REVISION TIMER
            </div>
            <div className="fw-black text-dark my-3 ai-timer-text">{formatTime(timeLeft)}</div>
            <div className="text-muted fst-italic mb-3 ai-text-xs-alt">
              {isTimerRunning ? "Focus Session in Progress" : "Pomodoro Session Ready"}
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className={`btn ${isTimerRunning ? 'btn-warning text-dark' : 'btn-primary'} rounded-pill px-4 fw-medium shadow-sm transition`}
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

          {/* Contextual Empty State */}
          <div className="text-center mt-5 fade-in">
            <div className="text-muted mb-3 opacity-50">
              <i className="bi bi-lightbulb ai-icon-xl"></i>
            </div>
            <h6 className="fw-bold text-dark">Smart Insights</h6>
            <p className="text-muted ai-text-sm">As you chat with the AI, key takeaways and exam prep recommendations will appear here.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIHome;
