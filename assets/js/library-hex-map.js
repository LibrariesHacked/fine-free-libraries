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
      var fine_free = adult_fine === 0 && child_fine === 0
      hexdata.hexes[hexCode].child_fine = child_fine
      hexdata.hexes[hexCode].adult_fine = adult_fine
      hexdata.hexes[hexCode].colour = fine_free ? '#a5d6a7' : '#eceff1'
    }
  })
  hex = new ODI.hexmap(document.getElementById('libraryhexmap'), {
    label: {
      show: true, // Show a label
      clip: true, // Make sure the label is clipped to the hexagon
      // Define a function to format the hex labels
      // It is passed:
      //  * txt - a text string with the hex's name
      //  * attr - an object containing:
      //			.* size - the size in pixels
      //			.* font-size - the font size in pixels
      //			.* x - the horizontal position in pixels
      //			.* y - the vertical position in pixels
      //			.* hex - the hexagon's HexJSON properties
      format: function (txt, attr) {
        var child_fine = attr.hex.child_fine
        var adult_fine = attr.hex.adult_fine
        var fine_free = adult_fine === 0 && child_fine === 0
        var text_class = fine_free ? 'fine-free' : 'fine-paid'
        var data_tippy_content = child_fine
        tspans =
          '<tspan data-tippy-content="' +
          data_tippy_content +
          '" class="hexdata ' +
          text_class +
          '">' +
          (fine_free ? '&check;' : '') +
          '</tspan>'
        return tspans
      }
    },
    hexjson: res[0]
  })

  tippy('#libraryhexmap .hex-cell', {
    trigger: 'click',
    content: reference => reference.getAttribute('title')
  })
})