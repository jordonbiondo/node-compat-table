var jade = require('jade')
var utils = require('./utils.js');
var $escape = utils.$escape
var $get = utils.$get
var testers = utils.objectifiedTesters();

var results = {
  v8: require(`./results/v8/nightly.json`),
  chakracore: require(`./results/chakracore/nightly.json`)
}

var headers = {
  v8: {
    super: 'v8',
    version: results.v8._version.replace(/-.*/, ''),
    includes: [{
      version: results.v8._version.replace(/-.*/, ''),
      engine: results.v8._engine
    }]
  },
  chakracore: {
    super: 'Chakra',
    version: results.v8._version.replace(/-.*/, ''),
    includes: [{
      version: results.chakracore._version.replace(/-.*/, ''),
      engine: results.chakracore._engine
    }]
  }
}

var html = jade.renderFile('index.jade', {
  pretty: true,
  headers: headers,
  testers: testers,
  results: function (nodeVersion, esVersion, path) {
    var result = $get(results[nodeVersion], esVersion, path)
    if (result === undefined) return ''

    var title = result === true ? 'Test passed' : typeof result === 'string' ? result : 'Test failed'
    result = result === true ? 'Yes' : typeof result === 'string' ? 'Error' : 'No'
    return `<div class="${result}" title="${$escape(title)}">${result}</div>`
  },
  requiresFlag: () => false,
  percent: function (nodeVersion, esVersion) {
    var data = $get(results[nodeVersion], esVersion)
    return data ? Math.floor(data._percent * 100) : ''
  }
})

require('fs').writeFileSync('./nightly.html', html)
