#!/usr/bin/nodejs
var child_process = require('child_process');;


function findCurrentWindow(tree) {
  if (tree && tree.focused) {
    return tree;
  } else if (typeof  tree === 'object') {
    for (var key in tree) {
      var result = findCurrentWindow(tree[key]);
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
  var x = currentWindow.rect.x;
  var y = currentWindow.rect.y;
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

var tree = JSON.parse(child_process.execSync('i3-msg -t get_tree'));
var direction = process.argv[2];
var win = findCurrentWindow(tree);
var resizeCommand = getResizeCommand(win, direction);
var ppt = process.argv[3] || 10;
var px = process.argv[4] || 100;
var shellCommand = 'i3-msg resize ' + resizeCommand + ' ' + px + ' px or '+ ppt + ' ppt'

// console.log("tree", tree)
// console.log("win", JSON.stringify(win, null, 2))

child_process.execSync(shellCommand);

