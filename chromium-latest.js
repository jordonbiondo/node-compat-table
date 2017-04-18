
const data = { master: 'client.v8.fyi', builder: 'V8 - node.js integration', limit: 10 }
const headers = { Accept: 'application/prpc; encoding=binary', 'Content-Type': 'application/json' }
const fail = () => { throw new Error('Valid build not found') }

// find the url to the latest successful build

require('get-then')('https://luci-milo.appspot.com/prpc/milo.Buildbot/GetBuildbotBuildsJSON', headers, data)
.then(
  // dissect the icky binary format
  (data) => data.toString('utf8', 8).split(/\n[^{]+/)
)
.then((builds) => builds[builds.findIndex((build) => !build.includes('Failure'))] || fail())
.then(JSON.parse)
.then((latest) =>
  latest && latest.steps.find((step) => step.name === "Archive link")
)
.then((archive_step) =>
  archive_step && archive_step.urls.download
)
.then(console.log)
//.then((url) => process.stdout.write(url))
.catch((e) => {
  console.error(String(e))
  process.exit(99)
})
