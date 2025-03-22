"use client";

import FarmerNav from "@/components/FarmerNavbar";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import {
  FaShoppingCart,
  FaClock,
  FaRupeeSign,
  FaDownload,
  FaMapMarkerAlt,
  FaTemperatureHigh,
  FaWind,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Bar,
  BarChart,
} from "recharts";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiDayHaze, WiThunderstorm, WiDayFog } from "react-icons/wi";

const getWeatherIcon = (weatherCode: number, size = 40) => {
  // Weather codes based on WMO standards
  if ([0, 1].includes(weatherCode)) return <WiDaySunny size={size} className="text-yellow-500" />;
  if ([2, 3].includes(weatherCode)) return <WiCloud size={size} className="text-gray-500" />;
  if ([45, 48].includes(weatherCode)) return <WiDayFog size={size} className="text-gray-400" />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(weatherCode)) return <WiRain size={size} className="text-blue-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return <WiSnow size={size} className="text-blue-200" />;
  if ([95, 96, 99].includes(weatherCode)) return <WiThunderstorm size={size} className="text-purple-500" />;
  return <WiDayHaze size={size} className="text-orange-300" />;
};

const getWeatherDescription = (weatherCode: number) => {
  if ([0].includes(weatherCode)) return "Clear sky";
  if ([1].includes(weatherCode)) return "Mainly clear";
  if ([2].includes(weatherCode)) return "Partly cloudy";
  if ([3].includes(weatherCode)) return "Overcast";
  if ([45, 48].includes(weatherCode)) return "Fog";
  if ([51, 53, 55].includes(weatherCode)) return "Drizzle";
  if ([56, 57].includes(weatherCode)) return "Freezing Drizzle";
  if ([61, 63, 65].includes(weatherCode)) return "Rain";
  if ([66, 67].includes(weatherCode)) return "Freezing Rain";
  if ([71, 73, 75].includes(weatherCode)) return "Snow fall";
  if ([77].includes(weatherCode)) return "Snow grains";
  if ([80, 81, 82].includes(weatherCode)) return "Rain showers";
  if ([85, 86].includes(weatherCode)) return "Snow showers";
  if ([95].includes(weatherCode)) return "Thunderstorm";
  if ([96, 99].includes(weatherCode)) return "Thunderstorm with hail";
  return "Unknown";
};

const WeatherCard = ({ data }) => {
  if (!data) return <div className="animate-pulse bg-gray-200 h-40 rounded-xl"></div>;
  
  const currentTemp = data.current?.temperature_2m || 0;
  const weatherCode = data.current?.weather_code || 0;
  const windSpeed = data.current?.wind_speed_10m || 0;
  
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">{Math.round(currentTemp)}°C</h3>
          <p className="text-lg">{getWeatherDescription(weatherCode)}</p>
          <div className="flex items-center mt-2">
            <FaMapMarkerAlt className="mr-1" />
            <span className="text-sm">Your Location</span>
          </div>
          <div className="flex items-center mt-1">
            <FaWind className="mr-1" />
            <span className="text-sm">{windSpeed} km/h</span>
          </div>
        </div>
        <div className="text-right">
          {getWeatherIcon(weatherCode, 60)}
          <p className="text-sm mt-2">{moment().format('dddd, MMM D')}</p>
        </div>
      </div>
    </div>
  );
};

