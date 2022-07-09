var fineFree = {
  hexJson: '/assets/js/services.hexjson',
  services: 'https://api.librarydata.uk/services/airtable',
  isFineFree: function (child, adult) {
    return child == 0 && adult == 0
  },

  bar: function () {}
}
