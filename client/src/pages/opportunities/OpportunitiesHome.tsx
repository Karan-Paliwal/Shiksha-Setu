import React, { useEffect, useMemo, useState } from "react";
import { getScholarships, Scholarship } from "../../services/opportunitiesService";
import "./OpportunitiesHome.css";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const getDaysLeft = (value: string) => {
  const today = new Date();
  const deadline = new Date(value);
  const diff = deadline.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const openUrl = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

type SortOption = "deadline-asc" | "deadline-desc" | "title-asc" | "provider-asc" | "updated-desc";

const OpportunitiesHome: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("deadline-asc");
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getScholarships({ search });
        setScholarships(data);
        setShowAll(false);
      } catch (_error) {
        setError("Unable to load scholarships right now.");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const sortedScholarships = useMemo(() => {
    return [...scholarships].sort((first, second) => {
      if (sortBy === "deadline-asc") {
        return new Date(first.deadline).getTime() - new Date(second.deadline).getTime();
      }

      if (sortBy === "deadline-desc") {
        return new Date(second.deadline).getTime() - new Date(first.deadline).getTime();
      }

      if (sortBy === "title-asc") {
        return first.title.localeCompare(second.title);
      }

      if (sortBy === "provider-asc") {
        return first.provider.localeCompare(second.provider);
      }

      return new Date(second.lastUpdated).getTime() - new Date(first.lastUpdated).getTime();
    });
  }, [scholarships, sortBy]);

  const visibleScholarships = showAll ? sortedScholarships : sortedScholarships.slice(0, 6);
  const featuredScholarship = sortedScholarships[0];
  const deadlinePulse = useMemo(() => sortedScholarships.slice(0, 4), [sortedScholarships]);

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-ss-bright fs-2 mb-1">Opportunity Hub</h1>
          <p className="text-ss-muted mb-0 fs-6">Discover active scholarships and internships matching your profile.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-ss-outline bg-white"><i className="bi bi-funnel me-2"></i>Filters</button>
          <button className="btn btn-ss-primary"><i className="bi bi-stars me-2"></i>AI Recommendations</button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="ss-card d-flex align-items-center gap-4">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center oh-icon-md">
              <i className="bi bi-currency-rupee fs-4"></i>
            </div>
            <div>
              <div className="text-ss-muted mb-1 oh-text-sm">Total Funding</div>
              <div className="fw-bold fs-3 text-dark">Live Catalog</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ss-card d-flex align-items-center gap-4">
            <div className="bg-light text-dark border rounded-circle d-flex justify-content-center align-items-center oh-icon-md">
              <i className="bi bi-mortarboard fs-4"></i>
            </div>
            <div>
              <div className="text-ss-muted mb-1 oh-text-sm">Eligible Schemes</div>
              <div className="fw-bold fs-3 text-dark">{scholarships.length} Active</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="ss-card d-flex align-items-center gap-4">
            <div className="bg-light text-dark border rounded-circle d-flex justify-content-center align-items-center oh-icon-md">
              <i className="bi bi-check2-circle fs-4"></i>
            </div>
            <div>
              <div className="text-ss-muted mb-1 oh-text-sm">Applied Last Month</div>
              <div className="fw-bold fs-3 text-dark">04 Submitted</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="bg-white border rounded-pill p-2 px-4 mb-4 d-flex align-items-center gap-3 shadow-sm">
            <i className="bi bi-search text-muted fs-5"></i>
            <input
              type="text"
              className="form-control border-0 shadow-none bg-transparent"
              placeholder="Search by name, provider, or keyword (e.g. 'Engineering', 'Government')..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="d-flex gap-2">
              <span className="badge bg-light text-dark border rounded-pill fw-medium py-2 px-3">STEM</span>
              <span className="badge bg-light text-dark border rounded-pill fw-medium py-2 px-3">Merit</span>
            </div>
          </div>

          <div className="bg-primary rounded-4 p-4 text-white d-flex justify-content-between align-items-center mb-5 shadow-sm position-relative overflow-hidden">
            <i className="bi bi-lightning-charge-fill position-absolute opacity-25 oh-hero-icon"></i>
            <div className="position-relative z-1 d-flex gap-4 align-items-center w-100">
              <div className="bg-white bg-opacity-25 rounded p-3 d-flex justify-content-center align-items-center oh-icon-lg">
                 <i className="bi bi-lightning-charge text-white fs-3"></i>
              </div>
              <div className="flex-grow-1">
                <h4 className="fw-bold mb-1">{featuredScholarship ? `New: ${featuredScholarship.title}` : "New scholarships are being indexed"}</h4>
                <p className="mb-0 text-white-50 oh-text-base">{featuredScholarship ? featuredScholarship.description : "The catalog is ready for provider syncs and seed data."}</p>
              </div>
              {featuredScholarship && (
                <button className="btn btn-light fw-bold px-4 py-2 text-dark whitespace-nowrap" onClick={() => openUrl(featuredScholarship.applyUrl)}>
                  Apply Before {formatDate(featuredScholarship.deadline)}
                </button>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2"><i className="bi bi-mortarboard text-primary"></i> Recommended Scholarships</h5>
            <select
              className="form-select form-select-sm w-auto border-0 text-primary fw-medium shadow-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              aria-label="Sort scholarships"
            >
              <option value="deadline-asc">Sort by: Nearest Deadline</option>
              <option value="deadline-desc">Sort by: Latest Deadline</option>
              <option value="updated-desc">Sort by: Recently Updated</option>
              <option value="title-asc">Sort by: Scholarship Name</option>
              <option value="provider-asc">Sort by: Provider Name</option>
            </select>
          </div>

          {isLoading && <div className="ss-card text-center text-muted mb-4">Loading scholarships...</div>}
          {error && <div className="ss-card text-center text-danger mb-4">{error}</div>}

          {!isLoading && !error && (
            <div className="row g-4 mb-4">
              {visibleScholarships.map((scholarship, index) => (
                <div className="col-md-6" key={scholarship.id}>
                  <div className="ss-card h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="border rounded p-2 bg-light"><i className="bi bi-building fs-4 text-primary"></i></div>
                        <span className="badge bg-light text-dark border rounded-pill fw-medium">{scholarship.category}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1 text-dark fw-bold">
                        <i className="bi bi-stars"></i> {Math.max(75, 95 - index * 4)}%
                      </div>
                    </div>
                    <h6 className="fw-bold text-dark fs-5 mb-1">{scholarship.title}</h6>
                    <div className="text-muted mb-4 oh-text-sm">{scholarship.provider}</div>

                    <div className="mt-auto">
                      <div className="d-flex gap-4 mb-4">
                        <div>
                           <div className="text-muted oh-text-xs"><i className="bi bi-cash me-1"></i>Amount</div>
                           <div className="fw-bold text-dark">{scholarship.amount}</div>
                        </div>
                        <div>
                           <div className="text-muted oh-text-xs"><i className="bi bi-calendar3 me-1"></i>Deadline</div>
                           <div className="fw-bold text-dark">{formatDate(scholarship.deadline)}</div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-light border w-50 fw-medium" onClick={() => openUrl(scholarship.detailsUrl || `/opportunities/${scholarship.id}`)}>Details</button>
                        <button className="btn btn-primary w-50 fw-medium" onClick={() => openUrl(scholarship.applyUrl)}>Apply Now <i className="bi bi-arrow-right ms-1"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {scholarships.length === 0 && (
                <div className="col-12">
                  <div className="ss-card text-center text-muted">No active scholarships match your search.</div>
                </div>
              )}
            </div>
          )}

          {sortedScholarships.length > 6 && (
            <div className="text-center mb-5">
               <button
                 className="btn btn-white border rounded-pill px-4 fw-bold text-dark shadow-sm"
                 onClick={() => setShowAll((current) => !current)}
               >
                 {showAll ? "Show Fewer Opportunities" : `Explore More Opportunities (${sortedScholarships.length - 6})`}
               </button>
            </div>
          )}

          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><i className="bi bi-briefcase text-primary"></i> Top Internship Alerts</h5>
          <div className="row g-3">
             <div className="col-md-6">
                <div className="ss-card p-3 d-flex align-items-center gap-3">
                   <div className="border rounded bg-light p-3 text-primary"><i className="bi bi-google fs-4"></i></div>
                   <div className="flex-grow-1">
                      <div className="fw-bold text-dark">Frontend Engineering</div>
                      <div className="text-muted oh-text-xs-alt">Google - Bangalore</div>
                   </div>
                   <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill">2 days left</span>
                </div>
             </div>
             <div className="col-md-6">
                <div className="ss-card p-3 d-flex align-items-center gap-3">
                   <div className="border rounded bg-light p-3 text-danger"><i className="bi bi-briefcase fs-4"></i></div>
                   <div className="flex-grow-1">
                      <div className="fw-bold text-dark">Product Design Intern</div>
                      <div className="text-muted oh-text-xs-alt">Zomato - Gurgaon</div>
                   </div>
                   <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill">5 days left</span>
                </div>
             </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="bg-primary rounded-4 p-4 text-white mb-4 shadow-sm">
            <h5 className="fw-bold d-flex align-items-center gap-2 mb-1"><i className="bi bi-check-circle"></i> Eligibility Checker</h5>
            <p className="text-white-50 mb-4 oh-text-sm">Quick check for personalized matches</p>

            <div className="bg-white bg-opacity-10 rounded p-3 mb-4">
               <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-6">Profile Completion</span>
                  <span className="fw-bold">65%</span>
               </div>
               <div className="progress oh-progress-bg">
                  <div className="progress-bar bg-white oh-w-65"></div>
               </div>
            </div>

            <div className="mb-4">
               <div className="fw-medium mb-3">Confirm your details:</div>
               <div className="form-check mb-2">
                 <input className="form-check-input bg-primary border-white" type="checkbox" defaultChecked id="c1" />
                 <label className="form-check-label" htmlFor="c1">Annual Income &lt; INR 8L</label>
               </div>
               <div className="form-check mb-2">
                 <input className="form-check-input bg-primary border-white" type="checkbox" defaultChecked id="c2" />
                 <label className="form-check-label" htmlFor="c2">Current GPA &gt; 7.5</label>
               </div>
               <div className="form-check mb-2">
                 <input className="form-check-input bg-primary border-white" type="checkbox" id="c3" />
                 <label className="form-check-label" htmlFor="c3">STEM Major</label>
               </div>
               <div className="form-check mb-2">
                 <input className="form-check-input bg-primary border-white" type="checkbox" id="c4" />
                 <label className="form-check-label" htmlFor="c4">First Gen Student</label>
               </div>
            </div>

            <button className="btn btn-light text-primary w-100 fw-bold">Find Matching Schemes</button>
            <div className="text-center mt-3 text-white-50 oh-text-xxs">Updated profile data increases your chance of selection by 40%.</div>
          </div>

          <div className="ss-card mb-4">
             <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><i className="bi bi-clock-history"></i> Deadline Pulse</h6>

             {deadlinePulse.map((scholarship) => {
               const daysLeft = getDaysLeft(scholarship.deadline);
               return (
                 <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" key={scholarship.id}>
                    <div>
                       <div className="fw-bold text-dark fs-6">{scholarship.title}</div>
                       <div className={daysLeft <= 7 ? "text-danger oh-text-xs-alt" : "text-muted oh-text-xs-alt"}>Ends in {daysLeft} days</div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                 </div>
               );
             })}

             {deadlinePulse.length === 0 && <div className="text-muted oh-text-sm">No upcoming scholarship deadlines.</div>}

             <div className="text-center mt-2">
                <a href="#" className="text-primary text-decoration-none oh-text-sm">View All Deadlines</a>
             </div>
          </div>

          <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 p-4 text-center">
             <div className="bg-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3 shadow-sm text-primary oh-icon-md-alt">
                <i className="bi bi-file-earmark-text fs-3"></i>
             </div>
             <h5 className="fw-bold text-dark mb-2">Need help with your application?</h5>
             <p className="text-muted mb-4 oh-text-sm">Download our "Winning Statement of Purpose" guide and templates used by top scholars.</p>
             <button className="btn btn-white border w-100 fw-bold shadow-sm text-dark">Download PDF Guide</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesHome;
