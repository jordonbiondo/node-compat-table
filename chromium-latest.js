
// find the url to the latest successful build

require('get-then')('https://build.chromium.org/p/client.v8.fyi/json/builders/V8%20-%20node.js%20integration/builds/_all/')
.then(JSON.parse)
.then((data) => {
  for (let n of Object.keys(data).reverse()) {
    if(data[n].text.includes('successful'))
    return data[n]
  }
})
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
