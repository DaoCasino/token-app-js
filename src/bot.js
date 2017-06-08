const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

var req = require('request-promise-native');
let bot = new Bot()

bot.onEvent = function (session, message) {
  switch (message.type) {
    case 'Init':
      icoList(session, 0)
      break
    case 'Message':
      icoList(session, 0)
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
  console.log("VERSION: 0.12")
  console.log("REQUEST")
  req('http://chaingear.cyber.fund/chaingear.json').then((body) => {
    let res = JSON.parse(body);
    var erc20 = res.filter(function (item) {
      if (item.consensus != undefined) {
        return item.consensus.consensus_type == "ERC20 Token" || item.consensus.type == "ERC20 Token";
      }
    });
    console.log(erc20.length)
    session.set('erc20', erc20)
  })
}

function onCommand(session, command) {

  if (command.content.value.match(/ico=/)) {
    var token = command.content.value.substr(4);
    showICO(session, token);
  } else if (command.content.value == 'welcome') {
    icoList(session, 0)
  } else if (command.content.value == 'more') {
    more(session)
  } else if (command.content.value == 'withdraw') {
    withdraw(session)
  } else if (command.content.value == 'invest') {
    invest(session)
  }
}


function invest(session){
  session.requestEth(3, "invest now!");
    session.reply(SOFA.Message({
    body: "invest now!",
    controls: [{
    type: 'button',
    label: "back",
    value: "welcome"
  }]
  }))

}

function withdraw(session) {

  var list = session.get('erc20');
  var token = session.get("currentToken")
  var current = list[token];

  session.set("currentToken", token);
  var links = new Array();
  var button = new Array();

  for (var i = 0; i < current.links.length && i < 5; i++) {

    links.push({
      type: 'button',
      label: current.links[i].type,
      action: "Webview::" + current.links[i].url
    })
  }
  button.push({
    type: "group",
    label: "links",
    controls: links
  }, {
    type: 'button',
    label: "withdraw",
    value: "withdraw"
  }, {
    type: 'button',
    label: "invest",
    value: "invest"
  }, {
    type: 'button',
    label: "back",
    value: "welcome"
  })

  session.reply(SOFA.Message({
    body: "You have 0 " + list[token].token.symbol,
    controls: button,
  }))
}


function icoList(session, lastNum) {
  request(session)
  console.log("icoList")
  let controls = new Array();
  var list = session.get('erc20');
  for (var i = lastNum; i < lastNum + 6 && i < list.length; i++) {
    controls.push({
      type: 'button',
      label: list[i].system,
      value: 'ico=' + i
    })
  }
  controls.push({
    type: 'button',
    label: 'more',
    value: 'more'
  })

  session.reply(SOFA.Message({
    body: "Hello! Select project:",
    controls: controls,
    showKeyboard: false,
  }))
  session.set("lastNum", lastNum + 6)
}

function more(session) {
  var last = session.get("lastNum");
  var list = session.get('erc20');
  if (last > list.length) {
    last = 0;
  }
  icoList(session, last)
  console.log("last:", last)
}

function showICO(session, token) {

  var list = session.get('erc20');

  var current = list[token];

  session.set("currentToken", token);
  var links = new Array();
  var button = new Array();

  for (var i = 0; i < current.links.length && i < 5; i++) {

    links.push({
      type: 'button',
      label: current.links[i].type,
      action: "Webview::" + current.links[i].url
    })
  }
  button.push({
    type: "group",
    label: "links",
    controls: links
  }, {
    type: 'button',
    label: "withdraw",
    value: "withdraw"
  }, {
    type: 'button',
    label: "invest",
    value: "invest"
  }, {
    type: 'button',
    label: "back",
    value: "welcome"
  })
  console.log("system_2:", list[token].system)

  var optionsTime = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  var d = new Date(Date.parse(list[token].crowdsales.end_date))
  var icoEnd = d.toLocaleString("ru", optionsTime)
  session.reply(SOFA.Message({
    body: "information about " + list[token].system + ": " + list[token].descriptions.headline + ". Token: '" + list[token].token.symbol + "'. ICO end: " + icoEnd + ". You have 0 " + list[token].token.symbol,
    controls: button,
  }))
}