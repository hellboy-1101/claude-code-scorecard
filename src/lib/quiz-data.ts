// ─── 型定義 ───

export interface QuizChoice {
  text: string;
  points: Record<string, number>;
}

export interface QuizChoiceMulti {
  text: string;
  featureId?: string;
  gapId?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: "single" | "multi";
  choices: QuizChoice[];
}

export interface QuizQuestionMulti {
  id: number;
  question: string;
  type: "multi";
  choices: QuizChoiceMulti[];
}

export type AnyQuestion = QuizQuestion | QuizQuestionMulti;

// ─── 質問データ ───

export const QUIZ_QUESTIONS: AnyQuestion[] = [
  // ── 軸1: ゴール（何を実現したいか）── 3問
  {
    id: 1,
    question: "Claude Codeで最も実現したいことは？",
    type: "single",
    choices: [
      { text: "個人プロジェクトを効率的に作りたい", points: { explorer: 2, architect: 1 } },
      { text: "チームの開発速度を上げたい", points: { commander: 2, visionary: 1 } },
      { text: "研究・論文・データ分析の生産性を上げたい", points: { scholar: 2 } },
      { text: "定型作業を自動化したい", points: { visionary: 2, commander: 1 } },
      { text: "コードの品質を徹底的に上げたい（バグを減らしたい）", points: { engineer: 2, architect: 1 } },
    ],
  },
  {
    id: 2,
    question: "開発で最もストレスを感じることは？",
    type: "single",
    choices: [
      { text: "セッションが切れるたびにコンテキストを説明し直す", points: { engineer: 2, architect: 1 } },
      { text: "ビルドは通るが実際に動かないことが多い", points: { engineer: 2 } },
      { text: "複数ファイルの変更が一貫しない", points: { commander: 2, engineer: 1 } },
      { text: "何から始めればいいかわからない（設計が曖昧なまま作り始めてしまう）", points: { architect: 2, explorer: 1 } },
      { text: "品質チェックを毎回手動でやっている", points: { engineer: 1, visionary: 2 } },
    ],
  },
  {
    id: 3,
    question: "プロジェクトの規模は？",
    type: "single",
    choices: [
      { text: "1人で小さなツール・スクリプトを作る", points: { explorer: 2 } },
      { text: "1人で中規模のWebアプリ・モバイルアプリを作る", points: { architect: 2, engineer: 1 } },
      { text: "チーム（2人以上）で開発している", points: { commander: 2 } },
      { text: "研究・データ分析・論文が中心で、コード開発は手段", points: { scholar: 2 } },
    ],
  },

  // ── 軸2: 現在の知識レベル（何を知っているか）── 2問
  {
    id: 4,
    question: "以下のうち、知っている・使ったことがあるものを選んでください（複数選択可）",
    type: "multi",
    choices: [
      { text: "CLAUDE.md", featureId: "claudemd" },
      { text: "Plan Mode（計画モード）", featureId: "planmode" },
      { text: "カスタムスラッシュコマンド（/user:xxx）", featureId: "commands" },
      { text: "サブエージェント（agents/）", featureId: "agents" },
      { text: "スキル（SKILL.md）", featureId: "skills" },
      { text: "MCP（Model Context Protocol）", featureId: "mcp" },
      { text: "Agent Teams", featureId: "agentteams" },
      { text: "Git Worktree（並列開発）", featureId: "worktree" },
      { text: "フック（hooks/）", featureId: "hooks" },
      { text: "feature_list.json による進捗管理", featureId: "featurelist" },
      { text: "どれも知らない", featureId: "none" },
    ],
  } as QuizQuestionMulti,
  {
    id: 5,
    question: "Claude Codeのセッションが切れたとき、どうしていますか？",
    type: "single",
    choices: [
      { text: "最初から説明し直す", points: { explorer: 2 } },
      { text: "CLAUDE.mdに書いてあるから大丈夫", points: { explorer: 1, architect: 1 } },
      { text: "進捗ファイル（progress.md等）を読ませている", points: { architect: 1, engineer: 1 } },
      { text: "SessionStartフックで自動読み込みしている", points: { engineer: 2 } },
      { text: "/compactで要約してから継続している", points: { architect: 1, engineer: 1 } },
    ],
  },

  // ── 軸3: 理想と現実のギャップ（やりたいができていないこと）── 2問
  {
    id: 6,
    question: "以下のうち、やりたいができていないものを選んでください（複数選択可）",
    type: "multi",
    choices: [
      { text: "新プロジェクトの初期設定を自動化したい", gapId: "project-init" },
      { text: "テスト→レビュー→コミットを一連の流れにしたい", gapId: "test-review-commit" },
      { text: "バグが出たとき自動で原因特定→修正したい", gapId: "auto-debug" },
      { text: "環境の品質を定期的にチェックしたい", gapId: "quality-check" },
      { text: "最新のClaude Code機能を常にキャッチアップしたい", gapId: "catchup" },
      { text: "複数のClaude Codeインスタンスを並列で動かしたい", gapId: "parallel" },
      { text: "コードの品質を自動で維持したい", gapId: "auto-quality" },
      { text: "すべてできている", gapId: "all-done" },
      { text: "まだそこまで考えていない", gapId: "not-yet" },
    ],
  } as QuizQuestionMulti,
  {
    id: 7,
    question: "Claude Codeの設定にどのくらい時間をかけたいですか？",
    type: "single",
    choices: [
      { text: "最小限でいい。すぐにコードを書き始めたい", points: { explorer: 2 } },
      { text: "30分くらいなら初期設定に使える", points: { architect: 2, explorer: 1 } },
      { text: "半日かけても、その後の効率が上がるならやりたい", points: { engineer: 2, architect: 1 } },
      { text: "継続的に環境を改善し続けたい", points: { engineer: 1, visionary: 2 } },
    ],
  },
];

