// Função para buscar a latitude e longitude a partir do CEP usando a API ViaCEP
document.getElementById('cep').addEventListener('blur', async function () {
    const cep = document.getElementById('cep').value.trim();
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const errorMessage = document.getElementById('weather');
    
    // Elementos que exibirão logradouro, bairro e localidade
    const logradouroElement = document.getElementById('logradouro');
    const bairroElement = document.getElementById('bairro');
    const localidadeElement = document.getElementById('localidade');
  
    // Limpar mensagem de erro anterior e campos de resultado
    errorMessage.innerText = '';
    logradouroElement.innerText = '';
    bairroElement.innerText = '';
    localidadeElement.innerText = '';
  
    // Validação básica de CEP (8 dígitos)
    if (!cep || cep.length !== 8 || isNaN(cep)) {
      errorMessage.innerText = 'Por favor, insira um CEP válido de 8 dígitos.';
      return;
    }
  
    try {
      // Buscar o endereço pelo CEP usando a API do ViaCEP
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const cepData = await cepResponse.json();
  
      if (cepData.erro) {
        errorMessage.innerText = 'CEP não encontrado!';
        return;
      }
  
      // Preencher os dados de logradouro, bairro e localidade
      logradouroElement.innerText = cepData.logradouro || 'Não disponível';
      bairroElement.innerText = cepData.bairro || 'Não disponível';
      localidadeElement.innerText = `${cepData.localidade}/${cepData.uf}` || 'Não disponível';
  
      const localidade = `${cepData.localidade}, ${cepData.uf}, Brazil`;
  
      // Agora, buscamos as coordenadas de latitude e longitude usando Nominatim
      const locationResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(localidade)}&format=json&limit=1`);
      const locationData = await locationResponse.json();
  
      if (locationData.length === 0) {
        errorMessage.innerText = 'Não foi possível encontrar a localização para o CEP informado.';
        return;
      }
  
      const latitude = locationData[0].lat;
      const longitude = locationData[0].lon;
  
      // Preencher os campos de latitude e longitude
      latitudeInput.value = latitude;
      longitudeInput.value = longitude;
  
    } catch (error) {
      errorMessage.innerText = 'Ocorreu um erro ao buscar a localização. Tente novamente.';
      console.error(error);
    }
  });
  
  // Evento de escuta no botão "Acessar" para buscar a previsão do tempo
  document.getElementById('weather-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impedir envio padrão do formulário
  
    const latitude = document.getElementById('latitude').value.trim();
    const longitude = document.getElementById('longitude').value.trim();
    const errorMessage = document.getElementById('weather');
  
    // Limpar mensagem de erro
    errorMessage.innerText = '';
  
    // Verificar se os campos de latitude e longitude estão preenchidos
    if (!latitude || !longitude) {
      errorMessage.innerText = 'Latitude e longitude não estão preenchidas corretamente.';
      return;
    }
  
    try {
      // Buscar a previsão do tempo pela latitude e longitude
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherResponse.json();
  
      if (!weatherData.current_weather) {
        errorMessage.innerText = 'Erro ao buscar a previsão do tempo!';
        return;
      }
  
      // Exibir as informações da previsão do tempo
      document.getElementById('weather').innerText = `Temperatura atual: ${weatherData.current_weather.temperature}°C, Vento: ${weatherData.current_weather.windspeed} km/h, Condição: ${weatherData.current_weather.weathercode}`;
  
    } catch (error) {
      errorMessage.innerText = 'Ocorreu um erro ao buscar a previsão do tempo. Tente novamente mais tarde.';
      console.error(error);
    }
  });
  