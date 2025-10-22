# Script para upload das imagens para Supabase
$projectUrl = "https://wgamkjtlvebwquuxxqwu.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU"

# Função para fazer upload de uma imagem
function Upload-Image {
    param(
        [string]$imagePath,
        [string]$fileName
    )
    
    $uri = "$projectUrl/storage/v1/object/mentorship/$fileName"
    $headers = @{
        "Authorization" = "Bearer $anonKey"
        "Content-Type" = "image/jpeg"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -InFile $imagePath
        Write-Host "Upload successful for $fileName"
        return $true
    }
    catch {
        Write-Host "Upload failed for $fileName`: $($_.Exception.Message)"
        return $false
    }
}

# Fazer upload das imagens (você precisa salvar as imagens primeiro)
Write-Host "Para usar este script:"
Write-Host "1. Salve a primeira imagem como 'mentoria-certificados.jpg'"
Write-Host "2. Salve a segunda imagem como 'mentoria-treinamento.jpg'" 
Write-Host "3. Salve a terceira imagem como 'mentoria-pratica.jpg'"
Write-Host "4. Execute: Upload-Image 'caminho/para/imagem' 'nome-do-arquivo.jpg'"
