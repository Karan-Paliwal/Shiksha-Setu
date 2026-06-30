import { FilterQuery, Types } from "mongoose";
import ScholarshipModel, { IScholarship } from "../models/Scholarship";
import scholarshipCatalog from "../data/scholarships.json";

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
  logo?: string;
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

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeDbScholarship = (scholarship: IScholarship): Scholarship => {
  const id = scholarship._id.toString();
  const deadline = scholarship.deadline || scholarship.createdAt || new Date();
  const lastUpdated = scholarship.lastUpdated || scholarship.updatedAt || new Date();

  return {
    id,
    _id: id,
    title: scholarship.title,
    provider: scholarship.provider,
    description: scholarship.description,
    amount: scholarship.amount,
    eligibility: scholarship.eligibility,
    deadline: deadline.toISOString(),
    category: scholarship.category,
    state: scholarship.state,
    degree: scholarship.degree,
    stream: scholarship.stream,
    applyUrl: scholarship.applyUrl,
    detailsUrl: scholarship.detailsUrl || scholarship.applyUrl,
    logo: scholarship.logo,
    source: scholarship.source,
    isActive: scholarship.isActive !== false,
    lastUpdated: lastUpdated.toISOString(),
  };
};

const normalizeCatalogScholarship = (scholarship: (typeof scholarshipCatalog)[number]): Scholarship => ({
  id: scholarship.id,
  _id: scholarship.id,
  title: scholarship.title,
  provider: scholarship.provider,
  description: scholarship.description,
  amount: scholarship.amount,
  deadline: scholarship.deadline,
  eligibility: scholarship.eligibility,
  category: scholarship.category,
  state: scholarship.state,
  degree: scholarship.degree,
  stream: scholarship.stream,
  applyUrl: scholarship.applyUrl,
  detailsUrl: scholarship.detailsUrl,
  logo: scholarship.logo,
  source: scholarship.source,
  isActive: scholarship.isActive,
  lastUpdated: scholarship.lastUpdated,
});

const isFutureActive = (scholarship: Scholarship) =>
  scholarship.isActive !== false && new Date(scholarship.deadline).getTime() >= Date.now();

const matchesValue = (actual: string, expected?: string) => {
  if (!expected || expected === "All") {
    return true;
  }

  return actual.toLowerCase() === expected.toLowerCase();
};

const applyInMemoryFilters = (scholarships: Scholarship[], filters: ScholarshipFilters = {}) => {
  const search = filters.search?.trim().toLowerCase();

  return scholarships
    .filter(isFutureActive)
    .filter((scholarship) => matchesValue(scholarship.state, filters.state))
    .filter((scholarship) => matchesValue(scholarship.category, filters.category))
    .filter((scholarship) => matchesValue(scholarship.degree, filters.degree))
    .filter((scholarship) => matchesValue(scholarship.stream, filters.stream))
    .filter((scholarship) => {
      if (!search) {
        return true;
      }

      return [
        scholarship.title,
        scholarship.provider,
        scholarship.description,
        scholarship.eligibility,
        scholarship.category,
        scholarship.state,
        scholarship.degree,
        scholarship.stream,
      ].some((value) => value.toLowerCase().includes(search));
    })
    .sort((first, second) => new Date(first.deadline).getTime() - new Date(second.deadline).getTime());
};

const buildScholarshipQuery = (filters: ScholarshipFilters = {}): FilterQuery<IScholarship> => {
  const query: FilterQuery<IScholarship> = {
    isActive: { $ne: false },
    deadline: { $gte: new Date() },
  };

  if (filters.search?.trim()) {
    const search = new RegExp(escapeRegex(filters.search.trim()), "i");
    query.$or = [
      { title: search },
      { provider: search },
      { description: search },
      { eligibility: search },
      { category: search },
      { state: search },
      { degree: search },
      { stream: search },
    ];
  }

  if (filters.state && filters.state !== "All") {
    query.state = new RegExp(`^${escapeRegex(filters.state)}$`, "i");
  }

  if (filters.category && filters.category !== "All") {
    query.category = new RegExp(`^${escapeRegex(filters.category)}$`, "i");
  }

  if (filters.degree && filters.degree !== "All") {
    query.degree = new RegExp(`^${escapeRegex(filters.degree)}$`, "i");
  }

  if (filters.stream && filters.stream !== "All") {
    query.stream = new RegExp(`^${escapeRegex(filters.stream)}$`, "i");
  }

  return query;
};

const getCatalogScholarships = (filters: ScholarshipFilters = {}) =>
  applyInMemoryFilters(scholarshipCatalog.map(normalizeCatalogScholarship), filters);

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

export const getScholarships = async (filters: ScholarshipFilters = {}) => {
  const scholarships = await ScholarshipModel.find(buildScholarshipQuery(filters)).sort({ deadline: 1 });
  const normalizedScholarships = scholarships.map(normalizeDbScholarship);

  if (normalizedScholarships.length > 0) {
    return normalizedScholarships;
  }

  return getCatalogScholarships(filters);
};

export const getScholarshipById = async (id: string) => {
  if (Types.ObjectId.isValid(id)) {
    const scholarship = await ScholarshipModel.findOne({
      _id: id,
      isActive: { $ne: false },
      deadline: { $gte: new Date() },
    });

    if (scholarship) {
      return normalizeDbScholarship(scholarship);
    }
  }

  return getCatalogScholarships().find((scholarship) => scholarship.id === id) || null;
};

export const getGovernmentSchemes = () => {
  return governmentSchemes;
};

export const syncScholarships = async () => {
  /*
   * Placeholder for future provider synchronization.
   *
   * Do not scrape search engines on user requests. A production sync should run
   * as a scheduled job and ingest official or trusted provider sources such as
   * National Scholarship Portal, AICTE, state scholarship portals, university
   * portals, and vetted private organizations. The API and frontend already use
   * the same normalized contract, so this can later upsert into MongoDB without
   * changing the UI.
   */
  return {
    status: "not_configured",
    message: "Scholarship synchronization placeholder is ready for official provider integrations.",
  };
};
