import { Model } from 'objection';
import lodash from 'lodash';
import { BadRequest } from '../lib/errors';

function getFormattedDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export default class ModelBase extends Model {
  validate(options) {
    if (!this.constructor.schema) {
      console.warn('Provide a schema for validations.');
      return Promise.resolve();
    }

    return Promise.resolve()
      .then(stripDisallowedFields.bind(this, options))
      .then(verifyRequiredFields.bind(this, options))
      .then(formatFields.bind(this, options))
      .then(validateFields.bind(this, options));
  }

  async $beforeInsert(options) {
    if (this.constructor.hasTimestamps) {
      this.createdAt = getFormattedDateTime();
      this.updatedAt = getFormattedDateTime();
    }

    const opts = Object.assign({ inserting: true, updating: false }, options);
    await this.validate(opts);
  }

  async $beforeUpdate(options) {
    if (this.constructor.hasTimestamps) {
      this.updatedAt = getFormattedDateTime();
    }

    const opts = Object.assign({ inserting: false, updating: true }, options);
    await this.validate(opts);
  }

  $formatJson(json, options) {
    super.$formatJson(json, options);
    return lodash.omit(json, this.constructor.hiddenFields || []);
  }
}

/**
 * Removes all invalid keys on a Model
 * @param  {object} options
 */
function stripDisallowedFields(options) {
  const fields = lodash.keys(this);
  const whitelist = lodash.keys(this.constructor.schema);

  fields.forEach((field) => {
    if (!whitelist.includes(field)) {
      delete this[field];
    }
  });
}

function verifyRequiredFields(options) {
  if (options.updating) {
    return;
  }

  const missing = [];
  for (let [field, rule] of Object.entries(this.constructor.schema)) {
    if (!this[field] && rule.required) {
      missing.push([field, 'is required']);
    }
  }

  if (missing.length) {
    throw new BadRequest(lodash.fromPairs(missing));
  }
}

function formatFields(options) {
  // lowercase .. uppercase .. etc
  return this;
}

function validateFields(options) {
  let validations = lodash.map(this, (value, field) => {
    const rule = this.constructor.schema[field];

    if (!rule.validator || typeof rule.validator !== 'function') {
      return Promise.resolve();
    }

    const validation = rule.validator.call(this, value, options);

    if (validation instanceof Promise) {
     return validation;
    }

    if (validation) {
      return Promise.resolve(value);
    }

    const message = (rule.message && rule.message.replace(/{VALUE}/g, value)) || `${field} is not valid.`;
    throw new BadRequest({
      [field]: message,
    });
  });

  return Promise.all(validations);
}
