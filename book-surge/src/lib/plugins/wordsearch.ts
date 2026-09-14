export const generateWordSearch = (words: string[]) => {
  const size = 15;
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  words.forEach(word => {
    const direction = Math.floor(Math.random() * 4); // 0=horiz, 1=vert, 2=diag
    const startRow = Math.floor(Math.random() * (size - word.length));
    const startCol = Math.floor(Math.random() * (size - word.length));
    for (let i = 0; i < word.length; i++) {
      if (direction === 0) grid[startRow][startCol + i] = word[i].toUpperCase();
      else if (direction === 1) grid[startRow + i][startCol] = word[i].toUpperCase();
      else grid[startRow + i][startCol + i] = word[i].toUpperCase();
    }
  });
  // Fill blanks
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
  return grid;
};
