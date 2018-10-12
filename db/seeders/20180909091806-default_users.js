'use strict';
const bcrypt = require('bcrypt');
const faker = require('faker');

module.exports = {

  up: (queryInterface, Sequelize) => {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync("superadmin", salt)

    let users = [{
        first_name: 'Admin',
        last_name: 'admin',
        email: 'email@email.email',
        phone: '0000000',
        password: hash.toString(),
        salt: salt.toString(),
        role_id: 1,
    }]
    
    users.push({
      first_name: 'Staff',
      last_name: 'staff',
      email: 'staff@email.email',
      phone: '0000000',
      password: hash.toString(),
      salt: salt.toString(),
      role_id: 2,
    })

    for(let i =1 ; i<=30; i++) {
      users.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        phone: '0000000',
        password: hash.toString(),
        salt: salt.toString(),
        role_id: 1,
      })
    }

    return  queryInterface.bulkInsert('users_users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users_users', null, {});
  }

};
