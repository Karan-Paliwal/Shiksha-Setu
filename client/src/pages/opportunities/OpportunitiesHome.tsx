import React, { useEffect, useMemo, useState } from "react";
import { getScholarships, Scholarship, ScholarshipFilters } from "../../services/opportunitiesService";
import "./OpportunitiesHome.css";

type SortOption = "deadline-asc" | "deadline-desc" | "updated-desc" | "title-asc" | "provider-asc";
type FilterKey = "state" | "category" | "degree" | "stream";

interface EligibilityCriteria {
  annualIncome: string;
  cgpa: string;
  degree: string;
  stream: string;
  state: string;
  isStemMajor: boolean;
  isFirstGeneration: boolean;
  isGirlStudent: boolean;
  isSpeciallyAbled: boolean;
}


const defaultFilters: ScholarshipFilters = {
  state: "All",
  category: "All",
  degree: "All",
  stream: "All",
};

const initialEligibilityCriteria: EligibilityCriteria = {
  annualIncome: "800000",
  cgpa: "7.5",
  degree: "Undergraduate",
  stream: "Engineering",
  state: "All India",
  isStemMajor: true,
  isFirstGeneration: false,
  isGirlStudent: false,
  isSpeciallyAbled: false,
};

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

const matchesAny = (value: string, selected?: string) => !selected || selected === "All" || value === selected;

const getMatchScore = (scholarship: Scholarship, criteria: EligibilityCriteria) => {
  const eligibilityText = `${scholarship.title} ${scholarship.description} ${scholarship.eligibility} ${scholarship.category}`.toLowerCase();
  const income = Number(criteria.annualIncome) || 0;
  const cgpa = Number(criteria.cgpa) || 0;
  let score = 30;

  if (matchesAny(scholarship.degree, criteria.degree) || scholarship.degree === "Any") {
    score += 20;
  }

  if (matchesAny(scholarship.stream, criteria.stream) || scholarship.stream === "Any") {
    score += 16;
  }

  if (matchesAny(scholarship.state, criteria.state) || scholarship.state === "All India") {
    score += 14;
  }

  if (income > 0 && income <= 800000 && /(means|income|weaker|need|economically)/.test(eligibilityText)) {
    score += 10;
  }

  if (cgpa >= 7.5 && /(merit|academic|score|cgpa|marks)/.test(eligibilityText)) {
    score += 8;
  }

  if (criteria.isStemMajor && /(engineering|technical|stem|science|technology)/.test(eligibilityText)) {
    score += 8;
  }

  if (criteria.isGirlStudent && /(girl|women|female|pragati)/.test(eligibilityText)) {
    score += 10;
  }

  if (criteria.isSpeciallyAbled && /(specially|abled|disability|saksham)/.test(eligibilityText)) {
    score += 10;
  }

  if (criteria.isFirstGeneration && /(first|foundation|need|means)/.test(eligibilityText)) {
    score += 5;
  }

  return Math.min(99, score);
};

