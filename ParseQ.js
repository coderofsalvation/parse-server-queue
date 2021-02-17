module.exports = (Parse,Q) => ({

	// this function makes sure queue's being visible in parse (dashboard)
	get: async (db,name) => {
		if( name.substr(0,2) != "Q_" ) throw 'queue names should start with Q_: '+name
		let done = () => {
			console.log("found Parse Class: "+name)
			return Q(db, name)
		}
		let schema = new Parse.Schema(name)
		try{
			await schema.get()
			return done()
		}catch(e){
			if( ! String(e).match(' does not exist') )
				console.error(e)
			console.log("creating new (Parse) queue: "+name)
			schema.addString("id")
			schema.addNumber("tries")
			schema.addObject("payload")
			schema.addString("visible")
			schema.addBoolean("deleted")
			schema.addNumber("tries")
			await schema.save() 
			return done()
		}
	}

})
