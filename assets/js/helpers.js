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
  }
}
