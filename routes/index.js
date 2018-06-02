/**
 * index.js
*/

var express = require( 'express' );
var app = express();
app.get( '/', function( req, res ) {
    res.render( 'index', { title: 'Node user profile' } );
} );

module.exports = app;