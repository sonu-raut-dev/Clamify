import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import CurrentWeather from "@/components/current-weather";
import HourlyWeather from "@/components/hourly-weather";
import WeatherDetails from "@/components/weather-details";
import ForecastDetails from "@/components/forecast-details";


const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams()
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherData = useWeatherQuery(coordinates);
  const forecastData = useForecastQuery(coordinates);

  const handleRefresh = () => {
    if (coordinates) {
      weatherData.refetch();
      forecastData.refetch();
    }
  };

   if (weatherData.error || forecastData.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2 justify-start">
          <p>Failed to fetch weather data. Please try again</p>
          <Button
            variant={"outline"}
            className="w-fit cursor-pointer"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherData.data || !forecastData.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return(
     <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{params.cityName} ,{weatherData.data.sys.country}</h1>
        <Button
          className={`cursor-pointer`}
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={
            weatherData.isFetching ||
            forecastData.isFetching 
          }
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherData.isFetching
                ? "animate-spin"
                : ""
            }`}
          />
        </Button>
      </div>
      <div className="grid gap-6"> 
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Current Weather Component */}
          <CurrentWeather data={weatherData.data} />
          {/* hourly temperature */}
          <HourlyWeather data={forecastData.data}/>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* details */}
          <WeatherDetails data={weatherData.data}/>
          {/* forecast */}
          <ForecastDetails data={forecastData.data}/>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
