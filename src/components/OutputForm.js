import React, {Component} from 'react';

class OutputForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            forecast:[],
            json:[]
        };
    }
    async componentDidMount() {
        const city = this.props.city;        
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=feAuAmMuAeLKM6I6pfR9dKMVpeNs4VC7&q=` + city)
        const json = await response.json();
        const cityCode = json[0].ParentCity.Key;                        
        await fetch('http://dataservice.accuweather.com/forecasts/v1/daily/1day/'+ cityCode +'?apikey=feAuAmMuAeLKM6I6pfR9dKMVpeNs4VC7&language=en-us&details=true&metric=true')
                    .then(res => res.json())
                    .then(json => 
                        {  
                        console.log(json);                     
                        let accuweather = {
                            "day":{
                                "wind":json.DailyForecasts[0].Day.Wind.Speed.Value,
                                "phrase":json.DailyForecasts[0].Day.IconPhrase
                            },
                            "temperature":{
                                "max":json.DailyForecasts[0].Temperature.Maximum.Value,
                                "min":json.DailyForecasts[0].Temperature.Minimum.Value,
                                "feelsLike":(json.DailyForecasts[0].RealFeelTemperature.Maximum + json.DailyForecasts[0].RealFeelTemperature.Maximum)/2
                            }
                        };
                        this.setState({
                            forecast:[...this.state.forecast,accuweather]
                        });
                     })
        const responseApixu = await fetch('http://api.apixu.com/v1/forecast.json?key=38495808c8d94c40aff133547180110 &q='+ city + '&days=1')
                     .then(res => res.json())
                     .then(json=> 
                    {
                        console.log(json);
                        let apixu = {
                            "day":{
                                "wind":json.forecast.forecastday[0].day.maxwind_kph,
                                "phrase":json.forecast.forecastday[0].day.condition.text
                            },
                            "temperature":{
                                "max":json.forecast.forecastday[0].day.maxtemp_c,
                                "min":json.forecast.forecastday[0].day.mintemp_c,
                                "feelsLike":json.current.feelslike_c
                            }
                        };
                        this.setState({
                            forecast:[...this.state.forecast,apixu]
                        });
                    }
                    );
    }    
    render(){
        return(
            <h1>Hello {this.props.city}</h1>
        );
        
    }
}
export default OutputForm;