var dataLoading = document.getElementById('p-data-loading')

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
        var familyFine = fineFree.estimateFamilyWeeklyFine(child, adult, interval)
        return [service['Name'], formattedFines.child, formattedFines.adult, (familyFine ? Math.round(familyFine.total, 2) : 0)]
      })


    new gridjs.Grid({
      columns: ['Service', 'Child', 'Adult', { 
        name: 'Family',
        formatter: (cell) => `£${cell}`
      }],
      pagination: true,
      search: {
        selector: (cell, rowIndex, cellIndex) => (cellIndex === 0 ? cell : null)
      },
      sort: true,
      data: services
    }).render(document.getElementById('div-table-wrapper'))

    dataLoading.style.display = 'none'

  })
  .catch(error => console.log(error))
