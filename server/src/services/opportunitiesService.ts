import { FilterQuery, Types } from "mongoose";
import Scholarship, { IScholarship } from "../models/Scholarship";

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

export interface OpportunityFilters {
  search?: string;
  state?: string;
  category?: string;
  degree?: string;
  stream?: string;
}

export interface NormalizedScholarship {
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

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const compactString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildExactFilter = (value: string) => new RegExp(`^${escapeRegex(value)}$`, "i");

const normalizeScholarship = (scholarship: IScholarship): NormalizedScholarship => ({
  id: scholarship._id.toString(),
  _id: scholarship._id.toString(),
  title: scholarship.title,
  provider: scholarship.provider,
  description: scholarship.description,
  amount: scholarship.amount,
  deadline: scholarship.deadline.toISOString(),
  eligibility: scholarship.eligibility,
  category: scholarship.category,
  state: scholarship.state,
  degree: scholarship.degree,
  stream: scholarship.stream,
  applyUrl: scholarship.applyUrl,
  detailsUrl: scholarship.detailsUrl || `/opportunities/${scholarship._id.toString()}`,
  logo: scholarship.logo,
  source: scholarship.source,
  isActive: scholarship.isActive,
  lastUpdated: scholarship.lastUpdated.toISOString(),
});

const buildScholarshipQuery = (filters: OpportunityFilters = {}): FilterQuery<IScholarship> => {
  const query: FilterQuery<IScholarship> = {
    isActive: true,
    deadline: { $gte: new Date() },
  };

  const state = compactString(filters.state);
  const category = compactString(filters.category);
  const degree = compactString(filters.degree);
  const stream = compactString(filters.stream);
  const search = compactString(filters.search);

  if (state) {
    query.state = buildExactFilter(state);
  }

  if (category) {
    query.category = buildExactFilter(category);
  }

  if (degree) {
    query.degree = buildExactFilter(degree);
  }

  if (stream) {
    query.stream = buildExactFilter(stream);
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { title: searchRegex },
      { provider: searchRegex },
      { description: searchRegex },
      { eligibility: searchRegex },
      { category: searchRegex },
      { state: searchRegex },
      { degree: searchRegex },
      { stream: searchRegex },
    ];
  }

  return query;
};

export const getScholarships = async (filters: OpportunityFilters = {}) => {
  try {
    const scholarships = await Scholarship.find(buildScholarshipQuery(filters)).sort({ deadline: 1 });
    return scholarships.map(normalizeScholarship);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw new Error("Failed to fetch scholarships");
  }
};

export const getScholarshipById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const scholarship = await Scholarship.findOne({
    _id: id,
    isActive: true,
    deadline: { $gte: new Date() },
  });

  return scholarship ? normalizeScholarship(scholarship) : null;
};

export const syncScholarships = async () => {
  /*
   * Placeholder for future provider synchronization.
   *
   * This function is intentionally not scraping search engines or third-party
   * result pages. A production sync should ingest data from official or trusted
   * provider sources such as National Scholarship Portal, AICTE, state
   * scholarship portals, university portals, and vetted private organizations.
   *
   * The API and frontend already read from MongoDB, so this function can later
   * be scheduled with a weekly cron job or queue worker to upsert provider data,
   * refresh deadlines, deactivate expired/withdrawn scholarships, and record
   * source metadata without changing the frontend contract.
   */
  return {
    status: "not_implemented",
    message: "Scholarship synchronization placeholder is ready for official provider integrations.",
  };
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
