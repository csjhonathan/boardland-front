// import { useState, useEffet } from 'react';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import COLORS from '../constants/colors.js';
import HashLoaderScreen from '../components/HashLoader.jsx';
import SessionContext from '../context/sessionContext.js';
import PurchaseContext from '../context/purchaseContext.js';
import api from '../services/api.js';
import { IoTrashBin } from 'react-icons/io5';
import { HashLoader } from 'react-spinners';

import styled from 'styled-components';

export default function CartPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const [number, setNumber] = useState('');
	const [name, setName] = useState('');
	const [cvv, setCvv] = useState('');
	const [validate, setValidate] = useState('');

	const { sessionData, setSessionData } = useContext(SessionContext);
	const { setPurchaseData } = useContext(PurchaseContext);

	const navigate = useNavigate();

	async function handleLoadCart() {
		setIsLoading(true);

		const session = JSON.parse(localStorage.getItem('session')) || JSON.parse(sessionStorage.getItem('session'));

		if (!session) {
			const cart = JSON.parse(localStorage.getItem('cart'));
			setSessionData(cart);

			setIsLoading(false);
			return;
		}

		try {
			const { data } = await api.get('/cart');
	
			localStorage.setItem('cart', JSON.stringify(data));
			setSessionData(data);
		} catch (error) {
			alert(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleDeleteItem(id) {
		setIsDeleteLoading({id, state: true});
		
		const session = JSON.parse(localStorage.getItem('session')) || JSON.parse(sessionStorage.getItem('session'));
			
		const updatedCart = sessionData.cart.filter(game => game.id !== id);
		const total = updatedCart.reduce((acc, {price}) => acc += price, 0);
		const item = { ...sessionData, cart: updatedCart, total };

		try {
			if (session) {
				delete item.idUser;
				delete item._id;
		
				await api.post('/cart', item);
			}

			localStorage.setItem('cart', JSON.stringify(item));
			setSessionData(item);
		} catch (error) {
			alert(error.message);
		} finally {
			setIsDeleteLoading({id, state: false});
		}

	}

	function handleSaveData() {
		if (number.trim().length === 0 || name.trim().length === 0 || cvv.trim().length === 0 || validate.trim().length === 0) {
			alert('Preencha todos os campos!');
			return;
		}

		const games = sessionData.cart.map(item => { 
			const newGame = {
				id: item.id, name: item.name
			};
			return newGame;
		});

		const newCart = {
			games,
			total: sessionData.total,
			creditCard: {
				number,
				name,
				cvv,
				validate,
			}
		};

		setPurchaseData(newCart);
		navigate('/check-order');
	}

	useEffect(() => {
		handleLoadCart();
	}, []);

	if (isLoading) return <HashLoaderScreen color={COLORS.secondary} />;

	return (
		<Container>
			{sessionData.cart.length === 0 ? (
				<EmptyCart>
					<Title>Seu carrinho está vazio</Title>
					<Subtitle onClick={() => navigate('/')}>Voltar para a Página Inicial</Subtitle>
				</EmptyCart>
			) : (
				<>
					<Title>Confirmação do Pedido:</Title>
					<GamesContainer>
						{sessionData.cart.map(item => (
							<GameContent key={item.id}>
								<InfoContent>
									<Image src={item.image} alt={`Imagem do jogo ${item.name}`} />
									<TitleGame>{item.name}</TitleGame>
								</InfoContent>

								<InfoContent>
									<PriceGame>{item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</PriceGame>
									{isDeleteLoading.id === item.id && isDeleteLoading.state === true ? <HashLoader 
										color={COLORS.secondary}
										size={18}
									/> : <IoTrashBin onClick={() => handleDeleteItem(item.id)}/>}
									
								</InfoContent>
							</GameContent>
						))}
					</GamesContainer>

					<CreditCardContainer>
						<CreditCardLine>
							<CreditCardItem width='100%' placeholder="Número do cartão" value={number} onChange={(e) => setNumber(e.target.value)}/>
						</CreditCardLine>

						<CreditCardLine>
							<CreditCardItem width='100%' placeholder="Titular do Cartão" value={name} onChange={(e) => setName(e.target.value)}/>
						</CreditCardLine>

						<CreditCardLine>
							<CreditCardItem width='50%' placeholder="CVV" alignCenter value={cvv} onChange={(e) => setCvv(e.target.value)}/>
							<CreditCardItem width='50%' placeholder="Validade (MM/YY)" alignCenter value={validate} onChange={(e) => setValidate(e.target.value)}/>
						</CreditCardLine>
					</CreditCardContainer>

					<TotalContainer>
						<TotalValue>{sessionData.total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</TotalValue>
					</TotalContainer>

					<Button onClick={handleSaveData}>Ir Para a Finalização</Button>
					<Link to="/">Continuar comprando</Link>
				</>
			)}
			
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

const EmptyCart = styled.div`
	height: 100%;
	width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
`;

const Title = styled.h2`
	font-size: 20px;
	font-weight: 700;
	line-height: 1;

	color: ${COLORS.main};
`;

const Subtitle = styled.p`
	font-size: 12px;
	font-weight: 700;
	line-height: 1;

	color: ${COLORS.main};
`;

const GamesContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;

	margin-top: 16px;
`;

const GameContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const InfoContent = styled.div`
	display: flex;
	align-items: center;
	gap: 13px;

	svg {
			color: ${COLORS.main};
			font-size: 18px;
	}
`;

const Image = styled.img`
	width: 40px;
	height: 20px;

	object-fit: cover;

	border-radius: 5px;
`;

const TitleGame = styled.p`
	font-size: 14px;
	font-weight: 700;
	line-height: 1;

	color: #000;
`;

const PriceGame = styled.p`
	font-size: 12px;
	font-weight: 500;
	line-height: 1;

	color: #000;
`;

const CreditCardContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;

	margin-top: 25px;
`;

const CreditCardLine = styled.div`
	width: 100%;
	height: 40px;

	display: flex;
	gap: 10px;
`;

const CreditCardItem = styled.input`
	width: ${(props) => props.width};
	height: 100%;

	border-radius: 5px;
	background: ${COLORS.input};
	text-align: ${(props) => props.alignCenter ? 'center' : 'left'} ;

	padding: 0 15px;

	border: none;

	::placeholder {
		color: ${COLORS.placeholder};
	}
`;

const TotalContainer = styled.div`
	display: flex;
	justify-content: flex-end;

	margin-top: 20px;
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

	background: ${COLORS.main};
	color: #FFF;
	border: none;
	border-radius: 5px;
`;