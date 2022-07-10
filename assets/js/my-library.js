var serviceData = []
var errorMessage = document.getElementById('search-error')

fetch('https://api.librarydata.uk/services/airtable')
  .then(response => response.json())
  .then(services_data => {
    var submitButton = document.getElementById('btn-search')
    submitButton.addEventListener('click', submitPostcode)
    serviceData = services_data
    errorMessage.innerHTML = ''
  })
  .catch(
    error =>
      (errorMessage.innerHTML =
        'Sorry, there was an error in loading required data. Please try again later.')
  )

function submitPostcode () {
  var postcode = document.getElementById('postcode').value
  if (/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode.trim())) {
    var postcode_url =
      'https://api-geography.librarydata.uk/rest/postcodes/' + postcode
    fetch(postcode_url)
      .then(response => response.json())
      .then(postcode_data => {
        if (Object.keys(postcode_data).length > 0) {
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
