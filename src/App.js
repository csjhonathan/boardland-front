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
import { useState } from 'react';
import AuthContext from './context/authContext.js';

export default function App() {
	const [authData, setAuthData] = useState();
	const [sessionData, setSessionData] = useState({
		cart : [], total : 0,
	});
	return (
		<AuthContext.Provider value = {{authData, setAuthData}}>
			<SessionContext.Provider value = {{sessionData, setSessionData}}>
				<BrowserRouter>
					<ResetStyle/>
					<GlobalStyles/>
					<Header/>
					<Routes>
						<Route path='/login' element = {<LoginPage/>}/>
						<Route path='/signup' element = {<SignUpPage/>}/>
						<Route path='/logout' element = {<LogoutPage/>}/>
						<Route path='/' element = {<HomePage/>}/>
						<Route path='/game/:ID' element = {<GamePage/>}/>
					</Routes>	
				</BrowserRouter>
			</SessionContext.Provider>
		</AuthContext.Provider>
	);
}
