/**
 * users.js
*/

var express = require( 'express' );
var app = express();
var ObjectId = require( 'mongodb' ).ObjectId;
var faker = require('faker');

app.get( '/', function( req, res, next ) {
    req.db.collection( 'userprofile' ).find().sort( { '_id': -1 } ).toArray( function( err, result ) {
        if( err ) {
            req.flash( 'error', err );
            res.render( 'user/list', { title: 'User list', data: '' });
        } else {
            res.render( 'user/list', { title: 'User list', data: result } );
        }
    } );
} );

app.get( '/add', function( req, res, next ) {
    res.render( 'user/add', {
        title: 'Add new user',
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        dateofbirth: faker.date.past(),
        bloodgroup: faker.random.arrayElement(['A', 'B', 'O', 'AB']) + faker.random.arrayElement(['+', '-']),
        occupation: faker.name.jobArea()
    });
} );

app.post( '/add', function( req, res, next ) {
    req.assert( 'firstname', 'First name is required' ).notEmpty();
    req.assert( 'lastname', 'Last name is required' ).notEmpty();
    req.assert( 'email', 'E-mail is required' ).notEmpty();

    var errors = req.validationErrors();

    if( ! errors ){
        if( req.files ) {
            var file = req.files.profilePic;
            var fileName = Date.now() + '_' + file.name;
            file.mv( './profilePics/'+fileName, function( err ) {
                if( err ) {
                    console.log( err );
                }
            } );
        }

        var user = {
            firstname: req.sanitize( 'firstname' ).escape().trim(),
            lastname: req.sanitize( 'lastname' ).escape().trim(),
            email: req.sanitize( 'email' ).escape().trim(),
            phone: req.sanitize( 'phone' ).escape().trim(),
            dateofbirth: req.sanitize( 'dateofbirth' ).escape().trim(),
            bloodgroup: req.sanitize( 'bloodgroup' ).escape().trim(),
            occupation: req.sanitize( 'occupation' ).escape().trim(),
            profilepic: fileName
        };

        req.db.collection( 'userprofile' ).insert( user, function( err, result) {
            if( err ) {
                req.flash( 'error', err );
                res.render( 'user/add', {
                    title: 'Add new user',
                    firstname: user.firstname
                } );
            } else {
                req.flash( 'success', 'User added successfully' );
                res.redirect( '/users' );
            }
        } );
    } else {
        var error_msg = '';
        errors.forEach( function( error ) {
            error_msg += error.msg + '<br>';
        } );
        req.flash( 'error', error_msg );
        res.render( 'user/add', {
            title: 'Add new user',
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            dateofbirth: req.body.dateofbirth,
            bloodgroup: req.body.bloodgroup,
            occupation: req.body.occupation
        } );
    }

} );

app.get( '/view/:id', function(req, res, next) {
    var o_id = new ObjectId( req.params.id );
    req.db.collection( 'userprofile' ).find( { '_id': o_id } ).toArray( function( err, result){
        if( err ){
            return;
            console.log( err );
        }
        if( ! result ) {
            req.flash( 'error', 'User not found with id = ' + req.params.id );
            res.redirect( '/users' );
        } else {
            res.render( 'user/view', {
                title: 'User details',
                id: result[0]._id,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                email: result[0].email,
                phone: result[0].phone,
                dateofbirth: result[0].dateofbirth,
                bloodgroup: result[0].bloodgroup,
                occupation: result[0].occupation,
                profilepic: result[0].profilepic
            } );
        }
    } );
} );

app.get( '/edit/:id', function(req, res, next) {
    var o_id = new ObjectId( req.params.id );
    req.db.collection( 'userprofile' ).find( { '_id': o_id } ).toArray( function( err, result){
        if( err ){
            return;
            console.log( err );
        }
        if( ! result ) {
            req.flash( 'error', 'User not found with id = ' + req.params.id );
            res.redirect( '/users' );
        } else {
            res.render( 'user/edit', {
                title: 'Edit User',
                id: result[0]._id,
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                email: result[0].email,
                phone: result[0].phone,
                dateofbirth: result[0].dateofbirth,
                bloodgroup: result[0].bloodgroup,
                occupation: result[0].occupation,
                profilepic: result[0].profilepic
            } );
        }
    } );
} );

