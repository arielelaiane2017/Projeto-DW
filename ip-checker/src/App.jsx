import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [status, setStatus] = useState('');

  const checkPort = async () => {
    if (!ip || !port) {
      setStatus('Por favor, preencha o IP e a porta.');
      console.log('Erro: IP e porta não fornecidos.');
      return;
    }

    console.log(`Enviando solicitação para IP: ${ip} e Porta: ${port}`);

    try {
      const response = await fetch(`/api/check?ip=${ip}&port=${port}`);
      
      // Verifica se a resposta é um JSON válido
      if (!response.ok) {
        const text = await response.text(); // Pegue o texto para ver o que está retornando
        throw new Error(`Erro na resposta do servidor: ${response.statusText}. Resposta: ${text}`);
      }

      const data = await response.json();
      console.log(`Resposta do servidor: ${JSON.stringify(data)}`);
      
      // Verifica se a resposta contém o campo esperado
      if (data.open !== undefined) {
        setStatus(data.open ? 'Porta está aberta!' : 'Porta está fechada.');
      } else {
        throw new Error('Resposta do servidor não contém o campo "open".');
      }
      
    } catch (error) {
      console.error(`Erro ao verificar a porta: ${error.message}`);
      setStatus(`Erro ao verificar a porta: ${error.message}`);
    }
  };

  // Define a classe com base no status
  const statusClass = status.includes('aberta') ? 'open' : status.includes('fechada') ? 'closed' : '';

  return (
    <div className="App">
      <h1>Verificador de IP</h1>
      <div className="form-group">
        <label htmlFor="ip">Digite o IP:</label>
        <input
          id="ip"
          type="text"
          placeholder="IP"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="port">Digite a Porta:</label>
        <input
          id="port"
          type="text"
          placeholder="Porta"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
      </div>
      <div className="button-container">
        <button onClick={checkPort}>Verificar</button>
      </div>
      <p className={statusClass}>{status}</p>
    </div>
  );
};

export default App;
