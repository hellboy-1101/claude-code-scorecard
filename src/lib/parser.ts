import type { ParsedInput } from "./types";

const SECTION_MAP: Record<string, keyof ParsedInput> = {
  VERSION: "version",
  MCP: "mcp",
  PLUGINS: "plugins",
  SETTINGS: "settings",
  RULES: "rules",
  SKILLS: "skills",
  AGENTS: "agents",
  COMMANDS: "commands",
  CLAUDEMD: "claudemd",
  HOOKS: "hooks",
  REFERENCES: "references",
  SKILLDATA: "skilldata",
  ZSHRC: "zshrc",
};

export function createEmptyInput(): ParsedInput {
  return {
    version: "",
    mcp: "",
    plugins: "",
    settings: "",
    rules: "",
    skills: "",
    agents: "",
    commands: "",
    claudemd: "",
    hooks: "",
    references: "",
    skilldata: "",
    zshrc: "",
  };
}

export function parseBulkInput(raw: string): ParsedInput {
  const result = createEmptyInput();
  const sections = raw.split(/^===([A-Z]+)===$/m);

  for (let i = 1; i < sections.length; i += 2) {
    const key = sections[i];
    const value = (sections[i + 1] ?? "").trim();
    const field = SECTION_MAP[key];
    if (field) {
      result[field] = value;
    }
  }

  return result;
}
