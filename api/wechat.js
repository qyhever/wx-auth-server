const axios = require('axios')
const appid = 'wxd38736f30b1d6669' // 测试号 appid，订阅号没有网页授权权限
const secret = 'cf3f2dcd023a252c155d8b38ea1d1c39' // 测试号 appsecret
const config = global.config

// 通过 code 获取 网页授权 access_token
async function fetchWebAccessTokenByCode(code) {
	const params = {
		appid,
		secret,
		code,
		grant_type: 'authorization_code'
	}
	const url = 'https://api.weixin.qq.com/sns/oauth2/access_token'
	const res = await axios.get(url, { params })
	const response = res.data
	const now = +new Date()
	// expires_in: 默认 7200s，这里提前 60s 好做更新
	response.expires_in = now + (response.expires_in - 60) * 1000
	console.log('接口获取 web access_token response', response)
	return response
}

// 验证网页授权 access_token 有效性
// async function validWebAccessToken(data, openId) {
// 	if (!data || !data.access_token) {
// 		return false
// 	}
// 	const url = 'https://api.weixin.qq.com/sns/auth'
// 	const params = {
// 		access_token: data.access_token,
// 		openid: openId
// 	}
// 	// 调用接口 验证 web access_token 有效性
// 	const res = await axios.get(url, { params })
// 	const response = res.data
// 	console.log('验证结果 web access_token response', response)
// 	// errcode === 0，验证通过
// 	return response.errcode === 0
// }

function validWebAccessToken(data) {
	if (!data || !data.access_token || !data.expires_in) {
		return false
	}
	const { expires_in } = data
	const now = +new Date()

	return now < expires_in
}

// 刷新网页授权 access_token
async function refreshWebAccessToken(refresh_token) {
	const url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token'
	const params = {
		appid,
		grant_type: 'refresh_token',
		refresh_token
	}
	const res = await axios.get(url, { params })
	return res.data
}

// 获取用户基本信息
function getUserInfo({access_token, openid}) {
	const params = {
		access_token,
		openid,
		lang: 'zh_CN'
	}
	const url = 'https://api.weixin.qq.com/sns/userinfo'
	return axios.get(url, { params })
}

// 获取普通 access_token
async function fetchAccessToken() {
	const url = 'https://api.weixin.qq.com/cgi-bin/token'
	const params = {
		grant_type: 'client_credential',
		// appid,
		// secret
		appid: config.wechat.appid,
		secret: config.wechat.secret
	}
	const res = await axios.get(url, { params })
	const response = res.data
	const now = +new Date()
	// expires_in: 默认 7200s，这里提前 60s 好做更新
	response.expires_in = now + (response.expires_in - 60) * 1000
	console.log('接口获取 基础 access_token response', response)
	return response
}

// 验证普通 access_token 是否过期
function validAccessToken(data) {
	if (!data || !data.access_token || !data.expires_in) {
		return false
	}

	const { expires_in } = data
	const now = +new Date()

	return now < expires_in
}

// 通过 普通 access_token 获取 jaspi_ticket
async function fetchJsapiTicket(access_token) {
	const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
	const params = {
		access_token,
		type: 'jsapi'
	}
	const res = await axios.get(url, { params })
	const response = res.data
	const now = +new Date()
	// expires_in: 默认 7200s，这里提前 60s 好做更新
	response.expires_in = now + (response.expires_in - 60) * 1000
	console.log('接口获取 jsapi_ticket response', response)
	return response
}

// 验证 ticket 是否过期
function validJsapiTicket(data) {
	if (!data || !data.ticket || !data.expires_in) {
		return false
	}

	const { expires_in } = data
	const now = +new Date()

	return now < expires_in
}

module.exports = {
	appid,
	fetchWebAccessTokenByCode,
	validWebAccessToken,
	refreshWebAccessToken,
	getUserInfo,
	fetchAccessToken,
	validAccessToken,
	fetchJsapiTicket,
	validJsapiTicket
}
