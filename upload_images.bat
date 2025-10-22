@echo off
echo Fazendo upload das imagens para o Supabase...

REM Primeiro, salve as 3 imagens como:
REM - mentoria-certificados.jpg (primeira imagem - certificados)
REM - mentoria-treinamento.jpg (segunda imagem - treinamento)  
REM - mentoria-pratica.jpg (terceira imagem - prática)

set PROJECT_URL=https://wgamkjtlvebwquuxxqwu.supabase.co
set ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU

echo Fazendo upload da imagem de certificados...
curl -X POST "%PROJECT_URL%/storage/v1/object/mentorship/mentoria-certificados.jpg" ^
     -H "Authorization: Bearer %ANON_KEY%" ^
     -H "Content-Type: image/jpeg" ^
     --data-binary @mentoria-certificados.jpg

echo Fazendo upload da imagem de treinamento...
curl -X POST "%PROJECT_URL%/storage/v1/object/mentorship/mentoria-treinamento.jpg" ^
     -H "Authorization: Bearer %ANON_KEY%" ^
     -H "Content-Type: image/jpeg" ^
     --data-binary @mentoria-treinamento.jpg

echo Fazendo upload da imagem de prática...
curl -X POST "%PROJECT_URL%/storage/v1/object/mentorship/mentoria-pratica.jpg" ^
     -H "Authorization: Bearer %ANON_KEY%" ^
     -H "Content-Type: image/jpeg" ^
     --data-binary @mentoria-pratica.jpg

echo Upload concluído!
pause
