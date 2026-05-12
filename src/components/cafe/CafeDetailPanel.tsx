import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { KakaoCafe } from '@/types/cafe';
import Button from '@/components/common/Button';
import api from '@/api/axios';

interface CafeDetailPanelProps {
  cafe: KakaoCafe;
  onClose: () => void;
}

export function CafeDetailPanel({ cafe, onClose }: CafeDetailPanelProps) {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current) {
      if (!mapInstanceRef.current) {
        const options = {
          center: new window.kakao.maps.LatLng(cafe.lat, cafe.lng),
          level: 3,
        };
        mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
        markerRef.current = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(cafe.lat, cafe.lng),
        });              
        markerRef.current.setMap(mapInstanceRef.current);
      } else {
        markerRef.current.setPosition(new window.kakao.maps.LatLng(cafe.lat, cafe.lng));
        mapInstanceRef.current.setCenter(new window.kakao.maps.LatLng(cafe.lat, cafe.lng));
      }
    }
  }, [cafe]);


  const goToDetailPage = async () => {
    try {
      if (cafe.dbCafeId) {
        navigate(`/cafes/${cafe.dbCafeId}`);
        return;
      }
      const response = await api.post('/api/cafes/save', {
        kakaoPlaceId: String(cafe.id),
        name: cafe.name,
        address: cafe.address,
        latitude: Number(cafe.lat),
        longitude: Number(cafe.lng),
      });
      navigate(`/cafes/${response.data}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white border-t rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-40 animate-in fade-in slide-in-from-bottom-10 duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{cafe.name}</h3>
            <p className="text-sm text-gray-500">{cafe.address}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            ✕
          </button>
        </div>

        <div
          ref={mapRef}
          className="w-full h-48 rounded-2xl bg-gray-100 mb-5 overflow-hidden shadow-inner"
          onClick={(e) => e.stopPropagation()}
        />

        <Button onClick={goToDetailPage} className="w-full h-12 text-base font-bold">
          이 카페 상세 정보 보기
        </Button>
      </div>
    </div>
  );
}
