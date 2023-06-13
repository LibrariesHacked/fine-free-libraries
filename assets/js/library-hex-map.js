const fetchHexJson = fetch(fineFree.hexJson).then(res => res.json())
const fetchServicesData = fetch(fineFree.services).then(res => res.json())
const fetchRegionData = fetch(fineFree.regions).then(res => res.json())
const allData = Promise.all([fetchHexJson, fetchServicesData, fetchRegionData])
const hexMapElement = document.getElementById('div-library-hexmap')

let storedData = null

const buildHexMap = (region = '', childOnly = false) => {
  hexMapElement.innerHTML = ''
  var hexdata = Object.assign({}, storedData[0])
  var serviceData = storedData[1]
  var regions = storedData[2]

  Object.keys(hexdata.hexes).forEach(hexCode => {
    var service = serviceData.find(x => x.Code === hexCode)
    var serviceRegion = regions[hexCode]

    var serviceRegionName = serviceRegion ? serviceRegion.region : ''

    if (region != '' && region !== serviceRegionName) {
      delete hexdata.hexes[hexCode]
    } else if (service) {
      var child = service['Child fine']
      var adult = service['Adult fine']
      var interval = service['Fine interval']

      var fineFreeLibrary = childOnly
        ? fineFree.isFineFreeForChildren(child)
        : fineFree.isFineFree(child, adult)

      hexdata.hexes[hexCode].child = child
      hexdata.hexes[hexCode].adult = adult
      hexdata.hexes[hexCode].interval = interval
      hexdata.hexes[hexCode].colour = fineFreeLibrary ? '#a5d6a7' : '#eceff1'
    }
  })
  new OI.hexmap(hexMapElement, {
    label: {
      show: true,
      clip: true,
      format: function (txt, attr) {
        var child = attr.hex.child
        var adult = attr.hex.adult
        var interval = attr.hex.interval
        var service = attr.hex.n
        var fineFreeLibrary = childOnly
          ? fineFree.isFineFreeForChildren(child)
          : fineFree.isFineFree(child, adult)

        var data_attrs = `data-service="${service}" data-child="${child}" data-adult="${adult}" data-interval="${interval}" data-fine-free="${fineFreeLibrary}"`

        var fineFreeHex = `<tspan ${data_attrs} class="hexdata fine-free">&check;</tspan>`
        var fineHex = `<tspan ${data_attrs} class="hexdata fine-paid">&cross;</tspan>`

        return fineFreeLibrary ? fineFreeHex : fineHex
      }
    },
    hexjson: hexdata
  })

  tippy('#div-library-hexmap .hexmap-inner svg g', {
    trigger: 'click',
    content: reference => {
      var span = reference.querySelector('.hexdata')
      if (span && span.dataset.fineFree) {
        var fineFreeLibrary = span.dataset.fineFree === 'true'
        var service = span.dataset.service
        var formatted = fineFree.formatFines(
          span.dataset.child,
          span.dataset.adult,
          span.dataset.interval
        )
        var finePopup = `<div class="div-fine"><span class="span-service">${service}</span><br/><span class="span-fine-amount">${formatted.child}</span> child fine<br/><span class="span-fine-amount">${formatted.adult}</span> adult fine</div>`
        var fineFreePopup = `<div class="div-fine-free"><span class="span-service">${service}</span><br/>Fine-free</div>`
        return fineFreeLibrary ? fineFreePopup : finePopup
      }
      return null
    },
    allowHTML: true
  })

  document.getElementById('p-data-loading').style.display = 'none'
}

allData.then(res => {
  storedData = res

  // Add option to show Child Only Fines
  var childOnly = document.getElementById('chb-childonly')
  var region = document.getElementById('sel-region')
  var regionCode = region.value
  var childOnlyChecked = childOnly.checked
  childOnly.addEventListener('change', function () {
    childOnlyChecked = childOnly.checked
    buildHexMap(regionCode, childOnlyChecked)
  })
  region.addEventListener('change', function () {
    regionCode = region.value
    buildHexMap(regionCode, childOnlyChecked)
  })
  Object.keys(storedData[2]).forEach(regionCode => {
    var option = document.createElement('option')
    option.value = storedData[2][regionCode].region
    option.text = storedData[2][regionCode].region
    region.appendChild(option)
  })
  document.getElementById('div-library-hexmap-controls').style.display = 'block'

  buildHexMap(regionCode, childOnlyChecked)
})
