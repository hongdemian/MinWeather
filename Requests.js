
let airQual, currentConditions, forecast = {}, weatherAlert, lightningAlert;

const CLIENT_ID = 'V0EhyX4bGWXDkmJunrbk0';
const CLIENT_SECRET = 'Rn1IRr4nYoNgefL7Y5YZQqX2mPEi4iKIAIlGeOTZ';

const requestAirQuality = () => {

	const url = 'https://api.aerisapi.com/airquality/T2m2m2?&format=json&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

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

	const url = 'https://api.aerisapi.com/observations/T2m2m2?&format=json&filter=allstations&limit=1&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

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

	const url = 'https://api.aerisapi.com/forecasts/t2m2m2?&format=json&filter=daynight&limit=14&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

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

	const url = 'https://api.aerisapi.com/forecasts/T2m2m2?&format=json&filter=1hr&limit=14&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else {
				forecast.hourly = json;
				updateForecast();
			}
		});
};
const requestAlert = () => {

	const url = 'https://api.aerisapi.com/alerts/t2m2m2?&format=json&limit=10&fields=details.name,loc,details.color,details.body,details.bodyFull,timestamps.beginsISO,timestamps.expiresISO&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET;

	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (!json.success) {
				console.log('Oh no!')
			} else if (json.response.length !== 0) {
				weatherAlert = json.response['0'].details;
			} else {
				weatherAlert = null;
			}
			updateWeatherAlert();
		});
};
const requestLightning = () => {

	const url = 'https://api.aerisapi.com/lightning/t2m2m2?&format=json&radius=25mi&filter=cg&limit=1&fields=id,ob,loc,recISO&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET;

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
	console.log(currentConditions);
	let statement = currentConditions.windKPH + " Km/h" + " (" + currentConditions.windDir + ") Sky Cover: " + currentConditions.sky + " %";
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
};
const updateForecast = () => {
	let forecast_heading, temp;
	if (!forecast.dayNight['0']['isDay']) {
		forecast_heading = "Tonight's Forecast:";
		temp = forecast.dayNight['0']['minTempC'] + " C";
		document.getElementById('high_low').innerHTML = "Overnight Low: ";
	} else {
		forecast_heading = "Tomorrow's Forecast:";
		temp = forecast.dayNight['0']['maxTempC'] + " C";
		document.getElementById('high_low').innerHTML = "Tomorrow's High: ";
	}
	document.getElementById('next_forecast').innerHTML = forecast_heading;
	let cloud = document.getElementById('summary_cloud');
	document.getElementById('summary_temp').innerHTML = temp;
	let wind = document.getElementById('summary_wind');
	let wind_max = document.getElementById('summary_wind_max');
	let air = document.getElementById('summary_air_quality');
	cloud.innerHTML = forecast.dayNight['0']['weather'];
	wind.innerHTML = forecast.dayNight['0']['windSpeedMaxKPH'] + " Km/h @ 0m ("
		+ forecast.dayNight['0']['windDirMax'] + ")";
	wind_max.innerHTML = forecast.dayNight['0']['windSpeedMax80mKPH'] + " Km/h @ 80m ("
		+ forecast.dayNight['0']['windDirMax80m'] + ")";



};
const updateAirQual = () => {
	let statement = airQual.category.toLocaleUpperCase() + " (" + airQual.dominant + " @ " + airQual.pollutants[airQualTypes.indexOf(airQual.dominant)]['valueUGM3'] + "g/m^3)";
	let color = "#" + airQual.color;
	const airquality = document.getElementById('current_air_quality');
	airquality.innerHTML = statement;
	airquality.style.color = color;

};
const updateLightning = () => {
	if (lightningAlert.length === 0) {
		document.getElementById('lightning_alert').style.display = 'none';
	}
};
const updateWeatherAlert = () => {
	// console.log(weatherAlert);
	if (weatherAlert.length === 0) {
		document.getElementById('weather_alert').style.display = 'hidden';
		return;
	}
	let weather_alert = document.getElementById('weather_alert');
	weather_alert.innerHTML = weatherAlert.name;
	weather_alert.style.color = "#" + weatherAlert.color;
	weather_alert.onclick = showAlert;
	function showAlert() {
		alert(weatherAlert.body)
	}
};

const sendRequest = () => {
	requestAirQuality();
	requestCurrentWeather();
	requestForecast();
	requestHourly();
	requestAlert();
	requestLightning();
};

sendRequest();

const forecastIsDay = () => {
	document.getElementById('next_forecast').innerHTML = "Tonight's Forecast:";
};

const forecastIsNight = () => {

};