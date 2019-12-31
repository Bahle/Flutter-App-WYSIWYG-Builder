import React from 'react'
import reactable from 'reactablejs'

const MyComponent = (props) => {
  return <div ref={props.getRef}>
    hello, world!
  </div>
}

// MyComponent will receive getRef in props, put getRef to the element you want interact, then you can use all options and event handlers on Reactable

const Reactable = reactable(MyComponent) 