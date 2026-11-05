EDZ BARBER — SITE FEITO ESPECIALMENTE PARA RESERVAS

OBJECTIVO
- A homepage (https://www.edzbarber.co.uk/) abre directamente com o formulário de pedido de reserva.
- O formulário permite ADICIONAR Haircut — £17 e/ou Beard Trim — £7 (dois cartões, sem dropdown) e pede data, hora, nome, email e TELEFONE obrigatório (nota opcional).
- O cliente NÃO recebe uma reserva confirmada automaticamente; você confirma por email.
- O formulário envia ao Web3Forms com a chave pública que você criou na conversa.
- O Web3Forms deve estar configurado na sua conta para enviar a edzbarber.bookings@gmail.com.
- Não há banco de dados nem pagamento integrado.

ARQUIVOS
index.html       página principal com booking acima da dobra
style.css        novo design completo e responsivo
booking.js       validação + envio de formulário + feedback
privacy.html     aviso de privacidade
favicon.svg      favicon original
booking/index.html  redireciona o link antigo /booking/ para a página principal

PUBLICAR NO GITHUB / VERCEL
1. Faça backup do conteúdo antigo no GitHub.
2. Envie esses arquivos para a raiz do repositório do seu site, mantendo a pasta booking/.
3. Faça commit. Vercel deverá publicar normalmente se estiver conectado ao repositório.
4. Acesse https://www.edzbarber.co.uk/ em navegador e celular.
5. Use seu email pessoal para fazer UM pedido de teste com data/hora inventadas.
6. Confirme que recebeu a notificação em edzbarber.bookings@gmail.com e que Reply responde para o endereço usado no formulário.
7. Confirme que o site indica "Request sent" somente após a resposta positiva do servidor.
8. Abra a pasta Spam/Promotions se o teste não aparecer.
9. Configure o link do Instagram como https://www.edzbarber.co.uk/ — a homepage é o formulário.

INFORMAÇÕES IMPORTANTES
- Datas/horários selecionados são PREFERÊNCIAS, não representam horários realmente livres.
- O cliente só fica confirmado após você responder pessoalmente por email.
- Todos os cortes: £17. Serviço de barba: Beard Trim £7. O cliente pode escolher um ou ambos os serviços. O e-mail inclui o campo services e total_price.
- Não há envio de resposta automática para o e-mail do cliente no plano gratuito do Web3Forms.
- Não enviamos um teste real ao seu inbox durante a criação dos arquivos.
- Confira se o texto da política de privacidade reflete suas práticas reais, inclusive prazo de retenção e local de atendimento.
- Mantenha notificação push ativada no Gmail e registre os bookings confirmados na sua agenda.
- A chave Web3Forms é pública para inserção em HTML, mas proteja a sua conta Web3Forms e não compartilhe senha do Gmail.

LOCALIZAÇÃO
- EDZ Barber dentro do Novo Studios, 47–51 Norfolk Street, Cambridge CB1 2LD, UK.
- O botão GET DIRECTIONS abre o Google Maps com destino no Novo Studios.
- O endereço também aparece na descrição do site e na FAQ.

ACTUALIZAÇÃO: telefone do cliente obrigatório no formulário; aparece nos emails enviados pelo Web3Forms.
LINK INSTAGRAM: botão Follow @edzbarber no formulário, menu e rodapé.

ACTUALIZAÇÃO: novo serviço Beard Trim — £7. Seleção por dois cartões em vez de dropdown, sem alterar o design geral.

ACTUALIZAÇÃO: ADICIONAR SERVIÇOS
- Haircut (£17) e Beard Trim (£7) são checkboxes independentes (escolher um ou ambos).
- Resumo e total actualizados imediatamente: Haircut + Beard Trim = £24.
- Antes do envio, o JavaScript preenche os campos ocultos `services` e `total_price`; ambos seguem para o Web3Forms e aparecem na mensagem de reserva.
- Se nenhum serviço estiver seleccionado, o envio é impedido e aparece um aviso.
- O formulário continua sujeito a confirmação manual por email.
- Este pacote foi testado com resposta simulada da API, não envio real para o seu Gmail.
