import React, { useState } from "react";
import FeatureCard from "../../components/FeatureCard";
import { mockScholarships, mockGovernmentSchemes } from "../../utils/mockData";

const OpportunitiesHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"scholarships" | "schemes">("scholarships");

  return (
    <div className="module-page fade-in">
      <div className="module-header">
        <h1>Opportunities Hub</h1>
        <p>Discover scholarships, government schemes, and educational loans tailored for you.</p>
      </div>

      <div className="module-grid mb-5">
        <FeatureCard
          icon="bi-award-fill"
          title="Scholarship Finder"
          description="Find merit-based, need-based, and category-specific scholarships."
          actionText="View Scholarships"
          onAction={() => setActiveTab("scholarships")}
        />
        <FeatureCard
          icon="bi-bank2"
          title="Government Schemes"
          description="Explore central and state government schemes for students."
          actionText="View Schemes"
          onAction={() => setActiveTab("schemes")}
        />
        <FeatureCard
          icon="bi-cash-coin"
          title="Education Loans"
          description="Compare interest rates and find collateral-free education loan options."
        />
      </div>

      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn ${activeTab === "scholarships" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("scholarships")}
        >
          Scholarships
        </button>
        <button
          className={`btn ${activeTab === "schemes" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("schemes")}
        >
          Government Schemes
        </button>
      </div>

      <div className="ss-table slide-up">
        {activeTab === "scholarships" ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Eligibility</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {mockScholarships.map((scholarship) => (
                <tr key={scholarship.id}>
                  <td className="fw-semibold">{scholarship.title}</td>
                  <td className="text-success">{scholarship.amount}</td>
                  <td>{scholarship.eligibility}</td>
                  <td>{scholarship.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Description</th>
                <th>Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {mockGovernmentSchemes.map((scheme) => (
                <tr key={scheme.id}>
                  <td className="fw-semibold">{scheme.title}</td>
                  <td>{scheme.description}</td>
                  <td>{scheme.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesHome;
