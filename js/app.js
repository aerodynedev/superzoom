var height = 3000
var width = 4000
var tsize = 256

// initialize the openseadragon viewer
var osd = OpenSeadragon({
  id: 'osd',
  prefixUrl: "//openseadragon.github.io/openseadragon/images/",
  tileSources:   "dzi/1_Wild_Turkey.dzi" 
})

// initialize the geojs viewer
var params = geo.util.pixelCoordinateParams('#geojs', width, height, tsize, tsize)
params.map.clampZoom = false
params.map.clampBoundsX = false
params.map.clampBoundsY = false
var map = geo.map(params.map)

var layer = map.createLayer('annotation')

// turn off geojs map navigation
map.interactor().options({actions: []})

// get the current bounds from the osd viewer
var getBounds = function () {
  return osd.viewport.viewportToImageRectangle(osd.viewport.getBounds(true))
}

// set the geojs bounds from the osd bounds
var setBounds = function () {
  var bounds = getBounds()
  map.bounds({
    left: bounds.x,
    right: bounds.x + bounds.width,
    top: bounds.y,
    bottom: bounds.y + bounds.height
  })  
}

// add handlers to tie navigation events together
osd.addHandler('open', setBounds)
osd.addHandler('animation', setBounds)

var annotation = new geo.annotation.rectangleAnnotation({
  coordinates: [
    {x: 4101.499999999999, y: 6760.5, z: 0},    
    {x: 4101.499999999999, y: 5032.5, z: 0},
    {x: 4917.499999999999, y: 5032.5, z: 0},
    {x: 4917.499999999999, y: 6760.5, z: 0}
  ]
})

layer.addAnnotation(annotation)

map.geoOn(geo.event.annotation.state, function (e) {
  bootbox.prompt({
    title: 'Enter your caption',
    inputType: 'textarea',
    callback: function (result) {
      console.log(result)
      e.annotation.label(result)
      e.annotation.draw()
    }
  })  

  $('#geojs .geojs-layer').css('pointer-events', 'none')
})

map.geoOn(geo.event.annotation.add_before, function (e) {
  console.log('before add')
	e.annotation.label('')
  
  e.annotation.style({
    strokeWidth: 4,
    fillColor: 'red',
    fillOpacity: 0.25,
    strokeColor: 'red'
  })   

  e.annotation.options({
    labelStyle: {
      font: '400 12px "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',      
      color: '#ffffff'
    }
  })	
})

$('.controls-container button').click(function (e) {
  $('#geojs .geojs-layer').css('pointer-events', 'auto')
  var type = $(e.target).data('type')
  layer.mode(type)
})
