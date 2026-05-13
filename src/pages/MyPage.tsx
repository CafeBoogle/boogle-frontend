import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import CafeCard from '@/components/cafe/CafeCard';
import { KakaoCafe, MyReview, MyWishCafe } from '@/types/cafe';
import Button from '@/components/common/Button';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [wishes, setWishes] = useState<MyWishCafe[]>([]);
  const [wishCount, setWishCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'reviews' | 'wishes'>('reviews');

  const handleDeleteReview = async (reviewId: number) => {
    const confirmDelete = window.confirm('이 리뷰를 삭제할까요?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/reviews/delete/${reviewId}`);
      alert('리뷰가 삭제되었습니다.');
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
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
        const [reviewRes, wishRes, wishListRes] = await Promise.all([
          api.get('/api/mypage/reviews'),
          api.get('/api/mypage/wish/count'),
          api.get('/api/mypage/wish'),
        ]);

        setReviews(reviewRes.data);
        setWishCount(wishRes.data);
        setWishes(wishListRes.data);
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
      <div className="bg-white px-5 pt-8 pb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-gray-900">{user.nickname} 님</p>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                user.provider === 'kakao' ? 'bg-[#FEE500] text-gray-800' : 'bg-[#03C75A] text-white'
              }`}
            >
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
        <Button
          variant="brown4"
          size="full"
          onClick={() => navigate('/addreview')}
          className="text-[15px] font-bold tracking-wide shadow-lg"
        >
          리뷰 등록하기
        </Button>

        <div className="bg-white rounded-2xl px-5 py-5">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-[#6B4F3A] border-b-2 border-[#6B4F3A]'
                  : 'text-gray-400'
              }`}
            >
              내가 남긴 리뷰
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                activeTab === 'wishes'
                  ? 'text-[#6B4F3A] border-b-2 border-[#6B4F3A]'
                  : 'text-gray-400'
              }`}
            >
              찜한 카페
            </button>
          </div>

          {activeTab === 'reviews' && (
            <>
              {reviews.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {reviews.map((review, index) => (
                    <div
                      key={review.id}
                      onClick={() => navigate(`/cafes/${review.cafeId}`)}
                      className="flex flex-col gap-3 cursor-pointer"
                    >
                      <CafeCard
                        cafe={{ name: review.name, tags: review.tags || [] } as KakaoCafe}
                      />
                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-[#8B7368] mb-1">한줄 리뷰</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReview(review.id);
                          }}
                          className="text-xs font-semibold text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                        >
                          수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(review.id);
                          }}
                          className="text-xs font-semibold text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                        >
                          삭제
                        </button>
                      </div>
                      {index !== reviews.length - 1 && <div className="border-b border-gray-100" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400">아직 작성한 리뷰가 없어요.</p>
                  <p className="text-xs text-gray-300 mt-1">첫 번째 리뷰를 남겨보세요!</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'wishes' && (
            <>
              {wishes.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {wishes.map((cafe) => (
                    <div
                      key={cafe.id}
                      onClick={() => navigate(`/cafes/${cafe.id}`)}
                      className="cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-gray-800 pb-2">{cafe.name}</p>
                      <p className="text-xs text-gray-400">{cafe.address}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400">찜한 카페가 없어요.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