// ─── 結果型 ───

export interface DiagnosisResult {
  primaryType: string;
  secondaryType: string;
  scores: Record<string, number>;
  knowledgeLevel: number;
  knownFeatures: string[];
  unknownFeatures: string[];
  sessionManagementLevel: number;
  actionGaps: string[];
  investmentWillingness: string;
}

// ─── 全機能リスト（Q4用）───

const ALL_FEATURES = [
  "claudemd", "planmode", "commands", "agents", "skills",
  "mcp", "agentteams", "worktree", "hooks", "featurelist",
];

// ─── セッション管理レベルマップ（Q5用）───

const SESSION_LEVELS: Record<number, number> = {
  0: 0, // 最初から説明し直す
  1: 1, // CLAUDE.mdがある
  2: 2, // 進捗ファイル
  3: 3, // SessionStartフック
  4: 2, // /compact
};

// ─── 投資意欲マップ（Q7用）───

const INVESTMENT_MAP: Record<number, string> = {
  0: "minimal",
  1: "moderate",
  2: "significant",
  3: "continuous",
};

// ─── 診断計算 ───

export function calculateDiagnosis(
  answers: Record<number, number>,
  multiAnswers: Record<number, number[]>
): DiagnosisResult {
  const scores: Record<string, number> = {
    explorer: 0,
    architect: 0,
    engineer: 0,
    commander: 0,
    scholar: 0,
    visionary: 0,
  };

  // 単一選択の質問（Q1, Q2, Q3, Q5, Q7）からスコア加算
  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    const qId = Number(questionId);
    const question = QUIZ_QUESTIONS.find((q) => q.id === qId);
    if (!question || question.type !== "single") continue;
    const choice = (question as QuizQuestion).choices[choiceIndex];
    if (!choice) continue;

    for (const [typeId, points] of Object.entries(choice.points)) {
      scores[typeId] = (scores[typeId] || 0) + points;
    }
  }

  // Q4: 知識レベル
  const q4Selected = multiAnswers[4] || [];
  const hasNone = q4Selected.includes(10); // "どれも知らない"
  const knownFeatureIndices = hasNone ? [] : q4Selected;
  const knownFeatures = knownFeatureIndices
    .map((i) => ALL_FEATURES[i])
    .filter(Boolean);
  const unknownFeatures = ALL_FEATURES.filter((f) => !knownFeatures.includes(f));
  const knowledgeLevel = knownFeatures.length;

  // 知識レベルからタイプスコアに加算
  if (knowledgeLevel <= 1) scores.explorer += 2;
  else if (knowledgeLevel <= 4) scores.architect += 2;
  else if (knowledgeLevel <= 7) scores.engineer += 2;
  else { scores.commander += 1; scores.visionary += 1; }

  // Q5: セッション管理レベル
  const q5Answer = answers[5] ?? 0;
  const sessionManagementLevel = SESSION_LEVELS[q5Answer] ?? 0;

  // Q6: 行動ギャップ
  const q6Selected = multiAnswers[6] || [];
  const q6Question = QUIZ_QUESTIONS.find((q) => q.id === 6) as QuizQuestionMulti;
  const actionGaps = q6Selected
    .map((i) => q6Question.choices[i]?.gapId)
    .filter((g): g is string => !!g);

  // Q6から追加のタイプスコア調整
  if (actionGaps.includes("all-done")) {
    scores.engineer += 2;
  }
  if (actionGaps.includes("not-yet")) {
    scores.explorer += 2;
  }

  // Q7: 投資意欲
  const q7Answer = answers[7] ?? 0;
  const investmentWillingness = INVESTMENT_MAP[q7Answer] ?? "minimal";

  // タイプ判定
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);

  return {
    primaryType: sorted[0][0],
    secondaryType: sorted[1][0],
    scores,
    knowledgeLevel,
    knownFeatures,
    unknownFeatures,
    sessionManagementLevel,
    actionGaps,
    investmentWillingness,
  };
}
