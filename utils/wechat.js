const { promisify } = require('util')
const client = require('@/database/redis')
const hgetallAsync = promisify(client.hgetall).bind(client)
const hmsetAsync = promisify(client.hmset).bind(client)
const delAsync = promisify(client.del).bind(client)

const COMMON_ACCESS_TOKEN = 'wechat-common-access-token'
const WEB_ACCESS_TOKEN = 'wechat-web-access-token'
const JSAPI_TICKET = 'wechat-jsapi-ticket'
// delAsync(COMMON_ACCESS_TOKEN).then(console.log)
// delAsync(WEB_ACCESS_TOKEN).then(console.log)
// delAsync(JSAPI_TICKET).then(console.log)
getAccessToken().then(res => console.log('AccessToken', res))
getJsapiTicket().then(res => console.log('Ticket', res))
getWebAccessToken().then(res => console.log('WebAccessToken', res))
async function getAccessToken() {
  return hgetallAsync(COMMON_ACCESS_TOKEN)
}
async function saveAccessToken(data) {
  if (!data || !data.access_token || !data.expires_in) return
  await hmsetAsync(COMMON_ACCESS_TOKEN, data)
}
async function getJsapiTicket() {
  return hgetallAsync(JSAPI_TICKET)
}
async function saveJsapiTicket(data) {
  if (!data || !data.ticket || !data.expires_in) return
  await hmsetAsync(JSAPI_TICKET, data)
}
async function getWebAccessToken() {
  return hgetallAsync(WEB_ACCESS_TOKEN)
}
async function saveWebAccessToken(data) {
  if (!data || !data.access_token || !data.expires_in) return
  await hmsetAsync(WEB_ACCESS_TOKEN, data)
}

module.exports  ={
  getAccessToken,
  saveAccessToken,
  getJsapiTicket,
  saveJsapiTicket,
  getWebAccessToken,
  saveWebAccessToken
}
