import axios from 'axios';
import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard.jsx';
import styled from 'styled-components';
import Footer from '../components/Footer.jsx';
export default function HomePage(){
	const [games, setGames] = useState([]);
	const [cart, setCart] = useState([]);
	const [total, setTotal] = useState(0);
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
							onCart = {cart.some(game => game.id===_id)}
							cart = {cart}
							setCart = {setCart}
							total = {total}
							setTotal = {setTotal}  
						/>
					);
				})}
			</Container>
			<Footer 
				total = {total}
				cart = {cart}
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