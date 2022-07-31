module.exports = {
    async afterCreate(data) {
        const id = data.result.id;

        const { invoiceId, invoiceStatus, type } = data.params.data;
        if (invoiceId) {
            // if paying an invoice to an 'account'
            const credit = await strapi.entityService.findOne(
                'api::credit.credit',
                id,
                { populate: '*' }
            );
            const invoice = await strapi.entityService.findOne(
                'api::invoice.invoice',
                invoiceId
            );
            const account = await strapi.entityService.findOne(
                'api::account.account',
                credit.account.id
            );
            await strapi.entityService.update(
                'api::account.account',
                account.id,
                {
                    data: {
                        balance: account.balance + invoice.total,
                    },
                }
            );
            await strapi.entityService.update(
                'api::invoice.invoice',
                invoice.id,
                {
                    data: {
                        status: 'Paid',
                    },
                }
            );
        } else if (type === 'equity-transfer') {
            const accountToAdjust = await strapi.entityService.findOne(
                'api::account.account',
                data.params.data.adjustAccount
            );
            const accountToBelong = await strapi.entityService.findOne(
                'api::account.account',
                data.params.data.account
            );
            await strapi.entityService.update(
                'api::account.account',
                accountToAdjust.id,
                {
                    data: {
                        balance:
                            accountToAdjust.balance + data.params.data.amount,
                    },
                }
            );
            await strapi.entityService.update(
                'api::account.account',
                accountToBelong.id,
                {
                    data: {
                        balance:
                            accountToBelong.balance + data.params.data.amount,
                    },
                }
            );
        }
    },
};
