import axios from 'axios';
import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import styled from 'styled-components';
import Footer from '../components/Footer.jsx';
import { useContext } from 'react';
import SessionContext from '../context/sessionContext.js';
import HashLoaderScreen from '../components/HashLoader.jsx';
import COLORS from '../constants/colors.js';
export default function HomePage(){
	const [games, setGames] = useState(null);
	const {sessionData, setSessionData} = useContext(SessionContext);
	useEffect(() => {
		getAllGames();
	}, []);
	async function getAllGames(){
		try{
			const response = await axios.get(`${process.env.REACT_APP_API_URL}/games`);
			const gamesList = response.data;
			setGames(gamesList);
		}catch(err){
			alert(err.response.data.message);
		}
	}

	if(!games) return <HashLoaderScreen color={COLORS.secondary}/>;
	
	return(
		<>
			<Container>
				{games.map(({_id, name, image, price, min, max})=>{
					return(
						<GameCard
							key={_id}
							id = {_id}
							name = {name}
							image = {image}
							price = {price}
							min = {min}
							max = {max}
							onCart = {sessionData.cart.some(game => game.id===_id)}
							sessionData = {sessionData}
							setSessionData = {setSessionData}
						/>
					);
				})}
			</Container>
			<Footer 
				total = {sessionData.total}
				cart = {sessionData.cart}
			/>
		</>
	);
}

const Container = styled.div`
  padding-top: 115px;
  padding-bottom: 70px;
  display: grid;
  justify-items: center;
  justify-content: center;
  grid-template-columns: 0.45fr 0.2fr 0.45fr;
  grid-row-gap: 25px;
`;