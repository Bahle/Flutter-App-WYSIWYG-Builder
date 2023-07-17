import React from 'react'
// ES Modules syntax
import Unsplash from 'unsplash-js';
// require syntax
// const Unsplash = require('unsplash-js').default;
const apiKey = 'DH9ic6FLM9vAg5Rp4HUJSMxbvKCaO69eUqlznasD7J8'
const unsplash = new Unsplash({ accessKey: apiKey });

/*const unsplash = new Unsplash({
  accessKey: apiKey,
  // Optionally you can also configure a custom header to be sent with every request
  headers: {
    "X-Custom-Header": "foo"
  },
  // Optionally if using a node-fetch polyfill or a version of fetch which supports the timeout option, you can configure the request timeout for all requests
  timeout: 500 // values set in ms
});*/

function UnsplashTest() {
	const [pictures, setPictures] = React.useState([])

	React.useEffect(function() {
		unsplash.search.photos("dogs", 1, 3, { orientation: "landscape" })
		  .then(response => response.json())
		  .then(({results}) => {
		  	console.dir(results)
		  	results = results.map(result => result.urls.small)
		    console.dir('got: ', results)

		    setPictures(results);
		  });
	}, [])

	/*React.useEffect(function() {
	}, [pictures])*/

	return (
		<div>
			<h3>Pictures</h3>
			{
				pictures.length == 0 ? 'Loading pictures from unsplash...' : pictures.map(picture => {
					return <img width="360" key={picture} src={picture} />
				})
			}
		</div>
	)
}

export default UnsplashTest;