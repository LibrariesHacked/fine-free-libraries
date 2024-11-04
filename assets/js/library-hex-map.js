const fetchHexJson = fetch(fineFree.hexJson).then(res => res.json())
const fetchServicesData = fetch(fineFree.services).then(res => res.json())
const fetchRegionData = fetch(fineFree.regions).then(res => res.json())
const allData = Promise.all([fetchHexJson, fetchServicesData, fetchRegionData])
const hexMapElement = document.getElementById('div-library-hexmap')

const colours = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15']

let storedData = null

const buildHexMap = (region = '', childOnly = false, displayCost = false) => {
  hexMapElement.innerHTML = ''
  var hexdata = JSON.parse(JSON.stringify(storedData[0]))
  var serviceData = storedData[1]
  var regions = storedData[2]

  var minFine = 0
  var maxFine = 0

  serviceData.forEach(service => {
    // Set the min and max fine values
    var child = service['Child fine']
    var adult = service['Adult fine']
    var fine = childOnly ? child : adult
    var interval = service['Fine interval']
    var fineNumber = parseFloat(fine)
    if (!isNaN(fineNumber)) {
      // If the interval is per week divide the amount by 7
      if (interval === 'Week') fineNumber = fineNumber / 7
      if (fineNumber < minFine) minFine = fineNumber
      if (fineNumber > maxFine) maxFine = fineNumber
    }
  })

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

      // If displayCost is true use the colour scale to assign a colour to the hex
      // Display either by adult fine or child fine
      if (displayCost) {
        var fine = childOnly ? child : adult
        var interval = service['Fine interval']
        var fineNumber = parseFloat(fine)
        if (!isNaN(fineNumber)) {
          // If the interval is per week divide the amount by 7
          if (interval === 'Week') fineNumber = fineNumber / 7
          // Get a value of 1-5 for the colour scale depending on the fineNumber and the min/max linear scale
          var colourIndex = Math.round(
            ((fineNumber - minFine) / (maxFine - minFine)) * 4
          )
          hexdata.hexes[hexCode].colour = fineFreeLibrary
            ? '#a5d6a7'
            : colours[colourIndex - 1]
        }
      } else {
        hexdata.hexes[hexCode].colour = fineFreeLibrary ? '#a5d6a7' : '#eceff1'
      }
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

  var childOnly = document.getElementById('chb-childonly')
  var displayCost = document.getElementById('chb-cost')
  var region = document.getElementById('sel-region')
  var regionCode = region.value
  var childOnlyChecked = childOnly.checked
  var displayCostChecked = displayCost.checked
  childOnly.addEventListener('change', function () {
    childOnlyChecked = childOnly.checked
    buildHexMap(regionCode, childOnlyChecked, displayCostChecked)
  })
  displayCost.addEventListener('change', function () {
    displayCostChecked = displayCost.checked
    buildHexMap(regionCode, childOnlyChecked, displayCostChecked)
  })
  region.addEventListener('change', function () {
    regionCode = region.value
    buildHexMap(regionCode, childOnlyChecked, displayCostChecked)
  })
  var regionNames = []
  Object.keys(storedData[2]).forEach(regionCode => {
    if (regionNames.indexOf(storedData[2][regionCode].region) === -1) {
      regionNames.push(storedData[2][regionCode].region)
    }
  })
  regionNames.sort()
  regionNames.forEach(regionName => {
    var option = document.createElement('option')
    option.value = regionName
    option.text = regionName
    region.appendChild(option)
  })
  document.getElementById('div-library-hexmap-controls').style.display = 'block'

  buildHexMap(regionCode, childOnlyChecked)
})
