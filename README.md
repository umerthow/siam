# SIAM Proejct
===

Installation:



```
$ cp -rf config.js.example config.js
$ cp config/sequelize.json.example config/sequelize.json
```

Sesuaikan config database pada file sequelize.json, lalu dilanjutkan langkah berikut

```
$ git pull origin master
$ yarn install
$ yarn migrate
$ yarn seed
$ yarn dev
```



default account:

- Administrator
   email: email@email.email
   pass: superadmin

- Staff:
    email: staff@email.email
    pass: superadmin
