# 🚚 Controle de Carga

Aplicação web para registrar e consultar informações de cargas, facilitando o controle e a organização dos registros do dia a dia.

## 📌 Sobre o projeto

O **Controle de Carga** é um projeto desenvolvido para digitalizar o registro de cargas, substituindo anotações manuais por uma aplicação web com dados armazenados em banco de dados.

O objetivo é tornar o processo de registro e consulta mais simples, organizado e acessível.

## 🎯 Objetivos

- Digitalizar os registros de cargas.
- Facilitar a consulta de informações cadastradas.
- Centralizar os dados em um banco de dados.
- Reduzir a dependência de registros em papel.
- Disponibilizar o sistema pela internet.

## 🛠️ Tecnologias utilizadas

- **Next.js** — framework para desenvolvimento web.
- **React** — construção da interface.
- **TypeScript** — tipagem estática.
- **Tailwind CSS** — estilização da interface.
- **Prisma ORM** — comunicação com o banco de dados.
- **PostgreSQL** — banco de dados relacional.
- **Supabase** — hospedagem do banco de dados.
- **Vercel** — hospedagem e publicação da aplicação.
- **Zod** — validação de dados.

## ⚙️ Funcionalidades

- Cadastro de registros de cargas.
- Consulta de cargas cadastradas.
- Armazenamento dos dados em banco de dados.
- Acesso à aplicação pela web.

*As funcionalidades podem ser ampliadas conforme a evolução do projeto.*

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Acesso ao banco de dados PostgreSQL.
- Git instalado.

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/controle-de-carga.git
```

Entre na pasta do projeto:

```bash
cd controle-de-carga
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias para a conexão com o banco de dados.

Exemplo de estrutura:

```env
DATABASE_URL="URL_DE_CONEXAO_DO_BANCO"
DIRECT_URL="URL_DE_CONEXAO_DIRETA_DO_BANCO"
```

Substitua os valores pelos dados de conexão do seu ambiente. Não compartilhe nem publique esse arquivo.

### 4. Execute as migrações

```bash
npx prisma migrate deploy
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse no navegador:

http://localhost:3000

## 🗄️ Banco de dados

O projeto utiliza PostgreSQL com Prisma ORM para gerenciar a estrutura e as operações do banco de dados.

As migrações do Prisma permitem versionar as alterações na estrutura das tabelas.

## ☁️ Deploy

A aplicação está publicada na Vercel e utiliza o Supabase como banco de dados.

**Aplicação:** https://controle-de-carga-five.vercel.app/

## 🔐 Segurança

A segurança é uma etapa importante da evolução do projeto.

- Manter credenciais fora do repositório.
- Utilizar variáveis de ambiente para configurações sensíveis.
- Implementar autenticação para controlar o acesso.
- Restringir as operações de leitura e escrita no banco de dados.
- Planejar rotinas de backup e recuperação dos dados.

**Observação:** a autenticação e as restrições de acesso ainda precisam ser implementadas e verificadas antes da utilização com dados reais.

## 🗺️ Próximos passos

- [ ] Implementar login e autenticação de usuários.
- [ ] Restringir o acesso aos registros.
- [ ] Melhorar a validação dos formulários.
- [ ] Implementar rotina de backup.
- [ ] Testar a recuperação dos dados.
- [ ] Melhorar a interface para uso em dispositivos móveis.

## 👩‍💻 Desenvolvimento

Projeto desenvolvido para praticar e aplicar conhecimentos em desenvolvimento web, banco de dados, versionamento de código e implantação em nuvem.

---

**Controle de Carga** — mais organização e praticidade no registro de cargas.
