import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import { Link } from 'react-router-dom';

export default function LoginPage(){
			
	return(
		<Container>
			<SpaceContainer>
				<h2>Você se desconectou com sucesso!</h2>
				<LinkLogin to={'/login'}>Fazer Login</LinkLogin>
				<LinkLogin to={'/'}>Voltar para a tela inicial</LinkLogin>
			</SpaceContainer>
		</Container>
	);
}

const Container = styled.div`
  width: 100%;
  min-height: 500px;;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SpaceContainer = styled.div`
  width: 80%;
  height: 100%;
  margin: 115px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  h2 {
	  font-family: 'Farro';
	  font-weight: 700;
    font-size: 24px;
	  color: ${COLORS.main};
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-bottom: 50px;
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
  margin: 10px;
`;