const options = {
  interpreter: 'node@11.1.0',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '1G',
};

module.exports = {
  apps: [{
    name: 'Game API Production',
    script: 'src/api/gameServer/index.js',
    ...options,
    env_production: {
      GAME_SERVER_PORT: 3000,
      NODE_ENV: 'production',
      STEAM_APP_ID: 914160,
      MONGODB_DATABASE: 'zup-arena-server_production',
    },
  }, {
    name: 'Game API Staging',
    script: 'src/api/gameServer/index.js',
    ...options,
    env_production: {
      GAME_SERVER_PORT: 3001,
      NODE_ENV: 'production',
      STEAM_APP_ID: 480,
      MONGODB_DATABASE: 'zup-arena-server_staging',
    },
  }, {
    name: 'Admin API Production',
    script: 'src/api/adminServer/index.js',
    ...options,
    env_production: {
      ADMIN_SERVER_PORT: 3030,
      NODE_ENV: 'production',
      STEAM_APP_ID: 914160,
      MONGODB_DATABASE: 'zup-arena-server_production',
    },
  }, {
    name: 'Admin API Staging',
    script: 'src/api/adminServer/index.js',
    ...options,
    env_production: {
      ADMIN_SERVER_PORT: 3031,
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
      path: '/home/deploy/zup-arena/server',
      ssh_options: ['ForwardAgent=yes'],
      'post-deploy': '. ~/.zshrc ; npm install && cp ~/.env .env && pm2 reload ecosystem.config.js --env production',
    },
  },
};
