import {
  Session,
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { BsCashCoin } from 'react-icons/bs';
import { TfiCup } from 'react-icons/tfi';
import { Database } from '../utils/database.types';

const TopCards = (session: { session: Session }) => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [ranking, setRanking] = useState<any>([]);

  useEffect(() => {
    getRanking(); // eslint-disable-line @typescript-eslint/no-use-before-define
  }, [session]);

  async function getRanking() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('ranking')
        .select(`ranking, money, total_users`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        console.log(data);
        setRanking(data);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 p-4 lg:grid-cols-4">
      <div className="col-span-1 flex w-full justify-center rounded-lg border bg-base-200 p-4 lg:col-span-1">
        <div className="rounded-lg p-2">
          <BsCashCoin size={40} className="fill-white" />
        </div>
        <div className="pl-4">
          <p className="text-2xl font-bold">
            {ranking.money ? (
              <>${ranking.money.toLocaleString()}</>
            ) : (
              <>${ranking.money}</>
            )}
          </p>
          <p>Total Money</p>
        </div>
      </div>
      <div className="col-span-1 flex w-full justify-center rounded-lg border bg-base-200 p-4 lg:col-span-1">
        <div className="rounded-lg p-2">
          <TfiCup size={40} className="fill-white" />
        </div>
        <div className="pl-4">
          <p className="text-2xl font-bold">
            {ranking.ranking} 位（{ranking.total_users}{' '}
            人中）
          </p>
          <p>Ranking</p>
        </div>
      </div>
    </div>
  );
};

export default TopCards;
