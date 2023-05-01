import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import styled from 'styled-components';
import Footer from '../components/Footer.jsx';
import { useContext } from 'react';
import SessionContext from '../context/sessionContext.js';
import HashLoaderScreen from '../components/HashLoader.jsx';
import COLORS from '../constants/colors.js';
import AuthContext from '../context/authContext.js';
import api from '../services/api.js';

export default function HomePage(){
	const [games, setGames] = useState(null);
	const {sessionData, setSessionData} = useContext(SessionContext);
	const {setAuthData} = useContext(AuthContext);

	useEffect(()=> {
		if(localStorage.getItem('session') || sessionStorage.getItem('session')){
			const {idUser, name, email, address, image, token} = JSON.parse(localStorage.getItem('session')) || JSON.parse(sessionStorage.getItem('session'));
			setAuthData({idUser, name, email, address, image, token});
		}
		getAllGames(); 
	},[]);

	async function getAllGames(){
		try{
			const response = await api.get('/games');
			const gamesList = response.data;
			setGames(gamesList);
		}catch(err){
			alert(err.response.data.message);
		}
	}

	if(!games) return <HashLoaderScreen color={COLORS.secondary}/>;
	
	const category = games.reduce((acc, game) => {
		if (!acc[game.max]) {
			acc[game.max] = [];
		}
		acc[game.max].push(game);
		return acc;
	}, {});

	return(
		<>{
			<Container>
				{Object.entries(category).map(([max, games]) => (
					<GameGroup key={max}>
						<h2>{`Até ${max} jogadores`}</h2>
						<GameList>
							{games.map(({ _id, name, image, price, min, max }) => (
								<GameCard
									key={_id}
									id={_id}
									name={name}
									image={image}
									price={price}
									min={min}
									max={max}
									onCart={sessionData.cart.some((game) => game.id === _id)}
									sessionData={sessionData}
									setSessionData={setSessionData}
								/>
							))}
						</GameList>
					</GameGroup>
				))}
			</Container>
		}			
		<Footer 
			total = {sessionData.total}
			cart = {sessionData.cart}
		/>
		</>
	);
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 90px;
`;
const GameGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  h2 {
    border-top: 1px solid ${COLORS.placeholder};
    padding-top: 20px;
    padding-left: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
  } 
`;
const GameList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
`;