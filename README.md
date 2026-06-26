# 🏢 Portal de Merchants - Desafio Técnico

Uma plataforma Full Stack desenvolvida para gestão, análise e aprovação de estabelecimentos parceiros (Merchants). O sistema implementa uma máquina de estados rigorosa para transição de status e uma linha do tempo (timeline) imutável para auditoria de ações.

## 🚀 Tecnologias Utilizadas

**Backend:**
* Python 3.x
* Django & Django REST Framework (DRF)
* PostgreSQL (Rodando em container Docker)
* Transações Atômicas (`@transaction.atomic`) para consistência de dados

**Frontend:**
* React (com Vite)
* TypeScript (Segurança de tipagem estática)
* Axios (Consumo de API REST)
* CSS Modules (Estilização isolada e Dark Mode corporativo)

---

## ⚙️ Arquitetura e Regras de Negócio

O sistema foi arquitetado em torno de regras de compliance estritas:
1. **Unicidade e Validação:** CNPJs são validados e formatados no Serializer, garantindo unicidade no banco de dados.
2. **Máquina de Estados (Status):** Todo Merchant nasce como `draft`. Transições ocorrem unicamente via endpoints dedicados (ex: `approve/`, `reject/`), respeitando o fluxo: `draft` -> `pending_analysis` -> `approved`/`rejected`.
3. **Bloqueio de Edição:** Alterações cadastrais via `PATCH/PUT` são bloqueadas na API caso o Merchant não esteja no status `draft`.
4. **Timeline Atômica:** Qualquer mudança de status gera um `MerchantEvent` automaticamente. O uso de transações atômicas no banco garante que, em caso de falha, o status não mude sem gerar o log (e vice-versa).

---

## 🛠️ Como executar o projeto localmente

### Pré-requisitos
* [Docker](https://www.docker.com/) instalado e rodando.
* [Node.js](https://nodejs.org/) (versão 18+) instalado.
* [Python 3.x](https://www.python.org/) instalado.

### 1. Subindo o Banco de Dados (PostgreSQL)
Na raiz do projeto, inicie o container do banco de dados:
```bash
docker-compose up -d

### 2. Configurando o Backend (Django)

Abra um terminal na pasta `backend`:

bash
# Crie e ative o ambiente virtual
python -m venv venv
# No Windows: venv\Scripts\activate
# No Linux/Mac: source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações para criar as tabelas
python manage.py migrate

# Inicie o servidor
python manage.py runserver



O backend estará rodando em `http://127.0.0.1:8000/`.

### 3. Configurando o Frontend (React)

Abra um novo terminal na pasta `frontend`:

bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev



Acesse a aplicação no navegador pela URL fornecida no terminal (geralmente `http://localhost:5173/`).