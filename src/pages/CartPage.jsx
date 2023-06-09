/* eslint-disable no-unused-vars */
// import { useState, useEffet } from 'react';
import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import COLORS from '../constants/colors.js';
import HashLoaderScreen from '../components/HashLoader.jsx';
import SessionContext from '../context/sessionContext.js';
import PurchaseContext from '../context/purchaseContext.js';
import api from '../services/api.js';
import { IoTrashBin } from 'react-icons/io5';
import { HashLoader } from 'react-spinners';

import styled, { css } from 'styled-components';

export default function CartPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const [number, setNumber] = useState('');
	const [name, setName] = useState('');
	const [cvv, setCvv] = useState('');
	const [validate, setValidate] = useState('');

	const [hasErrors, setHasErrors] = useState({number: false, name: false, cvv: false, validate: false});
	const [messagesErrors, setMessagesErrors] = useState({number: '', name: '', cvv: '', validate: ''});

	const { sessionData, setSessionData } = useContext(SessionContext);
	const { setPurchaseData } = useContext(PurchaseContext);

	const navigate = useNavigate();
	const numberRef = useRef(null);
	const nameRef = useRef(null);
	const cvvRef = useRef(null);
	const validateRef = useRef(null);

	function handleChangeNumber(e) {
		const { value } = e.target;

		const formattedValue = value
			.replace(/\D/g, '') 
			.replace(/(.{4})/g, '$1 ')
			.trim();

		setNumber(formattedValue);
	}

	function handleChangeCVV(e) {
		const { value } = e.target;

		const formattedValue = value.replace(/\D/g, '');

		setCvv(formattedValue);
	}

	function handleChangeValidate(e) {
		let value = e.target.value.replace(/\D/g, '');

		if (value.length > 2) {
			value = value.substring(0, 2) + '/' + value.substring(2);
		}
	
		setValidate(value);
	}

	async function handleLoadCart() {
		setIsLoading(true);

		const session = JSON.parse(localStorage.getItem('session'))?.cart || JSON.parse(sessionStorage.getItem('session'));

		if (!session) {
			
			const cart = JSON.parse(localStorage.getItem('cart'))?.cart || sessionData.cart;
			setSessionData({...sessionData, cart});
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

	function isValidData() {
		const regextNumber = /^[0-9]{16}$/;
		const regexCvv = /^[0-9]{3}$/;
		const regexValidate = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

		let errors = {number: false, name: false, cvv: false, validate: false};
		let messages = {number: '', name: '', cvv: '', validate: ''};

		const isNumberValid = regextNumber.test(number.replace(/\s/g, ''));
		const isCVVValid = regexCvv.test(cvv);
		const isValidateValid = regexValidate.test(validate);
		const isNotValidateName = name.trim().indexOf(' ') === -1 || name.trim().length < 6;

		if (!isValidateValid) {
			validateRef.current.focus();
			errors = {...errors, validate: true};
			messages = {...messages, validate: 'Formato de data inválido'};
		}

		if (!isCVVValid) {
			cvvRef.current.focus();
			errors = {...errors, cvv: true};
			messages = {...messages, cvv: 'O CVV deve ser composto por 3 números'};
		}

		if (isNotValidateName){
			nameRef.current.focus();
			errors = {...errors, name: true};
			messages = {...messages, name: 'São necessários nome e sobrenome neste campo!'};
		}

		if (!isNumberValid) {
			numberRef.current.focus();
			errors = {...errors, number: true};
			messages = {...messages, number: 'O número do cartão deve ser composto por 16 números'};
		}

		setHasErrors(errors);
		setMessagesErrors(messages);

		if (isNumberValid && isCVVValid && isValidateValid && !isNotValidateName) {
			return true;
		} else {
			return false;
		}
	}

	function handleSaveData() {
		const isValid = isValidData();

		if (isValid) {
			const games = sessionData.cart.map(item => { 
				const newGame = {
					id: item.id, name: item.name, price: item.price,
				};
				return newGame;
			});
	
			const newCart = {
				games,
				total: sessionData.total,
				creditCard: {
					number: number.replace(/\s/g, ''),
					name: name.replace(/\s+$/, ''),
					cvv,
					validate,
				}
			};
	
			setPurchaseData(newCart);
			navigate('/check-order');
		}
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
							<ItemContainer width='100%'>
								<CreditCardItem
									ref={numberRef}
									hasError={hasErrors.number}
									placeholder="Número do cartão"
									value={number}
									onChange={handleChangeNumber}
									maxLength={19}
								/>
								{hasErrors.number && <span>{messagesErrors.number}</span>}
							</ItemContainer>
						</CreditCardLine>

						<CreditCardLine>
							<ItemContainer width='100%'>
								<CreditCardItem
									ref={nameRef}
									hasError={hasErrors.name}
									placeholder="Titular do Cartão"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								{hasErrors.name && <span>{messagesErrors.name}</span>}
							</ItemContainer>
						</CreditCardLine>

						<CreditCardLine>
							<ItemContainer width='50%'>
								<CreditCardItem
									ref={cvvRef}
									hasError={hasErrors.cvv}
									placeholder="CVV"
									value={cvv}
									onChange={handleChangeCVV}
									alignCenter
									maxLength={3}
								/>
								{hasErrors.cvv && <span>{messagesErrors.cvv}</span>}
							</ItemContainer>
							<ItemContainer width='50%'>
								<CreditCardItem
									ref={validateRef}
									hasError={hasErrors.validate}
									placeholder="Validade (MM/YY)"
									alignCenter
									value={validate}
									onChange={handleChangeValidate}
									maxLength={5}
								/>
								{hasErrors.validate && <span>{messagesErrors.validate}</span>}
							</ItemContainer>
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

const ItemContainer = styled.div`
	width: ${(props) => props.width};
	display: flex;
	flex-direction: column;
`;

const CreditCardContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;

	margin-top: 25px;

	span {
		font-size: 12px;
		color: ${COLORS.logout};
		margin-top: 5px;
	}
`;

const CreditCardLine = styled.div`
	width: 100%;

	display: flex;
	gap: 10px;
`;

const CreditCardItem = styled.input`
	width: 100%;
	height: 40px;

	border-radius: 5px;
	background: ${COLORS.input};
	text-align: ${(props) => props.alignCenter ? 'center' : 'left'} ;

	padding: 0 15px;

	border: none;

	::placeholder {
		color: ${COLORS.placeholder};
	}

	${(props) => props.hasError ? `outline: 2px solid ${COLORS.logout}` : css`
		&:focus {
			outline: none;
		}
	`}
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