## Desafio FINAL - Construção de Interface para o Projeto "SISPAR"
**PROFESSORES:** Samuel Silvério e Karynne Moreira  
**Data de início:** 06/02/2025 | **Data de conclusão:** 14/05/2025

---

## Objetivo
Neste desafio, iniciaremos pelo Front-end (toda a parte visual) e concluiremos no Back-end (recebimento, processamento e armazenamento dos dados), garantindo a implementação fiel ao design fornecido no Figma.

---

## 🚀 Novidades - Integração com Inteligência Artificial

### ✨ Funcionalidades de IA Implementadas

O SISPAR agora conta com recursos avançados de **Inteligência Artificial** para otimizar a análise e aprovação de reembolsos:

#### 🤖 1. Chatbot Assistente Virtual
- **Localização:** Botão flutuante no canto inferior direito (disponível em todas as telas)
- **Funcionalidades:**
  - Assistente virtual integrado com **Grok API**
  - Responde dúvidas sobre reembolsos, processos e sistema
  - Sugestões de perguntas frequentes
  - Histórico de conversas na sessão
- **Como usar:** Clique no ícone do chat e digite sua pergunta

#### 🔍 2. Análise Inteligente de Reembolsos (IA)
- **Localização:** Tela de Análise → Botão "🤖 Análise IA" em cada solicitação
- **Funcionalidades:**
  - **Score de Confiabilidade:** Pontuação de 0-100% indicando a confiabilidade do reembolso
  - **Nível de Risco:** Classificação em Baixo, Médio ou Alto
  - **OCR Automático:** Extração de dados do comprovante (valor, data, CNPJ, estabelecimento)
  - **Validações Automáticas:**
    - ✓ Valor corresponde ao comprovante
    - ✓ Data válida
    - ✓ Detecção de duplicatas
    - ✓ Validação de estabelecimento
    - ✓ Verificação do tipo de despesa
    - ✓ Qualidade/legibilidade do comprovante
    - ✓ Detecção de sinais de edição/fraude
  - **Alertas Inteligentes:** Identificação de anomalias com gravidade (baixa, média, alta, crítica)
  - **Histórico do Colaborador:** Estatísticas de aprovações anteriores
  - **Recomendação IA:** Sugestão automática de aprovação ou rejeição com justificativa

#### ⚡ 3. Ações com IA
- **Aceitar Recomendação IA:** Aprova automaticamente baseado na análise
- **Aprovar Manualmente:** Ignora recomendação IA e aprova
- **Rejeitar:** Rejeita a solicitação

### 📱 Fluxo de Uso da Análise IA

1. Acesse a tela de **Análise** (menu lateral)
2. Localize a solicitação pendente
3. Clique no botão **"🤖 Análise IA"**
4. Visualize o **Score** e **Nível de Risco**
5. Revise os **Alertas** e **Validações**
6. Consulte a **Recomendação da IA**
7. Tome sua decisão: **Aceitar IA**, **Aprovar Manual** ou **Rejeitar**

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
![Grok AI](https://img.shields.io/badge/Grok_AI-000000?style=flat&logo=x&logoColor=white)
![OCR](https://img.shields.io/badge/OCR-FF6B6B?style=flat&logo=opencv&logoColor=white)

---

## Requisitos Técnicos

### 1. Tela de Login  
✅ **Funcionalidades:**  
🔹 Ao clicar em "ENTRAR", redirecionar para **Reembolsos**.  
🔹 Rota configurada para `/reembolsos`.

### 2. Tela de Reembolsos  
✅ **Funcionalidades:**  
🔹 Conteúdo estático (lista pré-carregada).  
🔹 Card "Solicitar Reembolso" leva à **Solicitação de Reembolsos**.

### 3. Tela de Solicitação de Reembolsos  
✅ **Funcionalidades:**  
🔹 Inputs funcionais para nome, valor, data etc.  
🔹 Armazenar entradas em array-estado (simulação de "task list").  
🔹 Botão "ENVIAR" dispara POST à API.

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

### 6. Novos Endpoints de IA 🆕
✅ **Endpoints adicionados:**  
🔹 **POST** `/reembolsos/{id}/analisar-ia` – Realiza análise inteligente do reembolso com OCR e validações.  
🔹 **POST** `/reembolsos/{id}/aprovar-com-ia` – Aprova reembolso com base na recomendação da IA.  
🔹 **POST** `/chatbot` – Endpoint do assistente virtual integrado com Grok API.  
🔹 **GET** `/reembolsos/{id}/comprovante` – Retorna o comprovante para visualização/download.

---

## Estrutura de Componentes de IA

```
src/components/
├── analise-ia/
│   ├── AnaliseIA.jsx          # Tela de análise detalhada com IA
│   └── AnaliseIA.module.scss  # Estilos da análise IA
├── chatbot/
│   ├── Chatbot.jsx            # Componente do assistente virtual
│   └── Chatbot.module.scss    # Estilos do chatbot
```

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
- **Back-end (Render):** [API SISPAR no Render](https://sispar-backend-npp2.onrender.com)

---

## 📋 Changelog - Atualizações Recentes

### v2.0.0 - Integração IA (Dezembro 2025)
- ✅ Adicionado **Chatbot** assistente virtual com Grok API
- ✅ Implementada **Análise IA** de reembolsos com score de confiabilidade
- ✅ Extração automática de dados via **OCR** de comprovantes
- ✅ Sistema de **alertas inteligentes** com níveis de gravidade
- ✅ **Validações automáticas** de valor, data, duplicatas e fraudes
- ✅ **Histórico do colaborador** integrado na análise
- ✅ Componentes de UI aprimorados (Loading, Modal)
- ✅ Melhorias de responsividade e acessibilidade
