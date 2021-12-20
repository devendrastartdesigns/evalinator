const  config = {
    user: process.env.DB_USER, // sql user
    password: process.env.DB_PASSWORD, //sql user password
    server:  process.env.DB_SERVER, // if it does not work try- localhost
    database: process.env.DB_NAME,
    options: {
      trustedconnection:  true,
      enableArithAbort:  true,
      instancename:  process.env.DB_INSTANCE  // SQL Server instance name
    },
    port:  parseInt(process.env.DB_PORT)
  }
module.exports = config;