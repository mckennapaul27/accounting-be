// await strapi.entityService.update('api::account.account', account.id, {
//     data: {
//         balance: account.balance + invoice.total,
//     },
// });

module.exports = {
    async afterCreate(data) {
        const id = data.result.id;
        const { liabilityAccount } = data.params.data;
        const bill = await strapi.entityService.findOne('api::bill.bill', id, {
            populate: '*',
        });
        const account = await strapi.entityService.findOne(
            'api::account.account',
            bill.account.id
        );
        await strapi.entityService.update('api::account.account', account.id, {
            data: {
                balance: account.balance + bill.total,
            },
        });
        if (liabilityAccount) {
            const liability = await strapi.entityService.findOne(
                'api::account.account',
                liabilityAccount
            );
            await strapi.entityService.update(
                'api::account.account',
                liability.id,
                {
                    data: {
                        balance: liability.balance
                            ? liability.balance - bill.total
                            : 0 + bill.total,
                    },
                }
            );
        }
    },
};

// async afterCreate(data) {
//     const id = data.result.id;
//     const bill = await strapi.db.query('api::bill.bill').findOne({
//         select: ['id', 'total', 'totalGBP', 'status'],
//         where: { id },
//         populate: { account: true },
//     });
//     await strapi.db.query('api::account.account').update({
//         where: { id: bill.account.id },
//         data: {
//             balance: bill.account.balance - bill.totalGBP,
//         },
//     });

// async afterUpdate(data) {
//     const id = data.result.id;
//     const bill = await strapi.db.query('api::bill.bill').findOne({
//         select: ['id', 'total', 'status'],
//         where: { id },
//         populate: { bank_account: true },
//     });

//     if (bill) {
//         if (data.params.data.status === 'Paid') {
//             await strapi.db.query('api::bank-account.bank-account').update({
//                 where: { id: bill.bank_account.id },
//                 data: {
//                     pwmBalance: bill.bank_account.pwmBalance - bill.total,
//                     statementBalance:
//                         bill.bank_account.statementBalance - bill.total,
//                 },
//             });
//         }
//     }
// },
// make one for afterDelete
