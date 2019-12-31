function setGlobalShapesByStage(stageId, shapes) {
  let obj = {};
  shapes.forEach((shape) => {
    obj[shape.id] = shape;
  })
  window.localStorage.setItem(`stage_${stageId}`, JSON.stringify(obj)); // { shapes }
}



function setGlobalShapesByShape(shape) {
  let shapes = JSON.parse(window.localStorage.getItem(`stage_${shape.stageId}`));
  shapes[shape.id] = shape;
  shape.key = shape.id; // for some odd FUCKING reason it keeps losing the key so I added this
  // console.log('shape (' + shape.id + ') is now: ' + JSON.stringify(shape));
  // console.log('shapes is now: ' + JSON.stringify(shapes));
  window.localStorage.setItem(`stage_${shape.stageId}`, JSON.stringify(shapes));
}

function loadGlobalShapes(stageId, test) {
  // console.clear();
  console.log('loading Shapes: ' + test)
  let shapes = JSON.parse(window.localStorage.getItem(`stage_${stageId}`)),
      selected = JSON.parse(window.localStorage.getItem('currentSelection'));

  // alert('selected is ' + selected);
  // alert('sjapes is ' + JSON.stringify(shapes));
  let arr = [];
  for(let shapeId in shapes) {
    // console.log(shape.id + ' vs ' + selected.id);
    let shape = shapes[shapeId];

    if(selected !== null && shape.id == selected.id) {
      // alert('shape: ' + shape.id + ' is focused');
      shape.isFocused = true;
    }
    arr.push(shape);
  }
  // alert('arr is ' + JSON.stringify(arr));
  return arr;
}

export { setGlobalShapesByStage, setGlobalShapesByShape, loadGlobalShapes };