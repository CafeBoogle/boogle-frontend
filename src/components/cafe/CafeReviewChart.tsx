import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const LABELS = [
  '콘센트',
  '넓은 카페',
  '화장실',
  '와이파이',
  '24시 카페',
  '조용한 카페',
] as const;

const SCORE_MAP: Record<(typeof LABELS)[number], string | null> = {
  콘센트: 'outletScoreAvg',
  '넓은 카페': 'seatScoreAvg',
  화장실: 'toiletScoreAvg',
  와이파이: 'wifiScoreAvg',
  '24시 카페': null,
  '조용한 카페': 'noiseScoreAvg',
};

export interface CafeReviewChartProps {
  scores?: Record<string, number>;
}

export default function CafeReviewChart({ scores }: CafeReviewChartProps) {
  const data = useMemo(() => {
    const values = LABELS.map((label) => {
      const key = SCORE_MAP[label];

      if (scores && key && typeof scores[key] === 'number') {
        return scores[key];
      }

      return 0; // 점수가 null이면 0
    });

    return {
      labels: LABELS,
      datasets: [
        {
          label: '카페 점수 (5점 만점)',
          data: values,
          fill: true,
          backgroundColor: 'rgba(160, 116, 90, 0.22)',
          borderColor: 'rgba(160, 116, 90, 1)',
          pointBackgroundColor: 'rgba(160, 116, 90, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(160, 116, 90, 1)',
        },
      ],
    };
  }, [scores]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
      },
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
          },
          angleLines: {
            display: false,
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="w-full h-[320px]">
      <Radar data={data} options={options} />
    </div>
  );
}