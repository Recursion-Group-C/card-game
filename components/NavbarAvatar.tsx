import {
  Session,
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { Database } from '../utils/database.types';
import Avatar from './Avatar';

type Profiles =
  Database['public']['Tables']['profiles']['Row'];

const NavAvatar = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
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
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Avatar
      uid={user ? user.id : ''}
      url={avatar_url}
      size={24}
      canUpLoad={false}
      onUpload={() => {}}
    />
  );
};

export default NavAvatar;
