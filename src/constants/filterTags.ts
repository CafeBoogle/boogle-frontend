export const SCORE_FILTERS = [
  { key: 'study', label: '카공 적합도', scoreKey: 'studyScoreAvg' },
  { key: 'outlet', label: '콘센트', scoreKey: 'outletScoreAvg' },
  { key: 'wifi', label: '와이파이', scoreKey: 'wifiScoreAvg' },
  { key: 'seat', label: '좌석 수', scoreKey: 'seatScoreAvg' },
  { key: 'noise', label: '소음', scoreKey: 'noiseScoreAvg' },
  { key: 'toilet', label: '화장실', scoreKey: 'toiletScoreAvg' },
] as const;

export type ScoreFilterKey = (typeof SCORE_FILTERS)[number]['key'];
export type SortKey = (typeof SCORE_FILTERS)[number]['scoreKey'];
