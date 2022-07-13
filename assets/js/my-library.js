var serviceData = []
var submitButton = document.getElementById('btn-search')
var errorMessage = document.getElementById('search-error')
var serviceHeader = document.getElementById('h-library-service')
var fineInfo = document.getElementById('p-fine-info')
var fineExample = document.getElementById('p-fine-example')
var tweetIntroText = document.getElementById('p-tweet-text')
var tweetLink = document.getElementById('a-tweet')
tweetLink.addEventListener('click', tweetLibraryService)

var grid = null

function submitPostcode () {
  errorMessage.innerHTML = ''
  var postcode = document
    .getElementById('postcode')
    .value.trim()
    .toUpperCase()
  if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode.trim())) {
    var postcode_url = `${fineFree.postcodes}/${postcode}`
    fetch(postcode_url)
      .then(response => response.json())
      .then(service_data => {
        if (Object.keys(service_data).length > 0) {
          serviceHeader.innerText = ``
          serviceHeader.style.display = 'none'
          fineInfo.innerHTML = ``
          fineInfo.style.display = 'none'
          fineExample.innerHTML = ``
          fineExample.style.display = 'none'
          var serviceCode = service_data['library_service']
          var service = serviceData.find(
            service => service['Code'] === serviceCode
          )

          if (service) {
            var child = service['Child fine']
            var adult = service['Adult fine']
            var interval = service['Fine interval']
            var serviceName = service['Name']
            var formattedFines = fineFree.formatFines(child, adult, interval)

            var estimateFamilyWeeklyFine = fineFree.estimateFamilyWeeklyFine(
              child,
              adult,
              interval
            )
            serviceHeader.innerText = serviceName
            serviceHeader.style.display = 'block'

            fineInfo.style.display = 'block'
            if (estimateFamilyWeeklyFine.total > 0) {
              fineInfo.innerHTML = `${serviceName} charge <strong>${formattedFines.child}</strong> fines for children and <strong>${formattedFines.adult}</strong> fines for adults.`
              fineExample.innerHTML = `A family of 4 would pay <strong>£${estimateFamilyWeeklyFine.total.toFixed(
                2
              )}</strong> if they were overdue by a week. That could cover the cost of ${
                estimateFamilyWeeklyFine.example.itemDescription
              }`
              fineExample.style.display = 'block'
            } else if (estimateFamilyWeeklyFine.total == 0) {
              fineInfo.innerHTML = `${serviceName} do not charge overdue fines.`
            } else {
              fineInfo.innerHTML = `No current info on ${serviceName}`
            }
          }

          var twitterHandle = service['Twitter handle']
          if (
            twitterHandle &&
            twitterHandle.length > 0 &&
            estimateFamilyWeeklyFine
          ) {
            // Tweet button code
            var tweetText = fineFree.getTweetText(
              estimateFamilyWeeklyFine.total
            )
            tweetIntroText.innerText = tweetText.tweetIntroduction
            tweetIntroText.style.display = 'block'

            tweetLink.dataset.related = service['Twitter handle']
            tweetLink.dataset.text = tweetText.tweetText
            tweetLink.style.display = 'inline'
          }
        } else {
          errorMessage.innerHTML =
            'Sorry, we could not find data for that postcode.'
        }
      })
      .catch(
        error =>
          (errorMessage.innerHTML =
            'Sorry, something went wrong. Please try again later.')
      )
  } else {
    errorMessage.innerHTML = 'Please enter a valid postcode'
  }
}

function tweetLibraryService (e) {
  e.preventDefault()
  var tweetText = `${tweetLink.dataset.text}\n\n@${tweetLink.dataset.related}`
  var url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )} via https://www.finefreelibraries.co.uk`
  window.open(url, '_blank')
  return false
}

fetch(fineFree.services)
  .then(response => response.json())
  .then(services_data => {
    submitButton.addEventListener('click', submitPostcode)
    submitButton.disabled = false
    serviceData = services_data
    errorMessage.innerHTML = ''
  })
  .catch(
    error =>
      (errorMessage.innerHTML =
        'Sorry, there was an error in loading required data. Please try again later.')
  )
