import Layout from '@/components/Layout';
import LineChart from '@/components/LineChart';
import RecentOrders from '@/components/RecentResults';
import TopCards from '@/components/TopCard';
import { useSession } from '@supabase/auth-helpers-react';

// https://github.com/Guccifer808/dashboard-nextjs
const Result = () => {
  const session = useSession();

  return (
    <Layout>
      {session ? (
        // <LineHorizontalChart session={session} />
        <>
          <TopCards session={session} />
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
            <LineChart session={session} />
            <RecentOrders session={session} />
          </div>
        </>
      ) : (
        <div />
      )}
    </Layout>
  );
};

export default Result;
