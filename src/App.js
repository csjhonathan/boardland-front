import ResetStyle from './styles/Reset.js';
import GlobalStyles from './styles/GlobalStyles.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import Header from './components/Header.jsx';
import GamePage from './pages/GamePage.jsx';
import SessionContext from './context/sessionContext.js';
import { useState } from 'react';
export default function App() {
	const [sessionData, setSessionData] = useState({
		cart : [], total : 0,
	});
	return (
		<SessionContext.Provider value = {{sessionData, setSessionData}}>
			<BrowserRouter>
				<ResetStyle/>
				<GlobalStyles/>
				<Header/>
				<Routes>
					<Route path='/' element = {<HomePage/>}/>
					<Route path='/game/:ID' element = {<GamePage/>}/>
				</Routes>	
			</BrowserRouter>
		</SessionContext.Provider>
	);
}
