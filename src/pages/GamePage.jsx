import styled from 'styled-components';
import Footer from '../components/Footer.jsx';
import { useContext, useEffect, useState } from 'react';
import SessionContext from '../context/sessionContext.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import COLORS from '../constants/colors.js';
import {BsFillPeopleFill} from 'react-icons/bs';
import HashLoaderScreen from '../components/HashLoader.jsx';
import AuthContext from '../context/authContext.js';
export default function GamePage(){
	const {sessionData, setSessionData} = useContext(SessionContext);
	const {setAuthData} = useContext(AuthContext);
	const [game, setGame] = useState(null);
	const {ID} = useParams();
	const navigate = useNavigate();

	useEffect(()=> {
		if(localStorage.getItem('session')){
			const {idUser, name, email, address, image, token} = JSON.parse(localStorage.getItem('session'));
			setAuthData({idUser, name, email, address, image, token});
		}
		getGame();
	},[]);

	async function getGame(){
		try{
			const response = await axios.get(`${process.env.REACT_APP_API_URL}/games/${ID}`);
			setGame(response.data);
		}catch(err){
			alert(err.response.data.message);
		}
	}
	
	function handleCart(id){

		const gameOnCart = sessionData.cart.find(game => game.id === id);
		if(gameOnCart){
			const updatedCart = sessionData.cart.filter(game => game.id!==id);
			const total = updatedCart.reduce((acc, {price}) => acc+=price, 0);
			setSessionData({...sessionData, cart : updatedCart ,total});
			return;
		}
		const addGame = {
			id : game._id,
			name : game.name,
			image : game.image,
			price : game.price,
		};

		const updatedCart = [...sessionData.cart, addGame];
		const total = updatedCart.reduce((acc, {price}) => acc+=price, 0);
		setSessionData({...sessionData, cart : updatedCart ,total});
	}

	if(!game) return <HashLoaderScreen color={COLORS.secondary}/>;
	
	return(
		<>
			<Container>
				<GameContainer>
					<ImageContainer>
						<GameImage src={game.image} alt = {`imagem referente ao jogo ${game.name}`}/>
						<Players> <PlayersIcon/> {`${game.min}-${game.max}`}</Players>
					</ImageContainer>
					<GameTitle>
						{game.name}
						<GamePrice>
							{`R$ ${game.price.toFixed(2).replace('.',',')}`}
						</GamePrice>
					</GameTitle>
					<GameDescription>
						{game.description}
					</GameDescription>
					<GameButton onCart = {sessionData.cart.some(g => g.id === game._id)} onClick={()=> handleCart(game._id)}>
						{sessionData.cart.some(({id}) => ID===id) ? 'No Carrinho' : 'Adicionar ao carrinho'}
					</GameButton>
				</GameContainer>

				<BackToHome onClick={() => navigate('/')}>
					Voltar para a página inicial
				</BackToHome>
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
	display: flex;
	align-items: center;
	flex-direction : column;
`;

const GameContainer = styled.div`
  position: relative;
  background-color: ${COLORS.main};
  width: 350px;
	height: 420px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 15px;
`;

const GameImage = styled.img`
  width: 100%;
	height: 150px;
  border-radius: 5px;
	object-fit: contain;
`;
const GameTitle = styled.p`
	display: flex;
	justify-content: space-between;
  align-self: flex-start;
  font-style: normal;
  font-weight: 700;
	font-size: 28px;
	line-height: 28px;
  color: ${COLORS.neutral};
	width: 100%;
`;
const GamePrice = styled.p`
  align-self: flex-start;
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 15px;
  color: ${COLORS.neutral};
`;
const GameButton = styled.button`
  width: 100%;
  height: 40px;
  background: ${({onCart}) => onCart ? COLORS.selected : COLORS.secondary};
  border-radius: 5px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: ${COLORS.neutral};
  transition: all .5s;
`;
const GameDescription = styled.div`
	height: 150px;
	width: 100%;
	overflow: scroll;
	font-family: 'Farro';
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	line-height: 12px;
	color:${COLORS.neutral};
`;
const BackToHome = styled.button`
	border: none;
	background-color: transparent;
	width: 280px;
	height: 24px;
	font-family: 'Farro';
	font-style: normal;
	font-weight: 700;
	font-size: 17px;
	line-height: 12px;
	text-align: center;
	color: ${COLORS.main};
	margin-top: 30px;
`;

const Players = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
	display: flex;
	width: 66px;
	height: 27px;
	background: ${COLORS.neutral};
	justify-content: space-evenly;
	align-items: center;
	border-radius: 5px;
	font-family: 'Farro';
	font-weight: 700;
	color: ${COLORS.main};
`;

const PlayersIcon = styled(BsFillPeopleFill)`
	width: 20px;
	height: 15px;
`;

const ImageContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
`;