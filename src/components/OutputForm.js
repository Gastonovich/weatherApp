import React, {Component} from 'react';
import DarkSkyApi from 'dark-sky-api';

class OutputForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            forecast: [],
            json: [],
            loading: true
        };
    }
    toCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5 / 9;
      }
    async componentWillMount() {
        const city = this.props.city;        
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=feAuAmMuAeLKM6I6pfR9dKMVpeNs4VC7&q=` + city)
        const json = await response.json();    
        const position = {
            latitude: json[0].GeoPosition.Latitude, 
            longitude: json[0].GeoPosition.Longitude
          };    
        const cityCode = json[0].ParentCity.Key; 

        const responseAccu = await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/'+ cityCode +'?apikey=feAuAmMuAeLKM6I6pfR9dKMVpeNs4VC7&language=en-us&details=true&metric=true');
        const jsonAccu = await responseAccu.json();  
        console.log(jsonAccu);                  
        let accuweather = {
            "day":{
                "wind": jsonAccu.DailyForecasts[0].Day.Wind.Speed.Value,
                "phrase": jsonAccu.DailyForecasts[0].Day.IconPhrase
                },
           "temperature":{
                "max": jsonAccu.DailyForecasts[0].Temperature.Maximum.Value,
                "min": jsonAccu.DailyForecasts[0].Temperature.Minimum.Value,
                }
        };  

        const responseApixu = await fetch('http://api.apixu.com/v1/forecast.json?key=38495808c8d94c40aff133547180110 &q='+ city + '&days=1');
        const jsonApixu = await responseApixu.json();
        console.log(jsonApixu);
        let apixu = {
            "day":{
                "wind": jsonApixu.forecast.forecastday[0].day.maxwind_kph,
                "phrase": jsonApixu.forecast.forecastday[0].day.condition.text
                },
            "temperature":{
                "max": jsonApixu.forecast.forecastday[0].day.maxtemp_c,
                "min": jsonApixu.forecast.forecastday[0].day.mintemp_c,
                "feelsLike": jsonApixu.current.feelslike_c
                }
        };

        const  responseOpenweather = await fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + position.latitude + '&lon=' + position.longitude + '&APPID=0a19e6cb59f156de48afcbb508393211&units=metric')
        const jsonOpenWeather = await responseOpenweather.json();
        console.log(jsonOpenWeather);
        let openWeatherMap = {
            "day":{
                "wind":jsonOpenWeather.list[0].wind.speed,
                "phrase":jsonOpenWeather.list[0].weather[0].description
                },
            "temperature":{
                "max": jsonOpenWeather.list[0].main.temp_max,
                "min": jsonOpenWeather.list[0].main.temp_min                
                },
            "pressure": jsonOpenWeather.list[0].main.pressure,
            "humidity": jsonOpenWeather.list[0].main.humidity
        };

        DarkSkyApi.apiKey = '01d0076d0ab578b6e7097b56ba38029f';
        DarkSkyApi.units = 'si';      
        const responseDarkSky = await DarkSkyApi.loadForecast(position);
        console.log(responseDarkSky);
        
        let darkSky = {
            "day":{
                "wind": responseDarkSky.daily.data[0].windSpeed,
                "phrase": responseDarkSky.daily.data[0].summary
                },
            "temperature":{
                "max": responseDarkSky.daily.data[0].temperatureMax,
                "min": responseDarkSky.daily.data[0].temperatureMin,
                }
        };

     
        
       this.setState({
           forecast:[accuweather,apixu,darkSky,openWeatherMap],
           loading:false
       }) 
    }  
 
    render(){
        const tempInfo = this.state.forecast.map(obj =>
            <div key={this.state.forecast.indexOf(obj)}>
                <p>{obj.temperature.min}° - {obj.temperature.max}°</p>
                <p>Wind {obj.day.wind} km/h</p>
            </div>
        );
        return(<div>
            {this.state.loading ?
            <div>Loading</div>
            :
                <div>
                <h1>{this.props.city}</h1>
                <div className="generalInfo">
                    <p>{this.state.forecast[2].day.phrase}</p>
                    <p>Humidity: {this.state.forecast[3].humidity}</p>
                    <p>Pressure: {this.state.forecast[3].pressure}</p>            
                </div>
                <div className="tempInfo">
                    {tempInfo}
                </div>
            </div>          
             }
            </div>            
        );        
    }
}
export default OutputForm;