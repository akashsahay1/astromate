module.exports = {
  apps: [
    {
      name: 'astromate-backend',
      script: 'server.js',
      cwd: '/Volumes/Projects/Projects/Astromate/astromate/admin',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 4001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
    },
  ],
};
