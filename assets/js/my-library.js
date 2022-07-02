var serviceData = []

fetch('https://api.librarydata.uk/services/airtable')
  .then(response => response.json())
  .then(services_data => (serviceData = services_data))
  .catch(error => console.log(error))

function submitPostcode () {}
