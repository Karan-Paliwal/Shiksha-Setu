import Scholarship from "../models/Scholarship";
import scholarships from "../data/scholarships.json";

export type ScholarshipSeed = {
  id?: string;
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
};

const scholarshipSeeds = scholarships as ScholarshipSeed[];

const normalizeSeedForMongo = ({ id: _id, ...scholarship }: ScholarshipSeed) => ({
  ...scholarship,
  deadline: new Date(scholarship.deadline),
  lastUpdated: new Date(scholarship.lastUpdated),
});

const buildScholarshipWrite = (scholarship: ScholarshipSeed) => ({
  updateOne: {
    filter: { title: scholarship.title, source: scholarship.source },
    update: { $set: normalizeSeedForMongo(scholarship) },
    upsert: true,
  },
});

export const seedScholarshipsIfEmpty = async (): Promise<number> => {
  const result = await Scholarship.bulkWrite(scholarshipSeeds.map(buildScholarshipWrite), {
    ordered: false,
  });

  return result.upsertedCount + result.modifiedCount;
};

export const syncScholarshipsFromJson = async () => {
  if (scholarshipSeeds.length === 0) {
    return { matched: 0, modified: 0, upserted: 0 };
  }

  const result = await Scholarship.bulkWrite(scholarshipSeeds.map(buildScholarshipWrite), {
    ordered: false,
  });

  return {
    matched: result.matchedCount,
    modified: result.modifiedCount,
    upserted: result.upsertedCount,
  };
};

export const getScholarshipSeedCount = (): number => scholarshipSeeds.length;
