export interface QuizChoice {
  text: string;
  points: Record<string, number>;
}

export interface QuizChoiceMulti {
  text: string;
  featureId?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: "single" | "multi";
  choices: (QuizChoice | QuizChoiceMulti)[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Claude Codeで最も実現したいことは？",
    type: "single",
    choices: [
      { text: "個人プロジェクトを効率的に作りたい", points: { basic: 3 } },
      { text: "仕様を明確にしてから品質の高いコードを書きたい", points: { specDriven: 3 } },
      { text: "開発環境そのものを最適化し、長期的に高い生産性を維持したい", points: { harness: 3 } },
      { text: "複数のAIエージェントを協調させて大規模な開発をしたい", points: { multiAgent: 3 } },
      { text: "研究・論文・データ分析の生産性を上げたい", points: { academic: 3 } },
      { text: "コードではなく「成果」を最適化したい。AIに任せられることは全て任せたい", points: { outcome: 3 } },
    ],
  },
  {
    id: 2,
    question: "開発で最もストレスを感じることは？",
    type: "single",
    choices: [
      { text: "何から始めればいいかわからない。設計が曖昧なまま作り始めてしまう", points: { specDriven: 2, basic: 1 } },
      { text: "セッションが切れるたびに同じことを説明し直す", points: { harness: 3 } },
      { text: "ビルドは通るが実際に動かない。テストを毎回手動で確認している", points: { harness: 2, specDriven: 1 } },
      { text: "1人でやっているが、複数のことを並行して進めたい", points: { multiAgent: 3 } },
      { text: "品質チェックや定型作業を毎回手動でやっている", points: { outcome: 2, harness: 1 } },
    ],
  },
  {
    id: 3,
    question: "プロジェクトの規模と状況は？",
    type: "single",
    choices: [
      { text: "1人で小さなツール・スクリプトを作る", points: { basic: 3 } },
      { text: "1人で中規模のWebアプリ・モバイルアプリを作る", points: { specDriven: 2, harness: 1 } },
      { text: "1人だが、複数プロジェクトを同時に進めている", points: { harness: 2, multiAgent: 1 } },
      { text: "チーム（2人以上）で開発している", points: { multiAgent: 3 } },
      { text: "研究・データ分析・論文が中心", points: { academic: 3 } },
    ],
  },
  {
    id: 4,
    question: "Claude Codeの設定にどのくらい時間をかけたいですか？",
    type: "single",
    choices: [
      { text: "最小限でいい。すぐコードを書き始めたい", points: { basic: 3 } },
      { text: "初回に30分くらいなら使える", points: { specDriven: 2 } },
      { text: "半日かけても、その後の効率が上がるならやりたい", points: { harness: 2, multiAgent: 1 } },
      { text: "継続的に環境を改善し続けたい", points: { harness: 2, outcome: 2 } },
    ],
  },
  {
    id: 5,
    question: "以下のうち、知っている・使ったことがあるものは？（複数選択可）",
    type: "multi",
    choices: [
      { text: "CLAUDE.md", featureId: "claudemd" },
      { text: "Plan Mode", featureId: "planmode" },
      { text: "カスタムスラッシュコマンド（/user:xxx）", featureId: "commands" },
      { text: "サブエージェント（agents/）", featureId: "agents" },
      { text: "スキル（SKILL.md）", featureId: "skills" },
      { text: "MCP（Model Context Protocol）", featureId: "mcp" },
      { text: "Agent Teams", featureId: "agentteams" },
      { text: "Git Worktree", featureId: "worktree" },
      { text: "フック（hooks/）", featureId: "hooks" },
      { text: "feature_list.json / 進捗管理", featureId: "featurelist" },
      { text: "どれも知らない", featureId: "none" },
    ],
  },
];

// All feature IDs for knowledge gap detection
export const ALL_FEATURES = [
  "claudemd", "planmode", "commands", "agents", "skills",
  "mcp", "agentteams", "worktree", "hooks", "featurelist",
];

// Interest area options for Step 3
export const INTEREST_OPTIONS = [
  { id: "project-init", text: "プロジェクトの初期設定を自動化したい" },
  { id: "workflow", text: "テスト→レビュー→コミットのワークフローを整えたい" },
  { id: "debug", text: "バグの自動検出・修正を導入したい" },
  { id: "quality", text: "コードの品質を自動で維持したい" },
  { id: "parallel", text: "複数のAIインスタンスを並列で動かしたい" },
  { id: "catchup", text: "最新のClaude Code機能や設定を常にキャッチアップしたい" },
  { id: "general", text: "特にない。全体的に底上げしたい" },
];

export interface DiagnosisResult {
  primaryType: string;
  selectedType?: string;
  scores: Record<string, number>;
  knownFeatures: string[];
  unknownFeatures: string[];
}

export function calculateDiagnosis(
  answers: Record<number, number>,
  multiAnswers: Record<number, number[]>,
): DiagnosisResult {
  const scores: Record<string, number> = {
    basic: 0, specDriven: 0, harness: 0,
    multiAgent: 0, academic: 0, outcome: 0,
  };

  // Q1-Q4: accumulate type scores
  for (const [qId, choiceIdx] of Object.entries(answers)) {
    const q = QUIZ_QUESTIONS.find((q) => q.id === Number(qId));
    if (!q || q.type !== "single") continue;
    const choice = q.choices[choiceIdx] as QuizChoice;
    if (!choice?.points) continue;
    for (const [typeId, pts] of Object.entries(choice.points)) {
      scores[typeId] = (scores[typeId] || 0) + pts;
    }
  }

  // Determine primary type (Q1 tiebreak: Q1 answer wins)
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const primaryType = sorted[0][0];

  // Q5: knowledge gap
  const q5Selected = multiAnswers[5] || [];
  const hasNone = q5Selected.includes(10);
  const knownFeatures = hasNone ? [] : q5Selected
    .map((i) => {
      const q5 = QUIZ_QUESTIONS.find((q) => q.id === 5);
      return (q5?.choices[i] as QuizChoiceMulti)?.featureId;
    })
    .filter((f): f is string => !!f && f !== "none");
  const unknownFeatures = ALL_FEATURES.filter((f) => !knownFeatures.includes(f));

  return { primaryType, scores, knownFeatures, unknownFeatures };
}
