## Desafio FINAL - Construção de Interface para o Projeto "SISPAR"
**PROFESSORES:** Samuel Silvério e Karynne Moreira  
**Data de início:** 06/02/2025 | **Data de conclusão:** 14/05/2025

---

## Objetivo
Neste desafio, iniciaremos pelo Front-end (toda a parte visual) e concluiremos no Back-end (recebimento, processamento e armazenamento dos dados), garantindo a implementação fiel ao design fornecido no Figma.

---

## Tecnologias

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=FFD62E)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-FF0000?style=flat&logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white)
![Flask CORS](https://img.shields.io/badge/Flask_CORS-4D7A9C?style=flat&logo=flask&logoColor=white)
![Flasgger](https://img.shields.io/badge/Flasgger-236192?style=flat&logo=swagger&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-2EC866?style=flat&logo=render&logoColor=white)

---

## Requisitos Técnicos

### 1. Tela de Login  
✅ **Funcionalidades:**  
🔹 Ao clicar em “ENTRAR”, redirecionar para **Reembolsos**.  
🔹 Rota configurada para `/reembolsos`.

### 2. Tela de Reembolsos  
✅ **Funcionalidades:**  
🔹 Conteúdo estático (lista pré-carregada).  
🔹 Card “Solicitar Reembolso” leva à **Solicitação de Reembolsos**.

### 3. Tela de Solicitação de Reembolsos  
✅ **Funcionalidades:**  
🔹 Inputs funcionais para nome, valor, data etc.  
🔹 Armazenar entradas em array-estado (simulação de “task list”).  
🔹 Botão “ENVIAR” dispara POST à API.

### 4. NavBar (Navegação)  
✅ **Funcionalidades:**  
🔹 Ícones linkam para cada tela (Home, Solicitação, Histórico, Gráficos).  
🔹 Menu hambúrguer abre/fecha a sidebar.  
🔹 Logout redireciona para **Login**.

### 5. Back-end (API Flask)  
✅ **Endpoints mínimos:**  
🔹 **POST** `/colaborador/login` – autenticação JWT.  
🔹 **GET/POST/PUT/DELETE** `/colaboradores` – CRUD de colaboradores.  
🔹 **GET/POST/PUT** `/reembolsos` – criar, listar, aprovar/rejeitar.  
🔹 **GET** `/reembolsos/historico?colaborador_id=…` – histórico filtrado.  
🔹 Documentação automática em `/apidocs/` via Flasgger.

---

## Materiais de Apoio
- **Protótipo no Figma:**  
  https://www.figma.com/design/HiQqNZdfEVGoBaxq1xZ4IK/PortoLogistica  
- **Conversores de Unidades:**  
  - Pixel → rem: https://nekocalc.com/px-to-rem-converter  
  - Pixel → vh/vw: https://khaledkzy.github.io/pixel-vh-vw-converter  

---

## Deploy

- **Front-end (Vercel):** [Projeto SISPAR no Vercel](https://vercel.com/gabriels-projects-07a8013f/projeto-sispar)  
- **Back-end (Render):** [API SISPAR no Render](https://cria-o-api.onrender.com)
