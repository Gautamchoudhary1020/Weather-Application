import { RotatingLines } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function MyWeather() {
	const [input, setInput] = useState('');
	const [weather, setWeather] = useState({
		loading: false,
		data: {},
		error: false,
	});

	const toDateTimeFunction = () => {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
			'September', 'October', 'November', 'December',
		];
		const WeekDays = [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
		];
		const currentDate = new Date();
		const day = WeekDays[currentDate.getDay()];
		const date = currentDate.getDate();
		const month = months[currentDate.getMonth()];
		const hours = currentDate.getHours().toString().padStart(2, '0');
		const minutes = currentDate.getMinutes().toString().padStart(2, '0');
		const time = `${hours}:${minutes}`;

		return `${day} ${date} ${month}, ${time}`;
	};

	const handleSearch = async () => {
		if (input.trim() === '') return; 

		setWeather({ ...weather, loading: true });
		const url = 'https://api.openweathermap.org/data/2.5/weather';
		const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
		await axios
			.get(url, {
				params: {
					q: input,
					units: 'metric',
					appid: api_key,
				},
			})
			.then((res) => {
				console.log('res', res);
				setWeather({ data: res.data, loading: false, error: false });
			})
			.catch((error) => {
				setWeather({ ...weather, data: {}, error: true });
				setInput('');
				console.log('error', error);
			});
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSearch();
		}
	};

	return (
		<div className="App">
			<h1 className="app-name">
      Weather Today: Discover the Forecast for Your City
			</h1>
			<div className="search-bar">
				<input
					type="text"
					className="city-search"
					placeholder="Enter City Name.."
					name="query"  
					value={input}
					onChange={(event) => setInput(event.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<FontAwesomeIcon
					icon={faMagnifyingGlass}
					className="search-icon"
					onClick={handleSearch}
				/>
			</div>

			{weather.loading && (
				<>
					<br />
					<br />
					<RotatingLines type="Oval" color="green" height={100} width={100} />
				</>
			)}
			{weather.error && (
				<>
					<br />
					<br />
					<span className="error-message">
						<FontAwesomeIcon icon={faFrown} />
						<span style={{ fontSize: '30px' }}>City not found</span>
					</span>
				</>
			)}
			{weather && weather.data && weather.data.main && (
				<div className='secondbox'>
					<div className="city-name">
						<h2>
							{weather.data.name}, <span>{weather.data.sys.country}</span>
						</h2>
					</div>
					<div className="date">
						<span>{toDateTimeFunction()}</span>
					</div>
					<div className="icon-temp">
						<img
							className=""
							src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
							alt={weather.data.weather[0].description}
						/>
						{Math.round(weather.data.main.temp)}
						<sup className="deg">°C</sup>
					</div>
					<div className="des-wind">
						<p>{weather.data.weather[0].description.toUpperCase()}</p>
						<p>Wind Speed: {weather.data.wind.speed}m/s</p>
					</div>
          
          </div>
        
			)}
		</div>
	);
  
}

export default MyWeather;
