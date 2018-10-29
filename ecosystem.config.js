module.exports = {
  apps: [{
    name: 'API',
    script: 'src/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      PORT: 80,
      NODE_ENV: 'production',
    },
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: '5.200.53.101',
      ref: 'origin/master',
      repo: 'git@github.com:BabenkoOleg/zup-arena-server.git',
      path: '/home/deploy/zup-arena-server',
      ssh_options: ['ForwardAgent=yes'],
      'post-deploy': 'npm install && cp ~/.env .env && pm2 reload ecosystem.config.js --env production',
    },
  },
};
