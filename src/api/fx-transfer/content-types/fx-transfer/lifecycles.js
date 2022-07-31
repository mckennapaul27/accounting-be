module.exports = {
    async afterCreate(data) {
        const id = data.result.id; // id of cashback-payment
        const {
            date,
            month,
            total,
            totalGBP,
            conversionRate,
            nonGBPAcc,
            currency,
            GBPAcc,
        } = data.params.data;

        const accountToCredit = await strapi.entityService.findOne(
            'api::account.account',
            GBPAcc
        );
        const accountToDebit = await strapi.entityService.findOne(
            'api::account.account',
            nonGBPAcc
        );
        await strapi.entityService.update(
            'api::account.account',
            accountToCredit.id,
            {
                data: {
                    balance: accountToCredit.balance + totalGBP,
                },
            }
        );
        await strapi.entityService.update(
            'api::account.account',
            accountToDebit.id,
            {
                data: {
                    balance: accountToDebit.balance - total,
                },
            }
        );
    },
};
