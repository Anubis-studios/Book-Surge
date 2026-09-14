export const generateMaze = (width = 20, height = 20) => {
  const maze = Array(height).fill(null).map(() => Array(width).fill('#'));
  const start = [1, 1];
  const directions = [[0,2],[2,0],[0,-2],[-2,0]];
  
  const carve = (x: number, y: number) => {
    maze[y][x] = ' ';
    const shuffled = [...directions].sort(() => Math.random() - 0.5);
    for (const [dx, dy] of shuffled) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < width-1 && ny > 0 && ny < height-1 && maze[ny][nx] === '#') {
        maze[y + dy/2][x + dx/2] = ' ';
        carve(nx, ny);
      }
    }
  };
  
  carve(start[0], start[1]);
  maze[1][0] = ' '; // Entrance
  maze[height-2][width-1] = ' '; // Exit
  return maze;
};
