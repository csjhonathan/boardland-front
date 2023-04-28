import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export default function SignUpPage(){

	const [form, setForm] = useState({name: '', email: '', address: '', image: '', password: '', passwordrepeat: ''});
	const navigate = useNavigate();
  
	function handleForm(e) {
		setForm({...form, [e.target.name]: e.target.value});
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

		axios.post(`${process.env.REACT_APP_API_URL}/sign-up`, body)
			.then (res => {
				console.log(res);
				navigate('/');
			})
			.catch (err => {
				console.log(err);
				alert(`Erro: ${err.response.data.message}`);
			});
	}
		
	return(
		<Container>
			<SpaceContainer>
				<h2>Cadastro:</h2>
				<form onSubmit={signUp}>
					<input type="name" placeholder="Nome e Sobrenome" name="name" value={form.name} onChange={handleForm} required/>
					<input type="email" placeholder="E-mail" name="email" value={form.email} onChange={handleForm} required />
					<input type="text" placeholder="Endereço (Rua, Bairro, Cidade, Estado, CEP)" name="address" value={form.address} onChange={handleForm} required />
					<input type="text" placeholder="Imagem de Perfil (Link)" name="image" value={form.image} onChange={handleForm} required />
					<input type="password" placeholder="Senha" name="password" value={form.password} onChange={handleForm} required />
					<input type="password" placeholder="Confirmar senha" name="passwordrepeat" value={form.passwordrepeat} onChange={handleForm} required />
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