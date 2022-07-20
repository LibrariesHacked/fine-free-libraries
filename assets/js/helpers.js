var fineFree = {
  hexJson: '/assets/js/services.hexjson',
  services: 'https://api.librarydata.uk/services/airtable',
  postcodes: 'https://api-geography.librarydata.uk/rest/postcodes',
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
    if (!isNaN(childNumber) && !isNaN(adultNumber)) {
      var total = 0
      if (childNumber > 0) total += childNumber * 2
      if (adultNumber > 0) total += adultNumber * 2
      if (interval == 'Day') total = total * 7
      return {
        total: total,
        example: total > 0 ? this.getExample(total) : null
      }
    } else {
      return null
    }
  },
  getExample: function (amount) {
    var exampleCost = null
    this.exampleCosts.forEach(example => {
      if (example.itemCost < amount) {
        exampleCost = example
      }
    })
    return exampleCost
  },
  getTweetText: function (estimateFamilyWeeklyFine) {
    if (!estimateFamilyWeeklyFine) return this.tweetText.noInformation
    if (estimateFamilyWeeklyFine.amount == 0) return this.tweetText.noFines
    if (estimateFamilyWeeklyFine.amount < 5) return this.tweetText.smallFines
    return this.tweetText.largeFines
  },
  exampleCosts: [
    {
      itemCost: 0.34,
      itemDescription: 'water and energy for a single load of clothes washing.',
      source:
        'https://inthewash.co.uk/laundry-and-ironing/cost-to-wash-clothes-uk/'
    },
    {
      itemCost: 0.79,
      itemDescription: 'a pint of milk.',
      source: 'https://www.tesco.com/groceries/en-GB/products/251314158'
    },
    {
      itemCost: 1.0,
      itemDescription: 'running water for a household for one day.',
      source:
        'https://www.water.org.uk/news-item/average-water-and-sewerage-bills-for-england-and-wales-to-fall-by-17-in-2020-21/'
    },
    {
      itemCost: 2.41,
      itemDescription: 'a school meal for a child.',
      source:
        'https://www.bigissue.com/news/social-justice/free-school-meals-everything-you-need-to-know/'
    },
    {
      itemCost: 2.8,
      itemDescription: 'a small family lunch of tomato soup.',
      source: 'https://www.tesco.com/groceries/en-GB/products/258147391'
    },
    {
      itemCost: 3.3,
      itemDescription: 'a box of crunchy nut cornflakes.',
      source: 'https://www.tesco.com/groceries/en-GB/products/256267349'
    },
    {
      itemCost: 4.00,
      itemDescription: 'a refill pack for a jar of Kenco instant coffee.',
      source: 'https://www.tesco.com/groceries/en-GB/products/265314701'
    },
    {
      itemCost: 5.6,
      itemDescription: 'loo roll for a family to last a week.',
      source: 'https://www.tesco.com/groceries/en-GB/products/309471660'
    },
    {
      itemCost: 6.58,
      itemDescription: 'nappies for a baby to last a week.',
      source: 'https://www.babiesandchildren.co.uk/baby-nappies-cost/'
    },
    {
      itemCost: 10.0,
      itemDescription: 'the monthly cost of a SIM only phone contract.',
      source: 'https://www.giffgaff.com/sim-only-deals'
    },
    {
      itemCost: 11.7,
      itemDescription: 'school meals for one child for a week.',
      source:
        'https://www.bigissue.com/news/social-justice/free-school-meals-everything-you-need-to-know/'
    },
    {
      itemCost: 13.25,
      itemDescription: "a houshold's TV licensing costs for one month.",
      source: 'https://www.nimblefins.co.uk/average-uk-household-cost-food'
    },
    {
      itemCost: 14.14,
      itemDescription: 'food for a family of 4 for one day.',
      source: 'https://www.nimblefins.co.uk/average-uk-household-cost-food'
    }
  ],
  tweetText: {
    noFines: {
      tweetIntroduction:
        "It's great your library doesn't charge fines. Consider tweeting a thank you to the service, and encourage others to go fine-free.",
      tweetText: 'thank for not charging overdue fines!'
    },
    largeFines: {
      tweetIntroduction:
        'These are large fines that will severely affect poorer users. Consider tweeting to the service to encourage them to lower fines or go fine-free.',
      tweetText:
        'please consider removing or reducing library fines, which affect poorer users and create a barrier to using libraries.'
    },
    smallFines: {
      tweetIntroduction:
        'These fines could discourage poorer users from using libraries. Consider tweeting to the service to encourage them to remove fines.',
      tweetText:
        'please consider removing library fines which create a barrier to using libraries.'
    },
    noInformation: {
      tweetIntroduction:
        "We don't have fine information for your library. This is normally due to poor website contact and then also not responding to queries. Consider tweeting to the service to encourage them to publish information on their fine policies.",
      tweetText:
        'please consider publishing your library fine policies. This will help get a better picture across the UK.'
    }
  }
}
