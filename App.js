import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	ActivityIndicator,
	Dimensions,
	ScrollView,
	StyleSheet,
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
	const [city, setCity] = useState('Loading...');
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);

	const API_KEY = '2a2ff4ca28199531e9a7ff4ce4811189';

	const icons = {
		Clouds: 'cloudy',
		Clear: 'day-sunny',
		Atmosphere: 'cloudy-gusts',
		Snow: 'snow',
		Rain: 'rains',
		Drizzle: 'rain',
		Thunderstorm: 'lightning',
	};

	const getWeather = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();
		if (!granted) {
			setOk(false);
		}
		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });
		const location = await Location.reverseGeocodeAsync(
			{ latitude, longitude },
			{ useGoogleMaps: false },
		);
		setCity(location[0].city);
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`,
		);
		const json = await response.json();
		setDays(json.daily);
	};

	useEffect(() => {
		getWeather();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar style='light'></StatusBar>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				horizontal
			>
				{days.length === 0 ? (
					<View style={{ ...styles.day, alignItems: 'center' }}>
						<ActivityIndicator
							color='black'
							size='large'
							style={{ marginTop: 10 }}
						/>
					</View>
				) : (
					days.map((day, index) => (
						<View key={index} style={styles.day}>
							<View style={styles.weatherContainer}>
								<Text style={styles.temperature}>
									{parseFloat(day.temp.day).toFixed(1)}
								</Text>
								<Fontisto
									name={icons[day.weather[0].main]}
									size={58}
									color='black'
									style={styles.icon}
								/>
							</View>
							<View style={styles.descriptionContainer}>
								<Text style={styles.main}>{day.weather[0].main}</Text>
								<Text style={styles.description}>
									{day.weather[0].description}
								</Text>
							</View>
						</View>
					))
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'powderblue',
	},
	city: {
		flex: 1.2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cityName: { fontSize: 68, fontWeight: '500' },

	weatherContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	day: { width: SCREEN_WIDTH, alignItems: 'center' },
	temperature: {
		fontSize: 80,
		fontWeight: '600',
		marginTop: 50,
		marginLeft: 20,
	},
	icon: { marginRight: 20 },
	descriptionContainer: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		width: '100%',
	},
	main: {
		fontSize: 30,
		marginTop: -10,
		marginLeft: 30,
	},
	description: { fontSize: 20, marginLeft: 30 },
});
