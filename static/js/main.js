// Sliders

const allRanges = document.querySelectorAll(".form-group");
allRanges.forEach(wrap => {
  const range = wrap.querySelector(".form-control-range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
	setBubble(range, bubble);
  });
  setBubble(range, bubble);
});

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 10;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`};


var dataset = {};

var button = d3.select("#button");

button.on("click", handleSubmit);

// Code from Reed
function handleSubmit(event) {
	const soc_gdp_percapita = document.getElementById("soc_gdp_percapita");
	const soc_literacy_pop = document.getElementById("soc_literacy_pop");
	const soc_suicide_per_100K = document.getElementById("soc_suicide");
	const soc_birthrate_cbr = document.getElementById("soc_birthrate_cbr");
	const eco_agriculture = document.getElementById("eco_agriculture");
	const eco_industry = document.getElementById("eco_industry");
	const eco_service = document.getElementById("eco_service");
	const eco_self_employed = document.getElementById("eco_self_employed");
	const travel_popdensity_sqmile = document.getElementById("travel_popdensity_sqmile");
	const travel_coastline_ratio = document.getElementById("travel_coastline_ratio");
	const travel_incountry_growth = document.getElementById("travel_incountry_growth");
	const travel_no_of_arrivals = document.getElementById("travel_no_of_arrivals");
	const pop_female = document.getElementById("pop_female");
	const pop_avghousehold_size = document.getElementById("pop_avghousehold_size");
	const pop_householdtype_nuclear = document.getElementById("pop_householdtype_nuclear");
	const pop_householdtype_nochildren = document.getElementById("pop_householdtype_nochildren");

	//retrieve your slider variables and scale them
	// 	get values from slider and convert it to a percentage
	var s_br = parseInt(soc_birthrate_cbr.value);
	var f_sel = parseInt(eco_self_employed.value);
	var m_arr = parseInt(travel_no_of_arrivals.value);
	var c_noc = parseInt(pop_householdtype_nochildren.value);

	var total = parseInt((s_br + f_sel + m_arr + c_noc))

	var soc_perc = (s_br / total)
	var eco_perc = (f_sel / total)
	var trav_perc = (m_arr / total)
	var pop_perc = (c_noc / total)

	d3.json("/api/v1.0/happyness_index", function (happy) {
		dataset = happy;

		// TBD - perform your magical calculation


		// for (var i = 0; i < dataset.length; i++) {
		// 	dataset[i]['happyscore'] = user_rank
		// };
		for (var i = 0; i < dataset['data'].length; i++) {
			//variables for user rank calculations
			var user_travel_rank = dataset['data'][i]['travel_rank']
			var user_soc_rank = dataset['data'][i]['society_rank']
			var user_eco_rank = dataset['data'][i]['economy_rank']
			var user_pop_rank = dataset['data'][i]['pop_rank']

			//Calculation
			user_rank = Math.round((user_soc_rank * soc_perc) + (user_eco_rank * eco_perc) + (user_travel_rank * trav_perc) + (user_pop_rank * pop_perc))
			dataset['data'][i]['user_rank'] = parseInt(user_rank)

		};
		var sorted_data = Object.values(dataset.data).sort(function (a, b) { return (a.user_rank > b.user_rank) ? 1 : ((b.user_rank > a.user_rank) ? -1 : 0); }).slice(0, 5);
		
		fetchResults(sorted_data[0].country);

		var list = d3.select("#summary");
		console.log(list)
		console.log(list.innerHTML)
		list.html("");
		Object.entries(sorted_data).forEach(function ([key, value]) {
			console.log(key, value);
			// var empty = d3.select("li");
			var cell = list.append("li");
			console.log(value)
			cell.text(value.country)
		});

		//wiki
		//takes one parameter captured in the previous step, made AJAX request to Wikipedia, and bring the json to console
		function fetchResults (searchQuery) {
			// var searchQuery = sorted_data[0].country

			const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${searchQuery}`;

			fetch(endpoint)
				.then(response => response.json())
				.then(data => {
					const results = data.query.search;
					displayResults(results);
				});
		}
		function displayResults(results) {
			console.log(results);
		}
		// Display the results on the page

		function displayResults(results) {
			// Store a reference to `.searchResults`
			const searchResults = document.querySelector('.searchResults');
			// Remove all child elements
			searchResults.innerHTML = '';

			// Loop over results array
			results.forEach(result => {
				const url = encodeURI(`https://en.wikipedia.org/wiki/${result.title}`);

				searchResults.insertAdjacentHTML('beforeend',
					`<div class="resultItem">
          <h3 class="resultItem-title">
            <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
          </h3>
          <span class="resultItem-snippet">${result.snippet}</span><br>
          <a href="${url}" class="resultItem-link" target="_blank" rel="noopener">${url}</a>
        </div>`
				);
			});
		}


		//MAP
		// var myMap = L.map("map", {
		// 	center: [15.5994, -28.6731],
		// 	zoom: 5
		// });
		// Adding tile layer
		L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			maxZoom: 18,
			id: "mapbox.streets",
			accessToken: API_KEY
		}).addTo(myMap);

		// Load in geojson data
		var geoData = '../static/data/world_map_rank.geojson';
		var geojson;
		var countryshapes;


		d3.json(geoData, function (data) {
			countryshapes = data
			console.log(sorted_data[0])
			for (var i = 0; i < countryshapes['features'].length; i++) {
				console.log()
				var countryname = countryshapes.features[i].properties.admin
				for (var j = 0; j < dataset.data.length; j++) {
					if (dataset.data[j].country === countryname) { countryshapes['features'][i]['properties']['user_rank'] = dataset.data[j]['user_rank'] }
				}
				// if (sorted_data[i]['country'] === countryshapes['features'][i]['properties']['admin'])
				// { countryshapes['features'][i]['properties']['user_rank'] = sorted_data[i]['user_rank'] }
				console.log(countryname)

			};
			plotting(countryshapes)

		});

		// first step reading in the geojson
		// second step update the data from within Marcio's results

		// make everything below it's own function to reference in the countryshapes function.
		function plotting(d) {// console.log(data)  // Create a new choropleth layer
			geojson = L.choropleth(d, {

				// Define what  property in the features to use
				valueProperty: "user_rank",

				// Set color scale
				scale: ["#7B68EE", "#ADFF2F"],

				// Number of breaks in step range
				steps: 17,

				// q for quartile, e for equidistant, k for k-means
				mode: "q",
				style: {
					// Border color
					color: "#fff",
					weight: 1,
					fillOpacity: 0.8
				},

				// Binding a pop-up to each layer
				onEachFeature: function (feature, layer) {
					layer.bindPopup("Country Name: " + feature.properties.admin + "<br>Our Happiness Score:<br>"
						+ feature.properties.user_rank);
				}
			}).addTo(myMap);
		}

	});
}


		// let magical_calculation_results = {
		// 	bestCountriestoLiveIn: bestCountriestoLiveIn,
		// 	geoDataforMap: {}
		// };
		// console.log(happy);
		
