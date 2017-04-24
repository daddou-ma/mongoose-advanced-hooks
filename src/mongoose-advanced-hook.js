
function mongooseAdvancedHook(schema, options) {

  schema.preCreateCallbacks  = []
  schema.postCreateCallbacks = []
  schema.preUpdateCallbacks  = []
  schema.postUpdateCallbacks = []
  schema.preDeleteCallbacks  = []
  schema.postDeleteCallbacks = []

	/* pre create */
	schema.preCreate = (callback) => {
		schema.preCreateCallbacks.push(callback)
	}

	/* post create */
	schema.postCreate = (callback) => {
		schema.postCreateCallbacks.push(callback)
	}

	/* pre update */
	schema.preUpdate = (callback) => {
		schema.preUpdateCallbacks.push(callback)
	}

	/* post update */
	schema.postUpdate = (callback) => {
		schema.postUpdateCallbacks.push(callback)
	}

	/* pre delete */
	schema.preDelete = (callback) => {
		schema.preDeleteCallbacks.push(callback)
	}

	/* post delete */
	schema.postDelete = (callback) => {
		schema.postDeleteCallbacks.push(callback)
	}
  
	schema.pre('save', function (next) {
  	this._wasNew = this.isNew
  	if (this.isNew) {
      let start = mapToNext(schema.preCreateCallbacks, this, {})
      start()
  	}
  	else {
      let start = mapToNext(schema.preUpdateCallbacks, this, {})
      start()
  	}
  	next()
	})

	schema.post('save', function (doc) {
  	if (this._wasNew) {
      let start = mapToNext(schema.postCreateCallbacks, doc, {})
      start()
  	}
  	else {
  		let start = mapToNext(schema.postUpdateCallbacks, doc, {})
      start()
  	}
	})

  schema.pre('update', function (next) {
  	this.findOne({_id: this._conditions._id}, (err, doc) => {
      if (err) {
        next()
        return
      }

      let start = mapToNext(schema.preUpdateCallbacks, doc, this)
      start()

      next()
    })
	})

	schema.post('update', function(){
    this.findOne({_id: this._conditions._id}, (err, doc) => {
      if (err) {
        return
      }
      
      let start = mapToNext(schema.postUpdateCallbacks, doc, this)
      start()
    })
	})

  schema.pre('remove', function(next) {
    let start = mapToNext(schema.preDeleteCallbacks, this, {})
    start()
    next()
	})

  schema.post('remove', function(doc) {
  	let start = mapToNext(schema.postDeleteCallbacks, this, {})
    start()
	})


  /* Adding next logic */

  function mapToNext(callbacks, doc, query) {
    if (callbacks.length == 0) {
      return function() {}
    }
    let lastIndex = callbacks.length - 1
    callbacks[lastIndex] = callbacks[lastIndex].bind(this, function() {}, doc, query)

    for(let i = lastIndex - 1; i >= 0; i--) {
      callbacks[i] = link(callbacks[i], callbacks[i + 1], doc, query)
    }

    return callbacks[0]
  }

  function link(a, b, doc, query) {
    return a.bind(this, b, doc, query)
  }
}



module.exports = mongooseAdvancedHook