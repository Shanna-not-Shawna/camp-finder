var baseURL = "https://developer.nps.gov/api/v1";
var apiKey = "GpXBVOoADabZe6DAWf2atfIHqSzsdyDMWejfa9rK";
var mbapiKey = 'pk.eyJ1IjoibXBmZWlmZXIxIiwiYSI6ImNsbjlhOTgwbTA0eTcybWxicHNoYzFlaTgifQ.rJIBDrbFLHr2CMnNCEtaeA';
var campGrounds = [];
var saveBtn = document.getElementById('save-btn');
var campname = 2;
var parkname = 1;

function getStates() {
  const url =
    "https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var options = '<option value="">Select a State</option>';
      for (const key in data) {
        options += `<option value=${key}>${data[key]}</option>`;
      }
      document.querySelector("#state-dropdown").innerHTML = options;
    })
    .catch(function (error) {
      console.log(error);
    });
}

document
  .querySelector("#search-state-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var stateSelect = document.querySelector("#state-dropdown").value;
    getParks(stateSelect);
  });
  function getParks(state) {
  const requestUrl = `${baseURL}/parks?stateCode=${state}&api_key=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var f = false;
      cards(data, f, parkname);
      const parks = data.data.filter(function (item) {
      return item.fullName.toLowerCase().includes("park");
      });
      showParkDropdown(parks);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function showParkDropdown(parks) {
  var options = '<option value="">Select a park</option>';
  for (const park of parks) {
    options += `<option value=${park.parkCode}>${park.fullName}</option>`;
  }
  document.querySelector("#park-dropdown").innerHTML = options;
}

document
  .querySelector("#search-park-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var park = document.querySelector("#park-dropdown").value;
    getCampGrounds(park);
  });

function getCampGrounds(park)  {
  const requestUrl = `${baseURL}/campgrounds?parkCode=${park}&api_key=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
     var f = false
      
      cards(data, f, campname)
      if (data.total == 0) { 
    //   document.querySelector(".alert").textContent = "No campgrounds found! ";   
        // Modal; if response is 0 then modal appears 
        // When User clicks close button modal disappears
        var modal = document.querySelector('.modal');
            // Back to Search Button for modal
            var closeButton = document.querySelector('#close-button');
            closeButton.addEventListener('submit', () => {
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 500);
          });
    } else {
        showCampsDropdown(data.data);
      }
    });
}

function showCampsDropdown(camps) {
  campGrounds = camps;
  var options = '<option value="">Select a park</option>';
  for (const i in camps) {
    options += `<option value=${i}>${camps[i].name}</option>`;
  }
  document.querySelector("#camp-dropdown").innerHTML = options;
  console.log(options)
}

document
  .querySelector("#search-camps-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var index = document.querySelector("#camp-dropdown").value;
    console.log(campGrounds[+index])
    showCampInfo(campGrounds[+index]);
    saveToLocalStorage(campGrounds[+index]);
  });

function showCampInfo(camp) {
  var t = true;
    cards(camp, t, campname);
}

function getParkActivites() {
  const requestUrl = `${baseURL}/activities/parks?api_key=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getParkAlerts() {
  const requestUrl = `${baseURL}/alerts?api_key=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getParkAmenities() {
  const requestUrl = `${baseURL}/amenities?api_key=${apiKey}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function saveToLocalStorage(data){
    var searchStorage = [];
    searchStorage.push(data.name)
    console.log('data', searchStorage)
    localStorage.setItem('searchHistory', searchStorage);
    var searchedValue = localStorage.getItem('searchHistory')
    console.log(searchedValue)
    }
saveBtn.addEventListener('click', saveToLocalStorage)



async function load_map(long,lat) {
  // change parkLong and parkLat to call API data of Long and Lat
      var parkLong = long
      var parkLat = lat
  // change map marker color by changing f60404 in URL, can change size of map image by replacing 400x300
      var testURL = 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+f60404(' + parkLong + ',' + parkLat + ')/' + parkLong + ',' + parkLat + ',7,0/400x300?access_token=' + mbapiKey;
  
      var url = testURL
  
      const options = {
          method: "GET"
      }
      let response = await fetch(url, options)
      if (response.status === 200) {
          const imageBlob = await response.blob()
          const imageObjectURL = URL.createObjectURL(imageBlob);
          const image = document.createElement('img')
          image.src = imageObjectURL
          const container = document.getElementById("map-container")
          container.append(image)
      }
      else {
          console.log("HTTP-Error: " + response.status)
      }
  }


getStates();

  function cards(data, tf, nameStyle) {


  var main = document.querySelector("main");
  main.innerHTML = '';
  
    if (tf == true) {
    var div = document.createElement("div");
    div.setAttribute("class","max-w-sm rounded overflow-hidden shadow-lg bg-green-500 mb-8");
    main.appendChild(div);
  
    var img = document.createElement('img');
    img.setAttribute("class", "w-full");
    if (data.images[0] === undefined ) {
      img.setAttribute("src", "https://daily.jstor.org/wp-content/uploads/2016/10/Moving_Forest_1050_700.jpg" )
     }else{
      img.setAttribute("src", data.images[0].url )
     }
     img.setAttribute("alt", "Picture of destination");
     div.appendChild(img);
  
     load_map(data.longitude, data.latitude)
     var mapdiv = document.createElement("div");
     mapdiv.setAttribute("id","map-container");
     main.appendChild(mapdiv);

     var div2 = document.createElement("div");
     div2.setAttribute("class","px-6 py-4");
     div.appendChild(div2);
 
     var div2a = document.createElement("div");
     div2a.setAttribute("class","font-bold text-xl mb-2");
     div2a.textContent = data.name;
     div2.appendChild(div2a);
 
     var p = document.createElement("p");
     p.setAttribute("class","text-gray-700 text-base");
     p.textContent = data.description;
     div2.appendChild(p);
 
     var div3 = document.createElement("div");
     div3.setAttribute("class","px-6 pt-4 pb-2");
     div.appendChild(div3);

 } else {
 for (var i = 0; i < data.data.length; i++) {
     console.log(i);
     var div = document.createElement("div");
     div.setAttribute("class","max-w-sm rounded overflow-hidden shadow-lg bg-green-500 mb-8");
     main.appendChild(div);
     
     var img = document.createElement('img');
     img.setAttribute("class", "w-full");
     if (data.data[i].images[0] === undefined ) {
      img.setAttribute("src", "https://daily.jstor.org/wp-content/uploads/2016/10/Moving_Forest_1050_700.jpg" )
     }else{
      img.setAttribute("src", data.data[i].images[0].url )
     }
     img.setAttribute("alt", "Picture of destination");
     div.appendChild(img);
    
     var div2 = document.createElement("div");
     div2.setAttribute("class","px-6 py-4");
     div.appendChild(div2);
 
     var div2a = document.createElement("div");
     div2a.setAttribute("class","font-bold text-xl mb-2");
     if (nameStyle == 1) {
      div2a.textContent = data.data[i].fullName;
    }else{
      div2a.textContent = data.data[i].name;
    }
     div2.appendChild(div2a);
 
     var p = document.createElement("p");
     p.setAttribute("class","text-gray-700 text-base");
     p.textContent =  data.data[i].description;
     div2.appendChild(p);
 
     var div3 = document.createElement("div");
     div3.setAttribute("class","px-6 pt-4 pb-2");
     div.appendChild(div3);
    }
  }
} 
 
