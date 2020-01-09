import React from 'react'
import RUG from 'react-upload-gallery'

// Add style manually
import 'react-upload-gallery/dist/style.css' // or scss


const RUGTest = props => {
	return (
		<RUG
		  action="/api/upload" // upload route
		  source={response => response.source} // response image source
		  initialState={[{source: './logo512.png', name: 'logo'}]}
		/>
	)
}

export default RUGTest;