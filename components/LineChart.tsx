import {
  Session,
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Database } from '../utils/database.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any>([]);
  const [userIds, setUserIds] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [results, setResults] = useState<any>([]);
  const [chartOptions, setChartOptions] = useState({});
  // const timezone = 'Asia/Tokyo'; // 日本時間に設定

  useEffect(() => {
    getMoneyHistory(); // eslint-disable-line @typescript-eslint/no-use-before-define
    getUsers(); // eslint-disable-line @typescript-eslint/no-use-before-define
    setChartOptions({
      plugins: {
        legend: {
          position: 'top' as const
        },
        title: {
          display: true,
          text: 'Users'
        },
        tooltip: {
          callbacks: {
            title: (context: any) => {
              const d = new Date(context[0].raw.date);
              const formattedDate = d.toLocaleString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }
              );
              return formattedDate;
            }
          }
        }
      },
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'money'
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time'
          },
          type: 'time',
          time: {
            unit: 'day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Money'
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: (value: number): string => `$${value}`
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true
    });
  }, [session]);

  async function getMoneyHistory() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('money_history')
        .select(`date, money, username`);

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        // console.log(data);
        setResults(data);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getUsers() {
    try {
      setLoading(true);

      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`id, username`)
        .neq('username', null);

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        const formatUsers = data.map((obj) => obj.username);
        setUsers(formatUsers);
        const formatUserIds = data.map((obj) => obj.id);
        setUserIds(formatUserIds);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  let chartData = {
    datasets: []
  };

  if (users && userIds && results) {
    const backgroundColor: Array<string> = [];
    const borderColor: Array<string> = [];
    for (let i = 0; i < users.length; i += 1) {
      let r;
      let g;
      let b;
      if (userIds[i] === user!.id) {
        // login userは白で固定する
        r = 255;
        g = 255;
        b = 255;
      } else {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
      }

      backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
      borderColor.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }
    const dataset = users.map(
      (username: string, index: number) => ({
        label: username,
        data: results.filter(
          (result: any) => result.username === username
        ),
        borderColor: borderColor[index],
        backgroundColor: backgroundColor[index]
      })
    );

    chartData = {
      datasets: dataset
    };
  }

  return (
    <div className="m-auto h-[50vh] w-full rounded-lg border bg-base-200 p-4 md:col-span-2 lg:h-[70vh]">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default LineChart;
