import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';


ChartJS.register(
ArcElement,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function IncomeExpenditureAnalysisGraph({savings, wants, investments, needs}: {savings: number, wants: number, investments:number, needs:number}) {

  const [bardata, setBarData] = useState<Array<number>>([]);

  const labels = ['Savings', 'Needs', 'Wants', 'Investments'];

  let data = {
      labels,
      datasets: [
          {
          data: bardata,
          label: '$',
          backgroundColor: ['#263EBB', '#5926BB', '#2689BB', '#A326BB'],
          }
      ],
  };
  
  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'center' as const
      }
    }
  };

  useEffect(() => {
    setBarData([savings, needs, wants, investments]);
  }, [savings, needs, wants, investments])

  return (
      <>
          <Doughnut options={options} data={data} style={{ height: '100%', width: '100%' }} />
      </>
  )
}

export default IncomeExpenditureAnalysisGraph;