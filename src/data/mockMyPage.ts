import { MyReview } from '@/types/cafe';

export const mockReviews: MyReview[] = [
  {
    id: 'rev-001',
    name: '커피브레이크 서강대점',
    tags: ['콘센트 있음', '대형 카페'],
    address: '서울 마포구 백범로 35',
    comment: '카공하기 아주 좋습니다!',
  },
  {
    id: 'rev-002',
    name: '스타벅스 신촌점',
    tags: ['와이파이 빠름'],
    address: '서울 마포구',
    comment: '항상 사람 많지만 작업하기 좋음.',
  },
];

export const mockUser = {
  nickname: 'boogle_234',
  provider: 'kakao',
  profileImageUrl: null,
};
