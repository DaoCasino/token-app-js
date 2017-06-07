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
      request(session)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      welcome(session)
      break
  }
}



function request(session) {
  console.log("REQUEST")
  var url = "http://chaingear.cyber.fund/chaingear.json";
  fetch(url).then(function (r) {
    console.log("R:",r)
    return r.json();
  }).then(function (data) {
    console.log("data:",data)
  })
  session.reply(SOFA.Message({
    body: "result",
    controls: [{
      type: 'button',
      label: 'back',
      value: 'welcome'
    }]
  }))
}

function onCommand(session, command) {

  if (command.content.value.match(/ico=/)) {
    var token = command.content.value.substr(4);
    showICO(session, token);
  } else if (command.content.value == 'welcome') {
    icoList(session)
  }
}


function icoList(session) {
  let controls = [{
      type: 'button',
      label: 'Token#1',
      value: 'ico=Token#1'
    },
    {
      type: 'button',
      label: 'Token#2',
      value: 'ico=Token#2'
    },
    {
      type: 'button',
      label: 'Token#3',
      value: 'ico=Token#3'
    },
    {
      type: 'button',
      label: 'Token#4',
      value: 'ico=Token#4'
    },
    {
      type: 'button',
      label: 'Token#5',
      value: 'ico=Token#5'
    },
    {
      type: 'button',
      label: 'Token#6',
      value: 'ico=Token#6'
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

function showICO(session, token) {
  session.reply(SOFA.Message({
    body: "information about " + token,
    controls: [{
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