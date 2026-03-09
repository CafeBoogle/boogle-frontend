import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

interface Cafe {
  id: number;
  name: string;
  tags: string[];
  review: string;
  imageUrl: string;
}

interface CafeCardProps {
  cafe: Cafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <div
            onClick={() => navigate(`/cafe/${cafe.name}`)}
            className="cursor-pointer font-bold"
          >
            {cafe.name}
          </div>

          <div className="flex flex-wrap gap-2">
            {cafe.tags.map((tag, idx) => (
              <Button
                key={idx}
                variant="brown1"
                size="xs"
                className="rounded-lg text-[#8B7368] font-normal px-2 py-1"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-24 h-24 rounded-lg overflow-hidden ">
          <img
            src={cafe.imageUrl}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <span className="text-sm font-bold shrink-0">한줄리뷰</span>
        <span className="text-sm text-gray-700 truncate">{cafe.review}</span>
      </div>
    </div>
  );
}
