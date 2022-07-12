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
  },
  estimateFamilyWeeklyFine: function (child, adult, interval) {
    var childNumber = parseFloat(child)
    var adultNumber = parseFloat(adult)
    if (!isNaN(childNumber) && !isNaN(adultNumber)){
      var total = 0;
      if (childNumber > 0) total += (childNumber * 2)
      if (adultNumber > 0) total += (adultNumber * 2)
      if (interval == 'Day') total = (total * 7)
      return total
    } else {
      return null
    }
  },
  exampleCosts: [
    { itemCost: '0.79', itemName: 'a pint of milk for a family to share.', source: 'https://www.water.org.uk/news-item/average-water-and-sewerage-bills-for-england-and-wales-to-fall-by-17-in-2020-21/' },
    { itemCost: '1.00', itemName: 'water bills for a day.', source: 'https://www.water.org.uk/news-item/average-water-and-sewerage-bills-for-england-and-wales-to-fall-by-17-in-2020-21/' },
    { itemCost: '6.58', itemName: 'nappies for a baby to last a week.', source: 'https://www.babiesandchildren.co.uk/baby-nappies-cost/' },
    { itemCost: '11.70', itemName: 'school meals for a child for a week.', source: 'https://www.bigissue.com/news/social-justice/free-school-meals-everything-you-need-to-know/' },
    { itemCost: '13.25', itemName: 'TV licensing costs for a month', source: 'https://www.nimblefins.co.uk/average-uk-household-cost-food' },
    { itemCost: '14.14', itemName: 'food for a family of 4 for a day.', source: 'https://www.nimblefins.co.uk/average-uk-household-cost-food' },
  ]
}
