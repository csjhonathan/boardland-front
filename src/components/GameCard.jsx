/*eslint-disable react/prop-types*/
import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import { useNavigate } from 'react-router-dom';
export default function GameCard({id, name, image, price, sessionData, setSessionData, onCart}){
	const navigate = useNavigate();
	function handleCart(id){

		const gameOnCart = sessionData.cart.find(game => game.id === id);
		if(gameOnCart){
			const updatedCart = sessionData.cart.filter(game => game.id!==id);
			const total = updatedCart.reduce((acc, {price}) => acc+=price, 0);
			setSessionData({...sessionData, cart : updatedCart ,total});
			return;
		}
		const game = {
			id,
			name,
			image,
			price,
		};

		const updatedCart = [...sessionData.cart, game];
		const total = updatedCart.reduce((acc, {price}) => acc+=price, 0);
		setSessionData({...sessionData, cart : updatedCart ,total});
	}
	return(
		<CardContainer >
			<CardImage src={image} alt = {`imagem referente ao jogo ${name}`}/>
			<CardName >
				{name}
			</CardName>
			<CardPrice>
				{`R$ ${price.toFixed(2).replace('.',',')}`}
			</CardPrice>
			<CardButton onCart = {onCart} onClick={()=> handleCart(id)}>
				{onCart ? 'No Carrinho' : 'Coloca no carrinho'}
			</CardButton>
			<Details onClick={() => navigate(`/game/${id}`)}>Ver detalhes</Details>
		</CardContainer>
	);
}

const CardContainer = styled.div`
  position: relative;
  background-color: ${COLORS.main};
  width: 150px;
  min-height: 200px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 15px;
  &:hover{
    box-shadow: 4px 4px lightgray;
  }
`;

const CardImage = styled.img`
  width: 120px;
  height: 70px;
  border-radius: 5px;
  object-fit: cover;
  margin-bottom: 4px;
`;
const CardName = styled.p`
  align-self: flex-start;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 12px;
  color: ${COLORS.neutral};
  margin-bottom: 2px;
`;
const CardPrice = styled.p`
  align-self: flex-start;
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 15px;
  color: ${COLORS.neutral};
`;
const CardButton = styled.button`
  width: 120px;
  height: 25px;
  background: ${({onCart}) => onCart ? COLORS.selected : COLORS.secondary};
  border-radius: 5px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: ${COLORS.neutral};
  transition: all .5s;
`;

const Details = styled.button`
  width: 120px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  align-items: center;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: ${COLORS.neutral};
  background-color: transparent;
`;