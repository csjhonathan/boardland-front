import styled, { css } from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import api from '../services/api.js';
import { ThreeDots } from 'react-loader-spinner';

export default function SignUpPage(){
	const [form, setForm] = useState({name: '', email: '', address: '', image: '', password: '', passwordrepeat: ''});
	const [inputText, setInputText] = useState(false);
	const [load, setLoad] = useState(false);
	const [hasErrors, setHasErrors] = useState({name: false, email: false, addres: false, image: false, password: false, passwordRepeat: false});
	const [messagesErrors, setMessagesErrors] = useState({name: '', email: '', address: '', image: '', password: '', passwordRepeat: ''});

	const navigate = useNavigate();
	const nameRef = useRef(null);
	const emailRef = useRef(null);
	const addressRef = useRef(null);
	const imageRef = useRef(null);
	const passwordRef = useRef(null);
	const passwordRepeatRef = useRef(null);
  
	function handleForm(e) {
		setForm({...form, [e.target.name]: e.target.value});		
	}

	function handleFocus(e){
		setInputText(e.target.name);
	}

	function signUp(e) {
		e.preventDefault();

		let errors = {name: false, email: false, addres: false, image: false, password: false, passwordRepeat: false};
		let messages = {name: '', email: '', address: '', image: '', password: '', passwordRepeat: ''};

		const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
		const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])[0-9a-zA-Z@$!%*?&#]{8,30}$/;
		const emailRegex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (form.password !== form.passwordrepeat) {
			passwordRepeatRef.current.focus();
			errors = {...errors, passwordRepeat: true};
			messages = {...messages, passwordRepeat: 'As senhas não conferem!'};
		}

		if (!passRegex.test(form.password) === true) {
			passwordRef.current.focus();
			errors = {...errors, password: true};
			messages = {...messages, password: 'Senha inválida.'};
		}

		if (!urlRegex.test(form.image.trim())) {
			imageRef.current.focus();
			errors = {...errors, image: true};
			messages = {...messages, image: 'É necessário digitar uma URL válida!'};
		}

		if (form.address.trim().length < 10) {
			addressRef.current.focus();
			errors = {...errors, address: true};
			messages = {...messages, address: 'É necessário digitar o endereço completo!'};
		}

		if (!emailRegex.test(form.email)) {
			emailRef.current.focus();
			errors = {...errors, email: true};
			messages = {...messages, email: 'O e-mail deve ser válido.'};
		}

		if (form.name.trim().indexOf(' ') === -1 || form.name.trim().length < 6) {
			nameRef.current.focus();
			errors = {...errors, name: true};
			messages = {...messages, name: 'São necessários nome e sobrenome neste campo!'};
		}

		if (Object.values(errors).some(value => value === true)) {
			setHasErrors(errors);
			setMessagesErrors(messages);
			return;
		}

		const body = {
			name: form.name.replace(/\s+$/, ''),
			email: form.email,
			address: form.address,
			image: form.image,
			password: form.password
		};
		setLoad(true);
		api.post('/sign-up', body)
			.then (() => {
				setLoad(false);
				navigate('/login');
			})
			.catch (err => {
				setLoad(false);
				let errors = {name: false, email: false, addres: false, image: false, password: false, passwordRepeat: false};
				let messages = {name: '', email: '', address: '', image: '', password: '', passwordRepeat: ''};

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('senha')) {
					passwordRef.current.focus();
					errors = {...errors, password: true};
					messages = {...messages, password: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('url')) {
					imageRef.current.focus();
					errors = {...errors, image: true};
					messages = {...messages, image: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('endereço')) {
					addressRef.current.focus();
					errors = {...errors, address: true};
					messages = {...messages, address: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('e-mail')) {
					emailRef.current.focus();
					errors = {...errors, email: true};
					messages = {...messages, email: err.response.data.message.toString()};
				}

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('nome')) {
					nameRef.current.focus();
					errors = {...errors, name: true};
					messages = {...messages, name: err.response.data.message.toString()};
				}

				setHasErrors(errors);
				setMessagesErrors(messages);
				// alert(`Erro: ${err.response.data.message.message}`);
			});
	}
		
	return(
		<Container>
			<SpaceContainer>
				<h2>Cadastro:</h2>
				<form onSubmit={signUp}>
					<ContainerInput>
						<Input
							hasError={hasErrors.name}
							onFocus={handleFocus}
							type="name"
							placeholder="Nome e Sobrenome"
							name="name"
							value={form.name}
							onChange={handleForm}
							ref={nameRef}
						/>
						{hasErrors.name && <span>{messagesErrors.name}</span>}
						<InfInput
							className="name"
							disabled={inputText === 'name' ? true : false}
						>
						Digite seu nome e sobrenome
						</InfInput>
					</ContainerInput>

					<ContainerInput>
						<Input
							hasError={hasErrors.email}
							onFocus={handleFocus}
							placeholder="E-mail"
							name="email"
							value={form.email}
							onChange={handleForm}
							ref={emailRef}
						/>
						{hasErrors.email && <span>{messagesErrors.email}</span>}
						<InfInput
							className="email"
							disabled={inputText === 'email' ? true : false}
						>
						Digite seu E-mail principal
						</InfInput>
					</ContainerInput>

					<ContainerInput>
						<Input
							hasError={hasErrors.address}
							onFocus={handleFocus}
							type="text"
							placeholder="Endereço (Rua, Bairro, Cidade, Estado, CEP)"
							name="address"
							value={form.address}
							onChange={handleForm}
							ref={addressRef}
						/>
						{hasErrors.addres && <span>{messagesErrors.address}</span>}
						<InfInput
							className="address"
							disabled={inputText === 'address' ? true : false}
						>
						Digite seu endereço completo
						</InfInput>
					</ContainerInput>

					<ContainerInput>
						<Input
							hasError={hasErrors.image}
							onFocus={handleFocus}
							type="text"
							placeholder="Imagem de Perfil (Link)"
							name="image"
							value={form.image}
							onChange={handleForm}
							ref={imageRef}
						/>
						{hasErrors.image && <span>{messagesErrors.image}</span>}
						<InfInput
							className="image"
							disabled={inputText === 'image' ? true : false}
						>
						Coloque um link da sua foto de perfil
						</InfInput>
					</ContainerInput>

					<ContainerInput>
						<Input
							hasError={hasErrors.password}
							onFocus={handleFocus}
							type="password"
							placeholder="Senha (8 caracteres com pelo número, letras e caracteres especiais"
							name="password"
							value={form.password}
							onChange={handleForm}
							ref={passwordRef}
						/>
						{hasErrors.password && <span>{messagesErrors.password}</span>}
						<InfInput
							className="password"
							disabled={inputText === 'password' ? true : false}
						>
						Mínimo 8 dígitos com pelo menos 1 caractere especial, 1 letra maiúscula, 1 letra minúscula e 1 número
						</InfInput>
					</ContainerInput>

					<ContainerInput>
						<Input
							hasError={hasErrors.passwordRepeat}
							onFocus={handleFocus}
							type="password"
							placeholder="Confirmar senha"
							name="passwordrepeat"
							value={form.passwordrepeat}
							onChange={handleForm}
							ref={passwordRepeatRef}
						/>
						{hasErrors.passwordRepeat && <span>{messagesErrors.passwordRepeat}</span>}
						<InfInput
							className="passwordrepeat"
							disabled={inputText === 'passwordrepeat' ? true : false}
						>
						Repita a mesma senha digitada acima
						</InfInput>
					</ContainerInput>

					<RegisterButton type='submit'>
						{load ? <ThreeDots color="white"/> : 'Cadastrar'}
					</RegisterButton>
				</form>
				<LinkLogin to={'/login'}>Já possui cadastro? Faça Login!</LinkLogin>
			</SpaceContainer>
		</Container>
	);
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
const SpaceContainer = styled.div`
  width: 80%;
  margin: 115px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  h2 {
	  font-family: 'Farro';
	  font-weight: 700;
    font-size: 24px;
	  color: ${COLORS.main};
  }
  form{
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    button{
      width: 100%;
      height: 50px;
      padding: 10px;
      background-color: ${COLORS.main};
      border: 0;
      border-radius: 5px;
      font-family: 'Farro';
      font-weight: 700;
      font-size: 24px;
      color: ${COLORS.neutral};
      margin-top: 5px;
    }

		span {
			font-size: 10px;
			color: ${COLORS.logout};
			position: absolute;
			top: 38px;
			left: 10px;
		}
  }
`;
const ContainerInput = styled.div`
	position: relative;
`;
const Input = styled.input`
	width: 100%;
	height: 50px;
	padding: 15px;
	background-color: ${COLORS.input};
	border: 0;
	border-radius: 5px;
	font-family: 'Abel', sans-serif;
	font-size: 16px;
	color: ${COLORS.placeholderback};
		
	::placeholder{
		color: ${COLORS.placeholder};
	}
	
	${(props) => props.hasError ? `outline: 2px solid ${COLORS.logout}` : css`
		&:focus {
		outline: none;
		}
	`}
`;
const LinkLogin = styled(Link)`
  font-family: 'Farro';
  font-weight: 700;
  font-size: 16px;
  color: ${COLORS.main};
  display: flex;
  justify-content: center;
  text-decoration: none;
  margin-top: 5px;
`;
const InfInput = styled.div`
  font-size: 12px;
  margin-top: 5px;
  line-height: 15px;
  &.name {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.email {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.address {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.image {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.password {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.passwordrepeat {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
`;

const RegisterButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.neutral};
`;