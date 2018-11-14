module.exports = {
  apps: [{
    name: 'API Production',
    script: 'src/server.js',
    interpreter: 'node@11.1.0',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      PORT: 3000,
      NODE_ENV: 'production',
      STEAM_APP_ID: 914160,
      MONGODB_DATABASE: 'zup-arena-server_production',
    },
  }, {
    name: 'API Staging',
    script: 'src/server.js',
    interpreter: 'node@11.1.0',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      PORT: 3001,
      NODE_ENV: 'production',
      STEAM_APP_ID: 480,
      MONGODB_DATABASE: 'zup-arena-server_staging',
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
      'post-deploy': 'export NVM_DIR="$HOME/.nvm" && npm install && cp ~/.env .env && pm2 reload ecosystem.config.js --env production',
    },
  },
};
