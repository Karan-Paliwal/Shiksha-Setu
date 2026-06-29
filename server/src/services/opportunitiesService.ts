export interface ScholarshipFilters {
  search?: string;
  state?: string;
  category?: string;
  degree?: string;
  stream?: string;
}

export interface Scholarship {
  id: string;
  _id: string;
  title: string;
  provider: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string;
  category: string;
  state: string;
  degree: string;
  stream: string;
  applyUrl: string;
  detailsUrl: string;
  source: string;
  isActive: boolean;
  lastUpdated: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  category: string;
  applyUrl: string;
  source: string;
}

const scholarships: Scholarship[] = [
  {
    id: "national-merit",
    _id: "national-merit",
    title: "National Merit Scholarship",
    provider: "Ministry of Education",
    description: "Annual support for high-performing undergraduate students.",
    amount: "INR 50,000/year",
    eligibility: "Students with 90%+ in Class 12",
    deadline: "2026-12-31",
    category: "Merit",
    state: "All India",
    degree: "Undergraduate",
    stream: "All",
    applyUrl: "https://scholarships.gov.in/",
    detailsUrl: "https://scholarships.gov.in/",
    source: "National Scholarship Portal",
    isActive: true,
    lastUpdated: "2026-06-01",
  },
  {
    id: "post-matric-sc-st",
    _id: "post-matric-sc-st",
    title: "Post-Matric Scholarship for SC/ST Students",
    provider: "Government of India",
    description: "Tuition and maintenance support for eligible post-matric students.",
    amount: "Full tuition + INR 10,000/month",
    eligibility: "SC/ST students with family income below INR 2.5 LPA",
    deadline: "2026-10-15",
    category: "Government",
    state: "All India",
    degree: "Undergraduate",
    stream: "All",
    applyUrl: "https://scholarships.gov.in/",
    detailsUrl: "https://scholarships.gov.in/",
    source: "National Scholarship Portal",
    isActive: true,
    lastUpdated: "2026-06-01",
  },
  {
    id: "inspire",
    _id: "inspire",
    title: "INSPIRE Scholarship",
    provider: "Department of Science and Technology",
    description: "Support for students pursuing natural and basic science programs.",
    amount: "INR 80,000/year",
    eligibility: "Top 1% in Class 12 board exams or selected science programs",
    deadline: "2026-11-30",
    category: "Research",
    state: "All India",
    degree: "Undergraduate",
    stream: "Science",
    applyUrl: "https://online-inspire.gov.in/",
    detailsUrl: "https://online-inspire.gov.in/",
    source: "INSPIRE Portal",
    isActive: true,
    lastUpdated: "2026-06-01",
  },
  {
    id: "pragati-girls",
    _id: "pragati-girls",
    title: "Pragati Scholarship for Girls",
    provider: "AICTE",
    description: "Financial assistance for girl students in technical education.",
    amount: "INR 50,000/year",
    eligibility: "Girl students in AICTE-approved technical programs with family income below INR 8 LPA",
    deadline: "2026-09-30",
    category: "Women",
    state: "All India",
    degree: "Diploma/Undergraduate",
    stream: "Engineering",
    applyUrl: "https://www.aicte-india.org/",
    detailsUrl: "https://www.aicte-india.org/",
    source: "AICTE",
    isActive: true,
    lastUpdated: "2026-06-01",
  },
];

const governmentSchemes: GovernmentScheme[] = [
  {
    id: "pm-vidyalaxmi",
    title: "PM Vidyalaxmi Scheme",
    description: "Collateral-free, guarantor-free education loans for students admitted to quality higher education institutions.",
    eligibility: "Students admitted to eligible higher education institutions",
    category: "Education Loan",
    applyUrl: "https://www.vidyalakshmi.co.in/",
    source: "Vidya Lakshmi Portal",
  },
  {
    id: "skill-india-digital",
    title: "Skill India Digital Hub",
    description: "Online courses and certifications to improve employability skills.",
    eligibility: "Indian citizens above 15 years",
    category: "Skill Development",
    applyUrl: "https://www.skillindiadigital.gov.in/",
    source: "Skill India Digital",
  },
  {
    id: "pmkvy",
    title: "PMKVY",
    description: "Skill development training and certification with placement-oriented courses.",
    eligibility: "Indian nationals, generally Class 10 pass or above depending on course",
    category: "Skill Development",
    applyUrl: "https://www.pmkvyofficial.org/",
    source: "PMKVY",
  },
  {
    id: "digital-india-internship",
    title: "Digital India Internship Scheme",
    description: "Internship opportunities in government departments working on digital initiatives.",
    eligibility: "Eligible B.Tech, MCA, M.Tech, CS, IT, or electronics students",
    category: "Internship",
    applyUrl: "https://www.meity.gov.in/",
    source: "MeitY",
  },
];

const contains = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase());

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

export const getScholarships = (filters: ScholarshipFilters = {}) => {
  return scholarships.filter((scholarship) => {
    if (filters.search) {
      const haystack = [
        scholarship.title,
        scholarship.provider,
        scholarship.description,
        scholarship.eligibility,
        scholarship.category,
        scholarship.stream,
      ].join(" ");

      if (!contains(haystack, filters.search)) return false;
    }

    if (filters.state && filters.state !== "All" && !contains(scholarship.state, filters.state)) {
      return false;
    }

    if (filters.category && filters.category !== "All" && !contains(scholarship.category, filters.category)) {
      return false;
    }

    if (filters.degree && filters.degree !== "All" && !contains(scholarship.degree, filters.degree)) {
      return false;
    }

    if (filters.stream && filters.stream !== "All" && !contains(scholarship.stream, filters.stream)) {
      return false;
    }

    return scholarship.isActive;
  });
};

export const getScholarshipById = (id: string) => {
  return scholarships.find((scholarship) => scholarship.id === id || scholarship._id === id) || null;
};

export const getGovernmentSchemes = () => {
  return governmentSchemes;
};
