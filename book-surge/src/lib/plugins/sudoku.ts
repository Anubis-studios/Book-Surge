export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
  // Simplified generator (in prod: use robust algo)
  const grid = Array(9).fill(null).map(() => Array(9).fill(0));
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    if (Math.random() > (difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 0.6 : 0.5)) {
      grid[row][col] = Math.floor(Math.random() * 9) + 1;
    }
  }
  return grid;
};
