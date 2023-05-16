import Layout from '@/components/Layout';
import LeaderBoard from '@/components/LeaderBoard';
import { useSession } from '@supabase/auth-helpers-react';

const Ranking = () => {
  const session = useSession();

  return (
    <Layout>
      {session ? (
        <div className="grid grid-cols-1 gap-4 p-4">
          <LeaderBoard session={session} />
        </div>
      ) : (
        <div />
      )}
    </Layout>
  );
};

export default Ranking;
