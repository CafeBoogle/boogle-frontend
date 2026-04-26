import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import CafeCard from '@/components/cafe/CafeCard';
import { KakaoCafe } from '@/types/cafe';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        // [API] 실제 백엔드에 내 리뷰 목록을 요청하는 구간
        const response = await api.get('/api/v1/reviews/my');
        setReviews(response.data);
      } catch (error) {
        // [MOCK] API 호출 실패 시 강제로 데이터를 넣어 화면을 구성함
        console.warn('백엔드 연결 실패 // Mock 데이터를 강제로 주입합니다.');
        setReviews([
          {
            id: 'rev-001',
            name: '커피브레이크 서강대점 (Mock)',
            tags: ['콘센트 있음', '대형 카페'],
            address: '서울 마포구 백범로 35',
            comment: '카공하기 아주 좋습니다! (서버 연결 실패 시 노출되는 Mock)',
          },
          {
            id: 'rev-002',
            name: '스타벅스 (Mock)',
            tags: ['와이파이 빠름'],
            address: '서울 마포구',
            comment: '항상 사람 많지만 작업하기 좋음.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchMyReviews();
    }
  }, [user, authLoading]);

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-[#F2EDE9] flex items-center justify-center font-medium text-[#4A3D39]">
        정보 로딩 중...
      </div>
    );
  }

  // [MOCK] 서버에서 유저 정보를 가져오지 못했을 때  가상 유저 데이터 세팅
  const displayUser = user || {
    nickname: 'boogle_234 ',
    provider: 'kakao',
    profileImageUrl: null,
  };

  return (
    <div className="min-h-screen bg-[#F2EDE9] font-sans pb-10">
      <main className="px-6">
        <section className="mb-10 pt-8">
          <h1 className="text-xl font-bold mb-6 text-stone-800">마이페이지</h1>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-stone-200 rounded-2xl overflow-hidden border border-stone-200 shadow-inner flex items-center justify-center">
              {displayUser.profileImageUrl ? (
                <img
                  src={displayUser.profileImageUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-stone-400">👤</span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {/* [API/MOCK] 유저 닉네임 표시 */}
              <p className="text-lg font-bold text-stone-800">{displayUser.nickname}</p>
              <p className="text-sm text-stone-500 uppercase tracking-wide">
                {displayUser.provider} 계정 (Mock)
              </p>
              {/* [MOCK] '찜한 카페' 기능은 현재 API가 없으므로 가상의 숫자와 텍스트 노출 */}
              <p className="text-xs text-[#4A3D39] font-bold mt-2 bg-white/60 px-2 py-1 rounded-full w-fit">
                찜한 카페 5개 (Mock)
              </p>
            </div>
          </div>
        </section>

        <Button
          variant="brown6"
          size="full"
          className="mb-12 shadow-sm py-5 text-lg rounded-2xl active:scale-[0.98] transition-transform"
          onClick={() => navigate('/addreview')}
        >
          + 간편 리뷰 등록하기 +
        </Button>

        <section>
          <h2 className="text-lg font-bold mb-5 text-stone-800 px-1">내가 남긴 리뷰</h2>
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-stone-100 flex flex-col gap-8">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={review.id || index} className="flex flex-col gap-4">
                  {/* [API/MOCK] 각 리뷰에 연결된 카페 정보를 CafeCard에 전달 */}
                  <CafeCard
                    cafe={
                      {
                        name: review.name,
                        tags: review.tags || [],
                        address: review.address,
                      } as KakaoCafe
                    }
                  />
                  <div className="bg-[#F8F5F2] p-4 rounded-2xl border border-stone-100/50">
                    <div className="flex gap-2 items-start">
                      <span className="text-[10px] font-black text-[#4A3D39] opacity-40 mt-1">
                        REVIEW
                      </span>
                      {/* [API/MOCK] 사용자가 작성한 실제/가상 코멘트 출력 */}
                      <p className="text-[13px] text-stone-700 leading-relaxed font-medium">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                  {index !== reviews.length - 1 && (
                    <div className="border-b border-stone-50 pt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-stone-400 text-sm">
                작성한 리뷰가 아직 없습니다.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
