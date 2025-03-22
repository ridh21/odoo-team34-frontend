// "use client";

// import FarmerNav from "@/components/FarmerNavbar";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import moment from "moment";
// import {
//   FaShoppingCart,
//   FaClock,
//   FaRupeeSign,
//   FaDownload,
//   FaMapMarkerAlt,
//   FaTemperatureHigh,
//   FaWind,
//   FaChartLine,
//   FaCalendarAlt,
//   FaFilter,
// } from "react-icons/fa";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Bar,
//   BarChart,
// } from "recharts";
// import { WiDaySunny, WiCloud, WiRain, WiSnow, WiDayHaze, WiThunderstorm, WiDayFog } from "react-icons/wi";

// const getWeatherIcon = (conditionText, size = 40) => {
//   if (conditionText.includes("Sunny")) return <WiDaySunny size={size} className="text-yellow-500" />;
//   if (conditionText.includes("Cloud") || conditionText.includes("Overcast"))
//     return <WiCloud size={size} className="text-gray-500" />;
//   if (conditionText.includes("Rain")) return <WiRain size={size} className="text-blue-500" />;
//   if (conditionText.includes("Thunder")) return <WiThunderstorm size={size} className="text-purple-500" />;
//   return <WiDaySunny size={size} className="text-yellow-500" />;
// };

// const WeatherCard = ({ data }) => {
//   if (!data) return <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>;

//   const { temp_c, condition, wind_kph, humidity } = data.current;

//   return (
//     <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
//       <div className="flex justify-between items-center">
//         <div>
//           <h3 className="text-2xl font-bold">{Math.round(temp_c)}°C</h3>
//           <p className="text-lg font-medium">{condition.text}</p>
//           <div className="flex items-center mt-3">
//             <FaWind className="mr-2" />
//             <span className="text-sm">{wind_kph} km/h</span>
//           </div>
//           <div className="flex items-center mt-2">
//             <span className="text-sm">Humidity: {humidity}%</span>
//           </div>
//         </div>
//         <div className="text-right">
//           {getWeatherIcon(condition.text, 70)}
//           <p className="text-sm mt-2 font-medium">{moment().format("dddd, MMM D")}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const WeatherForecast = ({ forecast }) => {
//   if (!forecast) return <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mt-6">
//       <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//         <FaCalendarAlt className="mr-2 text-blue-600" />
//         7-Day Forecast
//       </h3>
//       <div className="grid grid-cols-7 gap-2">
//         {forecast.forecastday.map((day, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center p-2 hover:bg-blue-50 rounded-lg transition-colors"
//           >
//             <p className="font-medium text-gray-700">{moment(day.date).format("ddd")}</p>
//             {getWeatherIcon(day.day.condition.text, 30)}
//             <p className="mt-1 font-bold text-gray-800">{Math.round(day.day.maxtemp_c)}°</p>
//             <p className="text-gray-500 text-sm">{Math.round(day.day.mintemp_c)}°</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const WeatherGraphs = ({ forecast }) => {
//   if (!forecast) return null;

