const reqURL='https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/';
export default async function getWeatherData(req, res){
    try{
        const response = await fetch(
        `${reqURL}search/?lattlong=43.7493,-79.737`);
        const responseData = await response.json();
        const woeid = responseData[0].woeid;

        const weather = await fetch(
        `${reqURL}${woeid}`);
        const weatherData = await weather.json();
        const finalWeather = weatherData.consolidated_weather;
        console.log(finalWeather);
        res.status(200).json(finalWeather);
    }
    catch (Error){
        alert(Error);
    }
}