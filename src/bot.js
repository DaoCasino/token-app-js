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
      welcome(session)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      welcome(session)
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
  let controls = [{
      type: 'button',
      label: 'Token#1',
      value: 'ico'
    },
    {
      type: 'button',
      label: 'Token#2',
      value: 'ico'
    },
    {
      type: 'button',
      label: 'Token#3',
      value: 'ico'
    }
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}

function showICO(session) {
  session.reply(SOFA.Message({
    body: "More about ICO .....",
    controls : [{
        type: 'button',
        label: 'back',
        value: 'welcome'
      },
      {
        type: 'button',
        label: 'invest',
        value: 'welcome'
      },
      {
        type: 'button',
        label: 'contact',
        value: 'welcome'
      },
      {
        type: "group",
        label: "contact",
        controls: [{
            type: "button",
            label: "site",
            value: "directions"
          },
          {
            type: "button",
            label: "twitter",
            value: "timetable"
          },
          {
            type: "button",
            label: "facebook",
            value: "exit"
          },
          {
            type: "button",
            label: "github",
            value: "conditions"
          }
        ]
      }
    ]
  }))
}