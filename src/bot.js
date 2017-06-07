const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

var req = require('request-promise-native');
let bot = new Bot()

// ROUTING

bot.onEvent = function (session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
  welcome(session)
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'ico':
      ico(session)
      break
  }
}



// STATES

function welcome(session) {
  sendFirstMessage(session, `Hello! I know about all ICO's!`)
}


function ico(session) {
      showICO(session)
}





// HELPERS

// function sendMessage(session, message) {
//   let controls = [{
//       type: 'button',
//       label: 'ico',
//       value: 'ico'
//     },
//     {
//       type: 'button',
//       label: 'Count',
//       value: 'count'
//     },
//     {
//       type: 'button',
//       label: 'Donate',
//       value: 'donate'
//     }
//   ]
//   session.reply(SOFA.Message({
//     body: message,
//     controls: controls,
//     showKeyboard: false,
//   }))
// }

function sendFirstMessage(session, message) {
  let controls = [
    {
      type: 'button',
      label: 'ICO',
      value: 'ico'
    }
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}

function showICO(session){
  session.reply(SOFA.Message({
  body: "What would you like to do next?",
  controls: [
    {
      type: "group",
      label: "Trip",
      controls: [
        {type: "button", label: "Directions", value: "directions"},
        {type: "button", label: "Timetable", value: "timetable"},
        {type: "button", label: "Exit Info", value: "exit"},
        {type: "button", label: "Service Conditions", value: "conditions"}
      ]
    },
    {
      type: "group",
      label: "Services",
      "controls": [
        {type: "button", label: "Buy Ticket", value: "buy-ticket"},
        {type: "button", label: "Support", value: "support"}
      ]
    }
  ]
}))
}

