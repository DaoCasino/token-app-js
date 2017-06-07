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
  req('http://chaingear.cyber.fund/chaingear.json').then((body) => {
    let res = JSON.parse(body);
    var erc20 = res.filter(function (item) {
      if(item.consensus != undefined){
      return item.consensus.consensus_type == "ERC20 Token" || item.consensus.type == "ERC20 Token";
      }
    });
    console.log(erc20.length)
    session.set('erc20', erc20)
  })
  icoList(session)
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
  let controls = new Array();
  var list = session.get('erc20');
  for(var i = 0; i < 6; i++){
    controls.push({type: 'button', label: list[i].system, value: 'ico='+i})
  }

  session.reply(SOFA.Message({
    body: "Hello! Select ICO:",
    controls: controls,
    showKeyboard: false,
  }))
}

function showICO(session, token) {
  var list = session.get('erc20');

  session.reply(SOFA.Message({
    body: "information about " + list[token].system,
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