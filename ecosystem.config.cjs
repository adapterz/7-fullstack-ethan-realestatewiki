// PM2 실행 시, NODE_ENV 값 주기
module.exports = {
  apps: [
    {
      name: "rewiki-backend-server",
      script: "server/app.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};

// pm2 start ecosystem.config.cjs // NODE_ENV: "development"
// pm2 start ecosystem.config.cjs env-production // NODE_ENV: "production"