app.put( '/edit/:id', function( req, res, next ){
    var o_id = new ObjectId( req.params.id );
    var existingProfilepic = '';

    req.db.collection( 'userprofile' ).find( { '_id': o_id } ).toArray( function( err, res){
        if( err ){
            return;
            console.log( err );
        } else if( res ) {
            existingProfilepic = res[0].profilepic;
        } else {
            console.log( 'Error while editing' );
        }
    } );

    req.assert( 'firstname', 'First name is required' ).notEmpty();
    req.assert( 'lastname', 'Last name is required' ).notEmpty();
    req.assert( 'email', 'E-mail is required' ).notEmpty();

    var errors = req.validationErrors();

    if( ! errors ) {

        if( req.files.profilePic ) {
            var file = req.files.profilePic;
            var fileName = Date.now() + '_' + file.name;
            file.mv( './profilePics/'+fileName, function( err ) {
                if( err ) {
                    console.log( err );
                } else {
                    console.log( 'fileuploaded successfully' );
                }
            } );

            var user = {
                firstname: req.sanitize( 'firstname' ).escape().trim(),
                lastname: req.sanitize( 'lastname' ).escape().trim(),
                email: req.sanitize( 'email' ).escape().trim(),
                phone: req.sanitize( 'phone' ).escape().trim(),
                dateofbirth: req.sanitize( 'dateofbirth' ).escape().trim(),
                bloodgroup: req.sanitize( 'bloodgroup' ).escape().trim(),
                occupation: req.sanitize( 'occupation' ).escape().trim(),
                profilepic: fileName
            };
        } else {
            var user = {
                firstname: req.sanitize( 'firstname' ).escape().trim(),
                lastname: req.sanitize( 'lastname' ).escape().trim(),
                email: req.sanitize( 'email' ).escape().trim(),
                phone: req.sanitize( 'phone' ).escape().trim(),
                dateofbirth: req.sanitize( 'dateofbirth' ).escape().trim(),
                bloodgroup: req.sanitize( 'bloodgroup' ).escape().trim(),
                occupation: req.sanitize( 'occupation' ).escape().trim(),
                profilepic: 'no_image.jpg'
            };
        }
        req.db.collection( 'userprofile' ).update( { '_id': o_id }, user, function( err, result ) {
            if( err ) {
                req.flash( 'error', err );
                res.render( 'user/edit', {
                    id: req.params.id,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    dateofbirth: req.body.dateofbirth,
                    bloodgroup: req.body.bloodgroup,
                    occupation: req.body.occupation,
                    profilepic: existingProfilepic
                } );
            } else {
                req.flash( 'success', 'User data updated successfully' );
                res.redirect( '/users' );
            }
        } );
    } else {
        var error_msg = '';
        errors.forEach( function( error ) {
            error_msg += error.msg + '<br>';
        } );

        req.flash( 'error', error_msg );
        res.render( 'user/edit', {
            title: 'Edit user',
            id: req.params.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            dateofbirth: req.body.dateofbirth,
            bloodgroup: req.body.bloodgroup,
            occupation: req.body.occupation,
            profilepic: existingProfilepic
        } );
    }
} );

app.delete( '/delete/:id', function( req, res, next ){
    var o_id = new ObjectId( req.params.id );
    req.db.collection( 'userprofile' ).remove( { '_id': o_id }, function( err, result ){
        if( err ){
            req.flash( 'error', err );
            res.redirect( '/users' );
        } else {
            req.flash( 'success', 'User deleted successfully! ID = ' + req.params.id );
            res.redirect( '/users' );
        }
    } );
} );

module.exports = app