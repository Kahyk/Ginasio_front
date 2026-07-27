# Sistema Ginásio
---

O Sistema Ginásio é uma aplicação web voltada para o gerenciamento de academias e centros esportivos. O projeto foi desenvolvido para otimizar o controle de alunos, planos e rotinas administrativas através de uma interface moderna e responsiva.

## Funcionalidades Principais
---

* **Gestão de Alunos:** Cadastro, edição e acompanhamento dos membros do ginásio.
* **Controle de Planos:** Gerenciamento das assinaturas e pacotes oferecidos pela academia.
* **Painel Administrativo:** Interface projetada para facilitar a operação diária da recepção e administração.

## Tecnologias e Arquitetura
---

* **Front-end:** Aplicação cliente (este repositório), hospedada e acessível via Vercel.
* **Back-end:** API executada localmente, responsável pelo banco de dados e regras de negócio.

## Aviso Importante: Fluxo de Execução
---

O front-end desta aplicação possui um link de deploy no Vercel, porém **ele não funcionará de forma independente**. Para que as listagens, cadastros e acessos funcionem corretamente, é estritamente necessário que o back-end da aplicação esteja rodando na sua máquina local.

**Para testar a aplicação por completo:**

1. **Subir o Back-end Localmente:**
Você deve possuir o código da API (back-end) deste projeto. Inicie o servidor localmente para que ele possa receber as requisições do front-end.

2. **Rodar o Front-end (Opcional para desenvolvimento):**
Caso queira rodar este repositório front-end localmente em vez de usar o link do Vercel, clone o projeto, abra o terminal na pasta raiz e execute:

```bash
npm install
npm run dev
