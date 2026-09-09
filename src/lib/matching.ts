export interface CompanyICP {
  targetIndustries?: string | null;
  targetCountries?: string | null;
  targetRoles?: string | null;
  industry?: string | null;
  country?: string | null;
}

export interface CreatorProfileData {
  industry: string;
  niche: string;
  country: string;
  followersCount: number;
  engagementRate: number;
}

/**
 * Calculates a match score between 65% and 98% based on ICP alignment
 */
export function calculateFitScore(company: CompanyICP, creator: CreatorProfileData): number {
  let baseScore = 72;

  const targetIndustries = (company.targetIndustries || company.industry || '')
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const targetCountries = (company.targetCountries || company.country || '')
    .toUpperCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Industry/Niche Match
  const creatorIndustry = creator.industry.toLowerCase();
  const creatorNiche = creator.niche.toLowerCase();
  const industryMatch = targetIndustries.some(
    (ind) =>
      creatorIndustry.includes(ind) ||
      ind.includes(creatorIndustry) ||
      creatorNiche.includes(ind)
  );

  if (industryMatch) {
    baseScore += 14;
  } else if (targetIndustries.length === 0) {
    baseScore += 8;
  }

  // Country/Geo Match
  const creatorCountry = creator.country.toUpperCase();
  const countryMatch = targetCountries.some((c) => c === creatorCountry);
  if (countryMatch) {
    baseScore += 8;
  } else if (targetCountries.length === 0) {
    baseScore += 4;
  }

  // Engagement bonus
  if (creator.engagementRate >= 4.0) {
    baseScore += 4;
  } else if (creator.engagementRate >= 3.0) {
    baseScore += 2;
  }

  // Follower tier consistency
  if (creator.followersCount >= 10000 && creator.followersCount <= 100000) {
    baseScore += 2;
  }

  return Math.min(98, Math.max(65, baseScore));
}
