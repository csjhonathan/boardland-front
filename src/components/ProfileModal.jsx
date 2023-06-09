import { Modal, Box } from '@mui/material';
import { styled as muiStyled} from '@mui/material';
import { useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext.js';
import COLORS from '../constants/colors.js';
import api from '../services/api.js';
export default function ProfileModal({openModal, setOpenModal, anchorEl}){
	const {authData, setAuthData} = useContext(AuthContext);
	const navigate = useNavigate();
	function handleLogout(){
		api.post('/logout')
			.then(() => {
				localStorage.removeItem('session');
				sessionStorage.removeItem('session');
				setAuthData();
				navigate('/logout');
			})
			.catch(err => {
				alert(err.response.data);
			});
	}
	if(!authData){
		return(
			<Modal 
				open = {openModal} 
				onClose={() => setOpenModal(false)} 
				anchorEl ={anchorEl} 
				sx={{p:2}}
			>
				<StyledBox height = "200px">
					<Message>
						{'Parece que você não está logado ! :('}
						<div>
							{'Possui cadastro ?'}
							<LoginButton onClick={()=> navigate('/login')}>Fazer Login</LoginButton>
						</div>
					
						<div>
							{'Novo por aqui?'}
							<RegisterButton onClick={()=> navigate('/signup')}>Registre-se</RegisterButton>
						</div>
					</Message>
				</StyledBox>
			</Modal>
		);
	}
	return(
		<Modal 
			open = {openModal} 
			onClose={() => setOpenModal(false)} 
			anchorEl ={anchorEl} 
			sx={{p:2}}
		>
			<StyledBox height = "180px">
				<Options>
					<ProfileData>
						<ProfileName>Ver Pedidos Antigos</ProfileName>
					</ProfileData>
					<HistoryButton onClick={()=> navigate('/history')}>Histórico</HistoryButton>
					<ProfileData>
						<ProfileName>{authData.name}</ProfileName>
					</ProfileData>
					<LogoutButton onClick={handleLogout}>Sair!</LogoutButton>
				</Options>
			</StyledBox>
		</Modal>
	);
}

const StyledBox = muiStyled(Box)(({height}) => ({
	background : `${COLORS.secondary}`,
	position: 'absolute', 
	bottom: '65px', 
	p: 2,
	opacity: 1,
	transition: 'opacity 0.5s ease-in-out',
	'&.entering': { opacity: 0 },
	'&.entered': { opacity: 1 },
	height : height,
	width : '180px',
	borderRadius : '5px',
	display :'flex',
	padding : '10px'
}));

const Options = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const ProfileData = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
`;

const ProfileName = styled.p`
  width: 100%;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: ${COLORS.neutral};
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: ${COLORS.neutral};
`;

const LoginButton = styled.button`
  width: 110px;
  background-color: ${COLORS.login};
  border: none;
  height: 30px;
  border-radius: 5px;
  margin-top: 5px;
  &:hover{
    box-shadow: 2px 2px black;
  }
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
`;

const LogoutButton = styled.button`
  width: 110px;
  background-color: ${COLORS.logout};
  border: none;
  height: 30px;
  border-radius: 5px;
  margin-top: -10px;
  &:hover{
    box-shadow: 2px 2px black;
  }
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  align-self: flex-start;
`;
const HistoryButton = styled.button`
	width: 110px;
	background-color: ${COLORS.selected};
	border: none;
	height: 30px;
	border-radius: 5px;
  margin-top: -10px;
	&:hover{
	box-shadow: 2px 2px black;
	}
	font-style: normal;
	font-weight: 700;
	font-size: 12px;
	align-self: flex-start;
	margin-bottom: 10px;
`;

const RegisterButton = styled.button`
  width: 110px;
  background-color: ${COLORS.selected};
  border: none;
  height: 30px;
  border-radius: 5px;
  margin-top: 5px;
  &:hover{
    box-shadow: 2px 2px black;
  }
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
`;
