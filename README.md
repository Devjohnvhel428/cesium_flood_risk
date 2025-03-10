# 🌦️ Current Weather Display and Flood Warning Alert Project

[![Watch the Demo](https://drive.google.com/file/d/1OTfUVhXXOXrAe9xjuOgxkLAFhckrbUQo/view?usp=drive_link)](https://drive.google.com/file/d/1OTfUVhXXOXrAe9xjuOgxkLAFhckrbUQo/view?usp=drive_link)

---

## 📖 Overview

The **Current Weather Display and Flood Warning Alert Project** is a React-based web application built with **React Hooks**, **TypeScript**, and **CesiumJS**. It provides users with real-time weather information for 438 cities in the Philippines and alerts for potential flood risks. The project uses mock data for weather information and integrates OpenStreetMap API for flood alert visualization.

---

## ✨ Features

-   **Current Weather Information**: Displays weather data (temperature, humidity, wind speed, etc.) for 438 cities in the Philippines.
-   **Flood Alerts**: Visualizes flood alerts on a map using circular ranges powered by OpenStreetMap API.
-   **Search Functionality**: Allows users to search for weather information by city name.
-   **Weather Filters**: Users can filter weather data by various weather types (e.g., sunny, rainy, cloudy).
-   **Customizable Map**: Includes a custom UI for selecting base maps and a map control bar for enhanced user interaction.
-   **Mock Data Integration**: Simulates real-world weather data using mock data from the Weatherbit API.

---

## 🛠️ Tech Stack

-   **Frontend**: React, React Hooks, TypeScript
-   **Mapping Library**: CesiumJS
-   **UI Framework**: Material-UI (MUI)
-   **APIs**:
    -   Weatherbit API (mock data)
    -   OpenStreetMap API

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

-   Node.js (v18.19.10 used or higher)
-   npm or yarn
-   Basic knowledge of React and TypeScript

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Devjohnvhel428/cesium_flood_risk.git
    cd cesium_flood_risk
    ```
    ```bash
    Install dependencies:
    yarn install
    ```

Start the development server:

```bash
yarn dev
```

Open your browser and navigate to:

http://localhost:5173/

---

## 📋 Usage Guide

1. Viewing Weather Information
   Upon visiting the app, you will see the current weather information for 438 cities in the Philippines.
   The weather data includes temperature, humidity, wind speed, and more.
2. Searching for a City
   Use the search bar to find weather information for a specific city.
   The app will display detailed weather data for the selected city.
3. Filtering Weather Data
   Apply filters to narrow down results by weather type (e.g., sunny, rainy, cloudy).
4. Viewing Flood Alerts
   Flood alerts are displayed on the map as circular regions.
   Click on a city with a flood alert to view more details.
5. Customizing the Map
   Use the map control bar to switch between different base maps (e.g., satellite, terrain, street view).
   Zoom in and out or pan across the map to explore different regions.
   All map natigation functions were customized.
