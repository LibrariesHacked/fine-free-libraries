var fineFree = {
  hexJson: '/assets/js/services.hexjson',
  services: 'https://api.librarydata.uk/services/airtable',
  isFineFree: function (child, adult) {
    return child == 0 && adult == 0
  },
  formatMoney: function (child, adult, interval) {
    var childFormatted = `£${child} per ${interval.toLowerCase()}`
    var adultFormatted = `£${adult} per ${interval.toLowerCase()}`
    return { child: childFormatted, adult: adultFormatted }
  },
  tableStyle: {
    table: {
      border: '1px solid #ccc'
    },
    th: {
      'background-color': 'rgba(0, 0, 0, 0.1)',
      'border-bottom': '1px solid #ccc'
    },
    td: {}
  }
}
