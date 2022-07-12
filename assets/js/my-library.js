var serviceData = []
var errorMessage = document.getElementById('search-error')
var fineInfo = document.getElementById('p-fine-info')
var fineExample = document.getElementById('p-fine-example')
var serviceHeader = document.getElementById('h-library-service')
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
          fineInfo.innerHTML = ``
          fineExample.innerHTML = ``
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

            if (estimateFamilyWeeklyFine.total > 0) {
              fineInfo.innerHTML = `${serviceName} charge <strong>${formattedFines.child}</strong> fines for children and <strong>${formattedFines.adult}</strong> fines for adults.`
              fineExample.innerHTML = `A family of 4 would pay <strong>£${estimateFamilyWeeklyFine.total.toFixed(
                2
              )}</strong> if they were overdue by a week. That could cover the cost of ${
                estimateFamilyWeeklyFine.example.itemDescription
              }`
            } else if (estimateFamilyWeeklyFine.total == 0) {
              fineInfo.innerHTML = `${serviceName} are a fine-free library service.`
            } else {
              fineInfo.innerHTML = `No current info on ${serviceName}`
            }
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

fetch(fineFree.services)
  .then(response => response.json())
  .then(services_data => {
    var submitButton = document.getElementById('btn-search')
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
