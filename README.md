<p align="center">
  <img src="src/assets/images/layouts/identity/FEAL.png" alt="FEAL - Fraternidade Espírita Amor e Luz" width="100"/>
</p>

<h1 align="center">
Biblioteca FEAL — Web
</h1>

<p align="center">
Frontend do sistema de gerenciamento do acervo da Biblioteca Francisco Cândido Xavier, da Fraternidade Espírita Amor e Luz (FEAL).
</p>

## Sobre o projeto

Este é o site público e o painel administrativo da **Biblioteca Francisco Cândido Xavier**, mantida pela FEAL. Ele permite que qualquer pessoa consulte o acervo (livros, autores, categorias e temas) online, e que bibliotecários/administradores gerenciem o catálogo, os empréstimos e os usuários.

A leitura sempre foi um dos grandes instrumentos de esclarecimento espiritual. Ao tornar o acervo acessível, este projeto busca incentivar o estudo, a reflexão e o contato com obras que ajudam a compreender melhor a vida espiritual e os ensinamentos do Evangelho. É mantido para apoiar as atividades da biblioteca da FEAL — sugestões de melhoria e contribuições são sempre bem-vindas.

Este repositório contém apenas o **frontend**. A API que ele consome vive em [`feal-biblioteca-api`](../feal-biblioteca-api).

## Principais funcionalidades

- Catálogo público navegável, com busca, filtros (categoria, tema, autor, editora) e ordenação.
- Página de detalhes de livro/volume e de autor, com empréstimo de exemplares disponíveis.
- Cadastro e login de usuários (CPF como identificador), recuperação de senha e perfil com histórico de empréstimos.
- Painel administrativo (livros, volumes, autores, categorias, temas, editoras, usuários e empréstimos), com complementação de metadados assistida por IA (Gemini).
- Suporte a múltiplos idiomas (pt/en/es) e modo claro/escuro.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, Server Components) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI v3](https://www.chakra-ui.com/) para componentes e tema, com [Emotion](https://emotion.sh/) por baixo
- [next-intl](https://next-intl.dev/) para internacionalização
- [Framer Motion](https://www.framer.com/motion/) para animações
- [Axios](https://axios-http.com/) para chamadas à API, [Zod](https://zod.dev/) para validação de formulários
- [Husky](https://typicode.github.io/husky/) + [commitlint](https://commitlint.js.org/) para hooks de commit

## Estrutura do projeto

```
src/
├── app/            # Rotas (App Router). Grupos: (public), (private), @modal
│   ├── (public)/   # Home/catálogo, login, registro, recuperação de senha, /sobre
│   ├── (private)/  # Páginas administrativas (acervo, autores, usuários, empréstimos...)
│   └── @modal/      # Rotas interceptadas - login, busca, autor etc. abrem como modal
│                    # sobre a página atual quando navegadas de dentro do app
├── components/     # Componentes de UI, organizados por domínio (Volume, Author, Admin...)
├── hooks/          # Lógica de estado/dados reutilizável (ex.: useAdminBooks, useVolumesCollection)
├── endpoints/      # Funções que chamam a API (uma por recurso: Books, User, Loans...)
├── contexts/       # Contextos React globais (autenticação, navbar, tema)
├── types/          # Tipos TypeScript compartilhados (entidades, props, API)
├── utils/          # Helpers puros (formatação, validação, constantes)
├── i18n/           # Configuração do next-intl (locales, roteamento)
└── middleware.tsx  # Controle de acesso a rotas públicas/privadas
messages/           # Textos traduzidos (pt.json, en.json, es.json) - uma chave por t()
```

O padrão de rotas em modal (`@modal`) é usado em `/login`, `/registro`, `/recuperar-senha`, `/buscar` e `/a/[autor]`: ao navegar para elas a partir de qualquer página do site, elas abrem como um diálogo sobre a página atual; ao acessar a URL diretamente (link direto, F5), a mesma tela é renderizada sobre a home, mantendo o comportamento consistente.

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- A [API](../feal-biblioteca-api) rodando (localmente ou apontando para um ambiente já disponível)

### Passo a passo

```bash
npm install

# copie o exemplo e ajuste os valores (veja a tabela abaixo)
cp .env.example .env

npm run dev
```

O site sobe em `http://localhost:3000` por padrão.

### Variáveis de ambiente

| Variável                             | Obrigatória | Descrição                                                                          |
| ------------------------------------- | :----------: | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_HOST`                |      ✅      | URL base da API (ex.: `http://localhost:3001` em desenvolvimento).                  |
| `NEXT_PUBLIC_API_CALL_TIMEOUT_IN_MS`  |      ✅      | Timeout (em ms) aplicado às chamadas à API.                                         |
| `NEXT_PUBLIC_APP_DOMAIN`              |      ✅      | Domínio público do site, usado em metadados/SEO (canonical, Open Graph, sitemap).   |

Como todas começam com `NEXT_PUBLIC_`, ficam embutidas no bundle enviado ao navegador - não coloque aqui nenhum segredo.

## Scripts disponíveis

| Comando               | O que faz                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `npm run dev`           | Inicia o servidor de desenvolvimento (Turbopack) com hot reload.        |
| `npm run build`         | Gera o build de produção.                                               |
| `npm start`             | Serve o build de produção (rode `build` antes).                        |
| `npm run lint`          | Roda o ESLint.                                                          |
| `npm run lint:fix`      | Roda o ESLint corrigindo o que for automático.                          |
| `npm run prettier`      | Formata o projeto com Prettier.                                        |
| `npx tsc --noEmit`      | Verifica os tipos TypeScript sem gerar arquivos.                       |

Antes de abrir um PR, rode `npx tsc --pretty --noEmit` e `npm run lint -- --max-warnings=0` - é o mesmo par de verificações que o hook de pre-commit (`husky`) já roda automaticamente.

## Internacionalização

Todo texto visível ao usuário passa por `next-intl` (`useTranslations`) - nunca hardcode strings em português direto no JSX. As traduções vivem em `messages/{pt,en,es}.json`, organizadas por namespace (uma chave de topo por página/domínio, ex.: `Collection`, `AdminCatalog`, `AboutPage`). Ao adicionar uma chave nova, ela precisa existir **nos três arquivos** com o mesmo caminho - um jeito rápido de checar isso:

```bash
node -e "
const [pt, en, es] = ['pt','en','es'].map(l => require('./messages/'+l+'.json'));
const flat = (o,p='') => Object.entries(o).flatMap(([k,v]) => typeof v==='object' ? flat(v,p+k+'.') : [p+k]);
const [a,b,c] = [pt,en,es].map(flat);
console.log('faltando em en:', a.filter(k => !b.includes(k)));
console.log('faltando em es:', a.filter(k => !c.includes(k)));
"
```

## Docker

```bash
docker compose up --build
```

Usa o `Dockerfile` na raiz (build de produção do Next.js, porta `3000`).

## Contribuindo

Sugestões, correções e novas funcionalidades são bem-vindas. Abra uma issue descrevendo o problema/ideia antes de um PR maior, para alinhar o escopo. Commits seguem o padrão do [commitlint](https://commitlint.js.org/) (Conventional Commits), verificado automaticamente pelo Husky.

## Licença

Distribuído sob a licença GNU GPLv3 - veja [`LICENSE`](./LICENSE).
