//  bill: id,
//  billId: id,
//  billStatus: 'Paid',
//  account,
//  date,
//  amount,

module.exports = {
    async afterCreate(data) {
        const id = data.result.id;
        const { billId, billStatus } = data.params.data;
        const debit = await strapi.entityService.findOne(
            'api::debit.debit',
            id,
            { populate: '*' }
        );
        const bill = await strapi.entityService.findOne(
            'api::bill.bill',
            billId
        );
        const account = await strapi.entityService.findOne(
            'api::account.account',
            debit.account.id
        );
        await strapi.entityService.update('api::account.account', account.id, {
            data: {
                balance: account.balance - bill.total,
            },
        });
        await strapi.entityService.update('api::bill.bill', bill.id, {
            data: {
                status: 'Paid',
            },
        });
    },
};
