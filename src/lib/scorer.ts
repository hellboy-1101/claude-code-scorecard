import type { ParsedInput, CategoryScore, ItemScore, ScorecardResult, Improvement } from "./types";

function has(text: string, ...patterns: string[]): boolean {
  const lower = text.toLowerCase();
  return patterns.some((p) => lower.includes(p.toLowerCase()));
}

function countLines(text: string): number {
  if (!text || text === "none" || text === "{}") return 0;
  return text.split("\n").filter((l) => l.trim().length > 0).length;
}

function countEntries(text: string): number {
  if (!text || text === "none") return 0;
  return text.split("\n").filter((l) => l.trim().length > 0).length;
}

// ─── カテゴリ1: 基盤・インフラ ───

function scoreClaudeMd(input: ParsedInput): ItemScore {
  const md = input.claudemd;
  let score = 0;
  const details: string[] = [];

  if (md && md !== "none") {
    score += 15;
    details.push("CLAUDE.md が存在する (+15)");

    const lines = countLines(md);
    if (lines <= 100) {
      score += 15;
      details.push(`${lines}行: 100行以下で簡潔 (+15)`);
    }

    if (has(md, "build", "test", "lint", "start", "dev", "ビルド", "テスト")) {
      score += 15;
      details.push("コマンドセクションあり (+15)");
    }

    if (has(md, "ARCHITECTURE.md", "architecture", "アーキテクチャ")) {
      score += 10;
      details.push("アーキテクチャ参照あり (+10)");
    }

    if (has(md, "禁止", "ルール", "rule", "don't", "never", "forbidden")) {
      score += 10;
      details.push("禁止事項/ルール記載あり (+10)");
    }

    if (has(md, "skill", "スキル")) {
      score += 10;
      details.push("使用スキル記載あり (+10)");
    }

    if (has(md, "ワークフロー", "workflow", "サイクル", "cycle")) {
      score += 10;
      details.push("日常ワークフロー記載あり (+10)");
    }

    if (has(md, "優先順位", "priority", "リソース優先")) {
      score += 15;
      details.push("リソース優先順位記載あり (+15)");
    }
  } else {
    details.push("CLAUDE.md が存在しない (0)");
  }

  return { name: "CLAUDE.md品質", score, maxScore: 100, details };
}

function scoreMcp(input: ParsedInput): ItemScore {
  const mcp = input.mcp;
  let score = 0;
  const details: string[] = [];

  if (mcp && mcp !== "none") {
    const lines = mcp.split("\n").filter((l) => l.trim());
    const connectedCount = lines.filter((l) => has(l, "connected")).length;
    const failedCount = lines.filter((l) => has(l, "failed", "needs")).length;
    const totalCount = lines.length;

    if (connectedCount >= 1) {
      score += 20;
      details.push(`MCP ${connectedCount}件接続中 (+20)`);
    }

    if (failedCount === 0 && connectedCount > 0) {
      score += 20;
      details.push("全件Connected (+20)");
    }

    if (has(mcp, "playwright", "puppeteer", "browser")) {
      score += 15;
      details.push("ブラウザ自動化系あり (+15)");
    }

    if (has(mcp, "context7", "docs", "documentation")) {
      score += 15;
      details.push("ドキュメント取得系あり (+15)");
    }

    if (has(mcp, "claude-peers", "peers")) {
      score += 15;
      details.push("インスタンス間通信系あり (+15)");
    }

    if (totalCount <= 10) {
      score += 15;
      details.push(`${totalCount}件: 過積載でない (+15)`);
    }
  } else {
    details.push("MCP接続なし (0)");
  }

  return { name: "MCP構成", score, maxScore: 100, details };
}

function scoreHooks(input: ParsedInput): ItemScore {
  const hooks = input.hooks;
  const settings = input.settings;
  let score = 0;
  const details: string[] = [];
  const combined = `${hooks}\n${settings}`;

  const hooksExist =
    (hooks && hooks !== "none") || has(settings, '"hooks"');

  if (hooksExist) {
    score += 20;
    details.push("フック構成あり (+20)");

    if (has(combined, "sessionstart", "session-start", "SessionStart")) {
      score += 20;
      details.push("SessionStartフックあり (+20)");
    }

    if (has(combined, "sessionend", "session-end", "SessionEnd")) {
      score += 15;
      details.push("SessionEndフックあり (+15)");
    }

    if (has(combined, "pretooluse", "posttooluse", "PreToolUse", "PostToolUse")) {
      score += 20;
      details.push("PreToolUse/PostToolUseフックあり (+20)");
    }

    if (has(combined, "progress", "feature_list", "進捗")) {
      score += 15;
      details.push("進捗ファイル自動読み込みあり (+15)");
    }

    const hookCount = countEntries(hooks);
    if (hookCount >= 2 && hookCount <= 10) {
      score += 10;
      details.push(`フック数 ${hookCount}件: 適正範囲 (+10)`);
    }
  } else {
    details.push("フック構成なし (0)");
  }

  return { name: "フック構成", score, maxScore: 100, details };
}

