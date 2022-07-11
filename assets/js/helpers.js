var fineFree = {
  hexJson: '/assets/js/services.hexjson',
  services: 'https://api.librarydata.uk/services/airtable',
  isFineFree: function (child, adult) {
    return child == 0 && adult == 0
  },
  formatFines: function (child, adult, interval) {
    var childFormatted = 'Unknown'
    var adultFormatted = 'Unknown'
    var childNumber = parseFloat(child)
    var adultNumber = parseFloat(adult)
    if (!isNaN(childNumber) && childNumber == 0) childFormatted = 'No'
    if (!isNaN(childNumber) && childNumber > 0)
      childFormatted = `${this.formatAmount(
        childNumber
      )} per ${interval.toLowerCase()}`

    if (!isNaN(adultNumber) && adultNumber == 0) adultFormatted = 'No'
    if (!isNaN(adultNumber) && adultNumber > 0)
      adultFormatted = `${this.formatAmount(
        adultNumber
      )} per ${interval.toLowerCase()}`
    return { child: childFormatted, adult: adultFormatted }
  },
  formatAmount: function (amount) {
    if (amount < 1) {
      return `${(amount * 100).toFixed(0)}p`
    } else {
      return `£${amount.toFixed(2)}`
    }
  }
}
