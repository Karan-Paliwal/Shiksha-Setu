import React from "react";
import "./InterviewPrepHome.css";

const InterviewPrepHome: React.FC = () => {
  return (
    <div className="fade-in pb-5 ip-textarea">
      <div className="row g-4">
        {/* Main Content Area (Left) */}
        <div className="col-lg-8 pe-lg-4">
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="fw-bold text-dark mb-2 ip-title">Interview Mastery Destination</h1>
              <p className="text-secondary fs-6 mb-0 ip-subtitle">
                Practice coding, polish behavioral responses, and schedule mock sessions with industry mentors.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light border d-flex align-items-center gap-2 fw-medium shadow-sm">
                <i className="bi bi-calendar"></i> Schedule Mock
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2 fw-medium shadow-sm">
                <i className="bi bi-stars"></i> Start Practice
              </button>
            </div>
          </div>

          {/* Cards Row */}
          <div className="row g-4 mb-5">
            {/* AI Mock Interview */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 ip-bg-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center ip-icon-sm">
                    <i className="bi bi-play-fill fs-4"></i>
                  </div>
                  <h5 className="fw-bold mb-0">AI Mock Interview</h5>
                </div>
                <p className="text-secondary mb-4 flex-grow-1 ip-text-base">
                  Instant feedback on your technical and behavioral skills using our AI interviewer.
                </p>
                <button className="btn btn-primary w-100 fw-medium">Start AI Session</button>
              </div>
            </div>

            {/* Live Mentor Mock */}
            <div className="col-md-6">
              <div className="card border shadow-sm rounded-4 h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-light text-dark border rounded-3 d-flex align-items-center justify-content-center ip-icon-sm">
                    <i className="bi bi-calendar-check fs-5"></i>
                  </div>
                  <h5 className="fw-bold mb-0">Live Mentor Mock</h5>
                </div>
                <p className="text-secondary mb-4 flex-grow-1 ip-text-base">
                  Get real-world experience with senior engineers from top tech companies.
                </p>
                <button className="btn btn-light border w-100 fw-medium">Book a Mentor</button>
              </div>
            </div>
          </div>

          {/* Coding Practice Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Coding Practice</h5>
            <div className="d-flex gap-2 align-items-center">
               <select className="form-select form-select-sm border bg-light text-muted rounded-2 ip-select"><option>Language</option></select>
               <select className="form-select form-select-sm border bg-light text-muted rounded-2 ip-select"><option>Difficulty</option></select>
               <button className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-2 fw-medium rounded-2"><i className="bi bi-play-fill"></i> Run Code</button>
            </div>
          </div>

          <div className="card border shadow-sm rounded-4 mb-5 overflow-hidden">
            <div className="row g-0 h-100">
              {/* Problem Statement */}
              <div className="col-md-5 p-4 border-end bg-white">
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill mb-3 px-3 py-2 fw-semibold border border-primary border-opacity-25">Problem of the Day</span>
                <h5 className="fw-bold text-dark mb-3">Validate Binary Search Tree</h5>
                <p className="text-secondary mb-4 ip-text-body">
                  Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node's key...
                </p>
                <a href="#" className="text-primary text-decoration-none fw-medium ip-text-base">View Full Description <i className="bi bi-box-arrow-up-right ms-1"></i></a>
              </div>
              {/* Code Editor */}
              <div className="col-md-7 bg-dark text-light p-0 position-relative d-flex flex-column">
                <div className="px-4 py-2 border-bottom border-secondary d-flex align-items-center ip-editor-header">
                  <i className="bi bi-code-slash text-secondary me-2"></i>
                  <span className="text-secondary ip-text-sm">solution.js</span>
                </div>
                <div className="p-4 font-monospace flex-grow-1 ip-editor-body">
                  <div><span className="ip-code-keyword">function</span> <span className="ip-code-function">isValidBST</span>(<span className="ip-code-var">root</span>) {'{'}</div>
                  <div className="ms-4"><span className="ip-code-keyword">return</span> <span className="ip-code-bool">true</span>;</div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Behavioral Questions & Question Bank Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <h5 className="fw-bold mb-1">Behavioral Questions</h5>
              <p className="text-secondary mb-3 ip-text-sm">Use the STAR method for soft skills</p>
              
              <div className="card border shadow-sm rounded-4 p-3 mb-3 hover-shadow cursor-pointer transition">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold text-dark mb-1 fs-6">Tell me about a time you failed.</div>
                    <div className="text-secondary ip-text-xs">Tip: Focus on what you learned and how you grew.</div>
                  </div>
                  <i className="bi bi-check-circle text-muted fs-5"></i>
                </div>
              </div>

              <div className="card border shadow-sm rounded-4 p-3 hover-shadow cursor-pointer transition">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold text-dark mb-1 fs-6">How do you handle conflict in a team?</div>
                    <div className="text-secondary ip-text-xs">Tip: Emphasize empathy and resolution-oriented communication.</div>
                  </div>
                  <i className="bi bi-check-circle text-muted fs-5"></i>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h5 className="fw-bold mb-1">Question Bank</h5>
              <p className="text-secondary mb-3 ip-text-sm">Search 500+ technical topics</p>
              
              <div className="card border shadow-sm rounded-4 p-4 h-100 d-flex flex-column">
                <div className="d-flex gap-2 mb-4">
                  <div className="position-relative flex-grow-1">
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input type="text" className="form-control rounded-pill ps-5 bg-white border" placeholder="Search topics..." />
                  </div>
                  <button className="btn btn-light border rounded-pill px-3 shadow-sm"><i className="bi bi-funnel"></i></button>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-light border text-dark rounded-pill px-3 py-2 fw-normal">System Design</span>
                  <span className="badge bg-light border text-dark rounded-pill px-3 py-2 fw-normal">React</span>
                  <span className="badge bg-light border text-dark rounded-pill px-3 py-2 fw-normal">Algorithms</span>
                  <span className="badge bg-light border text-dark rounded-pill px-3 py-2 fw-normal">SQL</span>
                  <span className="badge bg-light border text-dark rounded-pill px-3 py-2 fw-normal">Security</span>
                </div>

                <button className="btn btn-light border w-100 rounded-pill fw-medium text-secondary mt-auto shadow-sm">Explore Full Bank</button>
              </div>
            </div>
          </div>

          {/* Interview Prep Resources */}
          <h5 className="fw-bold mb-1">Interview Prep Resources</h5>
          <p className="text-secondary mb-3 ip-text-sm">Curated articles, videos, and cheatsheets</p>
          
          <div className="d-flex gap-3 overflow-auto pb-4 mb-4 no-scrollbar ip-scroll-container">
            <div className="card border shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3 flex-shrink-0 cursor-pointer hover-shadow transition ip-scroll-item">
              <div className="bg-light border rounded p-2 text-dark"><i className="bi bi-book fs-5"></i></div>
              <div className="fw-bold text-dark ip-text-base">The Ultimate System Design Primer</div>
              <i className="bi bi-arrow-up-right ms-auto text-muted ip-text-xs"></i>
            </div>
            <div className="card border shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3 flex-shrink-0 cursor-pointer hover-shadow transition ip-scroll-item">
              <div className="bg-danger bg-opacity-10 text-danger rounded p-2 border border-danger border-opacity-25"><i className="bi bi-play-btn fs-5"></i></div>
              <div className="fw-bold text-dark ip-text-base">React Performance Optimization</div>
              <i className="bi bi-arrow-up-right ms-auto text-muted ip-text-xs"></i>
            </div>
            <div className="card border shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3 flex-shrink-0 cursor-pointer hover-shadow transition ip-scroll-item">
              <div className="bg-light border rounded p-2 text-dark"><i className="bi bi-file-earmark-text fs-5"></i></div>
              <div className="fw-bold text-dark ip-text-base">Big O Notation Cheatsheet</div>
              <i className="bi bi-arrow-up-right ms-auto text-muted ip-text-xs"></i>
            </div>
          </div>

          {/* Community Insights */}
          <h5 className="fw-bold mb-3">Community Insights</h5>
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex gap-3 mb-4">
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" className="rounded-circle shadow-sm ip-avatar-md" />
              <div className="flex-grow-1 position-relative">
                <textarea className="form-control bg-light border-0 rounded-4 p-3 shadow-sm" rows={3} placeholder="Share a challenge or tip with fellow architects..." ></textarea>
                <div className="position-absolute bottom-0 end-0 p-2">
                  <button className="btn btn-primary btn-sm px-4 rounded-pill fw-medium shadow-sm">Post Insight</button>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 pt-4 border-top">
              <img src="https://ui-avatars.com/api/?name=Elena+Vance&background=ffedd5&color=ea580c" alt="Elena" className="rounded-circle shadow-sm ip-avatar-md" />
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-bold text-dark fs-6">Elena Vance</span>
                  <span className="badge bg-light border text-dark fw-medium rounded-pill px-2 ip-badge-text">Module 4 Expert</span>
                  <span className="text-muted ip-time-text">• 2h ago</span>
                </div>
                <p className="text-dark mb-3 ip-comment-text">
                  For those stuck on the DynamoDB lock: ensure your IAM policy has 'dynamodb:PutItem' permissions. It's a common oversight in the lab guide!
                </p>
                <div className="d-flex gap-4">
                  <span className="text-primary fw-medium cursor-pointer d-flex align-items-center gap-1 ip-text-sm"><i className="bi bi-hand-thumbs-up"></i> Helpful (12)</span>
                  <span className="text-muted fw-medium cursor-pointer d-flex align-items-center gap-1 ip-text-sm"><i className="bi bi-reply"></i> Reply</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Sidebar (col-lg-4) */}
        <div className="col-lg-4">
          
          {/* Recent Attempts */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold text-dark mb-4">Recent Attempts</h6>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-dark ip-text-base">Linked List Reversal</span>
                <span className="fw-bold text-dark">95%</span>
              </div>
              <div className="text-muted mb-2 ip-time-text">2h ago</div>
              <div className="progress rounded-pill bg-light ip-progress-bg">
                <div className="progress-bar bg-primary ip-w-95"></div>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-dark ip-text-base">System Design: Uber</span>
                <span className="fw-bold text-dark">82%</span>
              </div>
              <div className="text-muted mb-2 ip-time-text">Yesterday</div>
              <div className="progress rounded-pill bg-light ip-progress-bg">
                <div className="progress-bar bg-primary ip-w-82"></div>
              </div>
            </div>
          </div>

          {/* Interview Skills */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge text-primary fs-5"></i> Interview Skills
            </h6>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-dark ip-text-sm">Technical Accuracy</span>
                <span className="fw-bold text-dark ip-text-sm">88%</span>
              </div>
              <div className="progress rounded-pill bg-light ip-progress-bg">
                <div className="progress-bar bg-primary ip-w-88"></div>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-dark ip-text-sm">Communication</span>
                <span className="fw-bold text-dark ip-text-sm">65%</span>
              </div>
              <div className="progress rounded-pill bg-light ip-progress-bg">
                <div className="progress-bar bg-primary ip-w-65"></div>
              </div>
            </div>
          </div>

          {/* Upcoming Mocks */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-calendar2-event text-primary fs-5"></i> Upcoming Mocks
            </h6>
            
            <div className="position-relative border-start border-2 border-primary ms-2 ps-3 mb-4 py-1">
              <div className="position-absolute rounded-circle bg-primary ip-timeline-dot"></div>
              <div className="fw-bold text-dark fs-6 mb-1">Sarah D. (Google)</div>
              <div className="text-secondary ip-text-xs">Tomorrow, 10:00 AM</div>
            </div>

            <div className="position-relative border-start border-2 border-light ms-2 ps-3 mb-4 py-1">
              <div className="position-absolute rounded-circle bg-primary ip-timeline-dot"></div>
              <div className="fw-bold text-dark fs-6 mb-1">James L. (Meta)</div>
              <div className="text-secondary ip-text-xs">Fri, 2:00 PM</div>
            </div>

            <button className="btn btn-light border w-100 fw-medium text-secondary rounded-pill shadow-sm">View All</button>
          </div>

          {/* Mentor Support */}
          <div className="card border shadow-sm rounded-4 p-4 text-center d-flex flex-column align-items-center">
            <div className="position-relative mb-3">
              <img src="https://ui-avatars.com/api/?name=Mentor&background=e2e8f0" alt="Mentor" className="rounded-circle shadow-sm ip-avatar-lg" />
              <div className="position-absolute bg-success rounded-circle border border-white border-2 ip-status-dot"></div>
            </div>
            <h6 className="fw-bold text-dark mb-1 fs-5">Mentor Support</h6>
            <div className="text-secondary mb-4 ip-text-sm">Available Now</div>
            <button className="btn btn-primary w-100 fw-medium rounded-pill shadow-sm">Chat with Mentor</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InterviewPrepHome;