function scoreEnvManagement(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];

  if (input.settings && input.settings !== "{}") {
    score += 20;
    details.push("settings.json が存在 (+20)");
  }

  if (input.claudemd && input.claudemd !== "none") {
    score += 20;
    details.push("CLAUDE.md が存在 (+20)");
  }

  if (input.zshrc && input.zshrc !== "none") {
    if (has(input.zshrc, "claude")) {
      score += 20;
      details.push("Claude Code関連エイリアスあり (+20)");
    }

    if (has(input.zshrc, "ca=", "ca =", 'alias ca')) {
      score += 20;
      details.push("Auto Modeエイリアスあり (+20)");
    }

    if (has(input.zshrc, "caw=", "caw =", "worktree", 'alias caw')) {
      score += 20;
      details.push("Worktreeエイリアスあり (+20)");
    }
  }

  return { name: "PC間同期・環境管理", score, maxScore: 100, details };
}

// ─── カテゴリ2: スキル・エコシステム ───

function scoreSkillCount(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const count = countEntries(input.skills);

  if (count >= 1) { score += 10; details.push(`スキル${count}件以上 (+10)`); }
  if (count >= 3) { score += 10; details.push("3件以上 (+10)"); }
  if (count >= 5) { score += 10; details.push("5件以上 (+10)"); }
  if (count >= 10) { score += 10; details.push("10件以上 (+10)"); }

  const allText = `${input.skills}\n${input.claudemd}`;
  if (has(allText, "project-initializer")) {
    score += 15;
    details.push("project-initializer系あり (+15)");
  }
  if (has(allText, "skill-resolver")) {
    score += 15;
    details.push("skill-resolver系あり (+15)");
  }
  if (has(allText, "careful", "freeze")) {
    score += 15;
    details.push("careful/freeze系あり (+15)");
  }
  if (has(allText, "adversarial")) {
    score += 15;
    details.push("adversarial-review系あり (+15)");
  }

  if (count === 0) details.push("スキルなし (0)");

  return { name: "スキル数と多様性", score, maxScore: 100, details };
}

function scoreSkillArchitecture(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const rulesCount = countEntries(input.rules);

  if (rulesCount >= 3) {
    score += 15;
    details.push(`rules ${rulesCount}件: 3件以上 (+15)`);
  }
  if (rulesCount >= 5) {
    score += 10;
    details.push("5件以上 (+10)");
  }

  if (has(input.rules, "coding-standard", "coding_standard")) {
    score += 10;
    details.push("coding-standards系ルールあり (+10)");
  }
  if (has(input.rules, "security")) {
    score += 10;
    details.push("security系ルールあり (+10)");
  }
  if (has(input.rules, "testing", "test-policy", "test_policy")) {
    score += 10;
    details.push("testing-policy系ルールあり (+10)");
  }
  if (has(input.rules, "planning", "design")) {
    score += 10;
    details.push("planning-and-design系ルールあり (+10)");
  }
  if (has(input.rules, "context-management", "context_management")) {
    score += 10;
    details.push("context-management系ルールあり (+10)");
  }
  if (input.references && input.references !== "none") {
    score += 15;
    details.push("referencesディレクトリあり (+15)");
  }
  if (input.skilldata && input.skilldata !== "none") {
    score += 10;
    details.push("skill-dataディレクトリあり (+10)");
  }

  return { name: "スキルアーキテクチャ", score, maxScore: 100, details };
}

function scorePlugins(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const count = countEntries(input.plugins);

  if (count >= 1) { score += 25; details.push(`プラグイン${count}件 (+25)`); }
  if (count >= 3) { score += 25; details.push("3件以上 (+25)"); }

  if (has(input.plugins, "frontend-design")) {
    score += 25;
    details.push("frontend-design系含む (+25)");
  }
  if (has(input.plugins, "plugin-dev")) {
    score += 25;
    details.push("plugin-dev系含む (+25)");
  }

  if (count === 0) details.push("プラグインなし (0)");

  return { name: "プラグイン活用", score, maxScore: 100, details };
}

