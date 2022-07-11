var fineFree = {
  hexJson: '/assets/js/services.hexjson',
  services: 'https://api.librarydata.uk/services/airtable',
  isFineFree: function (child, adult) {
    return child == 0 && adult == 0
  },
  formatFines: function (child, adult, interval) {
    var childFormatted = 'Unknown'
    var adultFormatted = 'Unknown'
    if (child && child == 0) childFormatted = 'No fines'
    if (adult && adult == 0) adultFormatted = 'No fines'
    if (child && child > 0) childFormatted = `${this.formatAmount(child)} per ${interval.toLowerCase()}`
    if (adult && adult > 0) adultFormatted = `${this.formatAmount(adult)} per ${interval.toLowerCase()}`
    return { child: childFormatted, adult: adultFormatted }
  },
  formatAmount: function (amount) {
    if (amount < 1) {
      return `${(parseFloat(amount) * 100).toFixed(0)}p`
    } else {
      return `£${parseFloat(amount).toFixed(2)}`
    }
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
