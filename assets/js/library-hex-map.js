const fetchHexJson = fetch(fineFree.hexJson).then(res => res.json())
const fetchServicesData = fetch(fineFree.services).then(res => res.json())
const allData = Promise.all([fetchHexJson, fetchServicesData])

allData.then(res => {
  var hexdata = res[0]
  var serviceData = res[1]

  Object.keys(hexdata.hexes).forEach(hexCode => {
    var service = serviceData.find(x => x.Code === hexCode)
    if (service) {
      var child = service['Child fine']
      var adult = service['Adult fine']
      var interval = service['Fine interval']
      hexdata.hexes[hexCode].child = child
      hexdata.hexes[hexCode].adult = adult
      hexdata.hexes[hexCode].interval = interval
      hexdata.hexes[hexCode].colour = fineFree.isFineFree(child, adult)
        ? '#a5d6a7'
        : '#eceff1'
    }
  })
  hex = new ODI.hexmap(document.getElementById('div-library-hexmap'), {
    label: {
      show: true,
      clip: true,
      format: function (txt, attr) {
        var child = attr.hex.child
        var adult = attr.hex.adult
        var interval = attr.hex.interval
        var service = attr.hex.n
        var fineFreeLibrary = fineFree.isFineFree(child, adult)

        var data_attrs = `data-service="${service}" data-child="${child}" data-adult="${adult}" data-interval="${interval}" data-fine-free="${fineFreeLibrary}"`

        var fineFreeHex = `<tspan ${data_attrs} class="hexdata fine-free">&check;</tspan>`
        var fineHex = `<tspan ${data_attrs} class="hexdata fine-paid">&cross;</tspan>`

        return fineFreeLibrary ? fineFreeHex : fineHex
      }
    },
    hexjson: res[0]
  })

  tippy('#div-library-hexmap svg g', {
    trigger: 'click',
    content: reference => {
      var span = reference.querySelector('.hexdata')
      if (span && span.dataset.fineFree) {
        var fineFreeLibrary = span.dataset.fineFree === 'true'
        var service = span.dataset.service
        var formatted = fineFree.formatMoney(
          span.dataset.child,
          span.dataset.adult,
          span.dataset.interval
        )
        var finePopup = `<div><strong>${service}</strong><br/>${formatted.child} child fine<br/>${formatted.adult} adult fine</div>`
        var fineFreePopup = `<div><strong>${service}</strong><br/>Fine free</div>`
        return fineFreeLibrary ? fineFreePopup : finePopup
      }
      return null
    },
    allowHTML: true
  })

  document.getElementById('p-data-loading').style.display = 'none'
})
