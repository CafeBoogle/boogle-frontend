import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import type { KakaoCafe } from '@/types/cafe';

export const useGoToCafe = () => {
  const navigate = useNavigate();

  const goToDetailPage = async (cafe: KakaoCafe) => {
    try {
      if (cafe.dbCafeId) {
        navigate(`/cafes/${cafe.dbCafeId}`);
        return;
      }
      const cafePayload = {
        kakaoPlaceId: String(cafe.id),
        name: cafe.name,
        address: cafe.address,
        latitude: Number(cafe.lat),
        longitude: Number(cafe.lng),
      };
      const response = await api.post('/api/cafes/save', cafePayload);
      navigate(`/cafes/${response.data}`);
    } catch (error) {
      console.error(error);
    }
  };

  return { goToDetailPage };
};