//   const chartData = forecast.forecastday.map((day) => ({
//     date: moment(day.date).format("MMM DD"),
//     maxTemp: Math.round(day.day.maxtemp_c),
//     minTemp: Math.round(day.day.mintemp_c),
//     precipitation: day.day.totalprecip_mm,
//   }));

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//           <FaTemperatureHigh className="mr-2 text-orange-500" />
//           Temperature Trend (°C)
//         </h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis dataKey="date" stroke="#8884d8" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="maxTemp" stroke="#ff7300" name="Max Temp" />
//             <Line type="monotone" dataKey="minTemp" stroke="#387908" name="Min Temp" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//           <WiRain className="mr-2 text-blue-500" size={28} />
//           Precipitation (mm)
//         </h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis dataKey="date" stroke="#8884d8" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="precipitation" fill="#4299e1" name="Precipitation" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const [weather, setWeather] = useState(null);
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchWeather() {
//       try {
//         const farmerInfo = localStorage.getItem("farmerInfo");
//         const farmerId = JSON.parse(farmerInfo).farmerId;

//         // Fetch farmer details
//         const { data: farmer } = await axios.get(
//           `http://localhost:8000/api/farmers/${farmerId}/details`
//         );
//         const address = farmer.farmer.address;
//         setLocation(address);

//         // Convert address to lat/lon using PositionStack API
//         const { data: geoData } = await axios.get(
//           `http://api.positionstack.com/v1/forward`,
//           {
//             params: {
//               access_key: "0d41a6728f3543d59a8180047252203", // Replace with your PositionStack API key
//               query: address,
//               limit: 1,
//             },
//           }
//         );

//         if (!geoData.data.length) throw new Error("Geolocation not found");
//         const { latitude: lat, longitude: lon } = geoData.data[0];

//         // Fetch weather data
//         const { data: weatherData } = await axios.get(
//           "https://api.weatherapi.com/v1/forecast.json",
//           {
//             params: {
//               key: process.env.NEXT_PUBLIC_WEATHER_API_KEY, // Replace with your WeatherAPI key
//               q: `${lat},${lon}`,
//               days: 7,
//             },
//           }
//         );

//         setWeather(weatherData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchWeather();
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <FarmerNav />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Weather Section */}
//         <section className="mb-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//             <FaMapMarkerAlt className="mr-2 text-blue-600" />
//             Weather Forecast
//             {location && (
//               <span className="text-lg font-normal text-gray-600 ml-2">
//                 for {location}
//               </span>
//             )}
//           </h2>

//           {error ? (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//               <p className="font-medium">Error loading weather data: {error}</p>
//             </div>
//           ) : loading ? (
//             <div className="space-y-4">
//               <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>
//               <div className="animate-pulse bg-gray-200 h-60 rounded-lg"></div>
//             </div>
//           ) : (
//             <div>
//               <WeatherCard data={weather} />
//               <WeatherForecast forecast={weather.forecast} />
//               <WeatherGraphs forecast={weather.forecast} />
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
  FaChartLine,
  FaCalendarAlt,
  FaFilter,
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

const getWeatherIcon = (weatherCode, size = 40) => {
  // Weather codes based on WMO standards
  if ([0, 1].includes(weatherCode)) return <WiDaySunny size={size} className="text-yellow-500" />;
  if ([2, 3].includes(weatherCode)) return <WiCloud size={size} className="text-gray-500" />;
  if ([45, 48].includes(weatherCode)) return <WiDayFog size={size} className="text-gray-400" />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(weatherCode)) return <WiRain size={size} className="text-blue-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return <WiSnow size={size} className="text-blue-200" />;
  if ([95, 96, 99].includes(weatherCode)) return <WiThunderstorm size={size} className="text-purple-500" />;
  return <WiDayHaze size={size} className="text-orange-300" />;
};

const getWeatherDescription = (weatherCode) => {
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
  if (!data) return <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>;

  const currentTemp = data.current?.temperature_2m || 0;
  const weatherCode = data.current?.weather_code || 0;
  const windSpeed = data.current?.wind_speed_10m || 0;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">{Math.round(currentTemp)}°C</h3>
          <p className="text-lg font-medium">{getWeatherDescription(weatherCode)}</p>
          <div className="flex items-center mt-3">
            <FaMapMarkerAlt className="mr-2" />
            <span className="text-sm">Your Location</span>
          </div>
          <div className="flex items-center mt-2">
            <FaWind className="mr-2" />
            <span className="text-sm">{windSpeed} km/h</span>
          </div>
        </div>
        <div className="text-right">
          {getWeatherIcon(weatherCode, 70)}
          <p className="text-sm mt-2 font-medium">{moment().format('dddd, MMM D')}</p>
        </div>
      </div>
    </div>
  );
};

