const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

var req = require('request-promise-native');
let bot = new Bot()

bot.onEvent = function (session, message) {
  switch (message.type) {
    case 'Init':
      icoList(session)
      break
    case 'Message':
      icoList(session)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      welcome(session)
      break
  }
}


function onCommand(session, command) {
  switch (command.content.value) {
    case 'ico':
      showICO(session,command.content.label)
      break
  }
}

function welcome(session) {
  sendFirstMessage(session, `Hello! I know about all ICO's!`)
}


function icoList(session) {
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
    },
    {
      type: 'button',
      label: 'Token#4',
      value: 'ico'
    },
    {
      type: 'button',
      label: 'Token#5',
      value: 'ico'
    },
    {
      type: 'button',
      label: 'Token#6',
      value: 'ico'
    },
    {
      type: 'button',
      label: 'more',
      value: 'more'
    }
  ]
  session.reply(SOFA.Message({
    body: "Hello! Select ICO:",
    controls: controls,
    showKeyboard: false,
  }))
}

function showICO(session,label) {
  session.reply(SOFA.Message({
    body: "information about" + label,
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