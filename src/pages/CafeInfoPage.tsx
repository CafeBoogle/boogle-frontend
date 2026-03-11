import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '@/components/common/Button';
import CafeImageList from '@/components/cafe/CafeImageList';
import ImageModal from '@/components/cafe/ImageModal';

function CafeInfoPage() {
  const { name } = useParams<{ name: string }>();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl overflow-hidden bg-white shadow-xl/20 border border-neutral-200 p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center pt-4 text-brown-4">{name}</h1>

        <a href="#" className="text-blue-800 text-lg text-center font-medium">
          {name} 알아보기
        </a>
        <div className="w-full h-52 bg-white flex items-center justify-center border border-gray-200 shadow-inner rounded-sm ">
          <span className="text-3xl font-light text-gray-500">그래프</span>
        </div>
        <div className="break-keep text-center text-neutral-600 leading-relaxed text-xs mb-2">
          실제 리뷰를 바탕으로 카페의 분위기와 작업 환경을 분석한 리포트입니다. <br />
          이용자 경험을 데이터로 정리해 더 정확한 카페 선택을 돕습니다.
        </div>

        <CafeImageList onImageClick={setSelectedImage} />

        <Button variant="brown2" className="mt-3">
          카페 찜하기 ♡
        </Button>
      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}

export default CafeInfoPage;