const OpportunitiesHome: React.FC = () => {
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ScholarshipFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>("deadline-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [criteria, setCriteria] = useState<EligibilityCriteria>(initialEligibilityCriteria);
  const [eligibilityResults, setEligibilityResults] = useState<Array<Scholarship & { matchScore: number }>>([]);
  const [eligibilityMessage, setEligibilityMessage] = useState("Fill your details and check matches.");

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await getScholarships();
        setAllScholarships(data);
      } catch (_error) {
        setAllScholarships([]);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getScholarships({ ...filters, search });
        setScholarships(data);
        setShowAll(false);
      } catch (_error) {
        setError("Unable to load scholarships right now.");
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, filters]);

  const filterOptions = useMemo(() => {
    const optionSource = allScholarships.length > 0 ? allScholarships : scholarships;
    const values = (key: FilterKey) =>
      ["All", ...Array.from(new Set(optionSource.map((scholarship) => scholarship[key]).filter(Boolean))).sort()];

    return {
      state: values("state"),
      category: values("category"),
      degree: values("degree"),
      stream: values("stream"),
    };
  }, [allScholarships, scholarships]);

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
  const activeFilterCount = Object.values(filters).filter((value) => value && value !== "All").length;


  const updateFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearch("");
  };

  const runEligibilityCheck = () => {
    const matchSource = allScholarships.length > 0 ? allScholarships : sortedScholarships;
    const matches = matchSource
      .map((scholarship) => ({ ...scholarship, matchScore: getMatchScore(scholarship, criteria) }))
      .sort((first, second) => second.matchScore - first.matchScore)
      .slice(0, 5);

    setEligibilityResults(matches);
    setEligibilityMessage(matches.length > 0 ? `${matches.length} strong scholarship matches found.` : "No matches found with the current details.");
    setFilters({
      state: criteria.state || "All",
      degree: criteria.degree || "All",
      stream: criteria.stream || "All",
      category: "All",
    });
    setShowAll(true);
  };

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold text-ss-bright fs-2 mb-1">Opportunity Hub</h1>
          <p className="text-ss-muted mb-0 fs-6">Discover active scholarships and internships matching your profile.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-ss-outline bg-white" onClick={() => setShowFilters((current) => !current)}>
            <i className="bi bi-funnel me-2"></i>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          <button className="btn btn-ss-primary" onClick={runEligibilityCheck}>
            <i className="bi bi-stars me-2"></i>AI Recommendations
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="ss-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2"><i className="bi bi-sliders text-primary"></i> Scholarship Filters</h5>
            <button className="btn btn-sm btn-light border fw-medium" onClick={resetFilters}>Clear All</button>
          </div>
          <div className="row g-3">
            {(["state", "category", "degree", "stream"] as FilterKey[]).map((key) => (
              <div className="col-md-3 col-sm-6" key={key}>
                <label className="form-label text-muted oh-text-xs text-uppercase fw-bold">{key}</label>
                <select className="form-select" value={filters[key] || "All"} onChange={(event) => updateFilter(key, event.target.value)}>
                  {filterOptions[key].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-6">
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
        <div className="col-md-6">
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
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="bg-white border rounded-pill p-2 px-4 mb-4 d-flex align-items-center gap-3 shadow-sm oh-search">
            <i className="bi bi-search text-muted fs-5"></i>
            <input
              type="text"
              className="form-control border-0 shadow-none bg-transparent"
              placeholder="Search by name, provider, or keyword..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="d-flex gap-2 oh-quick-chips">
              {["STEM", "Merit"].map((keyword) => (
                <button className="badge bg-light text-dark border rounded-pill fw-medium py-2 px-3 oh-chip-button" key={keyword} onClick={() => setSearch(keyword)}>
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary rounded-4 p-4 text-white d-flex justify-content-between align-items-center mb-5 shadow-sm position-relative overflow-hidden">
            <i className="bi bi-lightning-charge-fill position-absolute opacity-25 oh-hero-icon"></i>
            <div className="position-relative z-1 d-flex gap-4 align-items-center w-100 oh-featured">
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

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
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
              {visibleScholarships.map((scholarship) => {
                const match = eligibilityResults.find((result) => result.id === scholarship.id);
                return (
                  <div className="col-md-6" key={scholarship.id}>
                    <div className="ss-card h-100 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="border rounded p-2 bg-light"><i className="bi bi-building fs-4 text-primary"></i></div>
                          <span className="badge bg-light text-dark border rounded-pill fw-medium">{scholarship.category}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 text-dark fw-bold">
                          <i className="bi bi-stars"></i> {match?.matchScore ?? getMatchScore(scholarship, criteria)}%
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
                          <button className="btn btn-light border w-50 fw-medium" onClick={() => openUrl(scholarship.detailsUrl || scholarship.applyUrl)}>Details</button>
                          <button className="btn btn-primary w-50 fw-medium" onClick={() => openUrl(scholarship.applyUrl)}>Apply Now <i className="bi bi-arrow-right ms-1"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

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


        </div>

        <div className="col-lg-4">
          <div className="bg-primary rounded-4 p-4 text-white mb-4 shadow-sm">
            <h5 className="fw-bold d-flex align-items-center gap-2 mb-1"><i className="bi bi-check-circle"></i> Eligibility Checker</h5>
            <p className="text-white-50 mb-4 oh-text-sm">{eligibilityMessage}</p>

            <div className="bg-white bg-opacity-10 rounded p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fs-6">Profile Completion</span>
                <span className="fw-bold">85%</span>
              </div>
              <div className="progress oh-progress-bg">
                <div className="progress-bar bg-white oh-w-85"></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="fw-medium mb-3">Confirm your details:</div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label oh-text-xs text-white-50">Income</label>
                  <input className="form-control form-control-sm" type="number" value={criteria.annualIncome} onChange={(event) => setCriteria((current) => ({ ...current, annualIncome: event.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label oh-text-xs text-white-50">CGPA</label>
                  <input className="form-control form-control-sm" type="number" step="0.1" value={criteria.cgpa} onChange={(event) => setCriteria((current) => ({ ...current, cgpa: event.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="form-label oh-text-xs text-white-50">Degree</label>
                  <select className="form-select form-select-sm" value={criteria.degree} onChange={(event) => setCriteria((current) => ({ ...current, degree: event.target.value }))}>
                    {filterOptions.degree.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label oh-text-xs text-white-50">Stream</label>
                  <select className="form-select form-select-sm" value={criteria.stream} onChange={(event) => setCriteria((current) => ({ ...current, stream: event.target.value }))}>
                    {filterOptions.stream.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label oh-text-xs text-white-50">State</label>
                  <select className="form-select form-select-sm" value={criteria.state} onChange={(event) => setCriteria((current) => ({ ...current, state: event.target.value }))}>
                    {filterOptions.state.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>

              {[
                ["isStemMajor", "STEM Major"],
                ["isFirstGeneration", "First Gen Student"],
                ["isGirlStudent", "Girl Student"],
                ["isSpeciallyAbled", "Specially Abled"],
              ].map(([key, label]) => (
                <div className="form-check mb-2" key={key}>
                  <input
                    className="form-check-input bg-primary border-white"
                    type="checkbox"
                    checked={criteria[key as keyof EligibilityCriteria] as boolean}
                    id={key}
                    onChange={(event) => setCriteria((current) => ({ ...current, [key]: event.target.checked }))}
                  />
                  <label className="form-check-label" htmlFor={key}>{label}</label>
                </div>
              ))}
            </div>

            <button className="btn btn-light text-primary w-100 fw-bold" onClick={runEligibilityCheck}>Find Matching Schemes</button>
            {eligibilityResults.length > 0 && (
              <div className="mt-3">
                {eligibilityResults.slice(0, 3).map((result) => (
                  <button className="oh-match-row text-start" key={result.id} onClick={() => openUrl(result.detailsUrl || result.applyUrl)}>
                    <span>{result.title}</span>
                    <strong>{result.matchScore}%</strong>
                  </button>
                ))}
              </div>
            )}
            <div className="text-center mt-3 text-white-50 oh-text-xxs">Updated profile data improves recommendation accuracy.</div>
          </div>

          <div className="ss-card mb-4">
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><i className="bi bi-clock-history"></i> Deadline Pulse</h6>

            {deadlinePulse.map((scholarship) => {
              const daysLeft = getDaysLeft(scholarship.deadline);
              return (
                <button className="oh-deadline-row" key={scholarship.id} onClick={() => openUrl(scholarship.detailsUrl || scholarship.applyUrl)}>
                  <span>
                    <span className="fw-bold text-dark fs-6 d-block">{scholarship.title}</span>
                    <span className={daysLeft <= 7 ? "text-danger oh-text-xs-alt" : "text-muted oh-text-xs-alt"}>Ends in {daysLeft} days</span>
                  </span>
                  <i className="bi bi-chevron-right text-muted"></i>
                </button>
              );
            })}

            {deadlinePulse.length === 0 && <div className="text-muted oh-text-sm">No upcoming scholarship deadlines.</div>}

            <div className="text-center mt-2">
              <button className="btn btn-link text-primary text-decoration-none oh-text-sm" onClick={() => setShowAll(true)}>View All Deadlines</button>
            </div>
          </div>

          <div className="bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 p-4 text-center">
            <div className="bg-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3 shadow-sm text-primary oh-icon-md-alt">
              <i className="bi bi-file-earmark-text fs-3"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">Need help with your application?</h5>
            <p className="text-muted mb-4 oh-text-sm">Download our "Winning Statement of Purpose" guide and templates used by top scholars.</p>
            <button className="btn btn-white border w-100 fw-bold shadow-sm text-dark" onClick={() => openUrl("https://scholarships.gov.in/")}>Open Application Guide</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesHome;
