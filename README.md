# Boardland

<h2>Descrição do Projeto</h2>

O Boardland Front é uma plataforma de e-commerce desenvolvida para a compra de jogos de tabuleiro. Os usuários podem criar suas contas fornecendo informações como email, nome, senha e endereço. Após o registro, eles podem acessar suas contas, adicionar e remover itens no carrinho, visualizar detalhes dos produtos e finalizar suas compras, fornecendo informações de cartão de crédito/débito. Após a conclusão da compra, os usuários são redirecionados para uma tela de confirmação e recebem um email de confirmação da compra. Além disso, o sistema mantém um histórico de compras para cada usuário.

<h2>Demo</h2>

![BoardLand Demo](./public/demo/boardland.gif)

<h2>Tecnologias Utilizadas</h2>

**React**: O framework JavaScript para construção da interface do usuário.

**Dayjs**: Uma biblioteca JavaScript para manipulação de datas e horas.

**Axios**: Uma biblioteca para fazer requisições HTTP.

**JWT**: Para autenticação de usuários.

**Local storage**: para persistência de dados no navegador do usuário.

**Styled-Components**: Para estilização de componentes.

<h2>Pré-requisitos</h2>

Antes de iniciar, certifique-se de ter o Node.js instalado na sua máquina. Você pode baixá-lo em <a href="https://nodejs.org/en">NodeJS</a>.

<h2>Instalação</h2>

***Clone o repositório***:

`git clone https://github.com/csjhonathan/boardland-front.git`

***Navegue até a pasta do projeto***:

`cd boardland-front`

***Instale as dependências***:

`npm install` ou `npm i`

***Ambiente***:

Crie um arquivo `.env` como como mostra o arquivo `.env.example`

<h2>Uso</h2>

***Inicie o servidor de desenvolvimento***:

`npm start`

Abra seu navegador favorito e acesse http://localhost:3000 para usar a aplicação.

Esta aplicação necessita de um backend para funcionar corretamente, e um backend compatível com a aplicação já foi criado, [clique aqui](https://github.com/csjhonathan/boardland-back) para acessar o repositório BoardLand-Backend, e ler instruções sobre como rodar o backend do projeto.

Caso prefira, esta aplicação está disponível para acesso publicamente na web, fique a vontade para experimentar: [BoardLand](https://projeto15-boardland-front.vercel.app/)