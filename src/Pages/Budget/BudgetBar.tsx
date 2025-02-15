import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BudgetBar ({barData} : {month:string; year:string, barData: Map<string, number>|undefined}) {

  const [label, setLabel] = useState<string[]>([]);
  const [dat, setDat] = useState<number[]>([]);
  
  let data = {
    labels: label,
    datasets: [
      {
        label: '$',
        data: dat,
        backgroundColor: ['#263EBB', '#5926BB', '#2689BB', '#A326BB', '#BB2688', '#BB263E', '#BB5926', '#BBA326', '#89BB26'],
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
        align: 'center' as const
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    }
  };


  useEffect(() => {

    if (barData !== undefined) {
      let keys = [];
      let values= [];

      for (let entry of barData.entries()) {
        keys.push(entry[0]);
        values.push(entry[1]);
      }

      const updatedData = {
        labels: keys,
        datasets: [
          {
            label: '$',
            data: values,
            backgroundColor: ['#263EBB'],
          },
        ],
      };

      setDat(values);
      setLabel(keys);
      data = updatedData;
    }

  }, [barData])

  return (
      <>
      {barData === undefined &&
        <p>Loading ... </p>
      }
      
      {barData !== undefined &&
        <Bar options={options} data={data} style={{ height: '100%', width: '100%' }} />
      }   
      </>
  )
}


export default BudgetBar;