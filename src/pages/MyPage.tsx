import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import CafeCard from '@/components/cafe/CafeCard';
import { KakaoCafe, MyReview } from '@/types/cafe';


export default function MyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [wishCount, setWishCount] = useState<number>(0);

  const handleDeleteReview = async (reviewId: number) => {
  const confirmDelete = window.confirm('이 리뷰를 삭제할까요?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/api/reviews/delete/${reviewId}`);
    alert('정상 처리되었습니다.');
    // 삭제 후 즉시 반영
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  } catch (e) {
    console.error('리뷰 삭제 실패:', e);
    alert('리뷰 삭제에 실패했습니다.');
  }
};


const handleEditReview = (reviewId: number) => {
  // TODO: 리뷰 수정 페이지 or 모달로 이동
  alert('리뷰 수정 기능은 준비 중입니다.');
  // navigate(`/reviews/edit/${reviewId}`);
};


  useEffect(() => {
  const fetchMyPageData = async () => {
    setLoading(true);
    try {
      const [reviewRes, wishRes] = await Promise.all([
        api.get('/api/mypage/reviews'),
        api.get('/api/mypage/wish/count'),
      ]);

      setReviews(reviewRes.data);
      setWishCount(wishRes.data);
    } catch (e) {
      console.error('마이페이지 데이터 fetch 실패:', e);
      setReviews([]);
      setWishCount(0);
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading) fetchMyPageData();
}, [user, authLoading]);

if (authLoading || (loading && user)) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="w-7 h-7 border-4 border-[#8B7368] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-gray-50">

      {/* 프로필 카드 */}
      <div className="bg-white px-5 pt-8 pb-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-gray-900">{user.nickname} 님</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
              user.provider === 'kakao'
                ? 'bg-[#FEE500] text-gray-800'
                : 'bg-[#03C75A] text-white'
            }`}>
              {user.provider.toUpperCase()} 계정
            </span>


            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-[#8B7368] bg-[#F5EDE8] px-2 py-1 rounded-sm">
                찜한 카페 {wishCount}개
              </span>
              <span className="text-xs font-semibold text-[#8B7368] bg-[#F5EDE8] px-2.5 py-1 rounded-sm">
                리뷰 {reviews.length}개
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">

        {/* 리뷰 등록 버튼 */}
        <button
          onClick={() => navigate('/addreview')}
          className="w-full bg-[#6B4F3A] text-white font-semibold text-sm py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform"
        >
          + 간편 리뷰 등록하기
        </button>

        {/* 내가 남긴 리뷰 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">
            내가 남긴 리뷰
          </p>

          {reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {reviews.map((review, index) => (
                <div key={review.id || index} className="flex flex-col gap-3">

                  <CafeCard
                    cafe={{ name: review.name, tags: review.tags || [] } as KakaoCafe}
                  />

                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-[#8B7368] mb-1">한줄 리뷰</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {/* ✅ 수정 / 삭제 버튼 */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditReview(review.id)}
                      className="text-xs font-semibold text-gray-500 px-3 py-1 rounded-lg
                                hover:bg-gray-100 transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-xs font-semibold text-red-500 px-3 py-1 rounded-lg
                                hover:bg-red-50 transition"
                    >
                      삭제
                    </button>
                  </div>

                  {index !== reviews.length - 1 && (
                    <div className="border-b border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400">아직 작성한 리뷰가 없어요.</p>
              <p className="text-xs text-gray-300 mt-1">첫 번째 리뷰를 남겨보세요!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
