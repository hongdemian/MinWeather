
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
				airQual = json.response['0'];
				console.log(airQual);
				airQualTypes = ['03', 'pm2.5', 'co', 'no2', 'so2'];
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
				forecast.dayNight = json
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
			} else if (json.response != []) {
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
			} else if (json.response != []) {
				lightningAlert = json.response;
			} else {
				lightningAlert = null;
			}
			updateLightning();
		});
};

const updateCurrent = () => {
	document.getElementById('temp').innerHTML = currentConditions.ob.tempC + " C";
};

const updateForecast = () => {
	document.getElementById('forecast').innerHTML = forecast.dayNight;
};

const updateAirQual = () => {
	let period = airQual.periods['0'];
	let statement = period.category + " (" + period.dominant + " @ " + period.pollutants[airQualTypes.indexOf(period.dominant)]['valueUGM3'] + "g/m^3)";
	let color = "#" + period.color;
	const airquality = document.getElementById('air_quality');
	airquality.innerHTML = statement;
	airquality.style.color = color;

};

const updateLightning = () => {
	console.log(lightningAlert);
	if (lightningAlert === null) {
		document.getElementById('lightning_alert').style.display = 'none';
	}
};

const updateWeatherAlert = () => {
	console.log(weatherAlert);
	if (weatherAlert === null) {
		document.getElementById('weather_alert').style.display = 'hidden';
	}
	weather_alert = document.getElementById('weather_alert');
	weather_alert.innerHTML = weatherAlert.name;
	weather_alert.style.color = "#" + weatherAlert.color;
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
