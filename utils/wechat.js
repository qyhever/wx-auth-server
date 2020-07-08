const { promisify } = require('util')
const client = require('@/database/redis')
const hgetallAsync = promisify(client.hgetall).bind(client)
const hmsetAsync = promisify(client.hmset).bind(client)

const COMMON_ACCESS_TOKEN = 'wechat-common-access-token'
const WEB_ACCESS_TOKEN = 'wechat-web-access-token'
const JSAPI_TICKET = 'wechat-jsapi-ticket'

async function getAccessToken() {
  return hgetallAsync(COMMON_ACCESS_TOKEN)
}
async function saveAccessToken(data) {
  await hmsetAsync(COMMON_ACCESS_TOKEN, data)
}
async function getJsapiTicket() {
  return hgetallAsync(JSAPI_TICKET)
}
async function saveJsapiTicket(data) {
  await hmsetAsync(JSAPI_TICKET, data)
}
async function getWebAccessToken() {
  return hgetallAsync(WEB_ACCESS_TOKEN)
}
async function saveWebAccessToken(data) {
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
