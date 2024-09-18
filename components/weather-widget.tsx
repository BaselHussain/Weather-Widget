"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedLocation = location.trim();
        if (trimmedLocation === "") {
            setError("Please enter a location");
            setWeather(null);
            return; 
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=815ee364546044d9a6255525241809&q=${trimmedLocation}`);
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            console.log("Weather API Data:", data);

            const weatherData: WeatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C"
            };
            setWeather(weatherData);
        } catch (error) {
            console.error("Error fetching data", error);
            setError("City not found. Please try again");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getTemperatureMessage = (temperature: number, unit: string): string => {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle up!`;
            } else if (temperature < 10) {
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
            } else if (temperature < 20) {
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
            } else if (temperature < 30) {
                return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
            } else {
                return `It's hot at ${temperature}°C. Stay hydrated!`;
            }
        } else {
            return `${temperature}°${unit}`;
        }
    };

    const getWeatherMessages = (description: string): string => {
        const desLower = description.toLowerCase();
        if (desLower === "sunny") {
            return "It's a beautiful sunny day!";
        } else if (desLower === "partly cloudy") {
            return "Expect some clouds and sunshine.";
        } else if (desLower === "cloudy") {
            return "It's cloudy today.";
        } else if (desLower === "overcast") {
            return "The sky is overcast.";
        } else if (desLower === "rain") {
            return "Don't forget your umbrella! It's raining.";
        } else if (desLower === "thunderstorm") {
            return "Thunderstorms are expected today.";
        } else if (desLower === "snow") {
            return "Bundle up! It's snowing.";
        } else if (desLower === "mist") {
            return "It's misty outside.";
        } else if (desLower === "fog") {
            return "Be careful, there's fog outside.";
        } else {
            return description;
        }
    };

    const getLocationMessages = (location: string): string => {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "at night" : "During Day"}`;
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md text-center mx-auto">
                <CardHeader>
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>Search the current weather condition in your city</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <Input
                            placeholder="Enter a city name"
                            type="text"
                            value={location}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Search"}
                        </Button>
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {weather && (
                        <div className="mt-4 grid gap-2">
                            <div className="flex items-center gap-2">
                                <ThermometerIcon className="w-6 h-6" />
                               <div> {getTemperatureMessage(weather.temperature, weather.unit)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CloudIcon className="w-6 h-6" />
                                <div>{getWeatherMessages(weather.description)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6" />
                                <div>{getLocationMessages(weather.location)}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
