import { useState, useEffect } from 'react';
import {
  useUser,
  useSupabaseClient,
  Session
} from '@supabase/auth-helpers-react';
import { Database } from '../utils/database.types';
import Avatar from './Avatar';

type Profiles =
  Database['public']['Tables']['profiles']['Row'];

const Account = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] =
    useState<Profiles['username']>(null);
  const [website, setWebsite] =
    useState<Profiles['website']>(null);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [avatar_url, setAvatarUrl] =
    useState<Profiles['avatar_url']>(null);

  useEffect(() => {
    getProfile(); // eslint-disable-line @typescript-eslint/no-use-before-define
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username, // eslint-disable-line @typescript-eslint/no-shadow
    website, // eslint-disable-line @typescript-eslint/no-shadow
    avatar_url // eslint-disable-line @typescript-eslint/no-shadow
  }: {
    username: Profiles['username'];
    website: Profiles['website'];
    avatar_url: Profiles['avatar_url'];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
      if (error) throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Avatar
        uid={user ? user.id : ''}
        url={avatar_url}
        size={150}
        canUpLoad
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({
            username,
            website,
            avatar_url: url
          });
        }}
      />
      <div className="mb-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={session.user.email}
          disabled
        />
      </div>
      <div className="mb-2">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <button
          type="button"
          className="button primary block"
          onClick={() =>
            updateProfile({ username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          type="button"
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Account;
