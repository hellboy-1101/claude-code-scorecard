export interface ParsedInput {
  version: string;
  mcp: string;
  plugins: string;
  settings: string;
  rules: string;
  skills: string;
  agents: string;
  commands: string;
  claudemd: string;
  hooks: string;
  references: string;
  skilldata: string;
  zshrc: string;
}

export interface ItemScore {
  name: string;
  score: number;
  maxScore: number;
  details: string[];
}

export interface CategoryScore {
  name: string;
  items: ItemScore[];
  average: number;
}

export interface Improvement {
  item: string;
  problem: string;
  action: string;
  estimatedTime: string;
  impact: number;
}

export interface ScorecardResult {
  categories: CategoryScore[];
  totalScore: number;
  grade: string;
  improvements: Improvement[];
}
