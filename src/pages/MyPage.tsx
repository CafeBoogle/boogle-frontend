import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import CafeCard from '@/components/cafe/CafeCard';
import { KakaoCafe, MyReview } from '@/types/cafe';
import { mockReviews, mockUser } from '@/data/mockMyPage';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<MyReview[]>([]);


  useEffect(() => {
    const fetchMyReviews = async () => {
      setLoading(true);
      try {        
        // [API] 실제 백엔드에 내 리뷰 목록을 요청하는 구간
        const response = await api.get('/api/v1/reviews/my');
        setReviews(response.data);
      } catch (error) {
        // TODO: 백엔드 API 연동 완료 후 mockReviews 주입 제거 및 에러 상태 UI 추가
        setReviews(mockReviews);
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

  const displayUser = user || mockUser;

  return (
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
              <p className="text-lg font-bold text-stone-800">{displayUser.nickname}</p>
              <p className="text-sm text-stone-500 uppercase tracking-wide">
                {displayUser.provider} 계정
              </p>
              <p className="text-xs text-[#4A3D39] font-bold mt-2 bg-white/60 px-2 py-1 rounded-full w-fit">
                찜한 카페 5개
              </p>
            </div>
          </div>
        </section>

        <Button variant="brown2"
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

  );
}
