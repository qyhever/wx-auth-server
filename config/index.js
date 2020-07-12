const commonConfig = {
  privateKey: 'this is prevate key',
  wechat: {
    appid: 'xxx',
    secret: 'xxx',
    token: 'xxx'
  }
}

const config = {
  development: {
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: 'xxx'
    }
  },
  production: {
    redis: {
      host: 'xxx',
      port: 6379,
      password: 'xxx'
    }
  }
}[process.env.NODE_ENV]

module.exports = {
  ...commonConfig,
  ...config
}
