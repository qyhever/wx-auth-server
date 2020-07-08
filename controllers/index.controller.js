const qs = require('querystring')
const cache = require('@/utils/wechat')
const { getResponse } = require('@/utils')

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
		const params = {
			appid,
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
    ctx.body = getResponse(true, { url }, 'ok')
  }
  async userInfo(ctx) {
    ctx.body = {
      success: true
    }
  }
  async apiAuth(ctx) {
    ctx.body = {
      success: true
    }
  }
}

module.exports = IndexController
