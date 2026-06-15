// ─── Opportunities Service ───────────────────────────────
// TODO: Connect to real scholarship/scheme databases or APIs

export const getOpportunitiesStatus = () => {
  return {
    module: "opportunities",
    status: "ok",
    message: "Opportunities Hub API is working.",
    features: [
      "Scholarship Finder",
      "Government Scheme Finder",
      "Education Loan Information",
      "Skill Development & Internship Schemes",
    ],
  };
};

// TODO: Fetch from database once seeded
export const getScholarships = () => {
  return [
    {
      id: 1,
      title: "National Merit Scholarship",
      amount: "₹50,000/year",
      eligibility: "Students with 90%+ in Class 12",
      deadline: "2026-12-31",
      category: "Merit-based",
    },
    {
      id: 2,
      title: "Post-Matric Scholarship for SC/ST Students",
      amount: "Full tuition + ₹10,000/month",
      eligibility: "SC/ST students with family income below ₹2.5 LPA",
      deadline: "2026-10-15",
      category: "Government",
    },
    {
      id: 3,
      title: "INSPIRE Scholarship",
      amount: "₹80,000/year",
      eligibility: "Top 1% in Class 12 Board Exams",
      deadline: "2026-11-30",
      category: "Research",
    },
    {
      id: 4,
      title: "Pragati Scholarship for Girls",
      amount: "₹50,000/year",
      eligibility: "Girl students in technical education, family income < ₹8 LPA",
      deadline: "2026-09-30",
      category: "Women",
    },
  ];
};

export const getGovernmentSchemes = () => {
  return [
    {
      id: 1,
      title: "PM Vidyalaxmi Scheme",
      description:
        "Collateral-free, guarantor-free education loans for students admitted to QHEIs.",
      eligibility: "Students admitted to quality higher education institutions",
    },
    {
      id: 2,
      title: "Skill India Digital Hub",
      description:
        "Free online courses and certifications to enhance employability skills.",
      eligibility: "All Indian citizens above 15 years",
    },
    {
      id: 3,
      title: "PMKVY (Pradhan Mantri Kaushal Vikas Yojana)",
      description:
        "Skill development training and certification with placement assistance.",
      eligibility: "Indian nationals, class 10 pass or above",
    },
    {
      id: 4,
      title: "Digital India Internship Scheme",
      description:
        "Internship opportunities in government departments working on digital initiatives.",
      eligibility: "B.Tech/MCA/M.Tech students in CS/IT/Electronics",
    },
  ];
};
