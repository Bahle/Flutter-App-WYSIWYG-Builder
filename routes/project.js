const router = require('express').Router();
const fs = require('fs');
const { create: xmlbuilder } = require('xmlbuilder2');

const projectsFolder = `./client/public/projects`

function get(req, res) {
	if( req.query.id === undefined ) {
		const projects = fs.readdirSync(projectsFolder).map(file => file);

		res.json({results: projects})
	} else {
		let project = JSON.parse(fs.readFileSync(`${projectsFolder}/${req.query.id}/index.js`));
		
		// console.log(project)

		res.json({results: project})
	}
}

function writeToFile(filePath, project, res, callback) {
	fs.writeFile(filePath, JSON.stringify(project), (err) => {
	    if (err) {
	    	if(res) res.status(500).json({error: err})
	    	throw err;
	    }
	    console.log('JSON data written to file');
	    // return;
	    if(!callback) {
	    	if(res) res.json({results: 'success'})
	    } else {
	    	callback()
	    }
	});
}

function generateMainFunction(initialPage, themeData) {
	var colors = {};
	themeData.forEach(({key, ...params}) => {
	  colors[key] = {...params}
	})

	/* *** prototypes seem to make the application crash, use functions instead
	Object.prototype.toColor = function() {
		return 'Colors.' + this.materialColor.replace(/(\d+)/g, "[$1]").replace('A', 'Accent')
	};*/

	const color = (themeColor) => 'Colors.' + themeColor.materialColor.replace(/(\d+)/g, "[$1]").replace('A', 'Accent')

	/*appBarTheme: AppBarTheme(
	  color: _lightPrimaryVariantColor,
	  iconTheme: IconThemeData(color: _lightOnPrimaryColor),
	),
	/*iconTheme: IconThemeData(
	  color: _iconColor,
	),
	textTheme: _lightTextTheme,
	*/

	// ignore on error for defalt
	var text = `import 'package:flutter/widgets.dart';
		import 'package:flutter/material.dart';

		void main() => runApp(MyApp());

		class MyApp extends StatelessWidget {
		  @override
		  Widget build(BuildContext context) {
		    return MaterialApp(
		      title: 'Flutter Demo',
		      theme: ThemeData(
		      	primaryColor: ${color(colors['Primary'])},
		      	accentColor: ${color(colors['Secondary'])},
		        colorScheme: ColorScheme( // .light
		          primary: ${color(colors['Primary'])},
		          secondary: ${color(colors['Secondary'])},
		          onSecondary: ${color(colors['OnSecondary'])},
		          onPrimary: ${color(colors['OnPrimary'])},
		          onBackground: ${color(colors['OnBackground'])},
		          surface: ${color(colors['Surface'])},
		          onSurface: ${color(colors['OnSurface'])},
		          error: ${color(colors['Error'])},
		          onError: ${color(colors['OnError'])},
		          background: ${color(colors['Background'])},
		        ),
		      ),
		      home: NewPage()
		    );
		  }
		}`;

	// console.log('text is ', text)

	/*text = text
		.replace('##', JSON.stringify(themeData).replace(/[\"{}]/g, ''))
		.replace('$$', `${initialPage}()`);*/

	return text
}

function writeToFileRaw(filePath, project, res, callback) {
	/*console.log('!!!WHAT THE FUCK IS RES!!! ', res)
	console.log('!!!FILE PATH!!!', filePath)
	console.log('!!!FUCKING WROTE!!!', project)*/

	try {
	  fs.writeFileSync(filePath, project); // , { mode: 0o755 }

	  if(!callback) {
	  	if(res) { console.log('BEING CALLED 2'); res.json({results: 'success'}) }
	  } else {
	  	callback()
	  }
	} catch(err) {
	  if(res) { console.log('BEING CALLED 1'); res.status(500).json({error: err}) }
	  throw err;
	}

	return;

	/*fs.writeFile('./filePath', project, (err) => {
	    if (err) {
	    	if(res) { console.log('BEING CALLED 1'); res.status(500).json({error: err}) }
	    	throw err;
	    }
	    
	    if(!callback) {
	    	if(res) { console.log('BEING CALLED 2'); res.json({results: 'success'}) }
	    } else {
	    	callback()
	    }
	});*/
}

