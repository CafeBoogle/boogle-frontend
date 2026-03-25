import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import api from "../../api/axios";

interface Cafe {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
}

// 1. props로 center를 직접 받습니다.
interface CafeMapProps {
  center: { lat: number; lng: number };
}

function CafeMap({ center }: CafeMapProps) {
  const [cafes, setCafes] = useState<Cafe[]>([]);

  const handleBoundsChange = async (map: kakao.maps.Map) => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    try {
      const response = await api.get("/cafes/within_bounds", {
        params: {
          minLat: sw.getLat(),
          maxLat: ne.getLat(),
          minLng: sw.getLng(),
          maxLng: ne.getLng(),
        },
      });
      setCafes(response.data);
    } catch (error) {
      console.error("데이터 통신 에러:", error);
    }
  };

  return (
    <Map
      // 중요: FilterPage에서 전달받은 center를 그대로 사용합니다.
      center={center} 
      style={{ width: "100%", height: "100%", display: "block" }}
      level={3}
      onIdle={(map) => handleBoundsChange(map)}
    >
      {cafes.map((cafe) => (
        <MapMarker
          key={cafe.id}
          position={{ lat: cafe.latitude, lng: cafe.longitude }}
          title={cafe.name}
        />
      ))}
    </Map>
  );
}

export default CafeMap;