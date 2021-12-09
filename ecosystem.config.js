module.exports = {
  apps : [{
    name :'clickhouse-test-backend',
    script: 'dist/src/main.js',
    namespace:'clickhouse-test',
    err_file    : "pm2logs/err.log",
    out_file    : "pm2logs/out.log",
    node_args: "--trace-warnings",
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

};
