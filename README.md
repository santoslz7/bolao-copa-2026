# Bolão Copa 2026 

Sistema de bolão da Copa do Mundo 2026 desenvolvido com persistência poliglota, integrando três bancos de dados simultaneamente para diferentes propósitos da aplicação.

# Tecnologias e Arquitetura

MySQL + Prisma ORM: Gerenciamento de usuários, jogos e palpites (dados relacionais).

Redis: Estrutura de Sorted Sets para computar o ranking global em tempo real.

MongoDB: Armazenamento do feed de atividades e histórico de eventos do sistema.

# Pré-requisitos
Antes de começar, certifique-se de ter instalado:

- Node.js 20+
- Docker Desktop

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

# Como Executar o Projeto

 1. Clone o repositório

bash

git clone https://github.com/seu-usuario/bolao-copa-2026.git
cd bolao-copa-2026

# 2. Instale as dependências

bash
npm install

# 3. Suba os bancos de dados via Docker

bash
docker compose up -d

Aguarde cerca de 30 segundos para os containers inicializarem.

# 4.Rodar as migrações do Prisma (MySQL)

bash
npx prisma migrate dev --name init

# 5. Execute a simulação

bash
npm start

# Resultado esperado

Iniciando simulação do bolão da copa 2026...

[ORM] Usuários e jogos inseridos com sucesso.

[MongoDB] Evento registrado: "Carlos fez um palpite no jogo Brasil x Croácia (Placar: 1x0)"

[MongoDB] Evento registrado: "Ana fez um palpite no jogo Brasil x Croácia (Placar: 2x0)"
[Sistema] Jogo encerrado! Resultado oficial: Brasil x Croácia 2 x 0.

[Redis] Atualizando pontuações no ranking...

[Redis] Atualizando pontuações no ranking...

[MongoDB] Evento registrado: "Ana acertou o placar em cheio e ganhou 50 pontos!"
[REDIS] --- TOP RANKING GLOBAL ---

1º Lugar: Ana - 50 pontos

2º Lugar: Carlos - 0 pontos
[MONGO] --- ULTIMAS ATIVIDADES DO FEED ---

[01:57] Ana acertou o placar em cheio e ganhou 50 pontos!
[01:57] Ana fez um palpite no jogo Brasil x Croácia (Placar: 2x0)
[01:57] Carlos fez um palpite no jogo Brasil x Croácia (Placar: 1x0)

Simulação concluída com sucesso. Conexões encerradas.

# Arquitetura

src/
├── database/# Conexões com os 3 bancos
│   ├── prismaClient.ts
│   ├── redisClient.ts
│   └── mongoClient.ts
├── repositories/# Consultas isoladas por tecnologia
│   ├── userRepository.ts
│   ├── redisRepository.ts
│   └── mongoRepository.ts
├── services/# Lógica de negócio
│   └── bolaoService.ts
└── runner.ts # Script principal de simulação
prisma/
└── schema.prisma # Modelagem relacional
docker-compose.yml # Infraestrutura dos containers

# Fluxos implementados

*Fluxo de apostas* — valida usuário no MySQL, salva palpite, registra evento no MongoDB
*Fluxo de encerramento* — calcula pontos, atualiza ranking no Redis, registra conquistas no MongoDB  
*Fluxo de painel* — busca ranking no Redis e feed no MongoDB