function create(req, res) {
	const {title, packageName, firebasePackages, generalPackages, projectIcon, majorVersion, minorVersion, patchVersion, minApiLevel, screenSizeOrGlTextureFormat, versionClassifier} = req.body;

	const folder = `${projectsFolder}/${title}`

	const colourDataSource = [
	  { key: 'Primary', name: 'Primary', materialColor: 'blue500', colorCode: '#2196f3' },
	  { key: 'PrimaryVariant', name: 'Primary Variant', materialColor: 'white', colorCode: '#ffffff' },
	  { key: 'Secondary', name: 'Secondary', materialColor: 'pinkA400', colorCode: '#f50057' },
	  { key: 'SecondaryVariant', name: 'Secondary Variant', materialColor: 'white', colorCode: '#ffffff' },
	  { key: 'Background', name: 'Background', materialColor: 'white', colorCode: '#ffffff' },
	  { key: 'Button', name: 'Button', materialColor: 'grey300', colorCode: '#e0e0e0' },
	  { key: 'Surface', name: 'Surface', materialColor: 'white', colorCode: '#ffffff' },
	  { key: 'Error', name: 'Error', materialColor: 'red700', colorCode: '#d32f2f' },
	  { key: 'OnPrimary', name: 'On Primary', materialColor: 'white', colorCode: '#ffffff' },
	  { key: 'OnSecondary', name: 'On Secondary', materialColor: 'black', colorCode: '#000000' },
	  { key: 'OnBackground', name: 'On Background', materialColor: 'black', colorCode: '#000000' },
	  { key: 'OnSurface', name: 'On Surface', materialColor: 'black', colorCode: '#000000' },
	  { key: 'OnError', name: 'On Error', materialColor: 'white', colorCode: '#ffffff' },
	];

	const themeData = JSON.parse("{\"color\":" + JSON.stringify(colourDataSource) + ",\"typography\":{},\"icons\":\"\"}");

	const json = {
		title, packageName, firebasePackages, generalPackages, projectIcon,
		version: {
			major: majorVersion,
			minor: minorVersion,
			patch: patchVersion,
			classifier: versionClassifier,
			minApiLevel,
			screenSizeOrGlTextureFormat
		},
		data: {
			pages: [],
			firebaseFiles: [],
			modelData: [],
			themeData
		},
		pages: []
	}

	if (!fs.existsSync(folder)){
	    fs.mkdirSync(folder);
	}

	writeToFile(`${folder}/index.js`, json, res);
}

function update(req, res) {
	const { id, pageData, exportProject, data: { pages, firebaseFiles, modelData, themeData } } = req.body;
	// console.log('update received: ' + JSON.stringify(req.body))

	const folder = `${projectsFolder}/${id}`

	// double JSON.parse(); first to convert byte data
	let project = JSON.parse(fs.readFileSync(`${projectsFolder}/${id}/index.js`));

	project.data.pages = pages;
	project.data.firebaseFiles = firebaseFiles;
	project.data.modelData = modelData;
	project.data.themeData = themeData;
	project.pages = pageData;

	writeToFile(`${folder}/index.js`, project, res, exportProject && function() {
		console.log('writeToFile happening')
		// console.log('WHAT IS THE RESULT: ', analyzeScaffoldFeatures(pages, pageData))
		const data = analyzeScaffoldFeatures(pages, pageData)

		if (!fs.existsSync(`${folder}/dart`)){
		    fs.mkdirSync(`${folder}/dart`);
		}

		exportData(data, `${folder}/dart`, themeData, pageData)

		res.json({results: 'success'}) // .status(200)
	});
}