function scoreSubagents(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const count = countEntries(input.agents);

  if (count >= 1) { score += 15; details.push(`エージェント${count}件 (+15)`); }
  if (count >= 3) { score += 15; details.push("3件以上 (+15)"); }
  if (count >= 5) { score += 10; details.push("5件以上 (+10)"); }

  if (has(input.agents, "code-review", "reviewer")) {
    score += 15;
    details.push("code-reviewer系あり (+15)");
  }
  if (has(input.agents, "test-writer", "tester")) {
    score += 15;
    details.push("test-writer系あり (+15)");
  }
  if (has(input.agents, "debugger", "debug")) {
    score += 15;
    details.push("debugger系あり (+15)");
  }
  if (has(input.agents, "quality-auditor", "auditor")) {
    score += 15;
    details.push("quality-auditor系あり (+15)");
  }

  if (count === 0) details.push("エージェントなし (0)");

  return { name: "サブエージェント活用", score, maxScore: 100, details };
}

// ─── カテゴリ3: ワークフロー自動化 ───

function scoreCommands(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const count = countEntries(input.commands);

  if (count >= 1) { score += 10; details.push(`コマンド${count}件 (+10)`); }
  if (count >= 3) { score += 10; details.push("3件以上 (+10)"); }
  if (count >= 5) { score += 10; details.push("5件以上 (+10)"); }
  if (count >= 10) { score += 10; details.push("10件以上 (+10)"); }

  if (has(input.commands, "review")) { score += 12; details.push("review系コマンドあり (+12)"); }
  if (has(input.commands, "test")) { score += 12; details.push("test系コマンドあり (+12)"); }
  if (has(input.commands, "commit")) { score += 12; details.push("commit系コマンドあり (+12)"); }
  if (has(input.commands, "status", "next")) { score += 12; details.push("status/next系コマンドあり (+12)"); }
  if (has(input.commands, "debug", "bugfix")) { score += 12; details.push("debug/bugfix系コマンドあり (+12)"); }

  if (count === 0) details.push("コマンドなし (0)");

  return { name: "スラッシュコマンド", score, maxScore: 100, details };
}

function scoreProjectInit(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.skills}\n${input.claudemd}`;

  if (has(allText, "project-initializer")) {
    score += 25;
    details.push("project-initializer系スキルあり (+25)");
  }
  if (has(allText, "skill-resolver")) {
    score += 25;
    details.push("skill-resolver系スキルあり (+25)");
  }
  if (has(allText, "feature_list")) {
    score += 25;
    details.push("feature_list.jsonの概念あり (+25)");
  }
  if (has(allText, "トークン概算", "token-estimate", "token estimate", "cost estimate")) {
    score += 25;
    details.push("トークン概算機能あり (+25)");
  }

  return { name: "プロジェクト初期化フロー", score, maxScore: 100, details };
}

function scoreDailyCycle(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.commands}\n${input.claudemd}`;

  if (has(allText, "next")) { score += 15; details.push("実装コマンドあり (+15)"); }
  if (has(allText, "test")) { score += 15; details.push("テストコマンドあり (+15)"); }
  if (has(allText, "review")) { score += 15; details.push("レビューコマンドあり (+15)"); }
  if (has(allText, "commit")) { score += 15; details.push("コミットコマンドあり (+15)"); }
  if (has(allText, "debug", "bugfix")) { score += 20; details.push("デバッグコマンドあり (+20)"); }
  if (has(allText, "refactor")) { score += 20; details.push("リファクタリングコマンドあり (+20)"); }

  return { name: "日常開発サイクルの完全性", score, maxScore: 100, details };
}

