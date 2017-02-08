import { Model } from 'objection';
import omit from 'lodash/omit';

function getFormattedDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export default class ModelBase extends Model {
  $beforeInsert() {
    return new Promise((resolve, reject) => {
      if (this.constructor.hasTimestamps) {
        this.createdAt = getFormattedDateTime();
        this.updatedAt = getFormattedDateTime();
      }

      resolve();
    });
  }

  $beforeUpdate() {
    return new Promise((resolve, reject) => {
      if (this.constructor.hasTimestamps) {
        this.updatedAt = getFormattedDateTime();
      }

      resolve();
    });
  }

  $formatJson(json, options) {
    super.$formatJson(json, options);
    return omit(json, this.constructor.hiddenFields || []);
  }
}
