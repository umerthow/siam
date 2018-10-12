'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    let roles = [
      {
        label: 'Administrator',
        description: '',
        status: 1,
        perms: 0xFFFFFFFFFFFFF,
      },
      {
        label: 'Staff',
        description: '',
        status: 1,
        perms: 3,
      }
    ]
    return  queryInterface.bulkInsert('users_roles', roles, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users_roles', null, {});
  }
};
