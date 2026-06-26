import api from "./api";

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

export interface ScholarshipFilters {
  search?: string;
  state?: string;
  category?: string;
  degree?: string;
  stream?: string;
}

export const getScholarships = async (filters: ScholarshipFilters = {}): Promise<Scholarship[]> => {
  try {
    const response = await api.get("/opportunities", { params: filters });
    return response.data.scholarships;
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

export const getScholarshipById = async (id: string): Promise<Scholarship> => {
  try {
    const response = await api.get(`/opportunities/${id}`);
    return response.data.scholarship;
  } catch (error) {
    console.error("Error fetching scholarship details:", error);
    throw error;
  }
};
