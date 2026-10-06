param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string[]]$Caminhos
)

$ErrorActionPreference = 'Stop'

$padroes = [ordered]@{
    'chave privada' = '-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'
    'chave AWS' = '\bAKIA[0-9A-Z]{16}\b'
    'segredo AWS' = '(?i)\bAWS_SECRET_ACCESS_KEY\s*[:=]\s*["'']?[^"''\s]{16,}'
    'chave OpenAI' = '\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b'
    'token GitHub clássico' = '\bgh[pousr]_[A-Za-z0-9]{20,}\b'
    'token GitHub granular' = '\bgithub_pat_[A-Za-z0-9_]{20,}\b'
    'chave Google' = '\bAIza[0-9A-Za-z_-]{30,}\b'
    'token Slack' = '\bxox[baprs]-[A-Za-z0-9-]{10,}\b'
    'token bearer' = '(?i)\bAuthorization\s*:\s*Bearer\s+[A-Za-z0-9._~+/=-]{16,}'
    'segredo nomeado' = '(?i)\b(?:OPENAI_API_KEY|ANTHROPIC_API_KEY|GITHUB_TOKEN|GH_TOKEN|DATABASE_URL|PASSWORD)\s*[:=]\s*["'']?[^"''\s]{8,}'
}

$arquivos = foreach ($caminho in $Caminhos) {
    if (-not (Test-Path -LiteralPath $caminho)) {
        throw "Caminho não encontrado: $caminho"
    }

    $item = Get-Item -LiteralPath $caminho
    if ($item.PSIsContainer) {
        Get-ChildItem -LiteralPath $item.FullName -Recurse -File
    }
    else {
        $item
    }
}

$achados = [System.Collections.Generic.List[object]]::new()

foreach ($arquivo in $arquivos) {
    if ($arquivo.Extension -eq '.gz') {
        $fluxo = [System.IO.File]::OpenRead($arquivo.FullName)
        $gzip = [System.IO.Compression.GZipStream]::new(
            $fluxo,
            [System.IO.Compression.CompressionMode]::Decompress
        )
        $leitor = [System.IO.StreamReader]::new($gzip, [System.Text.Encoding]::UTF8)
    }
    else {
        $fluxo = [System.IO.File]::Open(
            $arquivo.FullName,
            [System.IO.FileMode]::Open,
            [System.IO.FileAccess]::Read,
            [System.IO.FileShare]::ReadWrite
        )
        $leitor = [System.IO.StreamReader]::new($fluxo, [System.Text.Encoding]::UTF8, $true)
    }

    try {
        $numeroLinha = 0
        while (($linha = $leitor.ReadLine()) -ne $null) {
            $numeroLinha++
            foreach ($entrada in $padroes.GetEnumerator()) {
                if ([regex]::IsMatch($linha, $entrada.Value)) {
                    $achados.Add([pscustomobject]@{
                        Arquivo = $arquivo.FullName
                        Linha = $numeroLinha
                        Tipo = $entrada.Key
                    })
                }
            }
        }
    }
    finally {
        $leitor.Dispose()
        $fluxo.Dispose()
    }
}

if ($achados.Count -gt 0) {
    $achados | Sort-Object Arquivo, Linha, Tipo | Format-Table -AutoSize
    Write-Error "A auditoria encontrou $($achados.Count) possível(is) segredo(s). Revogue qualquer credencial real antes de versionar."
    exit 1
}

Write-Output "Auditoria concluída: nenhum segredo conhecido encontrado em $($arquivos.Count) arquivo(s)."
