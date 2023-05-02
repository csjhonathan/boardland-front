import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext.js';
import PurchaseContext from '../context/purchaseContext.js';
import api from '../services/api.js';
import { ThreeDots } from 'react-loader-spinner';
export default function LoginPage(){
	const [form, setForm] = useState({email: '', password: '', check: false});
	const [check, setCheck] = useState(false);
	const [load, setLoad] = useState(false);
	const [hasErrors, setHasErrors] = useState({email: false, password: false, messagePassword:'', messageEmail:''});
	const {setAuthData} = useContext(AuthContext);
	const { purchaseData } = useContext(PurchaseContext);

	const navigate = useNavigate();
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

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
		const emailRegex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		let errors = {email: false, password: false, messagePassword:'', messageEmail:''};

		if (!passRegex.test(form.password) === true) {
			errors = {...errors, password: true, messagePassword: 'A senha deve ter 8 ou mais caracteres e conter letras, números e caracteres especiais.'};
		}

		if (!emailRegex.test(form.email) === true) {
			errors = {...errors, email: true, messageEmail: 'Insira um e-mail válido.'};
		}

		if (errors.email || errors.password) {
			setHasErrors(errors);
			return;
		}

		const body = {
			email: form.email,
			password: form.password
		};
		setLoad(true);
		api.post('/login', body)
			.then (res => {
				if (check === false) {
					sessionStorage.setItem('session', JSON.stringify(res.data));
					setAuthData(res.data);
					setLoad(false);
					if(purchaseData) return navigate('/check-order');
					return navigate('/');
				}

				localStorage.setItem('session', JSON.stringify(res.data));
				setAuthData(res.data);
				setLoad(false);
				if(purchaseData) return navigate('/check-order');
				navigate('/');
			})
			.catch (err => {
				setLoad(false);
				let errors = {email: false, password: false, messagePassword:'', messageEmail:''};

				if (err.response.data && err.response.data.toString().toLowerCase().includes('senha')) {
					passwordRef.current.focus();
					errors = {...errors, password: true, messagePassword: err.response.data.toString()};
				} else {
					errors = {...errors, password: false, messagePassword: ''};
				}

				if (err.response.data && err.response.data.toString().toLowerCase().includes('e-mail')) {
					emailRef.current.focus();
					errors = {...errors, email: true, messageEmail: err.response.data.toString()};
				} else {
					errors = {...errors, email: false, messageEmail: ''};
				}

				setHasErrors(errors);
			});
	}
		
	return(
		<Container>
			<SpaceContainer>
				<h2>Login:</h2>
				<form onSubmit={signIn}>
					<Input placeholder="E-mail" name="email" value={form.email} onChange={handleForm} required ref={emailRef} hasError={hasErrors.email}/>
					{hasErrors.email && <span>{hasErrors.messageEmail}</span>}
					<Input type="password" placeholder="Senha" name="password" value={form.password} onChange={handleForm} required ref={passwordRef} hasError={hasErrors.password}/>
					{hasErrors.password && <span>{hasErrors.messagePassword}</span>}
					<CheckDiv>
						<h3>Manter Logado</h3>
						<input type="checkbox" name="check" value={check} onChange={handleCheck} />
					</CheckDiv>          
					<LoginButton type='submit'>{load ? <ThreeDots color="white"/> : 'Logar'}</LoginButton>
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

		span {
			font-size: 12px;
			color: ${COLORS.logout};
		}
  }
`;
const Input = styled.input `
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

const LoginButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.neutral};
`;