fetch('/assets/js/services.hexjson')
  .then(response => response.json())
  .then(hexdata => {
    hex = new ODI.hexmap(document.getElementById('hexmap1'), {
      labels: { show: true },
      hexjson: hexdata
    })
  })
  .catch(error => console.log(error))
