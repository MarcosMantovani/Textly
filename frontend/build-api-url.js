const fs = require('fs')

const updateEnvVariable = async () => {
  try {
    const envFilePath = '.env'
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8')
    const lines = envFileContent.split('\n')
    const apiUrlIndex = lines.findIndex((line) =>
      line.startsWith('REACT_APP_API_URL')
    )

    if (apiUrlIndex !== -1) {
      lines[apiUrlIndex] = 'REACT_APP_API_URL=https://textly.fly.dev'
    } else {
      lines.push('REACT_APP_API_URL=https://textly.fly.dev')
    }

    const updatedEnvContent = lines.join('\n')

    fs.writeFileSync(envFilePath, updatedEnvContent)

    console.log(
      'Variável REACT_APP_API_URL atualizada para https://textly.fly.dev'
    )
  } catch (error) {
    console.error('Erro ao atualizar a variável REACT_APP_API_URL:', error)
  }
}

updateEnvVariable()
