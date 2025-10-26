import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationCoordinates {
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export function useGeolocation() {
    const [location,setLocation] = useState<GeolocationCoordinates>({
        coordinates: null,
        error: null,
        isLoading: true,
    });

    const getLocation = () => {
        setLocation((prev) => ({...prev, isLoading: true,error: null}));
        if(!navigator.geolocation){
            setLocation({
                coordinates: null,
                error: "Geolocation is not supported by your browser.",
                isLoading: false,
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    coordinates: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    },
                    isLoading: false,
                    error: null,
                });
            },
            (error) => {
                let errorMessage: string;
                switch(error.code){
                    case error.PERMISSION_DENIED:
                        errorMessage = "User denied the request for Geolocation."; 
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get user location timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred.";
                        break;
                }
                setLocation({
                    coordinates: null,
                    error: errorMessage,
                    isLoading: false,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        )
    };

    useEffect(() => {
        getLocation();
    },[])

    return { ...location, getLocation};
}