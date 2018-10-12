'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let permissions = [
      {
        controller: 'dashboard',
        action: 'index',
        perm: 1
      },
      {
        controller: 'users',
        action: 'index',
        perm: 2
      }
    ]

    let routers = [
        'users/add',
        'users/detail',
        'users/edit',
        'users/delete',
        
        'roles',
        'roles/add',
        'roles/edit',
        'roles/detail',
        'roles/delete',
        
        'perms',
        
        'products',
        'products/add',
        'products/edit',
        'products/detail',
        'products/delete',
        
        'departements',
        'departements/add',
        'departements/edit',
        'departements/detail',
        'departements/delete',
        
        'jobs',
        'jobs/add',
        'jobs/edit',
        'jobs/detail',
        'jobs/delete',

        'audit',

        'reports'
    ]

    routers.forEach( router => {
      router = router.split('/')
      let perm = {
        controller: router[0],
        action: router[1] ? router[1] : 'index',
        perm: 1 << permissions.length
      }
      permissions.push(perm)
    })

    
    return queryInterface.bulkInsert('users_roles_permissions', permissions, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users_roles_permissions', null, {});
  }
};
