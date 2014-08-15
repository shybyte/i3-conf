#!/usr/bin/nodejs
var execSync = require('exec-sync');

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


function resizeCommand(currentWindow, direction) {
  var x = currentWindow.rect.x;
  var y = currentWindow.rect.y;
  switch (direction) {
    case 'up':
      return (y === 0 ? 'shrink' : 'grow') + ' height';
    case 'down':
      return (y === 0 ? 'grow' : 'shrink') + ' height';
    case 'left':
      return (x === 0 ? 'shrink' : 'grow') + ' width';
    case 'right':
      return (x === 0 ? 'grow' : 'shrink') + ' width';
  }
}

var tree = JSON.parse(execSync('i3-msg -t get_tree'));
var direction = process.argv[2];
var win = findCurrentWindow(tree);
var rCommand = resizeCommand(win, direction);
//console.log(win.rect);
//console.log(rCommand);
var ppt = process.argv[3] || 10;
var px = ppt || 100;
var shellCommand = 'i3-msg resize ' + rCommand + ' ' + px + ' px or '+ ppt + ' ppt'
//console.log(shellCommand);
execSync(shellCommand);