function scoreContextManagement(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.settings}\n${input.zshrc}\n${input.claudemd}\n${input.rules}\n${input.skills}`;

  if (has(allText, "AUTOCOMPACT", "autocompact")) {
    score += 25;
    details.push("AUTOCOMPACT設定あり (+25)");
  }
  if (has(allText, "MAX_THINKING_TOKENS", "max_thinking_tokens")) {
    score += 20;
    details.push("MAX_THINKING_TOKENS設定あり (+20)");
  }
  if (has(input.rules, "context-management", "context_management")) {
    score += 25;
    details.push("context-management系ルールあり (+25)");
  }
  if (has(allText, "strategic-compact", "compact-check")) {
    score += 15;
    details.push("strategic-compact系スキルあり (+15)");
  }
  if (has(input.claudemd, "/compact", "compact")) {
    score += 15;
    details.push("/compact運用ルールあり (+15)");
  }

  return { name: "コンテキスト管理", score, maxScore: 100, details };
}

// ─── カテゴリ4: 品質管理 ───

function scoreTestStrategy(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];

  if (has(input.mcp, "playwright")) { score += 20; details.push("Playwright系MCPあり (+20)"); }
  if (has(input.rules, "testing", "test-policy", "test_policy")) { score += 20; details.push("testing-policy系ルールあり (+20)"); }
  if (has(input.agents, "test-writer", "tester")) { score += 20; details.push("test-writer系エージェントあり (+20)"); }
  if (has(input.commands, "test")) { score += 20; details.push("test系コマンドあり (+20)"); }
  if (has(input.skills, "adversarial")) { score += 20; details.push("adversarial-review系スキルあり (+20)"); }

  return { name: "テスト・検証戦略", score, maxScore: 100, details };
}

function scoreSecurity(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.rules}\n${input.skills}\n${input.agents}`;

  if (has(input.rules, "security")) { score += 25; details.push("security系ルールあり (+25)"); }
  if (has(allText, "security-scan", "agentshield", "security-reviewer")) { score += 20; details.push("security系スキル/Agentあり (+20)"); }
  if (has(input.rules, "git-workflow", "git_workflow")) { score += 15; details.push("git-workflow系ルールあり (+15)"); }
  if (has(allText, "dependency-check", "dependency_check")) { score += 20; details.push("dependency-check系スキルあり (+20)"); }
  if (has(allText, "careful")) { score += 20; details.push("careful系スキルあり (+20)"); }

  return { name: "セキュリティ", score, maxScore: 100, details };
}

function scoreQualityEnforcement(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.hooks}\n${input.settings}\n${input.rules}\n${input.agents}\n${input.commands}\n${input.claudemd}`;

  if (has(allText, "posttooluse", "PostToolUse")) { score += 20; details.push("PostToolUseフックあり (+20)"); }
  if (has(input.rules, "quality-enforcement", "quality_enforcement")) { score += 20; details.push("quality-enforcement系ルールあり (+20)"); }
  if (has(input.agents, "code-review", "reviewer")) { score += 20; details.push("code-reviewer系エージェントあり (+20)"); }
  if (has(input.commands, "audit")) { score += 20; details.push("audit系コマンドあり (+20)"); }
  if (has(allText, "リファクタリング通知", "refactor通知", "5機能ごと", "5 features")) { score += 20; details.push("リファクタリング通知あり (+20)"); }

  return { name: "品質自動強制", score, maxScore: 100, details };
}

// ─── カテゴリ5: デバッグ＆修復 ───

function scoreDebugAbility(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.agents}\n${input.commands}\n${input.claudemd}`;

  if (has(input.agents, "debugger", "debug")) { score += 30; details.push("debugger系エージェントあり (+30)"); }
  if (has(input.commands, "debug")) { score += 25; details.push("debug系コマンドあり (+25)"); }
  if (has(input.commands, "bugfix")) { score += 25; details.push("bugfix系コマンドあり (+25)"); }
  if (has(allText, "原因特定", "修正", "再テスト", "root cause", "fix and retest")) { score += 20; details.push("デバッグフロー定義あり (+20)"); }

  return { name: "デバッグ能力", score, maxScore: 100, details };
}

function scoreRefactoringAbility(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.commands}\n${input.agents}\n${input.claudemd}\n${input.skills}`;

  if (has(input.commands, "refactor")) { score += 30; details.push("refactor系コマンドあり (+30)"); }
  if (has(input.commands, "audit")) { score += 20; details.push("audit系コマンドあり (+20)"); }
  if (has(input.agents, "quality-auditor", "auditor")) { score += 20; details.push("quality-auditor系エージェントあり (+20)"); }
  if (has(allText, "リファクタリング通知", "5機能ごと", "refactor通知")) { score += 15; details.push("リファクタリングタイミング通知あり (+15)"); }
  if (has(allText, "careful") && has(input.commands, "refactor")) { score += 15; details.push("carefulモード連携あり (+15)"); }

  return { name: "リファクタリング能力", score, maxScore: 100, details };
}

function scoreDependencyMaintenance(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.skills}\n${input.commands}\n${input.claudemd}`;

  if (has(allText, "dependency-check", "dependency_check")) { score += 40; details.push("dependency-check系スキルあり (+40)"); }
  if (has(allText, "security-scan", "security scan", "npm audit", "pip audit")) { score += 30; details.push("security-scan系あり (+30)"); }
  if (has(input.claudemd, "メンテナンス", "maintenance", "定期")) { score += 30; details.push("定期メンテナンスワークフロー記載あり (+30)"); }

  return { name: "依存管理・メンテナンス", score, maxScore: 100, details };
}

