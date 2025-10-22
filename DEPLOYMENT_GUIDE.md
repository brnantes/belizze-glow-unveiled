# Guia de Implantação para Hostinger

Este guia explica como implantar o site Belizze na Hostinger.

## Arquivos para Upload

Todos os arquivos necessários estão na pasta `dist`. Você precisará fazer upload de todos esses arquivos para o diretório raiz do seu hosting na Hostinger.

## Passos para Implantação

1. **Faça login no painel de controle da Hostinger**

2. **Acesse o Gerenciador de Arquivos ou use FTP**
   - Se usar o Gerenciador de Arquivos: Navegue até a pasta `public_html`
   - Se usar FTP: Conecte-se ao seu servidor e navegue até a pasta `public_html`

3. **Faça upload dos arquivos**
   - Faça upload de todos os arquivos e pastas da pasta `dist` para a pasta `public_html`
   - Certifique-se de que o arquivo `index.html` esteja na raiz do diretório `public_html`

4. **Configuração de URL de Reescrita (importante para React Router)**
   - Crie um arquivo `.htaccess` na pasta `public_html` com o seguinte conteúdo:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

5. **Verifique o site**
   - Acesse seu domínio para verificar se o site está funcionando corretamente
   - Teste a navegação para garantir que todas as páginas estão carregando

## Solução de Problemas

- **Página em branco**: Verifique se todos os arquivos foram carregados corretamente e se o arquivo `.htaccess` está configurado.
- **Imagens não aparecem**: Verifique se a pasta de imagens foi carregada corretamente.
- **Erro 404**: Verifique se o arquivo `.htaccess` está configurado corretamente.

## Manutenção

Para atualizar o site no futuro:
1. Faça as alterações necessárias no código
2. Execute `npm run build` para gerar uma nova versão da pasta `dist`
3. Faça upload dos novos arquivos para substituir os antigos no servidor
