const game = {
  table: {
    betDenominations: [5, 20, 50, 100]
  },
  player: {
    chips: 1000
  },
  card: {
    width: 140,
    height: 190
  }
} as const;

export default game;
