const mongooseAdvancedHook = require('../index')
const mongoose  = require('mongoose')
const sinon  	= require('sinon')
const should	= require('should')
const Schema 	= mongoose.Schema


let mongoDB = 'mongodb://' + process.env.TEST_DB_HOST + '/' + process.env.TEST_DB_NAME


mongoose.connect(mongoDB, function(err) {
    if (err) { throw err }
})
mongoose.Promise = global.Promise

describe('Working ?', function( ) {
	let preCreateSpy, preUpdateSpy, preDeleteSpy,
		postCreateSpy, postUpdateSpy, postDeleteSpy

	before(function(done) {
	    const TestSchema = new Schema({
	      	name: String,
	    })

	    TestSchema.plugin(mongooseAdvancedHook)
	    TestModel = mongoose.model('MyModel', TestSchema)
 
	    preCreateSpy	= sinon.spy()
	    postCreateSpy 	= sinon.spy()

	    preUpdateSpy 	= sinon.spy()
	    postUpdateSpy 	= sinon.spy()

	    preDeleteSpy 	= sinon.spy()
	    postDeleteSpy 	= sinon.spy()

	    TestModel.schema.preCreate(preCreateSpy)
	    TestModel.schema.postCreate(postCreateSpy)

	    TestModel.schema.preUpdate(preUpdateSpy)
	    TestModel.schema.postUpdate(postUpdateSpy)

	    TestModel.schema.preDelete(preDeleteSpy)
	    TestModel.schema.postDelete(postDeleteSpy)

	    done()
  	})
	describe('Create Hooks', function() {
		it('call pre hook listeners', function(done) {
	  		let test = new TestModel({
	  			name: 'preCreate'
	  		})
	  		test.save()
	  		.then((doc) => {
	  			doc.should.have.property('name', 'preCreate')
				preCreateSpy.callCount.should.eql(1)
				postCreateSpy.reset()
				done()
	  		})
	  		.catch((err) => {
	  			console.log(err)
	  		})
	  	})
	  	it('call post hook listeners', function(done) {
	  		let test = new TestModel({
	  			name: 'postCreate'
	  		})
	  		test.save()
	  		.then((doc) => {
	  			doc.should.have.property('name', 'postCreate')
				postCreateSpy.callCount.should.eql(1)
				preCreateSpy.reset()
				done()
	  		})
	  		.catch((err) => {
	  			console.log(err)
	  		})
	  	})
	})

	describe('Update Hooks', function() {
		it('call pre hook listeners', function(done) {
	  		let test = new TestModel({
	  			name: 'preUpdate'
	  		})
	  		test.save()
	  		.then((doc) => {
	  			doc.update({name: 'updated Hook'})
	  			.then((obj) => {
	  				obj.should.have.property('ok', 1)
					preUpdateSpy.callCount.should.eql(1)
					done()
	  			})
	  			.catch((err) => {
	  				console.log(err)
	  			})
	  			
	  		})
	  		.catch((err) => {
	  			console.log(err)
	  		})
	  	})
	  	it('call post hook listeners', function(done) {
	  		let test = new TestModel({
	  			name: 'postUpdate'
	  		})
	  		test.save()
	  		.then((doc) => {
	  			doc.update({name: 'updated Hook'})
	  			.then((obj) => {
	  				obj.should.have.property('ok', 1)
					postUpdateSpy.callCount.should.eql(1)
					done()
	  			})
	  			.catch((err) => {
	  				console.log(err)
	  			})
	  			
	  		})
	  		.catch((err) => {
	  			console.log(err)
	  		})
	  	})
	})
})