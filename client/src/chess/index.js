import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board'
import observe from './Game'

 export default () =>
 	<div style={{ height: '540px' }}><Board knightPosition={[7, 4]} /></div>
