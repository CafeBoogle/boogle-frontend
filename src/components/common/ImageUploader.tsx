import { useState } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}
export const ImageUploader = ({ onFileSelect }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="w-40 h-48 bg-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-transparent hover:border-stone-400">
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <span className="text-4xl text-gray-400">+</span>
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </>
        )}
      </label>
      <span className="mt-2 text-sm text-gray-600 font-medium">사진 등록하기</span>
    </div>
  );
};
