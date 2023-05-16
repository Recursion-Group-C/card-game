CREATE OR REPLACE VIEW public.money_history AS
-- resultsから日付毎の最新の所持金を取得
SELECT
  CAST(subquery.date AS DATE) AS date,
  profiles.username AS username,
  subquery.money AS money
FROM (
  SELECT
    user_id,
    DATE_TRUNC('day', created_at AT TIME ZONE 'Asia/Tokyo') AS date,
    money,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, DATE_TRUNC('day', created_at AT TIME ZONE 'Asia/Tokyo')
      ORDER BY created_at DESC
    ) AS rn
  FROM
    results
) AS subquery
LEFT JOIN
  profiles
ON subquery.user_id = profiles.id
WHERE
  subquery.rn = 1 AND profiles.username IS NOT NULL 
UNION
-- profilesから現在の所持金を取得
SELECT
  CAST(current_date AS DATE) AS date,
  profiles.username AS username,
  profiles.money AS money
FROM
  profiles
where
  profiles.username IS NOT NULL
ORDER BY date;