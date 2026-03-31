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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LABELS = ['콘센트', '넓은 카페', '화장실', '와이파이', '24시 카페', '조용한 카페'];

export interface CafeReviewChartProps {
  scores?: Record<string, number>;
  selectedTags?: string[];
}

export default function CafeReviewChart({ scores, selectedTags = [] }: CafeReviewChartProps) {
  const data = useMemo(() => {
    const values = LABELS.map((label) => {
      if (scores && typeof scores[label] === 'number') return scores[label];
      return selectedTags.includes(label) ? 80 : 100;
    });

    return {
      labels: LABELS,
      datasets: [
        {
          label: '카페 점수',
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
  }, [scores, selectedTags]);

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
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 100,
          angleLines: {
            display: false,
          },
          ticks: {
            stepSize: 20,
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
