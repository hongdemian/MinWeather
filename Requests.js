
let airQual, currentConditions, forecast = {}, weatherAlert, lightningAlert;

const CLIENT_ID = 'V0EhyX4bGWXDkmJunrbk0';
const CLIENT_SECRET = 'Rn1IRr4nYoNgefL7Y5YZQqX2mPEi4iKIAIlGeOTZ';
let latlon = 't2m2m2';
const locOptions = {
	enableHighAccuracy: false,
	timeout: 5000,
	maximumAge: 0
};

const requestAirQuality = () => {

	const url = 'https://api.aerisapi.com/airquality/' + latlon + '?&format=json&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;
	console.log(url);
	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (json) {
			if (!json.success) {
				console.log('Oh no!')
			} else {
				airQual = json.response['0']['periods']['0'];
				airQualTypes = ['o3', 'pm2.5', 'co', 'no2', 'so2'];
				updateAirQual();
			}
		});
};
const requestCurrentWeather = () => {

	const url = 'https://api.aerisapi.com/observations/' + latlon + '?&format=json&filter=allstations&limit=1&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else {
				currentConditions = json.response;
				updateCurrent();
			}
		});
};
const requestForecast = () => {

	const url = 'https://api.aerisapi.com/forecasts/' + latlon + '?&format=json&filter=daynight&limit=14&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else {
				forecast.dayNight = json.response['0']['periods'];
				console.log(forecast);
				updateForecast();
			}
		});
};
const requestHourly = () => {

	const url = 'https://api.aerisapi.com/forecasts/' + latlon + '?&format=json&filter=1hr&limit=14&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else {
				forecast.hourly = json;
				updateForecastHourly();
			}
		});
};
const requestAlert = () => {

	const url = 'https://api.aerisapi.com/alerts/' + latlon + '?&format=json&limit=10&fields=details.name,loc,details.color,details.body,details.bodyFull,timestamps.beginsISO,timestamps.expiresISO&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else if (json.response.length !== 0) {
					weatherAlert = json.response['0'].details;
					updateWeatherAlert();

			} else {
				document.getElementById('weather_alert').style.visibility = 'hidden';
			}

		});
};
const requestLightning = () => {

	const url = 'https://api.aerisapi.com/lightning/' + latlon+ '?&format=json&radius=25mi&filter=cg&limit=1&fields=id,ob,loc,recISO&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else if (json.response.length !== 0) {
				lightningAlert = json.response;
			} else {
				lightningAlert = null;
			}
			updateLightning();
		});
};

const updateCurrent = () => {
	currentConditions = currentConditions.ob;
	// console.log(currentConditions);
	let statement;
	if (currentConditions.windKPH < 4) {
		statement = "Wind Calm - Sky Cover: " + currentConditions.sky + " %";
	} else {
		statement = currentConditions.windKPH + " Km/h" + " (" + currentConditions.windDir + ") Sky Cover: " +
			currentConditions.sky + " %";
	}
	if (currentConditions.windGustKPH === null) {
		document.getElementById('current_wind_gust').style.visibility = 'hidden'
	}
	let gusts = currentConditions.windGustKPH + " Km/h" + " (" + currentConditions.windGustSpeedKPH + " Km/h)";
	document.getElementById('current_cloud').innerHTML = currentConditions.weather;
	document.getElementById('current_wind').innerHTML = statement;
	document.getElementById('current_wind_gust').innerHTML = gusts;
	document.getElementById('temp').innerHTML = currentConditions.tempC + " C";
	document.getElementById('current_temp').innerHTML = "Feels like: " + currentConditions.feelslikeC + " C";
	document.getElementById('current_humidity').innerHTML = "Humidity: " + currentConditions.humidity + " % (Dewpoint: " + currentConditions.dewpointC + " C)";
	flightRule = currentConditions.flightRule;
	if (flightRule != 'VFR') {
		document.getElementById('flight').style.color = 'red'
	}
	document.getElementById('flight').innerHTML = currentConditions.flightRule;
	document.getElementById('uv').innerHTML = "Solar: " + currentConditions.solradWM2 + "W/m^2";
	document.getElementById('current_precip').innerHTML = "Precipitation: " +
		(currentConditions.precipMM !== null ? (currentConditions.precipMM + " mm") : "None");
};
const updateForecast = () => {
	let forecast_heading, temp;
	if (!forecast.dayNight['0']['isDay']) {
		forecast_heading = "Tonight's Forecast:";
		temp = forecast.dayNight['0']['minTempC'] + " C";
		document.getElementById('high_low').innerHTML = "Overnight Low: ";
	} else {
		forecast_heading = "Today's Forecast:";
		temp = forecast.dayNight['0']['maxTempC'] + " C";
		document.getElementById('high_low').innerHTML = "Today's High: ";
	}
	document.getElementById('next_forecast').innerHTML = forecast_heading;
	let cloud = document.getElementById('summary_cloud');
	let pop = document.getElementById('summary_pop');
	let wind = document.getElementById('summary_wind');
	let wind_max = document.getElementById('summary_wind_max');
	let precip = document.getElementById('summary_precip');
	document.getElementById('summary_temp').innerHTML = temp;
	cloud.innerHTML = forecast.dayNight['0']['weather'];
	wind.innerHTML = forecast.dayNight['0']['windSpeedMaxKPH'] + " Km/h @ 0m ("
		+ forecast.dayNight['0']['windDirMax'] + ")";
	wind_max.innerHTML = forecast.dayNight['0']['windSpeedMax80mKPH'] + " Km/h @ 80m ("
		+ forecast.dayNight['0']['windDirMax80m'] + ")";
	pop.innerHTML = "POP: " + forecast.dayNight['0']['pop'] + "% " + "Cover: " + forecast.dayNight['0']['sky'] + "%";
	precip.innerHTML = "Precipitation: " + (((forecast.dayNight['0']['precipMM']) === '0') ? (forecast.dayNight['0']['precipMM'] + " mm") : "None");
};
const updateForecastHourly = () => {

};
const updateAirQual = () => {
	let level = airQual.category.toLocaleUpperCase() + " AQI: " + airQual.aqi;
	let statement = " (" + airQual.dominant + " @ " + airQual.pollutants[airQualTypes.indexOf(airQual.dominant)]['valueUGM3'] + "g/m^3)";
	let color = "#" + airQual.color;
	const airquality = document.getElementById('current_air_quality');
	const current_aqi = document.getElementById('current_aqi');
	airquality.innerHTML = statement;
	current_aqi.style.color = color;
	current_aqi.innerHTML = level;

};
const updateLightning = () => {
	if (lightningAlert !== null) {
		document.getElementById('lightning_alert').style.display = 'none';
	}
};
const updateWeatherAlert = () => {
	let weather_alert = document.getElementById('weather_alert');
	weather_alert.innerHTML = weatherAlert.name;
	weather_alert.style.color = "#" + weatherAlert.color;
	weather_alert.onclick = showAlert;
	function showAlert() {
		alert(weatherAlert.body)
	}
};

const sendRequest = (pos) => {
	latlon = 't2m2m2';
	if (pos) {
		console.log(pos);
		latlon = [pos.coords.latitude, pos.coords.longitude];
		console.log(latlon);
	}
	requestAirQuality();
	requestCurrentWeather();
	requestForecast();
	// requestHourly();
	requestAlert();
	requestLightning();
};

//navigator.geolocation.getCurrentPosition(sendRequest, error, locOptions);
function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
	latlon = 't2m2m2';
	sendRequest();
}
sendRequest();