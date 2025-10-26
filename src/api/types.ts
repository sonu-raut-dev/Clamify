export interface Coordinates {
    lat: number,
    lon: number
}

export interface WeatherCondition {
    id: number,
    main: string,
    description: string,
    icon: string
}

export interface WeatherData {
    coord: Coordinates,
    weather: WeatherCondition[],
    base: string,
    main:{
       "temp":number,
      "feels_like": number,
      "temp_min": number,
      "temp_max": number,
      "pressure": number,
      "humidity": number,
      "sea_level": number,
      "grnd_level": number,
    },
    visibility: number,
    wind: {
        speed: number,
        deg: number,
        gust: number
    },
    rain: Record<string,number>,
    clouds: Record<string,number>,
    dt: number,
    sys: {
        type: number,
        id: number,
        country: string,
        sunrise: number,
        sunset: number
    },
    timezone: number,
    id: number,
    name: string,
    cod: number
}

export interface ForecastData {
    cod: string,
    message: string,
    cnt: string,
    list: Array<{
        dt: number,
        main: WeatherData["main"] & {"temp_kf": number},
        weather: WeatherData["weather"],
        clouds: WeatherData["clouds"],
        wind: WeatherData["wind"],
        visibility: number,
        pop: number,
        rain: WeatherData["rain"],
        sys: Record<string,string>,
        dt_txt: string
    }>,
    city: {
        id: number,
        name: string,
        coord: Coordinates,
        country: string,
        population: number,
        timezone: number,
        sunrise: number,
        sunset: number
    }
}

export interface GeocodeData {
    name: string,
    local_names?: Record<string,string>,
    lat: number,
    lon: number,
    country: string,
    state?: string
}