var map;

function MyLocationControl(controlDiv, map) {

      // Set CSS for the control border.
      var controlUI = document.createElement('div');
    controlUI.style.cursor = 'pointer';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.margin = '0 10px 0 0';
    controlUI.style.borderRadius = '3px';
    controlUI.style.width = '30px';
    controlUI.style.height = '30px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
   // controlUI.innerHTML =  
    controlUI.title = 'My location';
    controlDiv.appendChild(controlUI);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(initialLocation);
            }); 
        }
    });

  }


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
       center: new google.maps.LatLng(35.137879, -82.836914),
    zoom: 15,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true
  });

  var myLocationControlDiv = document.createElement('div');
      var myLocationControl = new MyLocationControl(myLocationControlDiv, map);

        myLocationControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocationControlDiv);


// Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

        var myMarker = new google.maps.Marker({
        position: new google.maps.LatLng(35.137879, -82.836914),
        draggable: true
    });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        var bounds = new google.maps.LatLngBounds();
        place = places[0];

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
  
        map.fitBounds(bounds);
        myMarker.setPosition(place.geometry.location);

      what3WordsConvert(place.geometry.location.lat().toFixed(3), place.geometry.location.lng().toFixed(3));
      });

      setCurrentPosition(map, myMarker);

    google.maps.event.addListener(myMarker, 'dragend', function (evt) {
      what3WordsConvert(evt.latLng.lat().toFixed(3), evt.latLng.lng().toFixed(3));
    });

    google.maps.event.addListener(myMarker, 'dragstart', function (evt) {
        document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
    });

    map.setCenter(myMarker.position);
    myMarker.setMap(map);
}

var what3WordsConvert = function(lat, lng) {
    what3words.positionToWords([lat, lng], function (ret) {
        document.getElementById('current').innerHTML = '<p>'+ ret.join('.') +'</p>';
       
        document.getElementById('three-word').value  = ret.join('.');
    });
  }

    var setCurrentPosition = function(map, marker, set3word) {
    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
              initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              map.setCenter(initialLocation);
              marker.setPosition(initialLocation);
              if (set3word) {
                what3WordsConvert(position.coords.latitude.toFixed(3), position.coords.longitude.toFixed(3));
              }
          }); 
      }
  }