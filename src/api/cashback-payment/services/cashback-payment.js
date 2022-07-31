'use strict';

/**
 * cashback-payment service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cashback-payment.cashback-payment');
