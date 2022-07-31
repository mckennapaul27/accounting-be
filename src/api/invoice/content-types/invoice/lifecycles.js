const { ApplicationError } = require('@strapi/utils').errors;

module.exports = {
    // make one for afterUpdate
    async afterCreate(data) {
        const id = data.result.id;
        const invoice = await strapi.db.query('api::invoice.invoice').findOne({
            select: ['id', 'total', 'totalGBP', 'status'],
            where: { id },
            populate: { account: true },
        });
        await strapi.db.query('api::account.account').update({
            where: { id: invoice.account.id },
            data: {
                balance: invoice.account.balance + invoice.totalGBP,
            },
        });
    },
    async afterUpdate(data) {},
    // make one for afterDelete
};
