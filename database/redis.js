const redis = require('redis')
const config = global.config.redis

const client = redis.createClient({
	host: config.host,
	port: config.port
})

client.auth(config.password)

client.on('connect', () => {
  console.log('redis connect success!')
})

client.on('error', err => {
  console.log('redis err: ' + err)
})

module.exports = client
