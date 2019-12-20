import React from 'react'
import ReactDOM from 'react-dom'
import Knight from './Knight'
// import Square from './Square'
import BoardSquare from './BoardSquare'
import { canMoveKnight, moveKnight } from './Game'

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

export default function Board({ knightPosition }) {
	function renderSquare(i, [knightX, knightY]) {
	  	const x = i % 8
		const y = Math.floor(i / 8)
		const isKnightHere = x === knightX && y === knightY
		const black = (x + y) % 2 === 1
		const piece = isKnightHere ? <Knight /> : null

		return (
		  <div onClick={() => handleSquareClick(x, y)} key={i} style={{ width: '12.5%', height: '12.5%' }}>
		    <BoardSquare x={x} y={y}>
				{renderPiece(x, y, knightPosition)}
			</BoardSquare>
		  </div>
		)
	}

	function handleSquareClick(toX, toY) {
	  if (canMoveKnight(toX, toY)) {
	  	moveKnight(toX, toY)
	  }
	}

	function renderPiece(x, y, [knightX, knightY]) {
	  if (x === knightX && y === knightY) {
	    return <Knight />
	  }
	}
	
	const squares = []
	for (let i = 0; i < 64; i++) {
		squares.push(renderSquare(i, knightPosition))
	}

	return (
		<DndProvider backend={Backend}>
			<div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', }}>	
				{squares}
			</div>
		</DndProvider>
	)
}