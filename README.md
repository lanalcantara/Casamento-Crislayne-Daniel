# 💍 Convite de Casamento Virtual — Crislayne & Daniel

Site de convite de casamento virtual interativo, responsivo e mobile-first, com animação realista de envelope 3D em azul-marinho, selo de lacre de cera branco com flores secas, música de fundo ("Só Você" - Anderson Freire), estética rústica em madeira clara com florais em aquarela, contagem regressiva em tempo real, integração com Google Maps / Waze, confirmação de presença (RSVP) e lista de presentes via PIX.

---

## ✨ Funcionalidades Principais

1. **Tela Inicial e Animação 3D do Envelope**:
   - Envelope fechado em azul-marinho elegante com relevo e profundidade.
   - Selo de lacre de cera branco com relevo de ramo de oliveira e buquê de flores secas.
   - Botão interativo com efeito de pulsar e brilho: *"Toque para abrir o convite"*.
   - Abertura fluida em 3D: a aba superior se abre, o selo se desprende, confetes dourados explodem na tela e o convite principal surge suavemente.

2. **Música de Fundo Automática**:
   - Toca automaticamente no exato momento da abertura do envelope (respeitando a política de autoplay dos navegadores mobile).
   - Fade-in de volume suave e cinematográfico.
   - Widget flutuante de controle de áudio (tocar/pausar com disco de vinil giratório e barras equalizadoras animadas).

3. **Convite Principal (Estética de Luxo & Madeira)**:
   - Textura de madeira clara (estilo pinus/bétula) e ilustrações botânicas de lírios pêssego em aquarela nas pontas.
   - Citação clássica de Henry van Dyke:
     > *"O tempo é muito lento para os que esperam / Muito rápido para os que têm medo / Muito longo para os que lamentam / Muito curto para os que festejam / Mas, para os que amam, o tempo é eterno."*
   - Tipografia romântica com nomes em destaque: **Crislayne & Daniel**.
   - Data, horário e local: **21 de novembro de 2026 – Sábado – Às 18:00** no **Maysa Recepções**, Recife - PE.

4. **Foto dos Noivos**:
   - Foto original de Crislayne & Daniel emoldurada em um arco nobre dourado com folhagens decorativas.

5. **Contagem Regressiva em Tempo Real**:
   - Cronômetro interativo com Dias, Horas, Minutos e Segundos até 21/11/2026 às 18:00.
   - Botão para adicionar o evento ao Google Calendar ou Apple Calendar.

6. **Localização e Navegação**:
   - Card completo com endereço de **Maysa Recepções**.
   - Botões diretos para abrir no **Google Maps** e **Waze**.
   - Botão para copiar o endereço completo.
   - Mapa interativo embutido.
   - Guia de traje: **Traje Social**.

7. **Confirmação de Presença (RSVP com Supabase & E-mail)**:
   - Formulário completo e elegante com validação em tempo real e máscara de telefone `(XX) XXXXX-XXXX`.
   - Pergunta de confirmação: *"Sim, com certeza! 🎉"* ou *"Infelizmente não poderei comparecer 💔"*.
   - Seletor de acompanhantes e nomes dos acompanhantes.
   - Campo para recado com carinho aos noivos.
   - **Banco de Dados Supabase**: Salva diretamente na tabela `rsvp` (com script [`supabase_setup.sql`](file:///C:/Users/Lana/.gemini/antigravity-ide/scratch/convite-crislayne-daniel/supabase_setup.sql) incluído).
   - **Notificação Automática por E-mail**: Notifica automaticamente **`Crislayneevelin98@gmail.com`** a cada nova confirmação.
   - Tela de sucesso com confetes e botão para enviar a mensagem também pelo WhatsApp.

---

## ⚙️ Configuração do Supabase & E-mail

1. **Criar a tabela no Supabase**:
   - Abra o [Supabase](https://supabase.com) e crie um novo projeto gratuito.
   - Vá no menu **SQL Editor** e execute o conteúdo de [`supabase_setup.sql`](file:///C:/Users/Lana/.gemini/antigravity-ide/scratch/convite-crislayne-daniel/supabase_setup.sql).
2. **Conectar as chaves no site**:
   - Abra o arquivo [`supabase_config.js`](file:///C:/Users/Lana/.gemini/antigravity-ide/scratch/convite-crislayne-daniel/supabase_config.js).
   - Cole a sua **`SUPABASE_URL`** e **`SUPABASE_ANON_KEY`** (encontradas em *Project Settings -> API*).
   - O e-mail de notificação já está configurado para `Crislayneevelin98@gmail.com`.

8. **Lista de Presentes & PIX**:
   - QR Code em alta definição para leitura pelo app do banco.
   - Chave PIX: `81996946988` (Telefone) | Favorecida: `Crislayne Evelin`.
   - Botão de 1 clique para copiar a chave com notificação visual (Toast).
   - Cotas virtuais interativas de presente (Brinde dos Noivos, Jantar Romântico, Passeio de Barco, Noite de Núpcias, Contribuição Livre) com modais dedicados.

---

## 📁 Estrutura de Arquivos

```
convite-crislayne-daniel/
├── index.html               # Estrutura semântica e acessível HTML5
├── style.css                # Estilização CSS3 de luxo, 3D e responsividade
├── app.js                   # Lógica da animação, áudio, countdown e PIX
├── README.md                # Este manual
└── assets/
    ├── images/
    │   ├── wax_seal.png     # Selo de cera branco com flores secas
    │   ├── wood_texture.jpg # Fundo de textura em madeira clara
    │   ├── flower_lily.png  # Lírios pêssego em aquarela
    │   ├── noivos_portrait.jpg # Foto emoldurada dos noivos
    │   └── pix_qrcode.png   # QR Code de pagamento PIX
    └── audio/
        └── wedding_melody.wav # Trilha de áudio romântica
```

---

## 🚀 Como Executar Localmente

Você pode abrir o projeto diretamente no navegador ou rodar com qualquer servidor local:

```bash
# Com Python
python -m http.server 8080

# Ou com Node.js (npx)
npx serve .
```

Acesse em seu navegador ou celular: `http://localhost:8080` (ou o IP da sua rede local).

---

## 🌐 Como Publicar Gratuitamente na Internet

1. **GitHub Pages**:
   - Crie um repositório no GitHub, envie esta pasta e ative o GitHub Pages nas configurações.
2. **Vercel / Netlify**:
   - Basta arrastar e soltar a pasta no painel do [Netlify Drop](https://app.netlify.com/drop) ou [Vercel](https://vercel.com) para obter um link HTTPS em segundos.
