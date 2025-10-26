import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useForecastQuery,
  useReverseGeoQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import CurrentWeather from "@/components/current-weather";
import HourlyWeather from "@/components/hourly-weather";
import WeatherDetails from "@/components/weather-details";
import ForecastDetails from "@/components/forecast-details";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const locationQuery = useReverseGeoQuery(coordinates);
  const weatherData = useWeatherQuery(coordinates);
  const forecastData = useForecastQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      locationQuery.refetch();
      weatherData.refetch();
      forecastData.refetch();
    }
  };
  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2 justify-start">
          <p>{locationError}</p>
          <Button
            variant={"outline"}
            className="w-fit cursor-pointer"
            onClick={getLocation}
          >
            <MapPin className="mr-1 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Keep `locationName` as the geocode data (or undefined) so its
  // type matches the `CurrentWeather` prop `locationName?: GeocodeData`.
  // Render-friendly fallbacks (like "Unknown Location") should be
  // derived where the name is displayed (e.g. inside CurrentWeather).
  const locationName = locationQuery.data?.[0];

  if (weatherData.error || forecastData.error || locationQuery.error) {
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

  if (!weatherData.data || !forecastData.data) {
    return <WeatherSkeleton />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          className={`cursor-pointer`}
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={
            locationLoading ||
            weatherData.isFetching ||
            forecastData.isFetching ||
            locationQuery.isFetching
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
          <CurrentWeather data={weatherData.data}  locationName={locationName}/>
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

export default WeatherDashboard;
