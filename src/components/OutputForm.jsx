import React, { Component } from 'react';
import DarkSkyApi from 'dark-sky-api';

class OutputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forecast: [],
      loading: true
    };
  }

  async componentWillMount() {
    const { city } = this.props;
    const cityInfo = await fetch(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=feAuAmMuAeLKM6I6pfR9dKMVpeNs4VC7&q=${city}`
    );
    console.log(cityInfo);
    const json = await cityInfo.json();
    const position = {
      latitude: json[0].GeoPosition.Latitude,
      longitude: json[0].GeoPosition.Longitude
    };
    const cityCode = json[0].Key;
    const responseAccu = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityCode}?apikey=feAuAmMuAeLKM6I6pfR9dKMVpeNs4VC7&language=en-us&details=true&metric=true`
    );
    const jsonAccu = await responseAccu.json();
    const responseApixu = await fetch(
      `http://api.apixu.com/v1/forecast.json?key=38495808c8d94c40aff133547180110&q=${
        position.latitude
      },${position.longitude}&days=1`
    );
    const jsonApixu = await responseApixu.json();
    const responseOpenweather = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${position.latitude}&lon=${
        position.longitude
      }&APPID=0a19e6cb59f156de48afcbb508393211&units=metric`
    );
    const jsonOpenWeather = await responseOpenweather.json();
    DarkSkyApi.apiKey = '01d0076d0ab578b6e7097b56ba38029f';
    DarkSkyApi.units = 'si';
    const responseDarkSky = await DarkSkyApi.loadForecast(position);
    console.log(jsonAccu, jsonApixu, jsonOpenWeather, responseDarkSky);
    const response = {
      humidity: jsonOpenWeather.list[0].main.humidity,
      seaLevel: jsonOpenWeather.list[0].main.sea_level,
      pressure: jsonOpenWeather.list[0].main.pressure,
      visibility: responseDarkSky.daily.data[0].visibility,
      icon: jsonApixu.current.condition.icon,
      day: {
        wind: jsonAccu.DailyForecasts[0].Day.Wind.Speed.Value,
        phrase: jsonAccu.DailyForecasts[0].Day.IconPhrase
      },
      night: {
        wind: jsonAccu.DailyForecasts[0].Night.Wind.Speed.Value,
        phrase: jsonAccu.DailyForecasts[0].Night.IconPhrase
      },
      temperature: {
        max: jsonAccu.DailyForecasts[0].Temperature.Maximum.Value,
        min: jsonAccu.DailyForecasts[0].Temperature.Minimum.Value,
        realFeelMax: jsonAccu.DailyForecasts[0].RealFeelTemperature.Maximum.Value,
        realFeelMin: jsonAccu.DailyForecasts[0].RealFeelTemperature.Minimum.Value,
        current: jsonApixu.current.temp_c,
        feelsLikeCurrent: jsonApixu.current.feelslike_c
      },
      astro: {
        sunrise: jsonApixu.forecast.forecastday[0].astro.sunrise,
        sunset: jsonApixu.forecast.forecastday[0].astro.sunset,
        moonrise: jsonApixu.forecast.forecastday[0].astro.moonrise,
        moonset: jsonApixu.forecast.forecastday[0].astro.moonset,
        moonPhase: responseDarkSky.daily.data[0].moonPhase
      },
      summaryForWeek: responseDarkSky.daily.summary,
      summaryToday: responseDarkSky.daily.data[0].summary,
      summaryTomorrow: responseDarkSky.daily.data[1].summary
    };
    this.setState({
      forecast: response,
      loading: false
    });
  }

  render() {
    const { forecast, loading } = this.state;

    return (
      <div>
        {loading ? (
          <div>Loading</div>
        ) : (
          <div>
            <section>
              <div className="header">
                <h1>{this.props.city}</h1>
                <img src={'http://' + forecast.icon.slice(2)} alt="weather icon" />
              </div>
              <div className="summary">
                <div className="summary_today">{forecast.summaryToday}</div>
                <div className="summary_today">Tomorrow will be {forecast.summaryTomorrow}</div>
                <div className="summary_today">
                  On this week should wait {forecast.summaryForWeek}
                </div>
              </div>
              <div className="mainInfo">
                <h2>Temperature</h2>
                <div className="temperature_block">
                  <p> Now : {forecast.temperature.current}°</p>
                  <p>Feels like : {forecast.temperature.feelsLikeCurrent}°</p>
                  <p>
                    Minimum - Maximum : {forecast.temperature.min}° - {forecast.temperature.max}°
                  </p>
                </div>
              </div>

              <div className="details">
                <h2>Details</h2>
                <div className="details_block">
                  <div>
                    <p>Visibility: {forecast.humidity}</p>
                  </div>
                  <div>
                    <p>Humidity: {forecast.humidity}</p>
                  </div>
                  <div>
                    <p>Pressure: {forecast.pressure}</p>
                  </div>
                  <div>
                    <p>Sunrise: {forecast.astro.sunrise}</p>
                  </div>
                  <div>
                    <p>Sunset: {forecast.astro.sunset}</p>
                  </div>
                  <div>
                    <p>Moon Phase: {forecast.astro.moonPhase}</p>
                  </div>
                  <div className="wind">
                    <p>
                      Wind at day {forecast.day.wind}
                      km/h and at night {forecast.night.wind}
                      km/h
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <button className="rainbow-button" onClick={this.props.changer}>
              Search another city
            </button>
          </div>
        )}
      </div>
    );
  }
}
export default OutputForm;