// 	});
// };

	// once you're done with the magical calculation...
//   showOutput(magical_calculation_results);


// function showOutput(magical_calculation_results) {

// generate some HTML (maybe through d3) - e.g Table
	// const countrylistlocation = document.getElementById("countryList");

	// let countries = magical_calculation_results.bestCountriestoLiveIn;

	// countrylistlocation.innerHTML = " ";
	// countries.forEach( c => {
	// 	let countryData = document.createElement("li");
	// 	countryData.innerText = c;
	// 	countrylistlocation.add(countryData);s
	// });

	// and maybe do something with a map


// Calc + For loop + Map

// 	// console.log(var_name); // (10X)
// 	event.preventDefault();
// 	let json = {
// 		method: "POST",
// 		mode: "cors",
// 		cache: "no-cache",
// 		credentials: "same-origin",
// 		headers: {
// 			"Content-Type": "application/json"
// 		},
// 		redirect: "follow",
// 		referrer: "no-referrer",
// 		body: JSON.stringify(
// 			{
// 				data: {
// 					"S1": s_hh_n,
// 					"S2": s_bt_r,
// 					"S3": s_sd,
// 					"F1": f_hs,
// 					"F2": f_nb_a,
// 					"C1": c_pd,
// 					"C2": c_pct,
// 					"C3": c_pfp,
// 					"P1": p_p_se,
// 					"P2": p_cl_r,
// 				}
// 			})
// 	}
// 	console.log(json);
// 	const result = await fetch('/output', json);
// 	const result_json = await result.json();
// 	model_results = JSON.parse(result_json)
// 	model_group = model_results.Result.Output
// 	console.log(model_group)
// 	showOutput(model_group)
var myMap = L.map("map", {
	center: [15.5994, -28.6731],
	zoom: 2
  });
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 3,
	id: "mapbox.streets",
	accessToken: API_KEY
  }).addTo(myMap);

  // Load in geojson data
  var geoData = '../static/data/world_map_rank.geojson';
var geoData="../static/data/world_map_rank.geojson"
var geojson;
var countryshapes
// Grab data with d3
// This takes the geojson file and turns in into a list of dictionaries
// recreate what you did in pandas here.

// for ( var i = 0; i < countryshape['features'].length; i ++){
//     countryshape['features'][i]['properties']['overall_rank'] = happy['features'][i]['properties']['admin']

var myMap = L.map("map", {
	center: [0, 0],
	zoom: 2
});
// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.streets",
	accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData = '../static/data/world_map_rank.geojson';
var geojson;
var countryshapes;

d3.json(geoData, function (data) {
	countryshapes = data
	plotting(countryshapes)
});
// first step reading in the geojson
// second step update the data from within Marcio's results

// make everything below it's own function to reference in the countryshapes function.
function plotting(d) {// console.log(data)  // Create a new choropleth layer
	geojson = L.choropleth(d, {

		// Define what  property in the features to use
		valueProperty: "overall_rank",

		// Set color scale
		scale: ["#7B68EE", "#ADFF2F"],

		// Number of breaks in step range
		steps: 17,

		// q for quartile, e for equidistant, k for k-means
		mode: "q",
		style: {
			// Border color
			color: "#fff",
			weight: 1,
			fillOpacity: 0.8
		},

		// Binding a pop-up to each layer
		onEachFeature: function (feature, layer) {
			layer.bindPopup("Country Name: " + feature.properties.admin + "<br>Our Happiness Score:<br>"
				+ feature.properties.overall_rank);
		}
	}).addTo(myMap);
}
