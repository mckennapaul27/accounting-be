// date,
// email,
// account == bank account
// amount,
// currency,
// liabilityAccount == liability account
module.exports = {
    async afterCreate(data) {
        const id = data.result.id; // id of cashback-payment
        const { liabilityAccount } = data.params.data;
        const cashbackPayment = await strapi.entityService.findOne(
            'api::cashback-payment.cashback-payment',
            id,
            {
                populate: '*',
            }
        );
        const account = await strapi.entityService.findOne(
            'api::account.account',
            cashbackPayment.account.id
        );
        await strapi.entityService.update('api::account.account', account.id, {
            data: {
                balance: account.balance - cashbackPayment.amount,
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
                        balance: liability.balance - cashbackPayment.amount,
                    },
                }
            );
        }
    },
};
