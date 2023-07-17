import 'package:flutter/widgets.dart';
		import 'package:flutter/material.dart';

		void main() => runApp(MyApp());

		class MyApp extends StatelessWidget {
		  @override
		  Widget build(BuildContext context) {
		    return MaterialApp(
		      title: 'Flutter Demo',
		      theme: ThemeData(
		      	primaryColor: Colors.blue[500],
		      	accentColor: Colors.pinkAccent[400]
		      ),
		      home: page()
		    );
		  }
		}