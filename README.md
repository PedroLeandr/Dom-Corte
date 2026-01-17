# Barbearia Dom Lima - Sistema de Agendamento

Sistema de agendamento online para a Barbearia Dom Lima, desenvolvido com Next.js, NextAuth.js e shadcn/ui.

## Funcionalidades

- ✅ Autenticação com Google (NextAuth.js)
- ✅ Interface moderna com shadcn/ui
- ✅ Sistema de agendamento por etapas
- ✅ Seleção de serviços e barbeiros
- ✅ Calendário de disponibilidade
- ✅ Design responsivo

## Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **NextAuth.js v4** - Autenticação
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **TypeScript** - Tipagem estática
- **Lucide React** - Ícones

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as seguintes variáveis:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Configurar Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+
4. Crie credenciais OAuth 2.0
5. Configure as URLs de redirecionamento:
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback/google` (produção)

### 4. Executar o projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/auth/[...nextauth]/     # Configuração NextAuth
│   ├── marcacao/                   # Página de agendamento
│   ├── layout.tsx                  # Layout principal
│   └── page.tsx                    # Página inicial
├── components/
│   ├── ui/                         # Componentes shadcn/ui
│   ├── auth-components.tsx         # Componentes de autenticação
│   └── providers.tsx               # Providers React
└── lib/
    ├── auth.ts                     # Configuração NextAuth
    └── utils.ts                    # Utilitários
```

## Como Usar

1. **Login**: Faça login com sua conta Google
2. **Agendamento**: Clique em "Agendar agora"
3. **Dados Pessoais**: Preencha nome e telefone
4. **Serviço**: Escolha o serviço desejado
5. **Barbeiro**: Selecione o profissional
6. **Data/Hora**: Escolha data e horário disponível
7. **Confirmação**: Revise e confirme o agendamento

## Próximos Passos

- [ ] Integração com banco de dados
- [ ] Sistema de notificações
- [ ] Painel administrativo
- [ ] Histórico de agendamentos
- [ ] Sistema de pagamento
- [ ] Avaliações e comentários

## Licença

Este projeto é privado e pertence à Barbearia Dom Lima.