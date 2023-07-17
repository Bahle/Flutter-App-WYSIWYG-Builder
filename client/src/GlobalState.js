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
  window.localStorage.setItem(`stage_${shape.stageId}`, JSON.stringify(shapes));
}

function loadGlobalShapes(stageId, test) {
  // console.log('loading Shapes: ' + test)
  // console.log('loading stageId: ' + stageId)
  // console.log('fuckfjashjfksahkf: ' + window.localStorage.getItem(`stage_${stageId}`))
  let shapes = JSON.parse(window.localStorage.getItem(`stage_${stageId}`)),
      selected = window.localStorage.currentSelection && JSON.parse(window.localStorage.currentSelection);

  let arr = [];
  for(let shapeId in shapes) {
    let shape = shapes[shapeId];

    if(selected && shape.id == selected.id) { // select  !== null
      shape.isFocused = true;
    }
    arr.push(shape);
  }
  
  return arr;
}

function getShapeWidgetProps(shape) {
  // const stageId = 
  let shapes = JSON.parse(window.localStorage.getItem(`stage_${shape.stageId}`));
  // console.clear()
  // console.dir('shapes: ', shapes)
  // console.dir('shape: ', shape)
  if(shapes && shapes[shape.id]) {
    return shapes[shape.id].widgetProps;
  } else {
    const movedShapes = JSON.parse(window.localStorage.movedShapes)
    if(!movedShapes[shape.id]) {
      // alert('stop playing: ' + JSON.stringify(shape))
      return shape.widgetProps; //{};
    }

    return movedShapes[shape.id].widgetProps;
  }
}

function setShapeWidgetProps(shape, props) {
  let shapes = JSON.parse(window.localStorage.getItem(`stage_${shape.stageId}`));
  // console.clear()
  // console.dir('shapes: ', shapes)
  // console.dir('shape: ', shape)

  if(shapes[shape.id]) {
    shapes[shape.id].widgetProps = props; 
  } else {
    // how do you solve? start here
    // throw new Error('shapes[shape.id] is undefined')
    // debugger
  }

  window.localStorage.setItem(`stage_${shape.stageId}`, JSON.stringify(shapes));
}

export { setGlobalShapesByStage, setGlobalShapesByShape, loadGlobalShapes, getShapeWidgetProps, setShapeWidgetProps };