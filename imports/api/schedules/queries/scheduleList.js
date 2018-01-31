import Schedules from '../collection';

export default Schedules.createNamedQuery('listSchedules', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    frequency: 1,
    userIds: 1
});