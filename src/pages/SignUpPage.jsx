import styled, { css } from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import api from '../services/api.js';
import { ThreeDots } from 'react-loader-spinner';

export default function SignUpPage(){
	const [form, setForm] = useState({name: '', email: '', cep: '', logradouro: '', bairro: '', numeroEndereco: '', complemento: '', localidade: '', uf: '', image: '', password: '', passwordrepeat: ''});
	const [inputText, setInputText] = useState(false);
	const [load, setLoad] = useState(false);
	const [hasErrors, setHasErrors] = useState({name: false, email: false, cep: false, logradouro: false, numeroEndereco: false, bairro: false, localidade: false, uf: false, image: false, password: false, passwordRepeat: false});
	const [messagesErrors, setMessagesErrors] = useState({name: '', email: '', cep: '', logradouro: '', numeroEndereco: '', bairro: '', localidade: '', uf: '', image: '', password: '', passwordRepeat: ''});

	const navigate = useNavigate();
	const nameRef = useRef(null);
	const emailRef = useRef(null);
	const cepRef = useRef(null);
	const logradouroRef = useRef(null);
	const bairroRef = useRef(null);
	const numeroEnderecoRef = useRef(null);
	const localidadeRef = useRef(null);
	const ufRef = useRef(null);
	const imageRef = useRef(null);
	const passwordRef = useRef(null);
	const passwordRepeatRef = useRef(null);
  
	useEffect(() => {
		function checkCEP() {
			api.get(`https://viacep.com.br/ws/${form.cep}/json/`)
				.then(res => {
					const cepSelect = res.data;
					setForm({
						...form,
						logradouro: cepSelect.logradouro,
						bairro: cepSelect.bairro,
						localidade: cepSelect.localidade,
						uf: cepSelect.uf            
					});
				})
				.catch(err => console.log(err));
		}

		if (form.cep.length === 8) {
			checkCEP();
		}
	}, [form.cep]);


	function handleForm(e) {
		setForm({...form, [e.target.name]: e.target.value});		
	}

	function handleFocus(e){
		setInputText(e.target.name);
	}

	function signUp(e) {
		e.preventDefault();

		let errors = {name: false, email: false, cep: false, logradouro: false, numeroEndereco: false, bairro: false, localidade: false, uf: false, image: false, password: false, passwordRepeat: false};
		let messages = {name: '', email: '', cep: '', logradouro: '', numeroEndereco: '', bairro: '', localidade: '', uf: '', image: '', password: '', passwordRepeat: ''};

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

		if (form.uf.trim().length !== 2) {
			ufRef.current.focus();
			errors = {...errors, uf: true};
			messages = {...messages, uf: 'Digite a sigla'};
		}

		if (form.localidade.trim().length < 3) {
			localidadeRef.current.focus();
			errors = {...errors, localidade: true};
			messages = {...messages, localidade: 'Nome incorreto'};
		}

		if (form.bairro.trim().length < 3) {
			bairroRef.current.focus();
			errors = {...errors, bairro: true};
			messages = {...messages, bairro: 'Nome incorreto'};
		}

		if (form.numeroEndereco.trim().length < 1) {
			numeroEnderecoRef.current.focus();
			errors = {...errors, numeroEndereco: true};
			messages = {...messages, numeroEndereco: 'Inválido'};
		}

		if (form.logradouro.trim().length < 5) {
			logradouroRef.current.focus();
			errors = {...errors, logradouro: true};
			messages = {...messages, logradouro: 'Nome incorreto'};
		}

		if (form.cep.trim().length < 8) {
			cepRef.current.focus();
			errors = {...errors, cep: true};
			messages = {...messages, cep: 'CEP inexistente'};
		}

		if (!urlRegex.test(form.image.trim())) {
			imageRef.current.focus();
			errors = {...errors, image: true};
			messages = {...messages, image: 'É necessário digitar uma URL válida!'};
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
			address: `
      ${form.logradouro}, 
      ${form.numeroEndereco} - 
      ${form.bairro}
      ${form.complemento && ` - ${form.complemento}`} - 
      ${form.localidade}/${form.uf} - CEP: 
      ${form.cep}
      `,
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
				let errors = {name: false, email: false, cep: false, logradouro: false, numeroEndereco: false, bairro: false, localidade: false, uf: false, image: false, password: false, passwordRepeat: false};
				let messages = {name: '', email: '', cep: '', logradouro: '', numeroEndereco: '', bairro: '', localidade: '', uf: '', image: '', password: '', passwordRepeat: ''};

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('senha')) {
					passwordRef.current.focus();
					errors = {...errors, password: true};
					messages = {...messages, password: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('uf')) {
					ufRef.current.focus();
					errors = {...errors, uf: true};
					messages = {...messages, uf: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('localidade')) {
					localidadeRef.current.focus();
					errors = {...errors, localidade: true};
					messages = {...messages, localidade: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('bairro')) {
					bairroRef.current.focus();
					errors = {...errors, bairro: true};
					messages = {...messages, bairro: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('numeroEndereco')) {
					numeroEnderecoRef.current.focus();
					errors = {...errors, numeroEndereco: true};
					messages = {...messages, numeroEndereco: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('logradouro')) {
					logradouroRef.current.focus();
					errors = {...errors, logradouro: true};
					messages = {...messages, logradouro: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('cep')) {
					cepRef.current.focus();
					errors = {...errors, cep: true};
					messages = {...messages, cep: err.response.data.message.toString()};
				} 

				if (err.response.data.message && err.response.data.message.toString().toLowerCase().includes('url')) {
					imageRef.current.focus();
					errors = {...errors, image: true};
					messages = {...messages, image: err.response.data.message.toString()};
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

					<TitleDiv>Informações Pessoais:</TitleDiv>

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

					<TitleDiv>Dados de Endereço:</TitleDiv>

					<ContainerInput>
						<Input
							hasError={hasErrors.cep}
							onFocus={handleFocus}
							type="text"
							placeholder="CEP"
							name="cep"
							maxLength={8}
							value={form.cep.replace(/\D/g, '')}
							onChange={handleForm}
							ref={cepRef}
						/>
						{hasErrors.cep && <span>{messagesErrors.cep}</span>}
						<InfInput
							className="cep"
							disabled={inputText === 'cep' ? true : false}
						>
						Digite seu CEP
						</InfInput>
					</ContainerInput>

					<ContainerInput>
						<Input
							hasError={hasErrors.logradouro}
							onFocus={handleFocus}
							type="text"
							placeholder="Rua"
							name="logradouro"
							value={form.logradouro}
							onChange={handleForm}
							ref={logradouroRef}
						/>
						{hasErrors.logradouro && <span>{messagesErrors.logradouro}</span>}
						<InfInput
							className="logradouro"
							disabled={inputText === 'logradouro' ? true : false}
						>
            Digite o nome da sua rua/avenida
						</InfInput>
					</ContainerInput>

					<StyledAddress>
						<ContainerInput>
							<Input
								hasError={hasErrors.numeroEndereco}
								onFocus={handleFocus}
								type="text"
								placeholder="Número"
								name="numeroEndereco"
								value={form.numeroEndereco}
								onChange={handleForm}
								ref={numeroEnderecoRef}
							/>
							{hasErrors.numeroEndereco && <span>{messagesErrors.numeroEndereco}</span>}
							<InfInput
								className="numeroEndereco"
								disabled={inputText === 'numeroEndereco' ? true : false}
							>
              Digite o número do seu endereço
							</InfInput>
						</ContainerInput>

						<ContainerInput>
							<Input
								hasError={hasErrors.bairro}
								onFocus={handleFocus}
								type="text"
								placeholder="Bairro"
								name="bairro"
								value={form.bairro}
								onChange={handleForm}
								ref={bairroRef}
							/>
							{hasErrors.bairro && <span>{messagesErrors.bairro}</span>}
							<InfInput
								className="bairro"
								disabled={inputText === 'bairro' ? true : false}
							>
              Digite seu bairro
							</InfInput>
						</ContainerInput>
					</StyledAddress>

					<ContainerInput>
						<Input
							hasError={hasErrors.complemento}
							onFocus={handleFocus}
							type="text"
							placeholder="Complemento (Opcional)"
							name="complemento"
							value={form.complemento}
							onChange={handleForm}
						/>
						{hasErrors.complemento && <span>{messagesErrors.complemento}</span>}
						<InfInput
							className="complemento"
							disabled={inputText === 'complemento' ? true : false}
						>
            Digite o complemento se houver
						</InfInput>
					</ContainerInput>

					<StyledAddress>
						<ContainerInput>
							<Input
								hasError={hasErrors.localidade}
								onFocus={handleFocus}
								type="text"
								placeholder="Cidade"
								name="localidade"
								value={form.localidade}
								onChange={handleForm}
								ref={localidadeRef}
							/>
							{hasErrors.localidade && <span>{messagesErrors.localidade}</span>}
							<InfInput
								className="localidade"
								disabled={inputText === 'localidade' ? true : false}
							>
              Digite sua cidade
							</InfInput>
						</ContainerInput>

						<ContainerInput>
							<Input
								hasError={hasErrors.uf}
								onFocus={handleFocus}
								type="text"
								placeholder="Estado"
								name="uf"
								value={form.uf}
								onChange={handleForm}
								ref={ufRef}
							/>
							{hasErrors.uf && <span>{messagesErrors.uf}</span>}
							<InfInput
								className="uf"
								disabled={inputText === 'uf' ? true : false}
							>
              Digite a sigla do seu estado
							</InfInput>
						</ContainerInput>
					</StyledAddress>

					<TitleDiv>Digite uma senha:</TitleDiv>

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
const TitleDiv = styled.div`
  padding-top: 15px;
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
      margin-top: 25px;
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

  &[name='cep'] {
    width: 150px;
  }
  &[name='numeroEndereco'] {
    width: 80px;
  }
  &[name='bairro'] {
    width: 220px;
  }
  &[name='uf'] {
    width: 80px;
  }
  &[name='localidade'] {
    width: 220px;
  }
		
	::placeholder{
		color: ${COLORS.placeholder};
	}
	
	${(props) => props.hasError ? `outline: 2px solid ${COLORS.logout}` : css`
		&:focus {
		outline: none;
		}
	`}
`;
const StyledAddress = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  margin-bottom:15px;
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
  &.cep {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.logradouro {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.numeroEndereco {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
    justify-content: flex-start;
    width: 80px;
  }
  &.complemento {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.bairro {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
    justify-content: flex-end;
    width: 220px;
  }
  &.localidade {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
  }
  &.uf {
    display: ${props => (props.disabled === false) ? 'none' : 'flex'};
    justify-content: flex-end;
    width: 80px;
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