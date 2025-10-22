# 🔍 Guia de Teste - Persistência de Sessão

## 📝 Como Testar

### 1. Limpar Cache do Navegador
1. Abra o DevTools (F12)
2. Vá em **Application** (ou Aplicação)
3. Em **Storage** → Limpe tudo:
   - Local Storage
   - Session Storage
   - Cookies

### 2. Fazer Login
1. Acesse: `http://localhost:8080/admin-login`
2. Faça login com suas credenciais
3. Você será redirecionado para `/admin`

### 3. Verificar LocalStorage
1. Abra DevTools (F12)
2. Vá em **Application** → **Local Storage** → `http://localhost:8080`
3. Procure por chaves que começam com `sb-`
4. **Deve haver itens salvos!** ✅

### 4. Testar F5
1. Estando logado em `/admin`
2. Aperte **F5** (atualizar página)
3. **Deve continuar logado!** ✅

### 5. Verificar Console
Abra o Console (F12) e procure pelas mensagens:
- ✅ "Sessão ativa encontrada!"
- ❌ "Nenhuma sessão encontrada, redirecionando..."

## 🐛 Se Continuar Saindo

### Verificar LocalStorage
Se NÃO houver items `sb-` no localStorage:

**Possíveis causas:**
1. Navegador em modo privado/anônimo
2. Extensões bloqueando localStorage
3. Configurações de privacidade do navegador

### Verificar Console
Se aparecer erros no console:
- Anote o erro
- Me envie para eu corrigir

### Teste Alternativo
1. Faça login
2. Abra outra aba
3. Cole: `http://localhost:8080/admin`
4. Se funcionar na nova aba = localStorage OK
5. Se não funcionar = Problema com configuração

## 🔧 Comandos de Debug (Cole no Console)

### Ver Sessão Atual
```javascript
// Ver dados do localStorage
console.log(localStorage);

// Ver especificamente itens do Supabase
Object.keys(localStorage).filter(key => key.startsWith('sb-')).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

### Testar Sessão Manualmente
```javascript
// Importar supabase (se disponível)
supabase.auth.getSession().then(({data, error}) => {
  console.log('Sessão:', data.session);
  console.log('Erro:', error);
});
```

## 📊 Resultados Esperados

### ✅ Funcionando Corretamente
- LocalStorage tem itens `sb-wgamkjtlvebwquuxxqwu-auth-token`
- Console mostra "Sessão ativa encontrada!"
- F5 não faz logout
- Token é renovado automaticamente

### ❌ Com Problema
- LocalStorage vazio ou sem itens `sb-`
- Console mostra "Nenhuma sessão encontrada"
- F5 faz logout
- Sempre redireciona para login

## 🆘 Próximos Passos

Se continuar com problema:
1. Me envie screenshot do console
2. Me envie screenshot do localStorage
3. Me diga qual navegador está usando
4. Verifique se há extensões bloqueando cookies/storage

---

**Implementações feitas:**
- ✅ `persistSession: true`
- ✅ `autoRefreshToken: true`
- ✅ `storage: window.localStorage`
- ✅ Logs de debug no console
- ✅ Verificação de erro na sessão
