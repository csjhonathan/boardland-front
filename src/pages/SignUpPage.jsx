import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api.js';

export default function SignUpPage(){

	const [form, setForm] = useState({name: '', email: '', address: '', image: '', password: '', passwordrepeat: ''});
	const [inputText, setInputText] = useState(false);
	const navigate = useNavigate();
  
	function handleForm(e) {
		setForm({...form, [e.target.name]: e.target.value});		
	}

	function handleFocus(e){
		setInputText(e.target.name);
	}

	function signUp(e) {
		e.preventDefault();

		const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
		const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])[0-9a-zA-Z@$!%*?&#]{8,30}$/;

		if (form.name.trim().indexOf(' ') === -1 || form.name.trim().length < 6) return alert('São necessários nome e sobrenome neste campo!');
		if (form.address.trim().length < 10) return alert('É necessário digitar o endereço completo!');
		if (!urlRegex.test(form.image.trim())) return alert('É necessário digitar uma URL válida!');
		if (!passRegex.test(form.password) === true) return alert('A senha deve ter 8 ou mais caracteres e conter letras, números e caracteres especiais.');
		if (form.password !== form.passwordrepeat) return alert('As senhas não conferem!');

		const body = {
			name: form.name,
			email: form.email,
			address: form.address,
			image: form.image,
			password: form.password
		};

		api.post('/sign-up', body)
			.then (() => {
				navigate('/login');
			})
			.catch (err => {
				alert(`Erro: ${err.response.data.message}`);
			});
	}
		
	return(
		<Container>
			<SpaceContainer>
				<h2>Cadastro:</h2>
				<form onSubmit={signUp}>
					<input onFocus={handleFocus} type="name" placeholder="Nome e Sobrenome" name="name" value={form.name} onChange={handleForm} required/>
					<InfInput className="name" disabled={inputText === 'name' ? true : false}>Digite seu nome e sobrenome</InfInput>
					<input onFocus={handleFocus} type="email" placeholder="E-mail" name="email" value={form.email} onChange={handleForm} required />
					<InfInput className="email" disabled={inputText === 'email' ? true : false}>Digite seu E-mail principal</InfInput>
					<input onFocus={handleFocus} type="text" placeholder="Endereço (Rua, Bairro, Cidade, Estado, CEP)" name="address" value={form.address} onChange={handleForm} required />
					<InfInput className="address" disabled={inputText === 'address' ? true : false}>Digite seu endereço completo</InfInput>
					<input onFocus={handleFocus} type="text" placeholder="Imagem de Perfil (Link)" name="image" value={form.image} onChange={handleForm} required />
					<InfInput className="image" disabled={inputText === 'image' ? true : false}>Coloque um link da sua foto de perfil</InfInput>
					<input onFocus={handleFocus} type="password" placeholder="Senha (8 caracteres com pelo número, letras e caracteres especiais" name="password" value={form.password} onChange={handleForm} required />
					<InfInput className="password" disabled={inputText === 'password' ? true : false}>Mínimo 8 dígitos com pelo menos 1 caractere especial, 1 letra maiúscula, 1 letra minúscula e 1 número</InfInput>
					<input onFocus={handleFocus} type="password" placeholder="Confirmar senha" name="passwordrepeat" value={form.passwordrepeat} onChange={handleForm} required />
					<InfInput className="passwordrepeat" disabled={inputText === 'passwordrepeat' ? true : false}>Repita a mesma senha digitada acima</InfInput>
					<button type='submit'>Cadastrar</button>
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
    input {
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
      &:focus {
          outline: none;
      }
    }
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
  }
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
  margin-top: -5px;
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