'use strict';

/**
 * debit service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::debit.debit');
