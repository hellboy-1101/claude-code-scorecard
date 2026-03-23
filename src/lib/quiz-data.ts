export interface QuizChoice {
  text: string;
  /** タイプIDごとのポイント */
  points: Record<string, number>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  choices: QuizChoice[];
}

// 隣接タイプマッピング（各タイプの隣接タイプに+1）
// Explorer ↔ Architect ↔ Engineer ↔ Commander
// Scholar は Engineer / Visionary と隣接
// Visionary は Commander / Scholar と隣接

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Claude Codeを主にどのような目的で使いますか？",
    choices: [
      {
        text: "プログラミングの学習や小さなツール作成",
        points: { explorer: 2, architect: 1 },
      },
      {
        text: "個人プロジェクトの開発",
        points: { architect: 2, explorer: 1, engineer: 1 },
      },
      {
        text: "チームでの大規模開発",
        points: { commander: 2, engineer: 1 },
      },
      {
        text: "研究・論文・データ分析",
        points: { scholar: 2, visionary: 1 },
      },
      {
        text: "まだ使い始めたばかりでわからない",
        points: { explorer: 2 },
      },
    ],
  },
  {
    id: 2,
    question: "プロジェクトの平均的な期間は？",
    choices: [
      {
        text: "数時間〜1日",
        points: { explorer: 2, architect: 1 },
      },
      {
        text: "1週間〜1ヶ月",
        points: { architect: 2, explorer: 1, engineer: 1 },
      },
      {
        text: "1ヶ月以上、複数セッションにまたがる",
        points: { engineer: 2, architect: 1, commander: 1 },
      },
      {
        text: "常に複数プロジェクトを並行している",
        points: { commander: 2, engineer: 1, visionary: 1 },
      },
      {
        text: "研究テーマに沿って長期的に取り組む",
        points: { scholar: 2, engineer: 1 },
      },
    ],
  },
  {
    id: 3,
    question: "開発を始めるとき、最初にすることは？",
    choices: [
      {
        text: "すぐにコードを書き始める",
        points: { explorer: 2 },
      },
      {
        text: "仕様書やREADMEを先に書く",
        points: { architect: 2, engineer: 1 },
      },
      {
        text: "CLAUDE.mdとfeature_listを作成する",
        points: { engineer: 2, architect: 1, commander: 1 },
      },
      {
        text: "タスクを分解してチームに振り分ける",
        points: { commander: 2, engineer: 1, visionary: 1 },
      },
      {
        text: "関連論文や既存実装を調査する",
        points: { scholar: 2, architect: 1 },
      },
    ],
  },
  {
    id: 4,
    question: "コード品質の管理はどのレベルですか？",
    choices: [
      {
        text: "特に管理していない。動けばOK",
        points: { explorer: 2 },
      },
      {
        text: "手動でレビューしている",
        points: { architect: 2, explorer: 1 },
      },
      {
        text: "自動化されたテスト+レビュー+リファクタリングのサイクルがある",
        points: { engineer: 2, architect: 1, commander: 1 },
      },
      {
        text: "複数のエージェントが自動で品質チェックしている",
        points: { commander: 2, engineer: 1, visionary: 1 },
      },
      {
        text: "再現性を最重視し、品質ゲートを設けている",
        points: { scholar: 2, engineer: 1 },
      },
    ],
  },
  {
    id: 5,
    question: "Claude Codeにどこまで任せたいですか？",
    choices: [
      {
        text: "質問への回答やコード補完くらい",
        points: { explorer: 2 },
      },
      {
        text: "設計〜実装まで一連のフローを任せたい",
        points: { architect: 2, engineer: 1 },
      },
      {
        text: "初期化〜品質管理〜リファクタリングまで全自動化したい",
        points: { engineer: 2, architect: 1, commander: 1 },
      },
      {
        text: "複数エージェントの協調作業まで任せたい",
        points: { commander: 2, engineer: 1, visionary: 1 },
      },
      {
        text: "品質に関してはAI同士に議論させて最善解を出したい",
        points: { scholar: 1, visionary: 2, commander: 1 },
      },
    ],
  },
  {
    id: 6,
    question: "プロジェクトで最も重視するのは？",
    choices: [
      {
        text: "学ぶこと・楽しむこと",
        points: { explorer: 2 },
      },
      {
        text: "正しい設計と保守性",
        points: { architect: 2, engineer: 1 },
      },
      {
        text: "長期的な品質と効率の持続",
        points: { engineer: 2, architect: 1 },
      },
      {
        text: "スピードとスケーラビリティ",
        points: { commander: 2, visionary: 1 },
      },
      {
        text: "正確性と再現性",
        points: { scholar: 2, engineer: 1 },
      },
      {
        text: "最終的な成果・ビジネスインパクト",
        points: { visionary: 2, commander: 1 },
      },
    ],
  },
  {
    id: 7,
    question: "テストについてのスタンスは？",
    choices: [
      {
        text: "テストはあまり書かない",
        points: { explorer: 2 },
      },
      {
        text: "主要な機能にはテストを書く",
        points: { architect: 2, explorer: 1 },
      },
      {
        text: "TDDで、テストファーストで開発している",
        points: { engineer: 2, architect: 1, scholar: 1 },
      },
      {
        text: "複数エージェントでテスト生成+検証を並列化している",
        points: { commander: 2, engineer: 1 },
      },
      {
        text: "テスト結果の再現性を論文レベルで管理している",
        points: { scholar: 2, visionary: 1 },
      },
    ],
  },
  {
    id: 8,
    question: "技術的負債への対応は？",
    choices: [
      {
        text: "あまり意識していない",
        points: { explorer: 2 },
      },
      {
        text: "気づいたときに修正する",
        points: { architect: 2, explorer: 1 },
      },
      {
        text: "定期的なaudit+refactorサイクルが仕組み化されている",
        points: { engineer: 2, architect: 1, commander: 1 },
      },
      {
        text: "専門エージェントが自動で検出し、チームで対応する",
        points: { commander: 2, engineer: 1, visionary: 1 },
      },
      {
        text: "負債の発生自体を防ぐ厳格な設計レビューを行う",
        points: { scholar: 1, visionary: 1, architect: 1 },
      },
    ],
  },
  {
    id: 9,
    question: "チーム構成は？",
    choices: [
      {
        text: "1人で開発している",
        points: { explorer: 1, architect: 1, engineer: 1 },
      },
      {
        text: "小規模チーム（2-5人）",
        points: { architect: 1, engineer: 2 },
      },
      {
        text: "大規模チーム（5人以上）またはエンタープライズ",
        points: { commander: 2, engineer: 1 },
      },
      {
        text: "研究室やアカデミックなグループ",
        points: { scholar: 2 },
      },
      {
        text: "AIエージェントがチームメンバーの一部",
        points: { visionary: 2, commander: 1 },
      },
    ],
  },
  {
    id: 10,
    question: "理想のClaude Code環境を一言で表すと？",
    choices: [
      {
        text: "「気軽に聞ける先輩エンジニア」",
        points: { explorer: 2 },
      },
      {
        text: "「仕様書通りに動く優秀な実装者」",
        points: { architect: 2, engineer: 1 },
      },
      {
        text: "「品質を自動で守り続けるシステム」",
        points: { engineer: 2, architect: 1 },
      },
      {
        text: "「複数の専門家チームを指揮するリーダー」",
        points: { commander: 2, visionary: 1 },
      },
      {
        text: "「研究を加速する知的パートナー」",
        points: { scholar: 2, engineer: 1 },
      },
      {
        text: "「成果を最大化する自律的な組織」",
        points: { visionary: 2, commander: 1 },
      },
    ],
  },
];

export interface DiagnosisResult {
  primaryType: string;
  secondaryType: string;
  scores: Record<string, number>;
}

export function calculateDiagnosis(
  answers: Record<number, number>
): DiagnosisResult {
  const scores: Record<string, number> = {
    explorer: 0,
    architect: 0,
    engineer: 0,
    commander: 0,
    scholar: 0,
    visionary: 0,
  };

  for (const [questionId, choiceIndex] of Object.entries(answers)) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === Number(questionId));
    if (!question) continue;
    const choice = question.choices[choiceIndex];
    if (!choice) continue;

    for (const [typeId, points] of Object.entries(choice.points)) {
      scores[typeId] = (scores[typeId] || 0) + points;
    }
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  return {
    primaryType: sorted[0][0],
    secondaryType: sorted[1][0],
    scores,
  };
}
