import type { DiagnosisResult } from "./quiz-data";
import { getTypeReference } from "./type-references";
import type { TypeRelativeResult } from "./scorer";
import type { ParsedInput } from "./types";

// ─── Interest → Feature map (Layer 1) ───

export const INTEREST_TO_FEATURES: Record<string, { label: string; features: string[] }> = {
  "project-init": {
    label: "プロジェクトの初期設定を自動化したい",
    features: [
      "project-initializer スキル",
      "skill-resolver スキル",
      "CLAUDE.md テンプレート",
      "feature_list.json",
    ],
  },
  "workflow": {
    label: "テスト→レビュー→コミットのワークフローを整えたい",
    features: [
      "/user:test + test-writer サブエージェント",
      "/user:review + code-reviewer サブエージェント",
      "/user:commit コマンド",
      "PostToolUse フック",
    ],
  },
  "debug": {
    label: "バグの自動検出・修正を導入したい",
    features: [
      "debugger サブエージェント",
      "/user:debug コマンド",
      "/user:bugfix コマンド",
      "/user:build コマンド",
      "CLAUDE.md 品質検証ルール",
    ],
  },
  "quality": {
    label: "コードの品質を自動で維持したい",
    features: [
      "常駐ルール（rules/）",
      "adversarial-review スキル",
      "quality-auditor + /user:audit コマンド",
      "/user:refactor コマンド",
      "dependency-check スキル",
    ],
  },
  "parallel": {
    label: "複数のAIインスタンスを並列で動かしたい",
    features: [
      "Git Worktree（cawエイリアス）",
      "Agent Teams",
      "claude-peers MCP",
    ],
  },
  "catchup": {
    label: "最新のClaude Code機能や設定を常にキャッチアップしたい",
    features: [
      "Context7 MCP",
      "/weekly-eval コマンド",
      "researcher サブエージェント",
    ],
  },
  "general": {
    label: "全体的に底上げしたい",
    features: [],
  },
};

// ─── Feature info map for knowledge gap descriptions ───

export const FEATURE_INFO: Record<string, { name: string; description: string; prompt: string }> = {
  claudemd: {
    name: "CLAUDE.md",
    description: "プロジェクトの方針・ルール・コマンドを記載するグローバル設定ファイル",
    prompt: "~/.claude/CLAUDE.md を作成し、プロジェクトのルール・コマンド・ワークフローを記載してください。100行以内の目次に留め、詳細は docs/ に配置してください。",
  },
  planmode: {
    name: "Plan Mode（計画モード）",
    description: "実装前に計画を立て、承認を得てから実行するモード",
    prompt: "Shift+Tab でPlan Modeに切り替え、実装計画を立ててから作業を開始してください。",
  },
  commands: {
    name: "カスタムスラッシュコマンド",
    description: "~/.claude/commands/ に定義する独自のワークフローショートカット",
    prompt: "~/.claude/commands/ に review.md, test.md, commit.md, debug.md, status.md を作成し、日常の開発サイクルを自動化してください。",
  },
  agents: {
    name: "サブエージェント",
    description: "独立したコンテキストで動作する専門家エージェント",
    prompt: "~/.claude/agents/ に code-reviewer.md, test-writer.md, debugger.md, quality-auditor.md を作成してください。各エージェントにYAML frontmatter（name, description, tools, model）を記載します。",
  },
  skills: {
    name: "スキル（SKILL.md）",
    description: "トリガー条件に合致した時だけ読み込まれるClaude Codeの拡張機能",
    prompt: "~/.claude/skills/ にプロジェクト固有のスキルを作成してください。各スキルにはSKILL.mdファイルを配置し、description にトリガー条件を明記します。",
  },
  mcp: {
    name: "MCP（Model Context Protocol）",
    description: "外部ツールやサービスをClaude Codeに接続するプロトコル",
    prompt: "claude mcp add で Context7（ドキュメント取得）、Playwright（ブラウザ自動化）を追加してください。",
  },
  agentteams: {
    name: "Agent Teams",
    description: "複数のサブエージェントを連携させて大規模タスクを並列処理する機能",
    prompt: "CLAUDE_AGENT_TEAM 環境変数を設定し、Agent Teamsを有効化してください。Builder-Validatorパターンで品質を担保しながら並列実装できます。",
  },
  worktree: {
    name: "Git Worktree（並列開発）",
    description: "同一リポジトリの複数ブランチを同時に作業するための機能",
    prompt: "alias caw='claude --worktree' を ~/.zshrc に追加し、Git Worktreeで並列開発環境を構築してください。",
  },
  hooks: {
    name: "フック（hooks/）",
    description: "セッション開始/終了、ツール実行前後に自動実行されるスクリプト",
    prompt: "~/.claude/settings.json の hooks セクションに SessionStart（環境検証）と PostToolUse（品質チェック）フックを追加してください。",
  },
  featurelist: {
    name: "feature_list.json による進捗管理",
    description: "機能一覧とテスト手順を管理し、完了状態をバイナリで追跡するファイル",
    prompt: "プロジェクトルートに feature_list.json を作成し、各機能にid, name, passes（boolean）, test_steps（配列）を定義してください。/user:next コマンドで自動選定できます。",
  },
};