// ─── カテゴリ6: セッション管理 ───

function scoreSessionHandoff(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.hooks}\n${input.settings}\n${input.commands}\n${input.claudemd}`;

  if (has(allText, "sessionstart") && has(allText, "progress", "feature_list", "進捗")) {
    score += 30;
    details.push("SessionStartで進捗ファイル自動読み込み (+30)");
  }
  if (has(allText, "sessionstart") && has(allText, "feature_list")) {
    score += 25;
    details.push("SessionStartでfeature_list.json状態表示 (+25)");
  }
  if (has(allText, "sessionend") && has(allText, "progress", "doc", "update")) {
    score += 25;
    details.push("SessionEndで進捗/ドキュメント更新 (+25)");
  }
  if (has(input.commands, "commit") && has(input.claudemd, "進捗", "progress")) {
    score += 20;
    details.push("commitコマンドに進捗ファイル更新あり (+20)");
  }

  return { name: "セッション間引き継ぎ", score, maxScore: 100, details };
}

function scoreHarnessCompliance(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.skills}\n${input.commands}\n${input.claudemd}\n${input.agents}\n${input.mcp}`;

  if (has(allText, "project-initializer")) {
    score += 20;
    details.push("環境初期化: project-initializer系あり (+20)");
  }
  if (has(allText, "feature_list") && has(allText, "next")) {
    score += 20;
    details.push("インクリメンタル進捗: feature_list + next系 (+20)");
  }
  if (has(allText, "test") && has(allText, "review") && has(allText, "debug")) {
    score += 20;
    details.push("フィードバックループ: test+review+debug (+20)");
  }
  if (has(input.claudemd, "ARCHITECTURE") && has(allText, "explore", "grep", "glob", "コードベース")) {
    score += 20;
    details.push("コードベース=コンテキスト: ARCHITECTURE + Explore活用 (+20)");
  }
  if (has(allText, "audit") && has(allText, "refactor")) {
    score += 20;
    details.push("技術的負債制御: audit + refactor (+20)");
  }

  return { name: "ハーネスエンジニアリング準拠度", score, maxScore: 100, details };
}

function scoreSpecDrivenDev(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.skills}\n${input.claudemd}`;

  if (has(allText, "project-initializer")) { score += 25; details.push("project-initializer系あり (+25)"); }
  if (has(allText, "feature_list")) { score += 25; details.push("feature_list.jsonの概念あり (+25)"); }
  if (has(allText, "init.sh")) { score += 25; details.push("init.shの概念あり (+25)"); }
  if (has(allText, "ARCHITECTURE.md", "architecture")) { score += 25; details.push("ARCHITECTURE.mdの概念あり (+25)"); }

  return { name: "仕様書駆動開発", score, maxScore: 100, details };
}

// ─── カテゴリ7: 先進機能 ───

function scoreParallelDev(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.zshrc}\n${input.settings}\n${input.mcp}\n${input.claudemd}`;

  if (has(allText, "worktree", "caw")) { score += 30; details.push("worktree関連設定あり (+30)"); }
  if (has(input.mcp, "claude-peers", "peers")) { score += 25; details.push("claude-peers系MCPあり (+25)"); }
  if (has(allText, "CLAUDE_AGENT_TEAM", "agent_team", "agent team")) { score += 25; details.push("Agent Teams環境変数あり (+25)"); }
  if (has(input.claudemd, "並列", "parallel", "worktree")) { score += 20; details.push("並列開発ワークフロー記載あり (+20)"); }

  return { name: "並列開発", score, maxScore: 100, details };
}

