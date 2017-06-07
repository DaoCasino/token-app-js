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
    icoList(session)
  } else if (command.content.value.match(/link=/)) {
    var linkNum = command.content.value.substr(5);
    link(session, linkNum)
  }else if (command.content.value == 'more'){
    more(session)
  }
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
  session.set("lastNum", lastNum+6)
}

function more(session){
  var last = session.get("lastNum");
  var list = session.get('erc20');
  if (last > list.length){
    last = 0;
  }
  icoList(session, last)
  console.log("last:", last)
}

function showICO(session, token) {
  console.log("TOKEN:", token)
  var list = session.get('erc20');
  session.set("currentToken", list[token]);
  var current = list[token];
  var links = new array();
  for (var i = 0; i < current.links.length || i < 7; i++) {
    links.push({
      type: 'button',
      label: current.links[i].type,
      value: 'link=' + i
    })
  }
  links.push({
    type: 'button',
    label: "back",
    value: "welcome"
  })


  session.reply(SOFA.Message({
    body: "information about " + list[token].system + ": " + list[token].descriptions.headline,
    controls: controls,
  }))
}

function link(session, num) {
  var list = session.get('erc20');
  var current = session.get("currentToken");


  session.reply(SOFA.Message({
      body: current.links[num].type + ": " + current.links[num].url,
      controls: [{
          type: 'button',
          label: "back",
          value: 'ico='+current
        }],
  }))
}