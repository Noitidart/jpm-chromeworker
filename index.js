const {ChromeWorker} = require("chrome");
var { ToggleButton } = require("sdk/ui/button/toggle");
var myWorker;
var BOOTSTRAP = this;

function loadAndSetupWorker() {
	myWorker = new ChromeWorker(require("sdk/self").data.url('winscard.js'));
	myWorker.addEventListener('message', function handleMessageFromWorker(msg) {
		console.error('incoming message from worker to server, msg:', msg.data);
		BOOTSTRAP[msg.data[0]].apply(BOOTSTRAP, msg.data.slice(1));
	});
}

loadAndSetupWorker();

function showMsgDone() {
	console.log('this is called after chromeworker finishes');
}

var button = ToggleButton({
    id: "my-button1",
    label: "my button1",
    icon: "./icon-16.png",
    onChange: changed,
    badge: 0,
    badgeColor: "#00AAAA"
  });

function changed(state) {
  button.badge = state.badge + 1;
  if (state.checked) {
    button.badgeColor = "#AA00AA";
  }
  else {
    button.badgeColor = "#00AAAA";
	var myCallbackName = 'cb' + Math.random();
	BOOTSTRAP[myCallbackName] = function() {
		delete BOOTSTRAP[myCallbackName];
		console.log('chrome worker msg back: ' + Math.random());
	};
	myWorker.postMessage(['showMsgBox', 'body of msg', 'title of msg', myCallbackName]);  // this will trigger the showMsgBox function in winscard.js with arguments aBody set to "body of msg" and aTitle set to "title of msg"
  }
}

