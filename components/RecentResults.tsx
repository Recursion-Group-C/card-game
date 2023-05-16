import { makeMoneyString } from '@/utils/general';
import {
  Session,
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { Database } from '../utils/database.types';

const RecentOrders = ({
  session
}: {
  session: Session;
}) => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [results, setResults] = useState<any>([]);

  useEffect(() => {
    getResults(); // eslint-disable-line @typescript-eslint/no-use-before-define
  }, [session]);

  async function getResults() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('results')
        .select(
          `id, created_at, game, result, win_amount, money`
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        // console.log(data);
        const formatedData = data.map((record) => {
          const originalDate = new Date(record.created_at);
          const jstDate = originalDate.toLocaleString(
            'ja-JP',
            { timeZone: 'Asia/Tokyo' }
          );
          const newRecord = { ...record };
          newRecord.created_at = jstDate;
          return newRecord;
        });
        setResults(formatedData);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative col-span-1 m-auto h-[50vh] w-full overflow-y-scroll rounded-lg border bg-base-200 p-4 lg:h-[70vh]">
      <h1>Recent Results</h1>
      <ul>
        {results.map((result: any) => (
          <li
            key={result.id}
            className="my-3 flex cursor-pointer items-center rounded-lg p-2 hover:bg-base-100"
          >
            <div className="rounded-lg p-2">
              {result.win_amount > 0 ? (
                <RiMoneyDollarCircleFill
                  size={40}
                  className="fill-blue-700/80"
                />
              ) : (
                <RiMoneyDollarCircleFill
                  size={40}
                  className="fill-rose-700/80"
                />
              )}
            </div>
            {/* Order info */}
            <div className="pl-4">
              <p className="font-bold">
                {makeMoneyString(result.win_amount)}
              </p>
              <p className="text-sm text-slate-400">
                {result.game.toUpperCase()} {result.result}
              </p>
            </div>
            <p className="absolute right-6 text-sm md:hidden lg:flex">
              {result.created_at}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentOrders;
