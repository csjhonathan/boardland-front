import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext.js';
import api from '../services/api.js';

export default function LoginPage(){
	const [form, setForm] = useState({email: '', password: '', check: false});
	const [check, setCheck] = useState(false);
	const {setAuthData} = useContext(AuthContext);
	const navigate = useNavigate();
  
	useEffect(() => {
		if (localStorage.getItem('session')) {
			return navigate('/');
		}
	},[]);

	function handleCheck() {
		setCheck(!check);
	}

	function handleForm(e) {
		setForm({...form, [e.target.name]: e.target.value});
	}

	function signIn(e) {
		e.preventDefault();

		const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])[0-9a-zA-Z@$!%*?&#]{8,30}$/;

		if (!passRegex.test(form.password) === true) return alert('A senha deve ter 8 ou mais caracteres e conter letras, números e caracteres especiais.');


		const body = {
			email: form.email,
			password: form.password
		};

		api.post('/login', body)
			.then (res => {
				if (check === false) {
					setAuthData(res.data);
					sessionStorage.setItem('session', JSON.stringify(res.data));
					return navigate('/');
				}

				setAuthData(res.data);
				localStorage.setItem('session', JSON.stringify(res.data));
				navigate('/');
			})
			.catch (err => {
				alert(`Erro: ${err.response.data}`);
			});
	}
		
	return(
		<Container>
			<SpaceContainer>
				<h2>Login:</h2>
				<form onSubmit={signIn}>
					<input type="email" placeholder="E-mail" name="email" value={form.email} onChange={handleForm} required />
					<input type="password" placeholder="Senha" name="password" value={form.password} onChange={handleForm} required />
					<CheckDiv>
						<h3>Manter Logado</h3>
						<input type="checkbox" name="check" value={check} onChange={handleCheck} />
					</CheckDiv>          
					<button type='submit'>Logar</button>
				</form>
				<LinkLogin to={'/signup'}>Não possui cadastro? Cadastre-se agora!</LinkLogin>
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
    height: 60px;
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
    height: 60px;
    padding: 10px;
    background-color: ${COLORS.main};
    border: 0;
    border-radius: 5px;
    font-family: 'Farro';
    font-weight: 700;
    font-size: 24px;
    color: ${COLORS.neutral};
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
`;
const CheckDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  h3 {
    font-family: 'Farro';
    font-weight: 700;
    font-size: 16px;
    color: ${COLORS.main};
    display: flex;
    justify-content: center;
    text-decoration: none;
    margin-right: 5px;
  }
    input[type=checkbox] {
    display: flex;
    justify-content: flex-end;
    width: 22px;
    height: 22px;
    border: 2px solid ${COLORS.main};
    background-color: ${COLORS.neutral};
      :checked {
        background-color: ${COLORS.main};
        border: 2px solid ${COLORS.main};
      }
    }
`;