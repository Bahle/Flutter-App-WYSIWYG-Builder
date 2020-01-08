import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import interact from 'interactjs'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

let isResizing = false,
    isDragging = false;

interact('.resize-drag')
  .draggable({
    onmove: window.dragMoveListener,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent'
      })
    ]
  })
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent',
        endOnly: true
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 20, height: 20 }
      })
    ],

    inertia: false
  })
  .on('resizemove', function (event) {
    isResizing = false;

    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0)
    var y = (parseFloat(target.getAttribute('data-y')) || 0)

    // update the element's style
    target.style.width = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'

    // translate when resizing from top or left edges
    x += event.deltaRect.left
    y += event.deltaRect.top

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)'

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
    target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
  })

function handleClick(e, data) {
  console.log(data.foo);
}

const example = 
      (<div class="resize-container">
        <ContextMenuTrigger id="some_unique_identifier">
          <div class="resize-drag">
             Resize from any edge or corner
          </div>
        </ContextMenuTrigger>

        <ContextMenu id={MENU_TYPE}>
            <MenuItem onClick={this.handleClick} data={{ item: 'item 1' }}>Menu Item 1</MenuItem>
            <MenuItem onClick={this.handleClick} data={{ item: 'item 2' }}>Menu Item 2</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={this.handleClick} data={{ item: 'item 3' }}>Menu Item 3</MenuItem>
        </ContextMenu>
        <ContextMenu id={MENU_TYPE2}>
            <MenuItem onClick={this.handleClick} data={{ item: 'nested item 1' }}>Nested Menu Item 1</MenuItem>
            <MenuItem onClick={this.handleClick} data={{ item: 'nested item 2' }}>Nested Menu Item 2</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={this.handleClick} data={{ item: 'nested item 3' }}>Nested Menu Item 3</MenuItem>
        </ContextMenu>
      </div>);


// window.onclick = function() { alert(window.$('body').length) }

let $ = window.$;
let isMouseDown = false;
let currentElem = null;
$('body').mousedown(function(e) {
  if(e.button !== 0) return;

  let cursor = $('html').css('cursor');

  if( cursor == 'move' || cursor.indexOf('resize') !== -1) return;

  isMouseDown = true;
  let $elem = $('<div class="resize-drag" style="position:absolute; border: solid 3px black; width: 20px; height: 20px;"><ContextMenuTrigger id="some_unique_identifier"></ContextMenuTrigger></div>');

  // console.dir(e.clientX, e.clientY);

  $elem.css({
    top: e.clientY,
    left: e.clientX
  })

  currentElem = $elem;

  $('body').append( $elem );
}).mouseup(function(e) {
  isMouseDown = isResizing = isDragging = false;
}).mousemove(function(e) {
  if(isMouseDown) {
    let top = currentElem[0].offsetTop,
        left = currentElem[0].offsetLeft;

    currentElem.width(e.clientX - left);
    currentElem.height(e.clientY - top);
  }
})



//<interact draggable />
//<interact dropzone />

ReactDOM.render(example, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();