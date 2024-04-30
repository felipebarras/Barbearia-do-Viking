function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const message = data.messages[0].message.content.text;
  const from = data.messages[0].from;

  processIncomingMessage(from, message);
}

function processIncomingMessage(from, message) {
  const responseMessage = `Bem vindo à Barbearia do Viking! Escreva "Agendar" para agendar um horário ou "Cancelar" para cancelar um apontamento.`;
  sendWppMessage(from, responseMessage);

  if (message.toLowercase().trim().includes('agendar')) {
    const optionsMessage =
      'Qual serviço você deseja?\n1. Corte de Cabelo - R$ 45,00 💇‍♂️\n2. Barbaterapia - R$ 42,00 🧔\n3. Corte + Barbaterapia 🥳 - R$ 80,00';
    sendWppMessage(from, optionsMessage);
  } else if (message === 1 || message === 2 || message === 3) {
    const service = getServiceFromOption(message);
    const dateMessage = '📅 Para qual dia você gostaria de agendar o serviço de ' + service;
    sendWppMessage(from, dateMessage);
  } else {
    const defaultMessage = 'Desculpe, não entendi 😞. Escreva "Agendar" para agendar um horário ou "Cancelar" para cancelar um apontamento.';
    sendWppMessage(from, defaultMessage);
  }
}

function getServiceFromOption(option) {
  if (option === 1) {
    return 'Corte de Cabelo';
  } else if (option === 2) {
    return 'Barbaterapia';
  } else if (option === 3) {
    return 'Corte + Barbaterapia';
  } else {
    return '';
  }
}

function saveToGoogleCalendar(service, client, date) {
  const googleCalendarID = '9be1d8d186a535cfac92cce19c5e239dbbd66564c5ca374c0c9025083c66f9a4@group.calendar.google.com';
  const eventData = {
    summary: 'Agendamento do Felipe', //inserir o nome do cliente
    description: `Serviço: ${service}`,
    start: {
      dateTime: date.toISOString(),
      timeZone: 'America/Sao_Paulo'
    },
    end: {
      dateTime: date.toISOString(),
      timeZone: 'America/Sao_Paulo'
    }
  };

  const calendar = CalendarApp.getCalendarById(googleCalendarID);
  calendar.createEvent(eventData);
}

function sendWppMessage(to, message) {
  const twilioID = 'ACf2f4a0d7b58588262f8f0c654e564834';
  const twilioToken = 'c4fc68e897d85ba4eccb35559c7dfd35';
  const twilioNumber = '+13144037600';

  const payload = {
    from: `whatsapp: ${twilioNumber}`,
    body: message,
    to: `whatsapp: ${to}`
  };

  UrlFetchApp.fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioID}/Messages.json`, {
    method: 'post',
    payload,
    headers: {
      Authorization: `Basic ${Utilities.base64Encode(`${twilioID}:${twilioToken}`)}`
    }
  });
}

function saveToSheet(phone, service) {
  const sheet = SpreadsheetApp.openById('1HvesFlD_6NMkCktWBuQuQxhkA1FhqcAV5Sz0o8NQCxn_UnVtAV3FP1M5').getActiveSheet();
  sheet.appendRow([phone, service]);
}