// swapped param names because actually makes more sense
function analyzeScaffoldFeatures(pages, pageData) {
	// console.log('pages: ', pages)
	// console.log('pageDATA: ', pageData)
	const result = []

	/*
	{
		homePage: {
			appBar: ....,
			tab: {
				bar: ...,
				view: {
					tab: {
						bar: ...,
						view: {
							//=========
							// extreme case
							tab: {
								bar: ...,
								view: {
									
								}
							}
							//=========
						}
					}
				}
			}
		}
	}
	*/

	// for each page
	pages.forEach(function(page) {
		if(page.type != 'TabView') {
			pageResult = {body: []}

			let duck
			try {
				duck = JSON.parse(pageData.find(p => p.name == page.name).data)
			} catch(err) {
				console.log('Fucking crashed for: ', pageData.find(p => p.name == page.name))
				//throw new Error(err)
				return;
			} 

			// for each widget
			// hope does not crash from assumption filter will return something
			for(const key in duck) {
				const widget = duck[key]

				// console.log('bloody widget: ', widget)

				if(widget.type == 'AppBar') {
					pageResult.appBar = widget;

					if(widget.widgetProps.drawerListItems && widget.widgetProps.drawerListItems.trim() != '') {
						pageResult.drawer = widget.widgetProps.drawerListItems
					}
				} else if(widget.type == 'FloatingActionButton')  {
					pageResult.fab = widget;
				} else if(widget.type == 'TabBar' || widget.type == 'BottomNavigationBar' /* || 'PageView' */) {
					// ========
					pageResult.tab = {bars: [], views: []}

					// when more text tabs than icons
					if((widget.widgetProps.tabs && !widget.widgetProps.tabIcons) || (widget.widgetProps.tabs.length >= widget.widgetProps.tabIcons.length)) {
						widget.widgetProps.tabs.split('\n').forEach((tab, i) => {
							const tabBar = {
								text: tab,
								icon: widget.widgetProps.tabIcons && widget.widgetProps.tabIcons[i] 
							}

							pageResult.tab.bars.push(tabBar);
						})
					// when more icons tabs than text
					} else if((!widget.widgetProps.tabs && widget.widgetProps.tabIcons) || (widget.widgetProps.tabs.length <= widget.widgetProps.tabIcons.length)) {
						widget.widgetProps.tabIcons.forEach((tabIcon, i) => {
							const tabBar = {
								text: widget.widgetProps.tabs && widget.widgetProps.tabs[i] ,
								icon: tabIcon
							}

							pageResult.tab.bars.push(tabBar);
						})
					}

					const tabBarKey = widget.id;
					pageResult.tab.views = pages.filter(page => page.belongsTo == tabBarKey).map(page => {
						let temp = pageData.find(p => p.name == page.name)
						return temp ? JSON.parse(temp.data) : {}
					});
					console.log('##################################')
					console.log('pageResult.tab.views: ', pageResult.tab.views)
					console.log('##################################')
				} else {
					pageResult.body.push(widget)
				}
			}

			result.push({
				pageName: page.name,
				pageType: page.type,
				content: pageResult
			})
		} else {


		}
	})

	// console.log('result: ', JSON.stringify(result))
	return result;
}