function scoreEcosystemIntegration(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.references}\n${input.skills}\n${input.claudemd}`;

  if (has(input.references, "everything-claude-code", "ecc")) { score += 30; details.push("ECCリソース参照あり (+30)"); }
  if (has(allText, "ecc-dispatcher")) { score += 30; details.push("ecc-dispatcher系あり (+30)"); }
  if (has(allText, "重点", "補助", "アーカイブ", "priority", "archive")) { score += 20; details.push("ECCカテゴリ分類あり (+20)"); }
  if (has(allText, "蒸留", "distill", "常駐ルール")) { score += 20; details.push("常駐ルール蒸留あり (+20)"); }

  return { name: "エコシステム連携", score, maxScore: 100, details };
}

function scoreAutomationLevel(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.zshrc}\n${input.settings}\n${input.skills}\n${input.claudemd}`;

  if (has(allText, "auto mode", "auto_mode", "automode", "ca=", "alias ca")) { score += 25; details.push("Auto Mode対応 (+25)"); }
  if (has(allText, "plan mode", "plan_mode", "shift+tab", "planmode")) { score += 25; details.push("Plan Mode対応 (+25)"); }
  if (has(allText, "skill-resolver")) { score += 25; details.push("skill-resolver対応 (+25)"); }
  if (has(allText, "トークン概算", "token estimate", "cost estimate")) { score += 25; details.push("トークン概算対応 (+25)"); }

  return { name: "自動化レベル", score, maxScore: 100, details };
}

function scoreCommunication(input: ParsedInput): ItemScore {
  let score = 0;
  const details: string[] = [];
  const allText = `${input.mcp}\n${input.settings}\n${input.skills}\n${input.claudemd}`;

  if (has(input.mcp, "claude-peers", "peers")) { score += 35; details.push("claude-peers系MCP (+35)"); }
  if (has(input.mcp, "gmail", "calendar")) { score += 15; details.push("Gmail/Calendar系MCP (+15)"); }
  if (has(allText, "telegram", "discord", "channel")) { score += 25; details.push("Channels対応 (+25)"); }
  if (has(allText, "agent-skill-bus", "skill-bus", "品質監視")) { score += 25; details.push("スキル品質監視あり (+25)"); }

  return { name: "通信・遠隔", score, maxScore: 100, details };
}

// ─── 改善提案 ───

function generateImprovements(categories: CategoryScore[]): Improvement[] {
  const improvements: Improvement[] = [];

  const allItems = categories.flatMap((c) => c.items);

  for (const item of allItems) {
    if (item.score >= 60) continue;

    const suggestions = getItemSuggestions(item.name, item.score);
    improvements.push(...suggestions);
  }

  return improvements.sort((a, b) => b.impact - a.impact);
}

