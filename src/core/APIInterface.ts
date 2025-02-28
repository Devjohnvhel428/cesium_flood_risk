import axios from "axios";
import { cities } from "../data/city_data";

class APIInterface {
    private readonly _baseWeatherUrl: string;
    private readonly _baseOpendStreetMapUrl: string;
    private readonly _queryString: string;
    private readonly _chunkSize: number;
    private readonly _weatherAPIKey: string;

    constructor() {
        this._baseWeatherUrl = "https://api.weatherbit.io/v2.0/";
        this._baseOpendStreetMapUrl = "https://nominatim.openstreetmap.org/search";
        this._weatherAPIKey = import.meta.env.VITE_WEATHER_API_KEY;
        this._chunkSize = 100;
        this._queryString = cities.map((city) => city.city_id).join(",");
    }

    // Utility function to split cities into chunks
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    // Function to fetch weather data for a chunk of cities
    async fetchWeatherForCities(cityChunk) {
        const queryString = cityChunk.map((city) => city.city_id).join(",");
        const url = `${this._baseWeatherUrl}current?cities=${queryString}&key=${this._weatherAPIKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null; // Return null or handle the error as needed
        }
    }

    // Main function to fetch weather data for all cities
    async fetchWeatherForAllCities() {
        const cityChunks = this.chunkArray(cities, this._chunkSize); // Split cities into chunks
        const allResponses = [];

        // Sequentially fetch data for each chunk
        for (const chunk of cityChunks) {
            const response = await this.fetchWeatherForCities(chunk);
            if (response) {
                allResponses.push(response); // Collect the response
            }
        }

        // Combine all responses into a single result
        return allResponses.flat(); // Flatten the array if needed
    }

    // Function to fetch weather data for a chunk of cities
    async fetchAlertsForCities(cityChunk) {
        const queryString = cityChunk.map((city) => city.city_id).join(",");
        const url = `${this._baseWeatherUrl}alerts?cities=${queryString}&key=${this._weatherAPIKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null; // Return null or handle the error as needed
        }
    }

    // Main function to fetch weather data for all cities
    async fetchAlertsAllCities() {
        const allResponses = [];

        // Sequentially fetch data for each chunk
        for (const city of cities) {
            const url = `${this._baseWeatherUrl}alerts?city_id=${city.city_id}&key=${this._weatherAPIKey}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }
                const data = await response.json();
                allResponses.push(data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                return null; // Return null or handle the error as needed
            }
        }

        console.log("All", allResponses);
        // Combine all responses into a single result
        return allResponses.flat(); // Flatten the array if needed
    }

    async fetchCityData(city_name: string, lat: number, lon: number) {
        let city_data = null;
        const url = `${this._baseOpendStreetMapUrl}?city=${city_name}&country=PH&type=town&format=json&polygon_geojson=1`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            city_data = await response.json();
            if (city_data?.length > 0) {
                let i = 0;
                for (i = 0; i < city_data?.length; i++) {
                    const item = city_data[i];
                    if (
                        item?.lat?.split(".")[0] === lat.toString().split(".")[0] &&
                        item?.lon?.split(".")[0] === lon.toString().split(".")[0] &&
                        (item?.type === "town" || item?.type === "administrative")
                    ) {
                        return item;
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null; // Return null or handle the error as needed
        }
    }
}

export default APIInterface;
