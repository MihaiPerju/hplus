import Users from '../collection';

export default Users.createNamedQuery('listClients', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    clientName: 1,
    firstName: 1,
    lastName: 1,
    email: 1
});