function exportData(data, folder, themeData, pageData) {
	/*console.log('pageData: ', pageData)
	console.log('============================')*/
	// console.log('is this happening')
	// get the name of the first page
	writeToFileRaw(`${folder}/main.dart`, generateMainFunction(Object.values(data[0])[0], themeData.color)) // later move this to create function
	
	data.forEach(({pageName, pageType, content}) => {
		if(pageType == 'Container' || pageType == 'TabView') return;

		// console.log('data.page: ' + page)
		const scaffold = xmlbuilder({ version: '1.0' })
			.ele('root')
				.ele('import', {package: 'flutter_view_tools/flutter_view_tools.dart'}).up()
				.ele(pageName, {'flutter-view': true}).ele('scaffold');

		if(content.appBar) {
			const widgetProps = content.appBar.widgetProps

			let appBar = scaffold.ele('app-bar', {as: 'appBar'}) //.txt('foobar').up()	
				.ele('text', {as: 'title', 'value': widgetProps.title}).up();

			if(widgetProps.leadingIcon) {
				appBar.ele('icon-button', {as: 'leading'})
					.ele('icon', {as: 'icon', '_:value': widgetProps.leadingIcon})
			}

			if(widgetProps.actions) {
				const actions = appBar.ele('array', {as: 'actions'});
				
				widgetProps.actions.forEach(action => {
					actions.ele('icon-button')
						.ele('icon', {as: 'icon', '_:value': action})
				})
			}
		}

		let body = scaffold.ele('layout-builder', {as: 'body'});
		body = body.ele('function', {as: 'builder', params: 'context, viewportConstraints'})
				.ele('single-child-scroll-view')
					.ele('constrained-box')
						.ele('box-constraints', {as: 'constraints', '_:minHeight': 'viewportConstraints.maxHeight'}).up()
						.ele('stack')

		// console.log('content.body', content.body)

		let count = 1

		const color = themeColor => `:Theme.of(context).colorScheme.${themeColor[0].toLowerCase() + themeColor.slice(1)}` // shortcut => theme(color-scheme/primary-color)
		const margin = (name, widget, params={}) => body.ele('div', {margin: `${widget.y} ${widget.x}`}).ele(name, params)

		const nonContainers = (body, widget) => {
			const { widgetProps } = widget;

			// console.log('nonContainers', widget)
			if(widget.type == 'Text') {
				// console.log('widget fucking text: ' + widgetProps.text)
				const text = body.ele('div', {margin: `${widget.y} ${widget.x}`}).txt(widgetProps.text); // no need for margin function here
				if(widgetProps.fontSize) {
					text.att('font-size', `:Theme.of(context).textTheme.${widgetProps.fontSize}.fontSize`)
				}

			} else if(widget.type == 'RaisedButton') {
				const button = margin('raised-button')
					.ele('text', {'_:value': widgetProps.text}).up();

				if(widgetProps.color) {
					button.att('color', color(widgetProps.color))
				}

				if(widgetProps.backgroundColor) {
					button.att('background-color', color(widgetProps.backgroundColor))
				}
			} else if(widget.type == 'OutlineButton') {
				const button = margin('outline-button') // start from here
					.ele('text', {'_:value': widgetProps.text}).up();

				if(widgetProps.color) {
					button.att('color', color(widgetProps.color)) // would this be the text color
				}

				let border;
				if(widgetProps.borderColor) {
					// BorderSide(width: 16.0, color: Colors.lightBlue.shade50)
					border = button.ele('border-side', {as: 'borderSide', color: color(widgetProps.borderColor)});
				}

				if(widgetProps.borderWidth) {
					border.att('width', widgetProps.borderWidth);
				}
			} else if(widget.type == 'FlatButton') {
				const button = margin('flat-button', widget)
					.ele('text', {'_:value': widgetProps.text}).up();

				if(widgetProps.backgroundColor) {
					button.att('color', color(widgetProps.backgroundColor))
				}

				if(widgetProps.color) {
					button.att('textColor', color(widgetProps.color))
				}
			} else if(widget.type == 'IconButton') {
				const button = margin('icon-button', widget)

				if(widgetProps.fontSize) {
					button.att('fontSize', widgetProps.fontSize)
				}

				if(widgetProps.color) {
					button.att('color', color(widgetProps.color))
				}

				if(widgetProps.icon) {
					button.ele('icon', {as: 'icon', '_:value': `Icons.${widgetProps.icon.replace(/([A-Z])/g, '_$1').slice(1).toLowerCase()}`}).up();				
				}

			} else if(widget.type == 'DropdownButton') {
				const button = margin('dropdown-button', widget, {iconSize: '24', elevation: '16'}) // iconSize, elevation are defaults

				if(widgetProps.options != undefined) {
					const options = widgetProps.options.split('\n')

					button.att('_:uvalue', options[0])

					const optionItems = button.ele('array', {as: 'items'});

					options.forEach(option => {
						optionItems.ele('dropdown-menu-item').txt(option)
					})
				}
			} else if(widget.type == 'PopupMenuButton') {
				const button = margin('popup-menu-button', widget); // iconSize, elevation are defaults

				if(widgetProps.options != undefined) {
					const options = widgetProps.options.split('\n')

					const optionItems = button.ele('function', {as: 'itemBuilder', params: 'context'}).ele('array')
					options.forEach(option => {
						optionItems.ele('popup-menu-item', {'_:uvalue': `'${option}'`}).txt(option)
					})
				}
			}

			return body
		}

		content.body.forEach(widget => {
			const widgetProps = widget.widgetProps
			if(widget.type == 'Container') {
				const props = {margin: `${widget.y} ${widget.x}`}

				for(const key in widgetProps) {
					if(key == 'repeatable' || key == 'toColor') continue;
					const propValue = widgetProps[key]
					
					if(key == 'elevation') {
						body = body.ele('material', {elevation: propValue})
					} else if(key == 'opacity') {
						body = body.ele('opacity', {opacity: propValue})
					} else {
						props[key.replace(/([A-Z])/g, "-$1").toLowerCase()] = propValue
					}
				}

				body = body.ele('div', props);//.txt(props.text);

				const containers = pageData.filter(({name, data}) => name == widget.id)
				
				if(containers.length) body = body.ele('stack')

				containers.forEach(({name, data}) => {
					const widgets = JSON.parse(data)

					// assuming it can only be nested twice
					for(const key in widgets) {
						const widget = widgets[key]
						// console.log('INTERNAL FUCKING WIDGET IS ', widget)

						nonContainers(body, widget)
					}
				})

				body = body.up().up().up()
			} else {
				body = nonContainers(body, widget)
			}

		})

		if(content.fab) {
			const widget = scaffold.ele('floating-action-button', {as: 'floatingActionButton'}) // , id: 'btn', tooltip: 'Increment', 'on-pressed': 'model.incrementCounter()'
			if(content.fab.widgetProps.icon) {
				widget.ele('icon', {'_:value': `Icons.${content.fab.widgetProps.icon.toLowerCase()}`})
			} else {
				widget.ele('text', {'_:value': `Icons.${content.fab.widgetProps.text}`})
			}
		}	    

		// convert the XML tree to string
		const xml = scaffold.end({ prettyPrint: true });
		console.log('xml: ', xml);

		writeToFileRaw(`${folder}/${pageName}.xml`, xml.replace(/_:/g, ':').replace(/uvalue/g, '^value').replace('<?xml version="1.0"?>', '').replace('<root>', '').replace('</root>', '')); // , res, callback
	})
}

