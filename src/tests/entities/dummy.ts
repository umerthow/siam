export let permDummy = {
    id: 1,
    label: "Permission label",
    perm: "0xff",
    createdAt: 0,
    updatedAt: 0
}

export let roleDummy = {
    id: "1",
    label: 'staff',
    status: false,
    createdAt: 0,
    updatedAt: 0
}

export let userDummy = {
    id           : 1,
    first_name   : 'first-name',
    last_name    : 'last-name',
    email        : 'name-1@email.test',
    password     : 'password',
    group        : { id: 1, name: 'staff' },
    salt         : 'salt',
    last_login   : '2018-07-06 00:00:00',
    created_at   : '2018-07-06 00:00:00',
    updated_at   : '2018-07-06 00:00:00'
}