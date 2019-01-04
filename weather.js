

const request = () => {
	requestCurrentWeather();
	requestAirQuality();
	console.log(airQual);
};
request();
document.getElementById('temp').innerHTML = currentConditions.response.ob.tempC;
