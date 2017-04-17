
function mongooseAdvancedHook(schema, options) {

	/* pre create */
	schema.preCreate = (callback) => {
		schema.preCreateCallbacks = schema.preCreateCallbacks || []
		schema.preCreateCallbacks.push(callback)
	}

	/* post create */
	schema.postCreate = (callback) => {
		schema.postCreateCallbacks = schema.postCreateCallbacks || []
		schema.postCreateCallbacks.push(callback)
	}

	/* pre update */
	schema.preUpdate = (callback) => {
		schema.preUpdateCallbacks = schema.preUpdateCallbacks || []
		schema.preUpdateCallbacks.push(callback)
	}

	/* post update */
	schema.postUpdate = (callback) => {
		schema.postUpdateCallbacks = schema.postUpdateCallbacks || []
		schema.postUpdateCallbacks.push(callback)
	}

	/* pre delete */
	schema.preDelete = (callback) => {
		schema.preDeleteCallbacks = schema.preDeleteCallbacks || []
		schema.preDeleteCallbacks.push(callback)
	}

	/* post delete */
	schema.postDelete = (callback) => {
		schema.postDeleteCallbacks = schema.postDeleteCallbacks || []
		schema.postDeleteCallbacks.push(callback)
	}
  
  	schema.pre('save', function (next) {
    	this._wasNew = this.isNew
    	if (this.isNew) {
    		schema.preCreateCallbacks.map((f) =>  f(this))
    	}
    	else {
    		schema.preUpdateCallbacks.map((f) =>  f(this))
    	}
    	next()
  	})

  	schema.post('save', function (doc) {
    	if (this._wasNew) {
    		schema.postCreateCallbacks.map((f) => f(doc))
    	}
    	else {
    		schema.postUpdateCallbacks.map((f) =>  f(doc))
    	}
  	})

	schema.pre('update', function (next) {
    	this.constructor.findOne({_id: this._conditions._id})
        .then((obj) => {
            schema.preUpdateCallbacks.map((f) =>  f(obj))
            next()
        })
        .catch((err) => {
        	next()
        })
  	})

  	schema.post('update', function(error, doc, next){
  		this.findOne({_id: this._conditions._id})
        .then((obj) => {
            schema.postUpdateCallbacks.map((f) =>  f(obj))
            next()
        })
        .catch((err) => {
        	next()
        })
  	})

  	schema.pre('remove', function(next) {
  		schema.preDeleteCallbacks.map((f) => f(next))
	})

  	schema.post('remove', function(doc) {
  		schema.postDeleteCallbacks.map((f) => f(doc))
	})
}

module.exports = mongooseAdvancedHook