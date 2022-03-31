#!/usr/bin/node
import child_process from "child_process";

function findCurrentWindow(tree) {
  if (tree && tree.focused) {
    return tree;
  } else if (typeof  tree === 'object') {
    for (const key in tree) {
      const result = findCurrentWindow(tree[key]);
      if (result) {
        return result;
      }
    }
  }
}

function isInRange(x, min, length) {
    return min <= x && x <= min+length;
}

function getResizeCommand(currentWindow, direction) {
  const x = currentWindow.rect.x;
  const y = currentWindow.rect.y;
  switch (direction) {
    case 'up':
      return (y < 20 ? 'shrink' : 'grow') + ' height';
    case 'down':
      return (y < 20 ? 'grow' : 'shrink') + ' height';
    case 'left':
      return (x < 20 || isInRange(x, 1920, 20) ? 'shrink' : 'grow') + ' width';
    case 'right':
      return (x < 20 || isInRange(x, 1920, 20)  ? 'grow' : 'shrink') + ' width';
    default:
      throw new Error('Illegal Argument');
  }
}


const tree = JSON.parse(child_process.execSync('i3-msg -t get_tree'));
const direction = process.argv[2];
const win = findCurrentWindow(tree);
const resizeCommand = getResizeCommand(win, direction);
const ppt = process.argv[3] || 10;
const px = process.argv[4] || 100;
const shellCommand = 'i3-msg resize ' + resizeCommand + ' ' + px + ' px or ' + ppt + ' ppt';

// console.log("tree", tree)
// console.log("win", JSON.stringify(win, null, 2))

child_process.execSync(shellCommand);

