const commonConfig = {
  privateKey: 'this is prevate key',
  wechat: {
    appid: 'wx3952f869a002c51e',
    secret: '84ebb558dc6bcb187d46d8f381f711f0',
    token: '24a2b38967d62'
  }
}

const config = {
  development: {
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: 'foo'
    }
  },
  production: {
    redis: {
      host: '47.105.103.118',
      port: 6379,
      password: 'foo'
    }
  }
}[process.env.NODE_ENV]

module.exports = {
  ...commonConfig,
  ...config
}
