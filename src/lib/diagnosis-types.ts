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
    keywords: ["Explore → Plan → Code", "CLAUDE.mdのみ"],
    description:
      "Claude Codeとの対話を通じて、プログラミングの可能性を探索しています。現時点では最小限の設定で使っていますが、それは正しいアプローチです。まずはClaude Codeの基本を体に染み込ませることが最優先です。",
    strengths: [
      "フットワークが軽く、新しいことを試すのが得意",
      "最小限の設定で素早く始められる",
      "Claude Codeの基本操作に慣れつつある",
    ],
    growth: [
      "CLAUDE.mdを充実させることで、セッション間の一貫性が向上します",
      "次のステップはArchitect（設計者）タイプへの移行です",
      "仕様書を先に書く習慣をつけると、コードの品質が劇的に変わります",
    ],
    firstStep:
      "/init でCLAUDE.mdを生成し、プロジェクトの方針を記載する",
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
    keywords: ["Spec-Driven Development", "EARS", "仕様書ファースト"],
    description:
      "仕様書を先に書き、設計に基づいてコードを実装するアプローチをとっています。これはSpec-Driven Developmentの基本形であり、個人開発からチーム開発への移行準備ができています。",
    strengths: [
      "仕様書ファーストの習慣が身についている",
      "コードの品質と保守性を重視している",
      "設計と実装の分離ができている",
    ],
    growth: [
      "スキルとサブエージェントの導入で反復作業を自動化できます",
      "次のステップはEngineer（技師）タイプへの移行です",
      "常駐ルールの蒸留で、セッション間の品質一貫性が飛躍的に向上します",
    ],
    firstStep:
      "~/.claude/rules/ に coding-standards.md と testing-policy.md を作成する",
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
    keywords: ["ハーネスエンジニアリング", "常駐ルール蒸留", "3層構造"],
    description:
      "ハーネスエンジニアリングの原則に基づき、長期運用を見据えた堅牢な開発環境を構築しています。常駐ルール、スキル、サブエージェント、スラッシュコマンドを組み合わせた「作る→検査→直す」の完全サイクルが特徴です。",
    strengths: [
      "品質管理が自動化されている",
      "セッション間の引き継ぎが仕組み化されている",
      "技術的負債の制御が計画的に行われている",
    ],
    growth: [
      "Agent TeamsとWorktreeで並列開発に移行できます",
      "次のステップはCommander（指揮官）タイプの要素を取り入れることです",
      "敵対的レビュー（adversarial-review）で品質の上限を引き上げられます",
    ],
    firstStep:
      "Agent Teamsを有効化し、大きな機能を分割して並列実装する",
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
    keywords: ["Agent Teams", "Worktree", "マルチエージェント"],
    description:
      "複数のAIエージェントを協調させ、大規模な開発を効率的に進めるオーケストレーターです。Agent Teams、Worktree、Builder-Validatorパターンを駆使し、人間の役割を「実装」から「監督・戦略」に移行しています。",
    strengths: [
      "マルチエージェント協調が実現されている",
      "大規模リファクタリングを並列化できる",
      "CI/CD統合でデプロイまで自動化されている",
    ],
    growth: [
      "Outcome Engineeringの原則を取り入れ、「コード」ではなく「成果」を最適化",
      "エージェントの品質監視と自己改善ループの導入",
      "組織全体へのベストプラクティス展開",
    ],
    firstStep:
      "エージェントの実行履歴を分析し、ボトルネックを特定する",
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
    keywords: ["Worker-Criticペア", "品質ゲート", "再現性"],
    description:
      "研究の再現性と品質を最重視する学術志向のアプローチです。Worker-Criticペアによる敵対的検証、品質ゲート付きフェーズ管理、そして成果物の完全な追跡可能性が特徴です。",
    strengths: [
      "成果物の再現性が保証されている",
      "敵対的検証で品質の上限が高い",
      "知識の体系化と蓄積が仕組み化されている",
    ],
    growth: [
      "研究ワークフローの自動化をさらに進められます",
      "R&R（査読対応）の効率化にAgent Teamsを活用できます",
      "他の研究者とのワークフロー共有で組織全体の生産性向上",
    ],
    firstStep:
      "専門ドメインのナレッジベースをスキルとして体系化する",
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
    keywords: ["成果最適化", "AIチームメンバー化", "o16g"],
    description:
      "ソフトウェアエンジニアリングの次の形を模索しています。コードではなく成果を設計し、AIエージェントをチームメンバーとして扱うOutcome Engineeringの実践者です。",
    strengths: [
      "「何を作るか」ではなく「何を達成するか」にフォーカス",
      "AIエージェントの自律性を最大限活用",
      "従来のエンジニアリングの枠組みを超えた発想",
    ],
    growth: [
      "この領域はまだ「新興」であり、ベストプラクティスが確立されていない",
      "コミュニティへの知見共有で、パラダイムの形成に貢献できます",
      "Engineer（技師）タイプの品質管理手法を取り入れると安定性が向上",
    ],
    firstStep:
      "成果指標（KPI）を定義し、エージェントのパフォーマンスを計測する",
  },
];

export function getTypeById(id: string): DiagnosisType | undefined {
  return DIAGNOSIS_TYPES.find((t) => t.id === id);
}
