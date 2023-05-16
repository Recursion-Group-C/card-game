CREATE OR REPLACE VIEW public.ranking AS
select
  id,
  username,
  money, 
  RANK() over(order by money desc) ranking,
  COUNT(id) OVER() AS total_users
from
  profiles
where
  username is not null;