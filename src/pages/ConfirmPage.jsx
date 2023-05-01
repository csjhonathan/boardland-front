/* eslint-disable no-unused-vars */
// import { useState, useEffet } from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import COLORS from '../constants/colors.js';
import PurchaseContext from '../context/purchaseContext.js';
import SessionContext from '../context/sessionContext.js';
import { ThreeDots } from 'react-loader-spinner';

import styled from 'styled-components';
import api from '../services/api.js';

export default function ConfirmPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSucceeded, setIsSucceeded] = useState(false);

	const navigate = useNavigate();
	const { purchaseData, setPurchaseData } = useContext(PurchaseContext);
	const { setSessionData } = useContext(SessionContext);

	const session = JSON.parse(localStorage.getItem('session')) || JSON.parse(sessionStorage.getItem('session'));

	function hiddenNumber(number) {
		const newNumber = number.replace(/(.{4})/g, '$1 ');
		const first = newNumber.slice(0, 4);
		const second = newNumber.slice(4).replace(/\d/g, '*');
		const hidden = first + second;
		return hidden;
	}

	async function handleSendOrder() {
		try {
			setIsLoading(true);

			await api.post('/purchase', purchaseData);
			
			const newCart = {
				cart: [],
				total: 0
			};

			await api.post('/cart', newCart);

			localStorage.setItem('cart', JSON.stringify(newCart));
			setSessionData(newCart);
			setIsSucceeded(true);
		} catch (error) {
			alert(`Erro: ${error.response.data}`);
		} finally {
			setIsLoading(false);
			setPurchaseData(null);
		}
	}

	if (!isSucceeded && !purchaseData) return <Navigate to="/" />;

	if (!session) return <Navigate to="/login" />;

	if (isSucceeded) return (
		<CenterContainer>
			<Title>Pedido concluído com sucesso</Title>
			<Button onClick={() => navigate('/')}>Voltar para o início</Button>
		</CenterContainer>
	);

	return (
		<Container>
			<ItemsContainer>
				<Title>Finalização do Pedido:</Title>
				{purchaseData.games.map(item => (
					<ItemContent key={item.id}>
						<ItemTitle>{item.name}</ItemTitle>

						<ItemPrice>{item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</ItemPrice>
					</ItemContent>
				))}
			</ItemsContainer>

			<TotalContainer>
				<TotalValue>Total: {purchaseData.total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TotalValue>
			</TotalContainer>

			<ItemsContainer>
				<Title>Forma de Pagamento:</Title>
				<ItemContent>
					<ItemTitle>Cartão de Crédito</ItemTitle>
					<ItemTitle>{hiddenNumber(purchaseData.creditCard.number)}</ItemTitle>
				</ItemContent>
			</ItemsContainer>

			<ItemsContainer>
				<Title>Endereço:</Title>
				<ItemContent>
					<ItemTitle>{session.address}</ItemTitle>
				</ItemContent>
			</ItemsContainer>

			<Button onClick={handleSendOrder}>
				{isLoading ? <ThreeDots
					height="8px"
					radius="9"
					color="#FFF"
					ariaLabel="three-dots-loading"
					visible={true}
				/> : (
					'Fechar pedido')}
			</Button>
			<Link to="/">Voltar para a tela inicial</Link>
		</Container>
	);
}

const Container = styled.div`
	height: 100vh;
	width: 100vw;

	padding: 100px 20px 20px 20px;

	a {
		font-size: 12px;
		font-weight: 700;
		margin-top: 8px;
		
		display: block;

		text-decoration: none;
		text-align: center;
		color: ${COLORS.main};
	}
`;

const CenterContainer = styled.div`
	height: 100vh;
	width: 100vw;

	padding: 20%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;

	h2 {
		text-align: center;
	}

	button {
		max-width: 250px;
	}
`;

const Title = styled.h2`
	font-size: 20px;
	font-weight: 700;
	line-height: 1;

	color: ${COLORS.main};
`;

const ItemsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	margin-top: 16px;
`;

const ItemContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ItemTitle = styled.p`
	font-size: 14px;
	font-weight: 700;
	line-height: 1;

	color: #000;
`;

const ItemPrice = styled.p`
	font-size: 12px;
	font-weight: 500;
	line-height: 1;

	color: #000;
`;

const TotalContainer = styled.div`
	display: flex;
	justify-content: flex-end;

	margin-top: 16px;
`;

const TotalValue = styled.p`
	font-size: 14px;
	font-weight: 700;
	line-height: 1;

	color: #000;
`;

const Button = styled.button`
	margin-top: 20px;
	width: 100%;
	height: 40px;

	font-size: 20px;
	font-weight: 700;
	line-height: 1;
	text-align: center;

	display: flex;
	align-items: center;
	justify-content: center;

	background: ${COLORS.main};
	color: #FFF;
	border: none;
	border-radius: 5px;
`;