'use strict';

/**
 * dividend service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dividend.dividend');
