import { HashLoader } from 'react-spinners';
import styled from 'styled-components';
export default function HashLoaderScreen({color}){
	return(
		<Container>
			<HashLoader 
				color={color}
			/>
		</Container>
		
	);
}

const Container = styled.div`
  height: 100vh;
  padding-top: 115px;
  padding-bottom: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;