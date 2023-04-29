import Layout from '@/components/Layout';
import * as ja from '@/utils/ja.json';
import {
  useSession,
  useSupabaseClient
} from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Account from '../components/Account';

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <Layout>
      <div
        className="container"
        style={{ padding: '50px 0 100px 0' }}
      >
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            localization={{
              variables: ja
            }}
            providers={[]}
          />
        ) : (
          <Account session={session} />
        )}
      </div>
    </Layout>
  );
};

export default Login;
