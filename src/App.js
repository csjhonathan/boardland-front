import ResetStyle from './styles/Reset.js';
import GlobalStyles from './styles/GlobalStyles.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import Header from './components/Header.jsx';
import GamePage from './pages/GamePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LogoutPage from './pages/LogoutPage.jsx';
import SessionContext from './context/sessionContext.js';
import { useState, useEffect } from 'react';
import AuthContext from './context/authContext.js';
import api from './services/api.js';

export default function App() {
	const [authData, setAuthData] = useState();
	const [sessionData, setSessionData] = useState({
		cart: [], total: 0,
	});

	async function getCartData() {
		const session = JSON.parse(localStorage.getItem('session')) || JSON.parse(sessionStorage.getItem('session'));

		if (session) {
			const { data } = await api.get('/cart');

			setSessionData(data);
			return;
		}

		const cart = JSON.parse(localStorage.getItem('cart'));

		if (cart) {
			setSessionData(cart);
		}
	}

	useEffect(() => {
		getCartData();
	}, []);

	return (
		<AuthContext.Provider value={{ authData, setAuthData }}>
			<SessionContext.Provider value={{ sessionData, setSessionData }}>
				<BrowserRouter>
					<ResetStyle />
					<GlobalStyles />
					<Header />
					<Routes>
						<Route path='/login' element={<LoginPage />} />
						<Route path='/signup' element={<SignUpPage />} />
						<Route path='/logout' element={<LogoutPage />} />
						<Route path='/' element={<HomePage />} />
						<Route path='/game/:ID' element={<GamePage />} />
					</Routes>
				</BrowserRouter>
			</SessionContext.Provider>
		</AuthContext.Provider>
	);
}
