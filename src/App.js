import ResetStyle from './styles/Reset.js';
import GlobalStyles from './styles/GlobalStyles.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import Header from './components/Header.jsx';
function App() {
	return (
		<BrowserRouter>
			<ResetStyle/>
			<GlobalStyles/>
			<Header/>
			<Routes>
				<Route path='/' element = {<HomePage/>}/>
			</Routes>	
		</BrowserRouter>
	);
}

export default App;
