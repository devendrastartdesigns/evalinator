const  config = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');


const  sql = require('mssql');

async  function  getUsers() {
  try {
    let  pool = await  sql.connect(config);
    let  users = await  pool.request().query("SELECT * from AspNetUsers");
    return  users.recordsets;
  }
  catch (error) {
    return error;
  }
}

async  function  getUser(userId) {
  try {
    let  pool = await  sql.connect(config);
    let  user = await  pool.request()
    .input('input_parameter', sql.Int, userId)
    .query("SELECT * from AspNetUsers where Id = @input_parameter");
    return  user.recordsets;
  }
  catch (error) {
    return error;
  }
}

async  function  getUserByEmail(email) {
    try {
      let  pool = await  sql.connect(config);
      let  user = await  pool.request()
      .input('input_parameter', sql.NVarChar, email)
      .query("SELECT * from AspNetUsers where Email = @input_parameter");

      if(user.recordsets[0].length){
          return user.recordsets[0][0];
      }
      return false;
    }
    catch (error) {
        return error;
    }
  }


async  function  addUser(user) {
  try {
    const userId = uuidv4();
    let  pool = await  sql.connect(config);
    let  request  = await  pool.request()
    .input('Id', sql.NVarChar, userId)
    .input('Email', sql.NVarChar, user.Email)
    .input('EmailConfirmed', sql.NVarChar, 0)
    .input('PasswordHash', sql.NVarChar, user.PasswordHash)
    .input('UserName', sql.NVarChar, user.UserName)
    .input('FirstName', sql.NVarChar, user.FirstName)
    .input('LastName', sql.NVarChar, user.LastName)
    .input('PhoneNumberConfirmed', sql.NVarChar, 0)
    .input('TwoFactorEnabled', sql.NVarChar, 0)
    .input('LockoutEnabled', sql.NVarChar, 1)
    .input('AccessFailedCount', sql.NVarChar, 0)
    .query('insert into AspNetUsers (Id,Email,EmailConfirmed,PasswordHash,UserName,FirstName,LastName,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEnabled,AccessFailedCount) values (@Id,@Email,@EmailConfirmed,@PasswordHash,@UserName,@FirstName,@LastName,@PhoneNumberConfirmed,@TwoFactorEnabled,@LockoutEnabled,@AccessFailedCount)', (err, result) => {
        if (err) {
            if (err) throw err;
        }
        return userId;
    })
  }
  catch (error) {
    return error;
  }
}

module.exports = {
  getUsers:  getUsers,
  getUser:  getUser,
  getUserByEmail:  getUserByEmail,
  addUser:  addUser
}