// ─── Suggestion types ───

export interface GapSuggestion {
  type: "interest" | "knowledge" | "environment";
  title: string;
  description: string;
  prompt: string;
  priority: number;
}

// ─── inferActualType: infer type from environment data ───

export interface InferredType {
  actualType: string;
  confidence: number;
  evidence: string[];
}

export function inferActualType(input: ParsedInput): InferredType {
  const evidence: string[] = [];
  const scores: Record<string, number> = {
    basic: 0, specDriven: 0, harness: 0,
    multiAgent: 0, academic: 0, outcome: 0,
  };

  const has = (text: string, ...patterns: string[]): boolean => {
    const lower = text.toLowerCase();
    return patterns.some((p) => lower.includes(p.toLowerCase()));
  };

  // CLAUDE.md existence and quality
  if (input.claudemd && input.claudemd !== "none") {
    scores.basic += 1;
    evidence.push("CLAUDE.md が存在する");

    if (has(input.claudemd, "architecture", "仕様", "spec", "feature_list")) {
      scores.specDriven += 2;
      evidence.push("CLAUDE.md に仕様/アーキテクチャ参照がある");
    }
    if (has(input.claudemd, "ハーネス", "harness", "5つの柱", "品質検証")) {
      scores.harness += 2;
      evidence.push("CLAUDE.md にハーネスエンジニアリング参照がある");
    }
  }

  // Rules
  if (input.rules && input.rules !== "none") {
    const ruleCount = input.rules.split("\n").filter((l) => l.trim()).length;
    if (ruleCount >= 5) {
      scores.harness += 2;
      evidence.push(`常駐ルールが ${ruleCount} 件ある`);
    } else if (ruleCount >= 2) {
      scores.specDriven += 1;
      evidence.push(`常駐ルールが ${ruleCount} 件ある`);
    }
  }

  // Agents
  if (input.agents && input.agents !== "none") {
    const agentCount = input.agents.split("\n").filter((l) => l.trim()).length;
    if (agentCount >= 3) {
      scores.multiAgent += 2;
      scores.harness += 1;
      evidence.push(`サブエージェントが ${agentCount} 件ある`);
    }
  }

  // MCP
  if (input.mcp && input.mcp !== "none") {
    if (has(input.mcp, "claude-peers")) {
      scores.multiAgent += 2;
      evidence.push("claude-peers MCP が接続されている");
    }
    if (has(input.mcp, "context7")) {
      scores.academic += 1;
      evidence.push("Context7 MCP が接続されている");
    }
  }

  // Hooks
  if (input.hooks && input.hooks !== "none") {
    scores.harness += 2;
    evidence.push("フック設定がある");
  }

  // Skills
  if (input.skills && input.skills !== "none") {
    const skillCount = input.skills.split("\n").filter((l) => l.trim()).length;
    if (skillCount >= 3) {
      scores.harness += 1;
      scores.outcome += 1;
      evidence.push(`スキルが ${skillCount} 件ある`);
    }
  }

  // Commands
  if (input.commands && input.commands !== "none") {
    const cmdCount = input.commands.split("\n").filter((l) => l.trim()).length;
    if (cmdCount >= 5) {
      scores.harness += 2;
      evidence.push(`コマンドが ${cmdCount} 件ある`);
    }
  }

  // Zshrc worktree alias
  if (input.zshrc && has(input.zshrc, "worktree", "caw")) {
    scores.multiAgent += 1;
    evidence.push("Worktree エイリアスがある");
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const topScore = sorted[0][1];
  const totalPossible = 15; // rough max
  const confidence = Math.min(1, topScore / totalPossible * 2);

  return {
    actualType: topScore > 0 ? sorted[0][0] : "basic",
    confidence: Math.round(confidence * 100) / 100,
    evidence,
  };
}

// ─── compareTypes: compare quiz type vs inferred type ───

export interface TypeComparison {
  pattern: "match" | "aspiration" | "underestimate" | "diverge";
  evaluationType: string;
  message: string;
}

export function compareTypes(
  quizType: string,
  actualType: string,
  confidence: number,
): TypeComparison {
  if (confidence < 0.2) {
    // Low confidence: trust quiz
    return {
      pattern: "match",
      evaluationType: quizType,
      message: "環境データが少ないため、クイズ結果を基準にします。",
    };
  }

  if (quizType === actualType) {
    return {
      pattern: "match",
      evaluationType: quizType,
      message: "目指す姿と現在の環境が一致しています。",
    };
  }

  // Tier ordering for comparison
  const tiers: Record<string, number> = {
    basic: 1, specDriven: 2, harness: 3,
    multiAgent: 4, academic: 2, outcome: 4,
  };

  const quizTier = tiers[quizType] ?? 1;
  const actualTier = tiers[actualType] ?? 1;

  if (quizTier > actualTier) {
    return {
      pattern: "aspiration",
      evaluationType: quizType,
      message: `現在は ${actualType} レベルですが、${quizType} を目指しています。ギャップを埋める提案を行います。`,
    };
  }

  if (quizTier < actualTier) {
    return {
      pattern: "underestimate",
      evaluationType: actualType,
      message: `環境は既に ${actualType} レベルに達しています。より高い基準で評価します。`,
    };
  }

  // Same tier, different type
  return {
    pattern: "diverge",
    evaluationType: quizType,
    message: `現在の環境は ${actualType} 向きですが、${quizType} を目指しています。方向転換の提案を含めます。`,
  };
}

// ─── 3-layer suggestion generation ───

export function generateGapSuggestions(
  diagnosis: DiagnosisResult,
  typeRelative: TypeRelativeResult | null,
  selectedInterest?: string,
): GapSuggestion[] {
  const suggestions: GapSuggestion[] = [];
  const evaluationType = diagnosis.primaryType;
  const ref = getTypeReference(evaluationType);

  // Layer 1: Interest-based suggestions
  if (selectedInterest && selectedInterest !== "general") {
    const interestInfo = INTEREST_TO_FEATURES[selectedInterest];
    if (interestInfo && interestInfo.features.length > 0) {
      suggestions.push({
        type: "interest",
        title: interestInfo.label,
        description: "選択した関心領域に基づく提案です",
        prompt: interestInfo.features.map((f) => `- ${f}`).join("\n"),
        priority: 100,
      });
    }
  }

  // Layer 2: Knowledge gap (Q5 unknownFeatures relevant to evaluationType)
  if (ref) {
    for (const featureId of diagnosis.unknownFeatures) {
      const info = FEATURE_INFO[featureId];
      if (!info) continue;

      const isRelevant = isFeatureRelevantToType(featureId, ref.items);
      if (!isRelevant) continue;

      suggestions.push({
        type: "knowledge",
        title: info.name,
        description: `${ref.typeName}に必要な機能ですが、まだ使ったことがないようです。${info.description}`,
        prompt: info.prompt,
        priority: 80,
      });
    }
  }

  // Layer 3: Environment gap (items scoring below 80)
  if (typeRelative && ref) {
    for (const item of typeRelative.requiredItems) {
      if (item.score < 80) {
        suggestions.push({
          type: "environment",
          title: item.name,
          description: `${ref.typeName}の必須項目ですが、現在 ${item.score}/${item.max} 点です`,
          prompt: getEnvImprovementPrompt(item.name),
          priority: 60 + (80 - item.score),
        });
      }
    }
    for (const item of typeRelative.recommendedItems) {
      if (item.score < 80) {
        suggestions.push({
          type: "environment",
          title: item.name,
          description: `${ref.typeName}の推奨項目です。現在 ${item.score}/${item.max} 点`,
          prompt: getEnvImprovementPrompt(item.name),
          priority: 40 + (80 - item.score),
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}

// ─── Helper: check if feature is relevant to type ───

function isFeatureRelevantToType(
  featureId: string,
  items: Record<string, string>,
): boolean {
  const featureToItems: Record<string, string[]> = {
    claudemd: ["CLAUDE.md品質"],
    planmode: ["自動化レベル"],
    commands: ["スラッシュコマンド", "日常開発サイクルの完全性"],
    agents: ["サブエージェント活用"],
    skills: ["スキル数と多様性", "スキルアーキテクチャ"],
    mcp: ["MCP構成"],
    agentteams: ["並列開発"],
    worktree: ["並列開発"],
    hooks: ["フック構成"],
    featurelist: ["プロジェクト初期化フロー", "仕様書駆動開発", "セッション間引き継ぎ"],
  };

  const relatedItems = featureToItems[featureId] ?? [];
  return relatedItems.some(
    (itemName) => items[itemName] === "required" || items[itemName] === "recommended",
  );
}

// ─── Helper: environment improvement prompts ───

function getEnvImprovementPrompt(itemName: string): string {
  const prompts: Record<string, string> = {
    "CLAUDE.md品質": "~/.claude/CLAUDE.md を作成し、コマンド・ルール・ワークフロー・リソース優先順位を記載してください。",
    "MCP構成": "claude mcp add で playwright, context7 を追加してください。",
    "フック構成": "settings.json の hooks セクションに SessionStart / PostToolUse フックを追加してください。",
    "PC間同期・環境管理": "~/.zshrc に alias ca='claude --auto' を追加してください。",
    "スキル数と多様性": "~/.claude/skills/ にプロジェクト固有のスキルを作成してください。",
    "スキルアーキテクチャ": "~/.claude/rules/ に coding-standards.md, security.md, testing-policy.md を作成してください。",
    "プラグイン活用": "claude plugin add で frontend-design, plugin-dev 等を追加してください。",
    "サブエージェント活用": "~/.claude/agents/ に code-reviewer.md, test-writer.md, debugger.md を作成してください。",
    "スラッシュコマンド": "~/.claude/commands/ に review.md, test.md, commit.md, debug.md を作成してください。",
    "プロジェクト初期化フロー": "project-initializer スキルを作成し、feature_list.json 生成フローを組み込んでください。",
    "日常開発サイクルの完全性": "next, test, review, commit, debug, refactor の各コマンドを作成してください。",
    "コンテキスト管理": "settings.json に AUTOCOMPACT / MAX_THINKING_TOKENS を設定してください。",
    "テスト・検証戦略": "testing-policy ルール、test-writer エージェント、adversarial-review スキルを追加してください。",
    "セキュリティ": "security ルール、dependency-check スキル、careful スキルを追加してください。",
    "品質自動強制": "PostToolUse フック、quality-enforcement ルール、audit コマンドを追加してください。",
    "デバッグ能力": "~/.claude/agents/debugger.md を作成し、debug / bugfix コマンドを追加してください。",
    "リファクタリング能力": "refactor コマンドと audit コマンドを作成してください。",
    "依存管理・メンテナンス": "dependency-check スキルを作成してください。",
    "セッション間引き継ぎ": "SessionStart フックに progress.md の自動表示を追加してください。",
    "ハーネスエンジニアリング準拠度": "feature_list.json + progress管理 + test/review/debugフローでハーネス5柱に準拠してください。",
    "仕様書駆動開発": "project-initializer スキルを作成し、ARCHITECTURE.md / feature_list.json 生成を組み込んでください。",
    "並列開発": "worktree エイリアス、claude-peers MCP を追加してください。",
    "エコシステム連携": "everything-claude-code をリファレンスに追加し、ecc-dispatcher スキルを作成してください。",
    "自動化レベル": "Auto Mode エイリアス、Plan Mode 設定、skill-resolver を導入してください。",
    "通信・遠隔": "claude-peers MCP を追加してください。",
  };
  return prompts[itemName] ?? `${itemName} の設定を改善してください。`;
}
