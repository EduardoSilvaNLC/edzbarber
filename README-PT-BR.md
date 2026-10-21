# Landing page EDZ Barber — pronta para publicar

## Arquivos
- `index.html` — toda a página (HTML, CSS, botões e versão mobile).
- `favicon.svg` — ícone da página.
- `assets/` — pasta onde você pode incluir fotos **reais dos seus cortes**.

## Como publicar no Vercel
**Opção 1:** No seu projeto atual no GitHub, faça upload do arquivo `index.html` e do `favicon.svg` na pasta que corresponde à raiz do site estático (ou crie uma nova pasta para a landing page). Depois faça deploy no Vercel. Se seu site atual usa React ou Next.js, não substitua o `index.html` dele: publique esta versão como um projeto estático separado ou converta o conteúdo em uma página do seu framework.

**Opção 2:** Crie um novo projeto estático no Vercel a partir desta pasta / do repositório que contém os arquivos. O projeto não precisa de build nem de variáveis de ambiente.

Depois de testar a página publicada no seu próprio telemóvel, use o endereço HTTPS dela como **URL final** no Google Ads.

## O que a landing page faz
- Exibe **£10 First Haircut Offer**, exclusivamente para novos clientes.
- Apresenta Skin Fade e Classic Haircut e deixa os preços regulares no Fresha para evitar inventar valores.
- Oferece botões de destaque **Get Directions**, todos com este endereço preenchido no Google Maps: `47–51 Norfolk Street, Cambridge CB1 2LD`.
- Mostra **Novo Studios** como localização física e **EDZ Barber** como o serviço anunciado.
- Preserva um link secundário ao Fresha para quem prefere agendar.
- Não redireciona automaticamente: isso é intencional para manter uma landing page útil e evitar problemas de política de destino do Google Ads.

## Como adicionar fotos reais
Adicione à pasta `assets/` até três imagens JPG com nomes exatos:
- `cut-1.jpg`
- `cut-2.jpg`
- `cut-3.jpg`

A seção **Real cuts. Real results.** aparece automaticamente assim que a página encontrar fotos. Sem fotos, essa seção fica oculta. Use imagens dos seus próprios cortes, com permissão dos clientes.

## Antes de anunciar
1. Confirme que a promoção **£10** continua válida e seus termos estão corretos.
2. Confirme se os serviços oferecidos continuam sendo Skin Fade e Classic Haircut.
3. Teste o botão **Get Directions** num iPhone e num Android. Links do Google Maps normalmente abrem o app quando disponível, mas o comportamento depende do dispositivo e das configurações.
4. Confirme o endereço do Novo Studios e a URL do Fresha.
5. Espere a página estar publicada e acessível antes de alterar a URL final do Google Ads; uma mudança de destino pode provocar nova revisão.

## Medição
O `index.html` contém um evento opcional `get_directions_click` que pode ser enviado ao Google Analytics **se você instalar separadamente o Google tag (gtag.js)**. Isso não substitui o evento do próprio Google Ads **Local actions – Directions**. São ações distintas: clique no botão do seu site ≠ pedido de rota confirmado pelo Google ≠ cliente que chegou à barbearia.

## Ajustes futuros
Para adicionar preços de outros cortes, edite as duas caixas de serviços no `index.html`. Atualmente o valor de £10 é o único preço publicado porque foi o único valor confirmado na conversa.
