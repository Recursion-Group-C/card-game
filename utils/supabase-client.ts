import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fetchProfile = async (userId: string) => {
  const { data, error, status } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();
  if (data) return data;

  if (error && status !== 406) {
    console.log('error in fetchProfile', error);
  }
  return undefined;
};

const updateMoney = async (
  userId: string,
  money: number
) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ money })
      .eq('id', userId);

    if (error) {
      console.log('error in updateMoney', error);
    }
  } catch (error) {
    alert('Error updating the data!');
    console.log(error);
  }
};

const addResult = async (
  userId: string,
  game: string,
  result: string,
  winAmount: number
) => {
  try {
    const { error } = await supabase
      .from('results')
      .insert({
        user_id: userId,
        game,
        result,
        win_amount: winAmount
      });

    if (error) {
      console.log('error in addResult', error);
    }
  } catch (error) {
    alert('Error adding new result!');
    console.log(error);
  }
};

export { fetchProfile, updateMoney, addResult };
