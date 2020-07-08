const router = require('koa-router')()

const IndexController = require('@/controllers/index.controller')
const instance = new IndexController()

router.get('/webAuth', instance.webAuth)
router.post('/userInfo', instance.userInfo)
router.get('/apiAuth', instance.apiAuth)

module.exports = router
