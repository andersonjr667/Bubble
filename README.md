# Bubble — app web para conectar pessoas por interesses

## Descrição
Bubble é um aplicativo web para conectar pessoas por gostos/interesses, focado em amizades. O projeto é uma SPA (HTML/CSS/JS vanilla) com backend Node.js/Express, MongoDB (Mongoose), autenticação JWT, upload de imagens via Cloudinary e interface responsiva.

## Estrutura de Pastas
```
bubble/
  backend/
    controllers/
    models/
    routes/
    middlewares/
    utils/
    server.js
    config.js
    .env.example
    package.json
    seed.js
  frontend/
    css/
      styles.css
    js/
      api.js
      auth.js
      app.js
      discover.js
      profile.js
      participants.js
    assets/
      avatars/
        avatar1.png
        avatar2.png
        ...
    index.html
README.md
```

## Como rodar localmente

### Backend
1. Instale dependências:
   ```
   cd backend
   npm install
   ```
2. Configure `.env` (baseado em `.env.example`).
3. Inicie o servidor:
   ```
   npm run dev
   ```
4. (Opcional) Popule o banco com usuários fictícios:
   ```
   npm run seed
   ```

### Frontend
Abra `frontend/index.html` no navegador. O frontend faz requisições para `http://localhost:4000/api`.

## Endpoints principais

- `POST /api/auth/register` — registro de usuário
- `POST /api/auth/login` — login
- `GET /api/auth/me` — dados do usuário logado
- `PUT /api/users/:id` — editar perfil
- `DELETE /api/users/:id` — deletar conta
- `GET /api/users` — lista de usuários (filtros: `?q=nome&gosto=music&page=1&limit=20&mode=parecidos|explorar`)
- `GET /api/users/:id` — detalhes de perfil público
- `POST /api/upload/avatar` — upload de avatar (multipart/form-data)
- `POST /api/connections` — cria conexão ("Bubble")
- `GET /api/connections` — lista conexões do usuário

## Testando endpoints (exemplo curl)

Registro:
```
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Ana","email":"ana@bubble.com","password":"senha1234","confirmPassword":"senha1234","age":22,"gostos":["música","cinema","arte"],"preference":"parecidos"}'
```

Login:
```
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"ana@bubble.com","password":"senha1234"}'
```

Listar usuários (parecidos):
```
curl -H "Authorization: Bearer <token>" "http://localhost:4000/api/users?mode=parecidos"
```

## Integração futura de chat

O local ideal para integrar chat é criar um microserviço (ex: Node.js + Socket.io/WebSocket) e trocar o endpoint `POST /api/connections` para iniciar/aceitar sockets. O frontend tem placeholders e comentários para facilitar integração futura.

## Segurança
- Senhas com bcrypt
- JWT com expiração
- Validação de inputs
- Proteção de uploads (tipo/tamanho)
- Rate limiting nas rotas de autenticação
- Rotas protegidas por middleware JWT

## Paleta de cores
- Azul: #0E6FFF
- Amarelo: #FFC107
- Branco: #FFFFFF
- Preto: #000000

## Observações
- O chat **não está implementado** — apenas placeholders/documentação.
- O código é modular, comentado e pronto para extensão.
- Para dúvidas ou integração, consulte os comentários no código.
