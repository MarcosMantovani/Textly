const fs = require('fs')

// Função para ler o arquivo .env e alterar a variável REACT_APP_API_URL
const updateEnvVariable = async () => {
  try {
    const envFilePath = '.env'
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8')

    // Separar o conteúdo do arquivo .env em linhas
    const lines = envFileContent.split('\n')

    // Encontrar a linha que contém a variável REACT_APP_API_URL
    const apiUrlIndex = lines.findIndex((line) =>
      line.startsWith('REACT_APP_API_URL')
    )

    if (apiUrlIndex !== -1) {
      // Substituir o valor da variável REACT_APP_API_URL
      lines[apiUrlIndex] = 'REACT_APP_API_URL=https://textly.fly.dev'
    } else {
      // Se a variável não existe, adicionar ao final do arquivo
      lines.push('REACT_APP_API_URL=https://textly.fly.dev')
    }

    // Juntar as linhas de volta em uma string
    const updatedEnvContent = lines.join('\n')

    // Escrever o conteúdo atualizado de volta ao arquivo .env
    fs.writeFileSync(envFilePath, updatedEnvContent)

    console.log(
      'Variável REACT_APP_API_URL atualizada para https://textly.fly.dev'
    )
  } catch (error) {
    console.error('Erro ao atualizar a variável REACT_APP_API_URL:', error)
  }
}

// Chamar a função para atualizar a variável
updateEnvVariable()
