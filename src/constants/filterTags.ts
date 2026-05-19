export const SCORE_FILTERS = [
  { key: 'study', label: '카공 적합도 (별점)', scoreKey: 'studyScoreAvg' },
  { key: 'outlet', label: '콘센트', scoreKey: 'outletScoreAvg' },
  { key: 'wifi', label: '와이파이', scoreKey: 'wifiScoreAvg' },
  { key: 'seat', label: '넓은 카페', scoreKey: 'seatScoreAvg' },
  { key: 'noise', label: '조용한 카페', scoreKey: 'noiseScoreAvg' },
  { key: 'toilet', label: '쾌적한 화장실', scoreKey: 'toiletScoreAvg' },
] as const;

export type ScoreFilterKey = (typeof SCORE_FILTERS)[number]['key'];
export type SortKey = (typeof SCORE_FILTERS)[number]['scoreKey'];