function getItemSuggestions(itemName: string, currentScore: number): Improvement[] {
  const deficit = 100 - currentScore;
  const suggestionMap: Record<string, Improvement[]> = {
    "CLAUDE.md品質": [
      { item: itemName, problem: "CLAUDE.mdが未作成または内容不足", action: "~/.claude/CLAUDE.md を作成し、コマンド・ルール・ワークフロー・リソース優先順位を記載してください", estimatedTime: "15分", impact: Math.min(deficit, 40) },
    ],
    "MCP構成": [
      { item: itemName, problem: "MCP接続が未設定または不足", action: "claude mcp add で playwright, context7, claude-peers を追加してください", estimatedTime: "10分", impact: Math.min(deficit, 45) },
    ],
    "フック構成": [
      { item: itemName, problem: "フックが未設定", action: "settings.json の hooks セクションに SessionStart / PostToolUse フックを追加してください", estimatedTime: "15分", impact: Math.min(deficit, 40) },
    ],
    "PC間同期・環境管理": [
      { item: itemName, problem: "Claude Code用エイリアスが未設定", action: "~/.zshrc に alias ca='claude --auto' / alias caw='claude worktree' を追加してください", estimatedTime: "5分", impact: Math.min(deficit, 40) },
    ],
    "スキル数と多様性": [
      { item: itemName, problem: "スキルが不足", action: "~/.claude/skills/ に project-initializer, skill-resolver, adversarial-review, careful 等を作成してください", estimatedTime: "30分", impact: Math.min(deficit, 40) },
    ],
    "スキルアーキテクチャ": [
      { item: itemName, problem: "ルールファイルが不足", action: "~/.claude/rules/ に coding-standards.md, security.md, testing-policy.md, planning-and-design.md, context-management.md を作成してください", estimatedTime: "20分", impact: Math.min(deficit, 35) },
    ],
    "プラグイン活用": [
      { item: itemName, problem: "プラグインが未導入", action: "claude plugin add で frontend-design, plugin-dev 等を追加してください", estimatedTime: "10分", impact: Math.min(deficit, 50) },
    ],
    "サブエージェント活用": [
      { item: itemName, problem: "サブエージェントが不足", action: "~/.claude/agents/ に code-reviewer.md, test-writer.md, debugger.md, quality-auditor.md を作成してください", estimatedTime: "20分", impact: Math.min(deficit, 40) },
    ],
    "スラッシュコマンド": [
      { item: itemName, problem: "コマンドが不足", action: "~/.claude/commands/ に review.md, test.md, commit.md, debug.md, status.md を作成してください", estimatedTime: "15分", impact: Math.min(deficit, 40) },
    ],
    "プロジェクト初期化フロー": [
      { item: itemName, problem: "プロジェクト初期化の自動化が不足", action: "project-initializer スキルを作成し、feature_list.json 生成とトークン概算機能を含めてください", estimatedTime: "30分", impact: Math.min(deficit, 50) },
    ],
    "日常開発サイクルの完全性": [
      { item: itemName, problem: "開発サイクルに欠けがある", action: "next, test, review, commit, debug, refactor の各コマンドを作成して完全なサイクルを構築してください", estimatedTime: "20分", impact: Math.min(deficit, 40) },
    ],
    "コンテキスト管理": [
      { item: itemName, problem: "コンテキスト管理設定が不足", action: "settings.json に AUTOCOMPACT / MAX_THINKING_TOKENS を設定し、context-management ルールを作成してください", estimatedTime: "10分", impact: Math.min(deficit, 40) },
    ],
    "テスト・検証戦略": [
      { item: itemName, problem: "テスト戦略が不完全", action: "testing-policy ルール、test-writer エージェント、adversarial-review スキルを追加してください", estimatedTime: "20分", impact: Math.min(deficit, 40) },
    ],
    "セキュリティ": [
      { item: itemName, problem: "セキュリティ対策が不足", action: "security ルール、dependency-check スキル、careful スキルを追加してください", estimatedTime: "15分", impact: Math.min(deficit, 40) },
    ],
    "品質自動強制": [
      { item: itemName, problem: "品質自動強制の仕組みが不足", action: "PostToolUse フック、quality-enforcement ルール、audit コマンドを追加してください", estimatedTime: "15分", impact: Math.min(deficit, 40) },
    ],
    "デバッグ能力": [
      { item: itemName, problem: "デバッグの自動化が不足", action: "~/.claude/agents/debugger.md を作成し、debug / bugfix コマンドを追加してください", estimatedTime: "10分", impact: Math.min(deficit, 45) },
    ],
    "リファクタリング能力": [
      { item: itemName, problem: "リファクタリングの仕組みが不足", action: "refactor コマンドと audit コマンドを作成し、careful モードと連携させてください", estimatedTime: "10分", impact: Math.min(deficit, 40) },
    ],
    "依存管理・メンテナンス": [
      { item: itemName, problem: "依存管理が未自動化", action: "dependency-check スキルを作成し、CLAUDE.md に定期メンテナンスワークフローを記載してください", estimatedTime: "10分", impact: Math.min(deficit, 45) },
    ],
    "セッション間引き継ぎ": [
      { item: itemName, problem: "セッション間の引き継ぎが不足", action: "SessionStart フックに progress.md / feature_list.json の自動表示を追加してください", estimatedTime: "5分", impact: Math.min(deficit, 40) },
    ],
    "ハーネスエンジニアリング準拠度": [
      { item: itemName, problem: "ハーネス5柱への準拠が不足", action: "feature_list.json + init.sh + progress管理 + Exploreサブエージェント活用でハーネスエンジニアリングに準拠してください", estimatedTime: "30分", impact: Math.min(deficit, 50) },
    ],
    "仕様書駆動開発": [
      { item: itemName, problem: "仕様書駆動開発の仕組みが不足", action: "project-initializer スキルを作成し、ARCHITECTURE.md / feature_list.json / init.sh の生成フローを組み込んでください", estimatedTime: "20分", impact: Math.min(deficit, 50) },
    ],
    "並列開発": [
      { item: itemName, problem: "並列開発環境が未構築", action: "worktree エイリアス、claude-peers MCP を追加し、CLAUDE.md に並列開発ワークフローを記載してください", estimatedTime: "15分", impact: Math.min(deficit, 40) },
    ],
    "エコシステム連携": [
      { item: itemName, problem: "ECCエコシステムとの連携が不足", action: "everything-claude-code をリファレンスに追加し、ecc-dispatcher スキルを作成してください", estimatedTime: "20分", impact: Math.min(deficit, 40) },
    ],
    "自動化レベル": [
      { item: itemName, problem: "自動化レベルが低い", action: "Auto Mode エイリアス、Plan Mode 設定、skill-resolver を導入してください", estimatedTime: "10分", impact: Math.min(deficit, 40) },
    ],
    "通信・遠隔": [
      { item: itemName, problem: "通信・遠隔機能が不足", action: "claude-peers MCP を追加し、Discord/Telegram 連携を検討してください", estimatedTime: "15分", impact: Math.min(deficit, 35) },
    ],
  };

  return suggestionMap[itemName] ?? [
    { item: itemName, problem: `${itemName}のスコアが低い`, action: "該当する設定・ファイルを追加してください", estimatedTime: "10分", impact: Math.min(deficit, 30) },
  ];
}

