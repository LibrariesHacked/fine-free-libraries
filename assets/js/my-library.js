var serviceData = []

fetch('https://api.librarydata.uk/services/airtable')
  .then(response => response.json())
  .then(services_data => (serviceData = services_data))
  .catch(error => console.log(error))

function submitPostcode () {
  var postcode = document.getElementById('postcode').value
  var postcode_regex = /^[A-Z]{1,2}[0-9R][0-9A-Z]?[0-9][ABD-HJLNP-UW-Z]{2}$/i
  if (postcode_regex.test(postcode)) {
    var postcode_url =
      'https://api-geography.librarydata.uk/rest/postcodes/' + postcode
    fetch(postcode_url)
      .then(response => response.json())
      .then(postcode_data => {
        console.log(postcode_data)
      })
      .catch(error => console.log(error))
  } else {
    document.getElementById('address-postcode-error').innerHTML =
      'Please enter a valid postcode'
  }
}

var submitButton = document.getElementById('btnSearch')
submitButton.addEventListener('click', submitPostcode)
