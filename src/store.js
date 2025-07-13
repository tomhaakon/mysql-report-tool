const Store = require('electron-store').default;

const schema = {
  dbConfig: {
    type: 'object',
    properties: {
      host:     { type: 'string', default: '' },
      user:     { type: 'string', default: '' },
      password: { type: 'string', default: '' },
      database: { type: 'string', default: '' },
    },
    default: {}
  }
};

module.exports = new Store({ schema });

