var serviceData = []
var errorMessage = document.getElementById('search-error')
var grid = null

function submitPostcode () {
  errorMessage.innerHTML = ''
  var postcode = document.getElementById('postcode').value
  if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode.trim())) {
    var postcode_url = `https://api-geography.librarydata.uk/rest/postcodes/${postcode}`
    fetch(postcode_url)
      .then(response => response.json())
      .then(service_data => {
        if (Object.keys(service_data).length > 0) {
          var serviceCode = service_data['library_service']
          var service = serviceData.find(
            service => service['Code'] === serviceCode
          )
          var child = service['Child fine']
          var adult = service['Adult fine']
          var interval = service['Fine interval']
          var formattedFines = fineFree.formatFines(child, adult, interval)
          var serviceGrid = [
            [service['Name'], formattedFines.child, formattedFines.adult]
          ]
          if (service) {
            if (grid) {
              grid.updateConfig({ data: serviceGrid }).forceRender()
            } else {
              grid = new gridjs.Grid({
                columns: ['Service', 'Child fine', 'Adult fine'],
                pagination: false,
                data: serviceGrid
              }).render(document.getElementById('div-table-wrapper'))
            }
            var fineInfo = document.getElementById('p-fine-info')
            var estimateFamilyWeeklyFine = fineFree.estimateFamilyWeeklyFine(child, adult, interval)
            
            fineInfo.innerText = `A family of 2 adults and 2 children returning books a week late would need to pay £${estimateFamilyWeeklyFine}.`
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

fetch('https://api.librarydata.uk/services/airtable')
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
