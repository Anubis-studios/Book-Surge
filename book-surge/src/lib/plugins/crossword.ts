export const generateCrossword = (words: string[]) => {
  const grid = Array(15).fill(null).map(() => Array(15).fill(''));
  words.forEach(word => {
    if (Math.random() > 0.5) { // Horizontal
      const row = Math.floor(Math.random() * 15);
      const col = Math.floor(Math.random() * (15 - word.length));
      for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i].toUpperCase();
    } else { // Vertical
      const row = Math.floor(Math.random() * (15 - word.length));
      const col = Math.floor(Math.random() * 15);
      for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i].toUpperCase();
    }
  });
  // Fill blanks
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (!grid[r][c]) grid[r][c] = '.';
    }
  }
  return grid;
};
