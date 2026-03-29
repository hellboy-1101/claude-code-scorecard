export interface DiagnosisType {
  id: string;
  name: string;
  nameJa: string;
  color: string;
  colorLight: string;
  colorDark: string;
  subtitle: string;
  catchphrase: string;
  target: string;
  keywords: string[];
  description: string;
  strengths: string[];
  growth: string[];
  firstStep: string;
}

export const DIAGNOSIS_TYPES: DiagnosisType[] = [
  {
    id: "basic",
    name: "Explorer",
    nameJa: "探索者",
    color: "#3B82F6",
    colorLight: "#DBEAFE",
    colorDark: "#1E40AF",
    subtitle: "はじめの一歩を踏み出した冒険者",
    catchphrase: "claudeと対話し、可能性を探索する",
    target: "Claude Code初心者、コーディング学習者",
    keywords: ["/init", "Auto Mode", "/effort", "Auto Memory", "CLAUDE.md"],
    description:
      "Claude Codeとの対話を通じて、プログラミングの可能性を探索しています。/initによるCLAUDE.md自動生成、Auto Modeでの安全な自動操作、/effortでの推論レベル調整など、基本機能を使いこなすことが最優先です。バイブコーディングの限界を理解し、構造的なアプローチへ進む準備段階にいます。",
    strengths: [
      "フットワークが軽く、新しいことを試すのが得意",
      "/initで素早くプロジェクトを立ち上げられる",
      "Auto Modeで安全に自動操作を体験できる",
    ],
    growth: [
      "Auto Memoryを活用し、セッション間の一貫性を向上させましょう",
      "Skills Marketplaceからコミュニティ製スキルを導入してみましょう",
      "次のステップはArchitect（設計者）タイプへの移行です",
    ],
    firstStep:
      "/init でCLAUDE.mdを生成し、/effort で推論レベルを調整する",
  },
  {
    id: "specDriven",
    name: "Architect",
    nameJa: "設計者",
    color: "#8B5CF6",
    colorLight: "#EDE9FE",
    colorDark: "#5B21B6",
    subtitle: "仕様書から始める堅実な建築家",
    catchphrase: "コードを書く前に、まず設計図を描く",
    target: "中規模プロジェクト、品質重視の開発者",
    keywords: ["Spec-Driven Development", "AGENTS.md", "initialPrompt", "paths:", "MCP elicitation"],
    description:
      "仕様書を先に書き、設計に基づいてコードを実装するアプローチをとっています。AGENTS.mdによるエージェント設定標準化、initialPromptフロントマターによるエージェント自動サブミット、Skillsのpaths:による条件付きロード、managed-settings.d/によるチームポリシー管理、MCP elicitationによる対話形式の要件収集が次の進化ポイントです。",
    strengths: [
      "仕様書ファーストの習慣が身についている",
      "AGENTS.mdでエージェント設定を標準化できている",
      "設計と実装の分離ができている",
    ],
    growth: [
      "Agent Interviewワークフローで要件収集を自動化できます",
      "managed-settings.d/でチームポリシーをフラグメント管理できます",
      "次のステップはEngineer（技師）タイプへの移行です",
    ],
    firstStep:
      "~/.claude/rules/ に coding-standards.md を作成し、AGENTS.md でエージェント設定を定義する",
  },
  {
    id: "harness",
    name: "Engineer",
    nameJa: "技師",
    color: "#F59E0B",
    colorLight: "#FEF3C7",
    colorDark: "#B45309",
    subtitle: "長期運用を見据えたハーネスの匠",
    catchphrase: "仕組みで品質を保証する、持続可能な開発",
    target: "複数セッションにまたがる長期プロジェクト",
    keywords: ["ハーネスエンジニアリング", "HTTP Hooks", "21フックイベント", "Plugin Marketplace", "conditional if"],
    description:
      "ハーネスエンジニアリングの原則に基づき、長期運用を見据えた堅牢な開発環境を構築しています。HTTP Hooks、21種のフックイベント（PostCompact, TaskCreated等）、conditional ifによる条件付きフック実行、Skillsのeffort/modelフロントマター、Plugin Marketplaceの自作・配布、--bareフラグによるスクリプト統合、CLAUDE_CODE_SUBPROCESS_ENV_SCRUBによるセキュリティ強化が特徴です。",
    strengths: [
      "21種のフックイベントを活用した品質管理が自動化されている",
      "HTTP Hooksとconditional ifで精密なフック制御ができている",
      "Plugin Marketplaceで自作プラグインを配布できる",
    ],
    growth: [
      "Agent TeamsとWorktreeで並列開発に移行できます",
      "次のステップはCommander（指揮官）タイプの要素を取り入れることです",
      "CLAUDE_CODE_SUBPROCESS_ENV_SCRUBでサブプロセスのセキュリティを強化できます",
    ],
    firstStep:
      "HTTP Hooksを導入し、PostCompactフックでコンパクション後の状態検証を自動化する",
  },
  {
    id: "multiAgent",
    name: "Commander",
    nameJa: "指揮官",
    color: "#EF4444",
    colorLight: "#FEE2E2",
    colorDark: "#B91C1C",
    subtitle: "AIチームを率いるオーケストレーター",
    catchphrase: "1つのエージェントでは足りない。チームを編成する",
    target: "大規模コードベース、エンタープライズ、チーム開発",
    keywords: ["Agent Teams/Swarm", "isolation: worktree", "/loop", "Remote Control", "--channels"],
    description:
      "複数のAIエージェントを協調させ、大規模な開発を効率的に進めるオーケストレーターです。Agent Teams/Swarm Modeによる公式マルチエージェント、isolation: worktreeによるコンフリクトフリー並列開発、/loopとクラウドスケジュールタスクによる自律監視、Remote Controlによるモバイルからのオーケストレーション、--channelsによる非同期承認リレーが特徴です。",
    strengths: [
      "Agent Teams/Swarm Modeでマルチエージェント協調が実現されている",
      "isolation: worktreeで大規模リファクタリングを安全に並列化できる",
      "/loopとRemote Controlで非同期・遠隔からのオーケストレーションが可能",
    ],
    growth: [
      "Outcome Engineeringの原則を取り入れ、「コード」ではなく「成果」を最適化",
      "クラウドスケジュールタスクで完全自律の監視・レポート体制を構築",
      "worktree.sparsePathsでモノレポの並列化効率を向上",
    ],
    firstStep:
      "Agent TeamsでSwarm Modeを有効化し、isolation: worktreeで並列PRパイプラインを構築する",
  },
  {
    id: "academic",
    name: "Scholar",
    nameJa: "学者",
    color: "#10B981",
    colorLight: "#D1FAE5",
    colorDark: "#047857",
    subtitle: "知識を体系化する研究者",
    catchphrase: "再現性と品質を、学術レベルで追求する",
    target: "研究者、論文執筆、データ分析",
    keywords: ["Worker-Criticペア", "加重スコアリング", "Adversarial QA", "PostCompact", "Context Engineering"],
    description:
      "研究の再現性と品質を最重視する学術志向のアプローチです。Worker-Criticペアによる厳格な役割分離（クリティックはレビュー専任）、加重スコアリングとコンポーネント最低点による品質ゲート、Adversarial QAフェーズによる批評強度の可変設計、PostCompactフックによる長期セッション品質維持、Context Engineeringの概念を研究ワークフローに適用することが特徴です。",
    strengths: [
      "Worker-Criticペアで成果物の再現性が保証されている",
      "加重スコアリングで多角的な品質評価ができる",
      "PostCompactフックで長期セッションの品質を維持できる",
    ],
    growth: [
      "Context Engineeringを研究ワークフローに適用して効率化できます",
      "R&R（査読対応）の効率化にAgent Teamsを活用できます",
      "再現性検証プロトコルをテンプレート化して共有できます",
    ],
    firstStep:
      "Worker-Criticペアを構築し、Adversarial QAフェーズを研究パイプラインに組み込む",
  },
  {
    id: "outcome",
    name: "Visionary",
    nameJa: "先見者",
    color: "#EC4899",
    colorLight: "#FCE7F3",
    colorDark: "#BE185D",
    subtitle: "コードではなく成果を設計する革新者",
    catchphrase: "エンジニアリングの次の形を定義する",
    target: "Outcome Engineering実践者",
    keywords: ["KPI 4柱×3", "クラウドスケジュール", "制約違反認識", "Opus 4.6 1M", "安全設計"],
    description:
      "ソフトウェアエンジニアリングの次の形を模索しています。自律エージェントKPI測定フレームワーク（デリバリー・品質・効率・ビジネスインパクトの4柱×3KPI）、クラウドスケジュールタスクによるローカルCLI不要の完全自律実行、Outcome-Driven制約違反の認識と安全設計、Agent Teams+worktreeによる並列PRパイプライン、Opus 4.6の1Mコンテキスト戦略を実践するOutcome Engineeringの先駆者です。",
    strengths: [
      "KPIフレームワークで「成果」を定量的に最適化できる",
      "クラウドスケジュールタスクで完全自律のエージェント運用が可能",
      "Opus 4.6 1Mコンテキストを戦略的に活用できる",
    ],
    growth: [
      "制約違反リスクの認識と安全設計の深化が重要です",
      "コミュニティへの知見共有で、パラダイムの形成に貢献できます",
      "Engineer（技師）タイプの品質管理手法を取り入れると安定性が向上",
    ],
    firstStep:
      "KPI測定フレームワーク（4柱×3）を定義し、クラウドスケジュールタスクで自律監視を開始する",
  },
];

export function getTypeById(id: string): DiagnosisType | undefined {
  return DIAGNOSIS_TYPES.find((t) => t.id === id);
}
