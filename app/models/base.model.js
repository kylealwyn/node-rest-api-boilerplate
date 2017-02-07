import lodash, { extend } from 'lodash';

export default (bookshelf) => {
  let BaseModel = bookshelf.Model.extend({
    initialize() {
      this.on('saving', this.validate);
    },

    validate(model, attrs, options) {
      console.log(attrs);
      return Promise.resolve(null)
        .then(verifyRequiredAttributes.bind(this, options))
        .then(runValidations.bind(this, options));
    },
  }, {
    /**
     * Select a collection based on a query
     * @param {Object} [query]
     * @param {Object} [options] Options used of model.fetchAll
     * @return {Promise(bookshelf.Collection)} Bookshelf Collection of Models
     */
    findAll(filter, options) {
      return this.forge().where(filter).fetchAll(options);
    },

    /**
     * Select a model based on a query
     * @param {Object} [query]
     * @param {Object} [options] Options for model.fetch
     * @param {Boolean} [options.require=false]
     * @return {Promise(bookshelf.Model)}
     */
    findOne(query, options) {
      const opts = Object.assign({ require: true }, options);
      return this.forge(query).fetch(opts);
    },

    /**
     * Find a model based on it's ID
     * @param {String} id The model's ID
     * @param {Object} [options] Options used of model.fetch
     * @return {Promise(bookshelf.Model)}
     */
    findById(id, options) {
      return this.findOne({ [this.prototype.idAttribute]: id }, options);
    },

    /**
     * Insert a model based on data
     * @param {Object} data
     * @param {Object} [options] Options for model.save
     * @return {Promise(bookshelf.Model)}
     */
    create(data, options) {
      return this.forge(data).save(null, options);
    },

    /**
     * Update a model based on data
     * @param {Object} data
     * @param {Object} options Options for model.fetch and model.save
     * @param {String|Integer} options.id The id of the model to update
     * @param {Boolean} [options.patch=true]
     * @param {Boolean} [options.require=true]
     * @return {Promise(bookshelf.Model)}
     */
    update(data, options) {
      const opts = Object.assign({ patch: true, require: true }, options);

      return this
        .forge({ [this.prototype.idAttribute]: opts.id })
        .fetch(opts)
        .then((model) => model ? model.save(data, opts) : undefined);
    },

    /**
     * Destroy a model by id
     * @param {Object} options
     * @param {String|Integer} options.id The id of the model to destroy
     * @param {Boolean} [options.require=false]
     * @return {Promise(bookshelf.Model)} empty model
     */
    destroy(options) {
      options = extend({ require: true }, options);
      return this.forge({ [this.prototype.idAttribute]: options.id }).destroy(options);
    },

    /**
      * Select a model based on data and insert if not found
      * @param {Object} data
      * @param {Object} [options] Options for model.fetch and model.save
      * @param {Object} [options.defaults] Defaults to apply to a create
      * @return {Promise(bookshelf.Model)} single Model
      */
    findOrCreate(data, options) {
      return this.findOne(data, extend(options, { require: false }))
      .bind(this)
      .then(function(model) {
        let defaults = options && options.defaults;
        return model || this.create(extend(defaults, data), options);
      });
    },

    /**
     * Select a model based on data and update if found, insert if not found
     * @param {Object} selectData Data for select
     * @param {Object} updateData Data for update
     * @param {Object} [options] Options for model.save
     */
    upsert(selectData, updateData, options) {
      return this.findOne(selectData, extend(options, { require: false }))
      .bind(this)
      .then(function(model) {
        return model
          ? model.save(
            updateData,
            extend({ patch: true, method: 'update' }, options)
          )
          : this.create(
            extend(selectData, updateData),
            extend(options, { method: 'insert' })
          );
      });
    },
  });

  return BaseModel;
};

function verifyRequiredAttributes(options) {
  return lodash.reduce(this.rules, (attrs, rule, field) => {
    let value = this.attributes[field];

    if (!value && rule.required) {
      throw new Error(`${field} is required`);
    }

    if (value) {
      attrs[field] = value;
    }

    return attrs;
  }, {});
}

function runValidations(options, attrs) {
  console.log(options, attrs);
  console.log('');
  let validations = lodash.map(attrs, (value, field) => {
    const rule = this.rules[field];

    if (!rule.validator || typeof rule.validator !== 'function') {
      return Promise.resolve();
    }

    const isValid = this.rules[field].validator(value);

    if (isValid instanceof Promise) {
     return isValid;
    }

    if (isValid) {
      return Promise.resolve(value);
    }

    throw new Error(rule.message.replace(/{VALUE}/g, value) || `${field} is not valid.`);
  });

  return Promise.all(validations).then(() => attrs);
}