const WeatherForecast = ({ weather }) => {
  if (!weather || !weather.daily) return <div className="animate-pulse bg-gray-200 h-40 rounded-xl"></div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-7 gap-2">
        {weather.daily.time.map((time, index) => {
          const date = moment.unix(time).format("ddd");
          const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
          const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
          const precipitation = weather.daily.precipitation_sum[index];
          
          // Using a placeholder weather code since your data doesn't have daily weather codes
          const weatherCode = precipitation > 5 ? 61 : precipitation > 0 ? 3 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <p className="font-medium text-gray-700">{date}</p>
              {getWeatherIcon(weatherCode, 30)}
              <p className="mt-1 font-bold text-gray-800">{maxTemp}°</p>
              <p className="text-gray-500 text-sm">{minTemp}°</p>
              {precipitation > 0 && (
                <div className="flex items-center mt-1 text-blue-500 text-xs">
                  <WiRain size={16} />
                  <span>{precipitation}″</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeatherGraphs = ({ weather }) => {
  if (!weather || !weather.daily) return null;

  // Prepare data for the graph
  const chartData = weather.daily.time.map((time, index) => ({
    date: moment.unix(time).format("MMM DD"),
    maxTemp: Math.round(weather.daily.temperature_2m_max[index]),
    minTemp: Math.round(weather.daily.temperature_2m_min[index]),
    precipitation: weather.daily.precipitation_sum[index],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Temperature Trend (°C)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value}°C`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="maxTemp"
              stroke="#ff7300"
              name="Max Temp"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="minTemp"
              stroke="#387908"
              name="Min Temp"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Precipitation (inch)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value}″`, '']}
            />
            <Legend />
            <Bar 
              dataKey="precipitation" 
              fill="#82ca9d" 
              name="Precipitation" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, percentage, icon }) => {
  const isPositive = percentage >= 0;
  return (
    <div className="bg-white shadow-md rounded-xl p-10 flex items-center justify-between w-full max-w-lg border border-gray-300 transform transition-all duration-300 hover:shadow-lg">
      <div>
        <h3 className="text-gray-700 text-xl font-semibold">{title}</h3>
        <p className="text-4xl font-bold text-gray-900">
          {value.toLocaleString()}
        </p>
        <p
          className={`text-lg font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {Math.abs(percentage)}% {isPositive ? "Up" : "Down"} from yesterday
        </p>
      </div>
      <div className="bg-violet-100 p-6 rounded-xl text-violet-800 text-4xl">
        {icon}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 12000,
    revenueChange: 3,
    totalOrders: 500,
    ordersChange: 20,
    pendingOrders: 2,
    pendingChange: 0,
  });
  const [chartData, setChartData] = useState([
    { month: "January", demand: 210, supply: 200 },
    { month: "February", demand: 120, supply: 190 },
    { month: "March", demand: 180, supply: 210 },
    { month: "April", demand: 200, supply: 250 },
    { month: "May", demand: 310, supply: 200 },
    { month: "June", demand: 270, supply: 300 },
    { month: "July", demand: 350, supply: 340 },
    { month: "August", demand: 300, supply: 310 },
    { month: "September", demand: 200, supply: 360 },
    { month: "October", demand: 490, supply: 320 },
    { month: "November", demand: 450, supply: 410 },
    { month: "December", demand: 270, supply: 360 },
  ]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const downloadRef = useRef(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await axios.get("/api/farmer-dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }

    async function fetchChartData() {
      try {
        const response = await axios.get(
          `/api/demand-supply?year=${selectedYear}&category=${selectedCategory}`
        );
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    async function fetchWeather() {
      try {
        const farmerInfo = localStorage.getItem("farmerInfo");
        const farmerId = JSON.parse(farmerInfo).farmerId;

        // Fetch farmer details
        const { data: farmer } = await axios.get(
          `http://localhost:8000/api/farmers/${farmerId}/details`
        );
        const address = farmer.farmer.address;
        if (!address) throw new Error("Address not found");
        
        setLocation(address);

        // Convert address to lat/lon
        const { data: geoData } = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          { params: { q: address, format: "json", limit: 1 } }
        );

        if (!geoData.length) throw new Error("Geolocation not found");
        const { lat, lon } = geoData[0];

        // Fetch weather data
        const { data: weatherData } = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: lat,
              longitude: lon,
              timezone: "GMT",
              current: "temperature_2m,weather_code,wind_speed_10m",
              daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
              precipitation_unit: "inch",
              timeformat: "unixtime",
            },
          }
        );

        setWeather(weatherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    fetchDashboardStats();
    fetchChartData();
  }, [selectedYear, selectedCategory]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setIsDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <FarmerNav />

      <div className="p-6 md:p-10">
        {/* Weather Section */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Weather Forecast {location && <span className="text-lg font-normal text-gray-600">for {location}</span>}
          </h2>
          
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              <p>Error loading weather data: {error}</p>
            </div>
          ) : (
            <div>
              {/* Current Weather */}
              <WeatherCard data={weather} />
              
              {/* 7-Day Forecast */}
              <WeatherForecast weather={weather} />
              
              {/* Weather Graphs */}
              <WeatherGraphs weather={weather} />
            </div>
          )}
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            title="Total Revenue Generated"
            value={stats.totalRevenue}
            percentage={stats.revenueChange}
            icon={<FaRupeeSign />}
          />
          <DashboardCard
            title="Total Number of Orders"
            value={stats.totalOrders}
            percentage={stats.ordersChange}
            icon={<FaShoppingCart />}
          />
          <DashboardCard
            title="Total Pending Orders"
            value={stats.pendingOrders}
            percentage={stats.pendingChange}
            icon={<FaClock />}
          />
        </div>

        {/* Crop Demand Chart */}
        <div className="bg-white shadow-md rounded-xl p-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 md:mb-0">
              Crop Demand Over Year Trend
            </h2>
            <div className="flex flex-wrap gap-4">
              <select
                className="border border-gray-300 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <select
                className="border border-gray-300 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Category1">Fruit</option>
                <option value="Category2">Vegetables</option>
              </select>
              <div className="relative" ref={downloadRef}>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center transition-colors"
                  onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                >
                  <FaDownload className="mr-2" /> Download
                </button>
                {isDownloadOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
                    <button className="block px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                      Download CSV
                    </button>
                    <button className="block px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                label={{
                  value: "Quintals",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ color: "black" }} />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Demand"
              />
              <Area
                type="monotone"
                dataKey="supply"
                stroke="#FFE178"
                fill="#FFE178"
                fillOpacity={0.6}
                name="Supply"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
