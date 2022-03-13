module.exports = {
  apps: [
    {
      name: 'thesis-api',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'yarn',
      args: 'start',
    },
  ],
}
