const fetchHexJson = fetch(`/assets/js/services.hexjson`).then(res =>
  res.json()
)

const fetchServicesData = fetch(
  `https://api.librarydata.uk/services/airtable`
).then(res => res.json())

const allData = Promise.all([fetchHexJson, fetchServicesData])

allData.then(res => {
  var hexdata = res[0]
  var serviceData = res[1]

  Object.keys(hexdata.hexes).forEach(hexCode => {
    var service = serviceData.find(x => x.Code === hexCode)
    if (service) {
      var child_fine = service['Child fine']
      var adult_fine = service['Adult fine']
      hexdata.hexes[hexCode].child_fine = child_fine
      hexdata.hexes[hexCode].adult_fine = adult_fine
      hexdata.hexes[hexCode].colour =
        adult_fine === 0 && child_fine === 0
          ? 'rgb(247, 171, 45)'
          : 'rgb(211,211,211)'
    }
  })
  hex = new ODI.hexmap(document.getElementById('libraryhexmap'), {
    labels: { show: true },
    hexjson: res[0]
  })
})
