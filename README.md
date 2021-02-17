# parse-server-queue

Easy-peasy parse-dashboard-compatible queue for parse-server with mongodb.

* horizontal scalable
* easy drop-in replacement (no need to install rabbitmq etc) thanks to mongodb's `findOneAndUpdate()`
* manageable through parse-dashboard UI (queues show up)
* very powerful in combination with parse's ACL & **LiveQuery** pub/sub feature.

```javascript
const Parse = require('parse/node');
const ParseQ = require('./ParseQ')(Parse,Q)
const client = new mongodb.MongoClient(url, { useNewUrlParser: true,useUnifiedTopology:true })

client.connect( async (err) => {
  const db = client.db('test')
  
  const queue = await ParseQ.get(db,'Q_email')
    
  queue.add('Hello, World!', (err, id) => {
   	// Message with payload 'Hello, World!' added.
  	// 'id' is returned, useful for logging.
  })

  queue.get((err, msg) => {
  	console.log('msg.id=' + msg.id)
   	console.log('msg.ack=' + msg.ack)
   	console.log('msg.payload=' + msg.payload) // 'Hello, World!'
   	console.log('msg.tries=' + msg.tries)
  }) 
 
})
```
