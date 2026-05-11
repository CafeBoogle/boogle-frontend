import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';

type CafeDetail = {
  id: number;
  name: string;
  address: string;
  placeId?: string;
  contact?: string;
  imageName?: string;
  tags?: string[];
  reviewImageUrls?: string[] | null;
  shortReviews?: string[];
  score: {
    reviewCount: number;
    toiletScoreAvg: number;
    outletScoreAvg: number;
    seatScoreAvg: number;
    wifiScoreAvg: number;
    noiseScoreAvg: number;
    studyScoreAvg: number;
  };
  isWished?: boolean;
};

export const useCafeInfo = (cafeId: string | undefined) => {
  const navigate = useNavigate();
  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [isWished, setIsWished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cafeId) return;

    api.get(`/api/cafes/${cafeId}`)
      .then(res => {
        setCafe(res.data);
        setIsWished(res.data.isWished ?? false);
      })
      .catch(() => {
        alert('카페 정보를 불러올 수 없습니다.');
        navigate(-1);
      });
  }, [cafeId, navigate]);

  const handleWishToggle = async () => {
    if (!cafeId) return;

    setIsLoading(true);
    const prev = isWished;
    setIsWished(!prev);

    try {
      const res = await api.post(`/api/cafes/${cafeId}/wish`, {}, { withCredentials: true });
      setIsWished(res.data);
    } catch (err: any) {
      setIsWished(prev);
      if (err.response?.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/loginpage');
      } else {
        alert('찜 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { cafe, isWished, isLoading, handleWishToggle };
};
