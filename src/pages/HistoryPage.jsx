import styled from 'styled-components';
import COLORS from '../constants/colors.js';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/authContext.js';
import api from '../services/api.js';
import { Link } from 'react-router-dom';

export default function history(){

	const [myOrders,setMyOrders] = useState([]);
	const [activeOrder,setActiveOrder] = useState(null);
	const {authData} = useContext(AuthContext);
	useEffect(() => {
		getHistory();
	},[]);

	function getHistory(){

		api.get('/history', {Authorization: `Bearer ${authData.token}`})
			.then(res => {
				setMyOrders(res.data);
			})
			.catch(err => {                
				alert(`Erro: ${err.response.data}`);
			});
	}

	function handleOrderClick (order){
		setActiveOrder(order._id === activeOrder ? null : order._id);
	}

	return (
		<Container>
			<SpaceContainer>
				<OrderHeader>
					<img src={authData.image}/>
					<h2>{authData.name}<br/>[ Histórico de Pedidos ]</h2>
				</OrderHeader>
				<Orders>
					{activeOrder !== undefined ? <h1>Clique no pedido e veja os detalhes:</h1> : <h4>Você ainda não tem pedidos na loja...<br/>=/</h4>}
					{myOrders.map( ord => (
						<SepOrder key={ord._id}>
							<Order onClick={() => handleOrderClick(ord)}><p><span>#{ord._id}</span><span>{ord.date ? ord.date : ''}</span></p></Order>
							{activeOrder === ord._id && (
								<>
									<OrderDetails>
										{ord.games.map( (det,ind) => (
											<ListOrder key={det._id}>
												<NamePrice>
													<p>{ind+1} - {det.name}</p>
												</NamePrice>
												<Date>R${det.price.toFixed(2).replace('.',',')}</Date>
											</ListOrder>
										))}
									</OrderDetails>
									<AddressPayment>
										<h2>Endereço de Entrega:</h2>
										<h3>{authData.address}</h3>
									</AddressPayment>
									<AddressPayment>
										<h2>Forma de Pagamento:</h2>
										<h3><ion-icon name="card"></ion-icon>Crédito: {ord.creditCard.name}</h3>
										<h3>Número: **** **** **** {ord.creditCard.number}</h3>
									</AddressPayment>
								</>
							)}                            
						</SepOrder>
					))}
				</Orders>
			</SpaceContainer>
			<BottomContainer to={'/'}>
                Voltar para a Página Inicial
			</BottomContainer>
		</Container>
	);
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 70px;
`;
const BottomContainer = styled(Link)`
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: ${COLORS.neutral};
    width: 100%;
    padding-top: 10px;
    height: 50px;
    font-family: 'Farro';
    font-weight: 700;
    font-size: 16px;
    color: ${COLORS.main};
    text-decoration: none;
`;
const SpaceContainer = styled.div`
  width: 84%;
  margin: 115px 20px 20px 20px;
  display: flex;
  flex-direction: column;
`;
const OrderHeader = styled.div`
    width: 100%;
    display: flex;
    padding-bottom: 20px;
    gap: 15px;
    h2 {
        width: 100%;
        font-family: 'Farro';
        font-weight: 700;
        font-size: 18px;
        color: ${COLORS.main};
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1.4;
    }
    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }
`;
const Orders = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    gap: 12px;
    p{
        display: flex;
        justify-content: space-between;
    }
    h4{
        width: 100%;
        padding-top: 100px;
        display: flex;
        justify-content: center;
        text-align: center;
        line-height: 30px;
        font-size: 16px;
    }
`;
const SepOrder = styled.div`
    display: flex;
    flex-direction: column;
    background-color:  ${COLORS.input};
    padding: 10px;
    border-radius: 5px;
`;
const Order = styled.div`
    font-family: 'Farro';
    font-weight: 700;
    font-size: 14px;
    color: ${COLORS.main};
    display: flex;
    align-items: left;
    flex-direction: column;
`;
const OrderDetails = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    margin-top: 5px;
`;
const ListOrder = styled.div`
    width: 100%;
    display: flex;
    margin-top: 7px;;
    gap: 20px;
`;
const NamePrice = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-family: 'Farro';
    font-weight: 400;
    font-size: 14px;
    p {
        display: flex;
        justify-content: flex-start;
        font-weight: 400;
    }
`;
const Date = styled.div`
    display: flex;
    justify-content: flex-end;
    font-family: 'Farro';
    font-weight: 400;
    font-size: 14px;
`;
const AddressPayment = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 7px;
    gap: 5px;
    h2{
        font-family: 'Farro';
        font-weight: 700;
        font-size: 14px;
        color: ${COLORS.main};
    }    
    h3{
        font-family: 'Farro';
        font-weight: 400;
        font-size: 14px;
        ion-icon {
            margin-bottom: -2px;
            margin-right: 4px;
            font-size: 16px;
        }
    }    
`;