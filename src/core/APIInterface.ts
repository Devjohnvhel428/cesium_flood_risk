import axios from "axios";
import { cities } from "../../public/data/city_data";

class APIInterface {
    private readonly _baseWeatherUrl: string;
    private readonly _queryString: string;
    private readonly _chunkSize: number;
    private readonly _weatherAPIKey: string;

    constructor() {
        this._baseWeatherUrl = "https://api.weatherbit.io/v2.0/";
        this._weatherAPIKey = import.meta.env.VITE_WEATHER_API_KEY;
        this._chunkSize = 100;
        this._queryString = cities.map((city) => city.city_id).join(",");
        console.log("query", `${this._baseWeatherUrl}/current?cities=${this._queryString}&key=${this._weatherAPIKey}`);
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
        console.log("url", url);
        // try {
        //     const response = await fetch(url);
        //     if (!response.ok) {
        //         throw new Error(`Error fetching data: ${response.statusText}`);
        //     }
        //     return await response.json();
        // } catch (error) {
        //     console.error("Error fetching weather data:", error);
        //     return null; // Return null or handle the error as needed
        // }
    }

    // Main function to fetch weather data for all cities
    async fetchWeatherForAllCities() {
        const cityChunks = this.chunkArray(cities, this._chunkSize); // Split cities into chunks
        const allResponses = [];

        // Sequentially fetch data for each chunk
        for (const chunk of cityChunks) {
            const response = await this.fetchWeatherForCities(chunk);
            // if (response) {
            //     allResponses.push(response); // Collect the response
            // }
        }

        // Combine all responses into a single result
        return allResponses.flat(); // Flatten the array if needed
    }
}

export default APIInterface;
