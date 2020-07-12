module.exports = {
  apps : [{
    name: 'wx-auth-server-refactor',
    script: './bin/www',
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : ['47.105.103.118'],
      port: '22',
      ref  : 'origin/master',
      repo : 'git@gitee.com:qinyhquery/wx-auth-server-refactor.git',
      path : '/usr/local/src/node-project/wx-auth-server-refactor',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'git pull && sh deploy.sh',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};