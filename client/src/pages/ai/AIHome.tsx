import React, { useState } from "react";
import FeatureCard from "../../components/FeatureCard";
import { mockAIResponses } from "../../utils/mockData";

const AIHome: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(mockAIResponses);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message
    const newMessages = [...messages, { prompt, response: "", timestamp: new Date().toISOString() }];
    setMessages(newMessages);
    setPrompt("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const response = "This is a placeholder AI response. Once the backend AI service is integrated, real responses will appear here.";
      setMessages([...messages, { prompt, response, timestamp: new Date().toISOString() }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="module-page fade-in">
      <div className="module-header">
        <h1>AI Study Assistant</h1>
        <p>Your personal 24/7 tutor for viva prep, doubt solving, and notes summarization.</p>
      </div>

      <div className="module-grid mb-5">
        <FeatureCard
          icon="bi-mic-fill"
          title="Viva Preparation"
          description="Simulate real viva scenarios and practice answering common examiner questions."
        />
        <FeatureCard
          icon="bi-lightbulb-fill"
          title="Subject Doubt Solver"
          description="Get step-by-step explanations for complex academic concepts and problems."
        />
        <FeatureCard
          icon="bi-file-earmark-text-fill"
          title="AI Notes Summarizer"
          description="Paste lengthy textbook chapters and get concise, exam-ready summaries."
        />
      </div>

      <div className="chat-container">
        <div className="p-3 border-bottom" style={{ borderColor: "var(--ss-border)" }}>
          <h5 className="m-0 fw-semibold">
            <i className="bi bi-robot text-primary me-2"></i>
            Chat with Assistant
          </h5>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <React.Fragment key={i}>
              <div className="chat-bubble user">{msg.prompt}</div>
              {msg.response && (
                <div className="chat-bubble ai" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.response}
                </div>
              )}
            </React.Fragment>
          ))}
          {isLoading && (
            <div className="chat-bubble ai">
              <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
              <span className="ms-2">Thinking...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-input-area">
          <input
            type="text"
            placeholder="Ask a question or request a summary..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !prompt.trim()}>
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIHome;
