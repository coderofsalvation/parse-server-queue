# parse-server-queue

Easy-peasy parse-dashboard-compatible queue for parse-server with mongodb.

* horizontal scalable workers
* easy drop-in replacement (no need to install rabbitmq etc) thanks to mongodb's `findOneAndUpdate()`
* manageable through parse-dashboard UI (queues show up)
* very powerful in combination with parse's ACL & **LiveQuery** pub/sub feature.

## Usage 

```
$ git clone https://github.com/coderofsalvation/parse-server-queue
$ cd parse-server-queue
$ npm install 
$ export DATABASE_URI=mongodb://localhost:27017
$ export MASTER_KEY=*** 
$ export APP_ID=myapp
$ export API_KEY_JAVASCRIPT=*** 
$ export SERVER_URL=http://localhost:1337
$ npm start
```

## Documentation

see [index.js](https://github.com/coderofsalvation/parse-server-queue/blob/master/index.js) and [mongodb-queue](http://npmjs.com/mongodb-queue)

```javascript
const Parse = require('parse/node');
const ParseQ = require('./ParseQ')(Parse,Q)
const client = new mongodb.MongoClient(url, { useNewUrlParser: true,useUnifiedTopology:true })

let work = (queue) => {
  done = () => work(queue) // repeat infinitely!
  queue.get((err, msg) => {
	try{
		if( !msg )  return done()
		if( err  )  throw err 
		console.dir(msg)
		console.log('msg.id=' + msg.id)
		console.log('msg.ack=' + msg.ack)
		console.log('msg.payload=' + msg.payload) // 'Hello, World!'
		console.log('msg.tries=' + msg.tries)
		queue.ack( msg.ack, console.error )
		done()
	}catch(e){ 
		console.error(e)
		done()
	}
  }) 
}

client.connect( async (err) => {
  const db = client.db('test')
  
  const queue = await ParseQ.get(db,'Q_email')
    
  queue.add('Hello, World!', (err, id) => {
   	// Message with payload 'Hello, World!' added.
  	// 'id' is returned, useful for logging.
  })

  work(queue)

})
```

## TIP

If you're not using kubernetes/docker-compose e.g., just put add some [multicore-code](https://nodejs.org/api/cluster.html) in there (PROFIT!)
