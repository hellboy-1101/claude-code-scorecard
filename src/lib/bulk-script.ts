export const BULK_SCRIPT = `echo "===VERSION==="
claude --version 2>/dev/null || echo "not installed"
echo "===MCP==="
claude mcp list 2>/dev/null || echo "none"
echo "===PLUGINS==="
claude plugin list 2>/dev/null || echo "none"
echo "===SETTINGS==="
cat ~/.claude/settings.json 2>/dev/null || echo "{}"
echo "===RULES==="
ls ~/.claude/rules/ 2>/dev/null || echo "none"
echo "===SKILLS==="
ls -d ~/.claude/skills/*/ 2>/dev/null || echo "none"
echo "===AGENTS==="
ls ~/.claude/agents/ 2>/dev/null || echo "none"
echo "===COMMANDS==="
ls ~/.claude/commands/ 2>/dev/null || echo "none"
echo "===CLAUDEMD==="
cat ~/.claude/CLAUDE.md 2>/dev/null || echo "none"
echo "===HOOKS==="
ls ~/.claude/hooks/ 2>/dev/null || echo "none"
echo "===REFERENCES==="
ls ~/.claude/references/ 2>/dev/null || echo "none"
echo "===SKILLDATA==="
ls ~/.claude/skill-data/ 2>/dev/null || echo "none"
echo "===ZSHRC==="
grep -E "^(alias|export)" ~/.zshrc 2>/dev/null | sed -E 's/(KEY|SECRET|TOKEN|PASSWORD)="[^"]*"/\\1="***"/gi' || echo "none"
echo "===END==="`;

export const INDIVIDUAL_COMMANDS: Record<string, { label: string; command: string }> = {
  version: { label: "Claude Codeバージョン", command: "claude --version" },
  mcp: { label: "MCP接続一覧", command: "claude mcp list" },
  plugins: { label: "プラグイン一覧", command: "claude plugin list" },
  settings: { label: "settings.json", command: "cat ~/.claude/settings.json" },
  rules: { label: "ルールファイル一覧", command: "ls ~/.claude/rules/" },
  skills: { label: "スキル一覧", command: "ls -d ~/.claude/skills/*/" },
  agents: { label: "エージェント一覧", command: "ls ~/.claude/agents/" },
  commands: { label: "コマンド一覧", command: "ls ~/.claude/commands/" },
  claudemd: { label: "CLAUDE.md", command: "cat ~/.claude/CLAUDE.md" },
  hooks: { label: "フック一覧", command: "ls ~/.claude/hooks/" },
  references: { label: "リファレンス一覧", command: "ls ~/.claude/references/" },
  skilldata: { label: "スキルデータ一覧", command: "ls ~/.claude/skill-data/" },
  zshrc: { label: "シェルエイリアス", command: 'grep -E "^(alias|export)" ~/.zshrc | sed -E \'s/(KEY|SECRET|TOKEN|PASSWORD)="[^"]*"/\\1="***"/gi\'' },
};
