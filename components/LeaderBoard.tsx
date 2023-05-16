import {
  Session,
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { Database } from '../utils/database.types';
import Avatar from './Avatar';

const LeaderBoard = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [ranking, setRanking] = useState<any>([]);
  const [avatars, setAvatars] = useState<any>([]);

  useEffect(() => {
    getRanking(); // eslint-disable-line @typescript-eslint/no-use-before-define
    getAvatarUrls(); // eslint-disable-line @typescript-eslint/no-use-before-define
  }, [session]);

  async function getRanking() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('ranking')
        .select();

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        // console.log(data);
        setRanking(data);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getAvatarUrls() {
    try {
      setLoading(true);
      if (!user) throw new Error('No user');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`id, avatar_url`);

      if (error && status !== 406) {
        throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
      }

      if (data) {
        const formatedData: { [key: string]: string } = {};
        data.forEach((avatar) => {
          formatedData[avatar.id] = avatar.avatar_url;
        });
        // console.log(formatedData);
        setAvatars(formatedData);
      }
    } catch (error) {
      alert('Error loading user data!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-auto h-[85vh] w-full overflow-y-scroll rounded-lg border bg-base-200 p-4 lg:w-5/6">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-white text-lg leading-10">
            <th>RANK</th>
            <th>USER</th>
            <th>MONEY</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((userdata: any) => (
            <tr
              className="text-center hover:bg-base-100"
              key={userdata.id}
            >
              <td className="px-6 py-3">
                <div className="flex justify-center">
                  {userdata.ranking === 1 && (
                    <div className="relative">
                      <FaCrown
                        size={40}
                        className="fill-yellow-500"
                      />
                      <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-base font-bold text-white">
                        1
                      </span>
                    </div>
                  )}
                  {userdata.ranking === 2 && (
                    <div className="relative">
                      <FaCrown
                        size={40}
                        className="fill-gray-500"
                      />
                      <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-base font-bold text-white">
                        2
                      </span>
                    </div>
                  )}
                  {userdata.ranking === 3 && (
                    <div className="relative">
                      <FaCrown
                        size={40}
                        className="fill-orange-500"
                      />
                      <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-base font-bold text-white">
                        3
                      </span>
                    </div>
                  )}
                  {userdata.ranking > 3 && (
                    <p className="text-lg">
                      {userdata.ranking}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center justify-center">
                  <div className="mr-4">
                    <Avatar
                      uid={userdata.id}
                      url={avatars[userdata.id]}
                      size={20}
                      canUpLoad={false}
                      onUpload={() => {}}
                    />
                  </div>
                  <span>{userdata.username}</span>
                </div>
              </td>
              <td>
                <span className="text-lg">
                  ${userdata.money.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
