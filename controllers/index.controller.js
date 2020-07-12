const sha1 = require('sha1')
const qs = require('querystring')
const cache = require('@/utils/wechat')
const { genResponse } = require('@/utils')
const api = require('@/api/wechat')
const { createParameterError } = global.err
const config = global.config

class IndexController {
  /**
	 * @api {get} /webAuth 微信网页授权
	 * @apiName appAuth
	 * @apiGroup WX
	 * @apiParam {String} pageUrl 当前页面url（不包含#，需 encodeURI 处理）
	 * @apiVersion 0.0.0
	 * @apiUse Error
	 * @apiUse Success
	*/
  async webAuth(ctx) {
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    const redirect_uri = ctx.query.pageUrl
    if (!redirect_uri) {
      throw createParameterError('param pageUrl is required')
    }
		const params = {
			appid: api.appid,
			redirect_uri,
      response_type: 'code',
      // 不弹出授权页面，直接跳转，只能获取用户openid
      // scope: 'snsapi_base', 
      // 弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息
			scope: 'snsapi_userinfo',
			state: 'STATE',
			connect_redirect: 1
		}
		const paramString = qs.stringify(params)
		url = url + '?' + paramString + '#wechat_redirect'
    ctx.body = genResponse(true, { url }, 'ok')
  }
  /**
	 * @api {post} /userInfo 获取用户信息
	 * @apiName userInfo
	 * @apiGroup WX
	 *
	 * @apiParam {String} code 页面search参数code
	 * @apiParam {String} openId 当前用户（第一次进入不传，后面每次都传）
	 *
	 * @apiVersion 0.0.0
	 *
	 * @apiUse Error
	 * @apiUse Success
	*/
  async userInfo(ctx) {
    const { code, openId } = ctx.request.body
    console.log('{ code, openId }', { code, openId })
    if (!code) {
      throw createParameterError('param code is required')
    }
    const response = await fetchWebAccessToken(code, openId)
    const res = await api.getUserInfo(response)
    ctx.body = genResponse(true, res.data, 'ok')
  }
  /**
	 * @api {get} /apiAuth js-sdk 授权
	 * @apiName apiAuth
	 * @apiGroup WX
	 *
	 * @apiParam {String} url 当前页面url（不包含#，需 encodeURIComponent 处理）
	 *
	 * @apiVersion 0.0.0
	 *
	 * @apiUse Error
	 * @apiUse Success
	*/
  async apiAuth(ctx) {
		const url = ctx.query.url
    if (!url) {
      throw createParameterError('param url is required')
    }
    // 获取 基础 access_token
    const { access_token } = await fetchBaseAccessToken()
    // 获取 ticket
    const ticketData = await fetchJsapiTicket(access_token)
    const ticket = ticketData.ticket
    // 时间戳，10 位数时间戳
    const timestamp = Number(String(+new Date()).slice(0, -3))
    // 随机字符串
    const noncestr = Math.random().toString(16).substring(2)
    let string = 'jsapi_ticket=' + ticket
		string += '&noncestr=' + noncestr
		string += '&timestamp=' + timestamp
		string += '&url=' + url
		const signature = sha1(string)
		console.log('签名参数字符串', string)
    console.log('生成签名', signature)
    const result = {
      appId: config.wechat.appid,
      noncestr,
      timestamp,
      signature
    }
    ctx.body = genResponse(true, result, 'ok')
  }
}
// 获取 web access_token
async function fetchWebAccessToken(code, openId) {
  let data = null
  try {
    // 读取本地 网页授权 access_token
    data = await cache.getWebAccessToken()
    console.log('redis web access_token ', data)
    // 验证 web access_token 合法性
    if (!api.validWebAccessToken(data)) {
      console.log('redis web access_token 验证失败')
      data = await api.fetchWebAccessTokenByCode(code)
    }
    // if (openId) { // 有 openId，已调用过获取信息接口（前端已缓存）
    //   console.log('有 openId，已调用过获取信息接口（前端已缓存），需要验证')
    //   const isValid = await api.validWebAccessToken(data, openId)
    //   if (!isValid) {
    //     console.log('验证未通过')
    //     if (data && data.refresh_token) {
    //       console.log('有 redis 缓存，将 access_token 刷新')
    //       data = await api.refreshWebAccessToken(data.refresh_token)
    //     } else {
    //       console.log('没有 redis 缓存，通过 code 获取 网页授权 access_token')
    //       data = await api.fetchWebAccessTokenByCode(code)
    //     }
    //   }
    // } else { // 没有 openId（第一次调用），通过 code 获取 网页授权 access_token
    //   console.log('没有 openId（第一次调用），通过 code 获取 网页授权 access_token')
    //   data = await api.fetchWebAccessTokenByCode(code)
    // }
  } catch (err) {
    console.log('读取 redis web access_token 出错', err)
    data = await api.fetchWebAccessTokenByCode(code)
  }
  // 保存到 redis
  await cache.saveWebAccessToken(data)
  return data
}

// 获取 基础 access_token
async function fetchBaseAccessToken() {
  let data = null
  try {
    data = await cache.getAccessToken()
    console.log('redis 基础 access_token ', data)
    // 验证 access_token 合法性
    if (!api.validAccessToken(data)) {
      console.log('redis 基础 access_token 验证失败')
      data = await api.fetchAccessToken()
    }
  } catch (err) {
    console.log('读取 redis 基础 access_token 出错', err)
    data = await api.fetchAccessToken()
  }
  await cache.saveAccessToken(data)
  return data
}
// 获取 js-sdk ticket
async function fetchJsapiTicket(access_token) {
  let data = null
  try {
    data = await cache.getJsapiTicket()
    console.log('redis jsapi_ticket ', data)
    if (!api.validJsapiTicket(data)) {
      console.log('redis jsapi_ticket 验证失败')
      data = await api.fetchJsapiTicket(access_token)
    }
  } catch (err) {
    console.log('读取 redis jsapi_ticket 出错', err)
    data = await api.fetchJsapiTicket(access_token)
  }
  await cache.saveJsapiTicket(data)
  return data
}

module.exports = IndexController
