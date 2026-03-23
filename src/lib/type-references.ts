export type Relevance = "required" | "recommended" | "irrelevant";

export interface TypeReference {
  typeId: string;
  typeName: string;
  description: string;
  items: Record<string, Relevance>;
}

// 25項目のID（scorer.tsのname値と一致）
const ALL_ITEM_NAMES = [
  "CLAUDE.md品質",
  "MCP構成",
  "フック構成",
  "PC間同期・環境管理",
  "スキル数と多様性",
  "スキルアーキテクチャ",
  "プラグイン活用",
  "サブエージェント活用",
  "スラッシュコマンド",
  "プロジェクト初期化フロー",
  "日常開発サイクルの完全性",
  "コンテキスト管理",
  "テスト・検証戦略",
  "セキュリティ",
  "品質自動強制",
  "デバッグ能力",
  "リファクタリング能力",
  "依存管理・メンテナンス",
  "セッション間引き継ぎ",
  "ハーネスエンジニアリング準拠度",
  "仕様書駆動開発",
  "並列開発",
  "エコシステム連携",
  "自動化レベル",
  "通信・遠隔",
] as const;

export { ALL_ITEM_NAMES };

function buildItems(
  required: string[],
  recommended: string[],
): Record<string, Relevance> {
  const items: Record<string, Relevance> = {};
  for (const name of ALL_ITEM_NAMES) {
    if (required.includes(name)) items[name] = "required";
    else if (recommended.includes(name)) items[name] = "recommended";
    else items[name] = "irrelevant";
  }
  return items;
}

export const TYPE_REFERENCES: TypeReference[] = [
  {
    typeId: "explorer",
    typeName: "Explorer（ベーシック）",
    description:
      "CLAUDE.mdが整備され、Plan Modeを活用し、基本的なMCPが接続されている状態が理想。",
    items: buildItems(
      ["CLAUDE.md品質", "MCP構成"],
      ["フック構成", "セッション間引き継ぎ"],
    ),
  },
  {
    typeId: "architect",
    typeName: "Architect（仕様書駆動）",
    description:
      "仕様書先行、タスク分割→1タスク1コミット、テストファースト。設計に基づいた堅実な開発が理想。",
    items: buildItems(
      [
        "CLAUDE.md品質", "MCP構成", "プロジェクト初期化フロー",
        "テスト・検証戦略", "仕様書駆動開発", "セッション間引き継ぎ",
      ],
      [
        "フック構成", "スラッシュコマンド", "コンテキスト管理",
        "デバッグ能力", "セキュリティ",
      ],
    ),
  },
  {
    typeId: "engineer",
    typeName: "Engineer（ハーネスエンジニアリング）",
    description:
      "5つの柱が完全実装。3層構造、自動化されたワークフロー、品質管理の完全サイクルが理想。全25項目が必須。",
    items: buildItems(ALL_ITEM_NAMES as unknown as string[], []),
  },
  {
    typeId: "commander",
    typeName: "Commander（マルチエージェント）",
    description:
      "Agent Teams/Worktreeで並列開発。Builder-Validatorパターンによる大規模開発が理想。",
    items: buildItems(
      [
        "CLAUDE.md品質", "MCP構成", "サブエージェント活用", "並列開発",
        "テスト・検証戦略", "セキュリティ", "デバッグ能力",
      ],
      [
        "スキル数と多様性", "スラッシュコマンド", "コンテキスト管理",
        "フック構成", "品質自動強制", "自動化レベル",
      ],
    ),
  },
  {
    typeId: "scholar",
    typeName: "Scholar（アカデミック/リサーチ）",
    description:
      "論文/データ分析中心。Worker-Criticペアによる検証、再現性重視の研究環境が理想。",
    items: buildItems(
      [
        "CLAUDE.md品質", "MCP構成", "サブエージェント活用",
        "セッション間引き継ぎ", "コンテキスト管理",
      ],
      [
        "スキル数と多様性", "フック構成", "テスト・検証戦略", "品質自動強制",
      ],
    ),
  },
  {
    typeId: "visionary",
    typeName: "Visionary（Outcome Engineering）",
    description:
      "成果最適化。エージェントチーム→自律実行→人間レビュー。成果を最大化する自律的な組織が理想。",
    items: buildItems(
      [
        "CLAUDE.md品質", "MCP構成", "サブエージェント活用", "並列開発",
        "自動化レベル", "セッション間引き継ぎ", "ハーネスエンジニアリング準拠度",
      ],
      [
        "スキル数と多様性", "スラッシュコマンド", "プロジェクト初期化フロー",
        "テスト・検証戦略", "コンテキスト管理",
      ],
    ),
  },
];

export function getTypeReference(typeId: string): TypeReference | undefined {
  return TYPE_REFERENCES.find((t) => t.typeId === typeId);
}
