import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import {GiPerspectiveDiceSixFacesSix} from 'react-icons/gi';
import { Link } from 'react-router-dom';
export default function Header(){
	return(		
		<Link to={'/'}><HeaderContainer>B<GiPerspectiveDiceSixFacesSix/>ardLand</HeaderContainer></Link>
	);
}

const HeaderContainer = styled.div`
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: ${COLORS.main};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Grandstander';
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 40px;
  text-align: center;
  color: ${COLORS.neutral};
  Link {
    
  }
`;