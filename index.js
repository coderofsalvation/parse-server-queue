var mongodb = require('mongodb')
var Q       = require('mongodb-queue')
const Parse = require('parse/node');
const ParseQ = require('./ParseQ')(Parse,Q)
const url = process.env.DATABASE_URI
console.log(url)
const client = new mongodb.MongoClient(url, { useNewUrlParser: true,useUnifiedTopology:true })

Parse.initialize( process.env.APP_ID, process.env.API_KEY_JAVASCRIPT, process.env.MASTER_KEY )
Parse.serverURL = process.env.SERVER_URL

client.connect( async (err) => {
  const db = client.db('test')
  console.log("connected")
  try{
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
    
  }catch(e){ console.error(e) }
 
})