// function generateCSSFile() {}

function createPage(req, res) {
	const newPage = req.body.page;

	const fileName = `${projectsFolder}/${req.body.id}/index.js`;
	let project = JSON.parse(fs.readFileSync(fileName));
	console.log('project.data.pages: ', project.data.pages)
	var pageData = project.data.pages;
	pageData.push(newPage)

	project.data.pages = pageData	
	
	writeToFile(fileName, project, res);
}

function deletePage(req, res) {
	const pageName = req.body.page;

	console.log('stringified: ' + JSON.stringify(req.body));
	console.log('=====')
	console.log(`${projectsFolder}/${req.body.id}/index.js`);

	const fileName = `${projectsFolder}/${req.body.id}/index.js`;
	let project = JSON.parse(fs.readFileSync(fileName));
	// var pageData = project.data.pages.filter(page => page.name != pageName)

	project.pages = project.pages.filter(page => page.name != pageName)
	project.data.pages = project.data.pages.filter(page => page.name != pageName)
	console.log('project.data.pages: ', project.data.pages)

	writeToFile(fileName, project, res);
}

router.route( '/' ) // /
       .get( get )
       .post( create )
       
router.route( '/fuck' ).post( update );

router.route( '/page' )
		.post( createPage )
		.delete( deletePage )

module.exports = router;