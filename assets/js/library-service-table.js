var serviceData = []

fetch(fineFree.services)
  .then(response => response.json())
  .then(services_data => {
    var services = services_data
      .sort((a, b) => a['Name'].localeCompare(b['Name']))
      .map(service => {
        var child = service['Child fine']
        var adult = service['Adult fine']
        var interval = service['Fine interval']
        var formattedFines = fineFree.formatFines(child, adult, interval)
        return [service['Name'], formattedFines.child, formattedFines.adult]
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
