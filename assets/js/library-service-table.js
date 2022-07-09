var serviceData = []

fetch('https://api.librarydata.uk/services/airtable')
  .then(response => response.json())
  .then(services_data => {
    var services = services_data
      .sort((a, b) => a['Name'].localeCompare(b['Name']))
      .map(service => {
        var child_fine_amount = service['Child fine']
        var child_fine = child_fine_amount > 0
        var child_fine_text = child_fine
          ? child_fine_amount + ' / ' + service['Fine interval']
          : 'None'
        var adult_fine_amount = service['Adult fine']
        var adult_fine = adult_fine_amount > 0
        var adult_fine_text = adult_fine
          ? adult_fine_amount + ' / ' + service['Fine interval']
          : 'None'
        return [service['Name'], child_fine_text, adult_fine_text]
      })
    new gridjs.Grid({
      columns: ['Service', 'Child', 'Adult'],
      pagination: true,
      search: {
        selector: (cell, rowIndex, cellIndex) => (cellIndex === 0 ? cell : null)
      },
      data: services
    }).render(document.getElementById('div-table-wrapper'))
  })
  .catch(error => console.log(error))