const WeatherForecast = ({ weather }) => {
  if (!weather || !weather.daily) return <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaCalendarAlt className="mr-2 text-blue-600" />
        7-Day Forecast
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {weather.daily.time.map((time, index) => {
          const date = moment.unix(time).format("ddd");
          const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
          const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
          const precipitation = weather.daily.precipitation_sum[index];

          // Using a placeholder weather code since your data doesn't have daily weather codes
          const weatherCode = precipitation > 5 ? 61 : precipitation > 0 ? 3 : 0;

          return (
            <div key={index} className="flex flex-col items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaTemperatureHigh className="mr-2 text-orange-500" />
          Temperature Trend (°C)
        </h3>
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <WiRain className="mr-2 text-blue-500" size={28} />
          Precipitation (inch)
        </h3>
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
              fill="#4299e1"
              name="Precipitation"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, percentage, icon, color }) => {
  const isPositive = percentage >= 0;
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between w-full border border-gray-200 transform transition-all duration-300 hover:shadow-lg">
      <div>
        <h3 className="text-gray-700 text-lg font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {value.toLocaleString()}
        </p>
        <p
          className={`text-sm font-medium mt-2 ${
            isPositive ? "text-green-600" : "text-red-600"
          } flex items-center`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(percentage)}% from yesterday
        </p>
      </div>
      <div className={`${color} p-4 rounded-full text-white text-2xl`}>
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
    <div className="bg-gray-50 min-h-screen">
      <FarmerNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor your farm performance, weather conditions, and market trends
          </p>
        </div>

        {/* Dashboard Stats */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartLine className="mr-2 text-blue-600" />
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Total Revenue"
              value={stats.totalRevenue}
              percentage={stats.revenueChange}
              icon={<FaRupeeSign />}
              color="bg-green-600"
            />
            <DashboardCard
              title="Total Orders"
              value={stats.totalOrders}
              percentage={stats.ordersChange}
              icon={<FaShoppingCart />}
              color="bg-blue-600"
            />
            <DashboardCard
              title="Pending Orders"
              value={stats.pendingOrders}
              percentage={stats.pendingChange}
              icon={<FaClock />}
              color="bg-amber-600"
            />
          </div>
        </section>

        {/* Weather Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-600" />
            Weather Forecast
            {location && <span className="text-lg font-normal text-gray-600 ml-2">for {location}</span>}
          </h2>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error loading weather data: {error}</p>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-60 rounded-lg"></div>
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
        </section>

        {/* Crop Demand Chart */}
        <section className="mb-10">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
                <FaChartLine className="mr-2 text-blue-600" />
                Crop Demand & Supply Trends
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="relative inline-flex">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCalendarAlt className="text-gray-500" />
                  </div>
                  <select
                    className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div className="relative inline-flex">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaFilter className="text-gray-500" />
                  </div>
                  <select
                    className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Category1">Fruits</option>
                    <option value="Category2">Vegetables</option>
                  </select>
                </div>

                <div className="relative" ref={downloadRef}>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                  >
                    <FaDownload className="mr-2" /> Export
                  </button>
                  {isDownloadOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg z-50 overflow-hidden border border-gray-200">
                      <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                        <FaDownload className="mr-2 text-gray-500" /> Export as CSV
                      </button>
                      <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                        <FaDownload className="mr-2 text-gray-500" /> Export as PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-600 text-sm">
                This chart shows the comparison between crop demand and supply throughout the year.
                Use this data to plan your cultivation and maximize profits.
              </p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#4a5568' }}
                  axisLine={{ stroke: '#cbd5e0' }}
                />
                <YAxis
                  label={{
                    value: "Quintals",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: 'middle', fill: '#4a5568' }
                  }}
                  tick={{ fill: '#4a5568' }}
                  axisLine={{ stroke: '#cbd5e0' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="demand"
                  stroke="#8884d8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDemand)"
                  name="Market Demand"
                />
                <Area
                  type="monotone"
                  dataKey="supply"
                  stroke="#ffc658"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSupply)"
                  name="Market Supply"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-2">Demand Insights</h4>
                <p className="text-purple-700 text-sm">
                  Market demand peaks in October-November. Consider planning your harvest cycles to align with these high-demand periods.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-2">Supply Insights</h4>
                <p className="text-amber-700 text-sm">
                  Market supply is highest in November-December. To maximize profits, consider crops that have high demand but lower supply.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;