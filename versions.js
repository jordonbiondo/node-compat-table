
const versions = require('fs').readFileSync('./.versions').toString().replace(/v/g, '').trim().split('\n')
const prev = { flagged: { data: '' }, unflagged: { data: '' } }

function serialize (v, harmony = '') {
  const data = require(`./results/${v}${harmony}.json`)
  return {
    v8: data._v8,
    data: JSON.stringify(data, (k, v) => /^_/.test(k) ? 0 : v)
  }
}

versions.unshift('nightly')
versions.forEach((v) => {
  const cur = {
    unflagged: serialize(v),
    flagged: serialize(v, '--harmony')
  }

  if (cur.unflagged.data !== prev.unflagged.data || cur.flagged.data !== prev.flagged.data) {
    prev.parent = v
    exports[v] = []
  }
  exports[prev.parent].push({
    version: v,
    engine: 'v8 ' + cur.unflagged.v8
  })
  prev.flagged = cur.flagged
  prev.unflagged = cur.unflagged
})

if (require.main === module) {
  console.log(JSON.stringify(exports, null, 2))
}
