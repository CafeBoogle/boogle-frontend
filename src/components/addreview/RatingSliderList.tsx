  import { Slider } from '@/components/addreview/Slider';

const sliderConfig = [
  { key: 'study', label: '카공 적합도', tip: '비추천 / 괜찮아요 / 최고예요' },
  { key: 'outlet', label: '콘센트', tip: '없어요 / 보통이에요 / 자리마다 있어요' },
  { key: 'seat',   label: '좌석 수', tip: '테이블이 3개 이하 / 보통이에요 / 대형 카페에요' },
  { key: 'toilet', label: '화장실',  tip: '불편해요 / 평범해요 / 깨끗해요' },
  { key: 'wifi',   label: '와이파이', tip: '없어요 / 끊겨요 / 빨라요' },
  { key: 'noise',  label: '소음',    tip: '시끄러워요 / 보통이에요 / 조용해요' },
];

interface RatingSliderListProps {
  ratings: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

const RatingSliderList = ({ ratings, onChange }: RatingSliderListProps) => {
  return (
    <div className="space-y-6 mb-8">
      {sliderConfig.map(({ key, label, tip }) => (
        <Slider
          key={key}
          label={label}
          tip={tip}
          min={1}
          max={5}
          value={ratings[key]}
          onChange={(v) => onChange(key, v)}
        />
      ))}
    </div>
  );
};

export default RatingSliderList;
