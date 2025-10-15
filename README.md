# 🤖 BOT ELITE

**Plataforma completa para gerenciamento avançado de bots do Telegram**

Uma aplicação web moderna e intuitiva inspirada no design do Grok, construída com React + Vite + Tailwind CSS, para criar, gerenciar e otimizar seus bots do Telegram com facilidade.

## ✨ Funcionalidades

- **Dashboard Intuitivo**: Métricas em tempo real, gráficos interativos e visão geral completa
- **Criação de Bots**: Wizard multi-step guiado para configurar novos bots
- **Gerenciamento**: Lista completa com edição, exclusão e visualização de estatísticas
- **Automações**: Builder visual para criar fluxos automáticos de resposta
- **Simulador de Chat**: Teste suas mensagens e automações em tempo real
- **Estatísticas Avançadas**: Análise detalhada com gráficos de barra, linha e pizza
- **Templates de Mensagens**: Crie e gerencie mensagens predefinidas
- **Configurações**: Personalize seu perfil, notificações e preferências

## 🎨 Design System

- **Tema**: Dark mode premium inspirado no Grok
- **Cores**: Fundo escuro (#0a0a0a), cards sutis (#1a1a1a), accent azul neon (#3b82f6)
- **Tipografia**: Inter (Google Fonts)
- **Animações**: Transições suaves com Framer Motion
- **Responsivo**: Mobile-first, otimizado para todos os dispositivos

## 🚀 Tecnologias

- **React 18** com Hooks modernos
- **Vite** para desenvolvimento ultrarrápido
- **TypeScript** para type safety
- **Tailwind CSS** para estilização utilitária
- **shadcn/ui** para componentes UI elegantes
- **Framer Motion** para animações fluidas
- **React Router** para navegação SPA
- **Zustand** para gerenciamento de estado
- **React Hook Form + Zod** para validação de formulários
- **Recharts** para gráficos interativos

## 📦 Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre no diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── Logo.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── ProtectedRoute.tsx
├── layouts/            # Layouts principais
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── CreateBot.tsx
│   ├── MyBots.tsx
│   ├── Stats.tsx
│   ├── Automations.tsx
│   ├── Messages.tsx
│   ├── Settings.tsx
│   └── Support.tsx
├── store/              # Estado global (Zustand)
│   └── authStore.ts
├── mocks/              # Dados mockados
│   └── mockData.ts
└── App.tsx             # Componente raiz com rotas
```

## 🔐 Autenticação

O sistema utiliza autenticação simulada com persistência local (localStorage via Zustand). Ideal para protótipos e testes.

**Login padrão:**
- Email: qualquer email válido
- Senha: mínimo 6 caracteres

## 📊 Dados Mockados

Todos os dados são simulados localmente para demonstração:
- 3 bots de exemplo
- Métricas e estatísticas fictícias
- Gráficos com dados dos últimos 7 dias
- Automações e templates predefinidos

## 🎯 Próximos Passos

- [ ] Integração com API real do Telegram
- [ ] Backend para persistência de dados
- [ ] Webhook para recebimento de mensagens
- [ ] Sistema de notificações em tempo real
- [ ] Export de relatórios em PDF
- [ ] Multi-idioma (i18n)
- [ ] Temas customizáveis

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 🌐 Deploy

Para fazer deploy do projeto, use o botão **Publish** no Lovable ou siga os passos para deploy em Vercel/Netlify.

## 📄 Licença

Este projeto é um protótipo desenvolvido com Lovable.dev

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores, abra uma issue primeiro para discutir o que você gostaria de mudar.

---

**Desenvolvido com ❤️ usando [Lovable.dev](https://lovable.dev)**