// ─── メインスコアリング ───

function calcAverage(items: ItemScore[]): number {
  if (items.length === 0) return 0;
  return Math.round(items.reduce((sum, i) => sum + i.score, 0) / items.length);
}

function getGrade(score: number): string {
  if (score >= 95) return "S";
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 65) return "C";
  if (score >= 55) return "D";
  return "E";
}

export function calculateScore(input: ParsedInput): ScorecardResult {
  const categories: CategoryScore[] = [
    {
      name: "基盤・インフラ",
      items: [scoreClaudeMd(input), scoreMcp(input), scoreHooks(input), scoreEnvManagement(input)],
      average: 0,
    },
    {
      name: "スキル・エコシステム",
      items: [scoreSkillCount(input), scoreSkillArchitecture(input), scorePlugins(input), scoreSubagents(input)],
      average: 0,
    },
    {
      name: "ワークフロー自動化",
      items: [scoreCommands(input), scoreProjectInit(input), scoreDailyCycle(input), scoreContextManagement(input)],
      average: 0,
    },
    {
      name: "品質管理",
      items: [scoreTestStrategy(input), scoreSecurity(input), scoreQualityEnforcement(input)],
      average: 0,
    },
    {
      name: "デバッグ＆修復",
      items: [scoreDebugAbility(input), scoreRefactoringAbility(input), scoreDependencyMaintenance(input)],
      average: 0,
    },
    {
      name: "セッション管理",
      items: [scoreSessionHandoff(input), scoreHarnessCompliance(input), scoreSpecDrivenDev(input)],
      average: 0,
    },
    {
      name: "先進機能",
      items: [scoreParallelDev(input), scoreEcosystemIntegration(input), scoreAutomationLevel(input), scoreCommunication(input)],
      average: 0,
    },
  ];

  for (const cat of categories) {
    cat.average = calcAverage(cat.items);
  }

  const allItems = categories.flatMap((c) => c.items);
  const totalScore = Math.round(allItems.reduce((sum, i) => sum + i.score, 0) / allItems.length);

  const improvements = generateImprovements(categories);

  return {
    categories,
    totalScore,
    grade: getGrade(totalScore),
    improvements,
  };
}

// ─── タイプ相対スコア計算 ───

import { getTypeReference, type Relevance } from "./type-references";

export interface TypeRelativeResult {
  score: number;
  grade: string;
  requiredItems: { name: string; score: number; max: number }[];
  recommendedItems: { name: string; score: number; max: number }[];
  irrelevantItems: string[];
}

export function calculateTypeRelativeScore(
  categories: CategoryScore[],
  typeId: string,
): TypeRelativeResult {
  const ref = getTypeReference(typeId);
  if (!ref) {
    return { score: 0, grade: "E", requiredItems: [], recommendedItems: [], irrelevantItems: [] };
  }

  const allItems = categories.flatMap((c) => c.items);
  const requiredItems: { name: string; score: number; max: number }[] = [];
  const recommendedItems: { name: string; score: number; max: number }[] = [];
  const irrelevantItems: string[] = [];

  for (const item of allItems) {
    const relevance: Relevance = ref.items[item.name] ?? "irrelevant";
    if (relevance === "required") {
      requiredItems.push({ name: item.name, score: item.score, max: item.maxScore });
    } else if (relevance === "recommended") {
      recommendedItems.push({ name: item.name, score: item.score, max: item.maxScore });
    } else {
      irrelevantItems.push(item.name);
    }
  }

  const reqTotal = requiredItems.reduce((s, i) => s + i.score, 0);
  const reqMax = requiredItems.reduce((s, i) => s + i.max, 0);
  const recTotal = recommendedItems.reduce((s, i) => s + i.score, 0);
  const recMax = recommendedItems.reduce((s, i) => s + i.max, 0);

  const numerator = reqTotal + recTotal * 0.5;
  const denominator = reqMax + recMax * 0.5;
  const score = denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

  return {
    score,
    grade: getGrade(score),
    requiredItems,
    recommendedItems,
    irrelevantItems,
  };
}
