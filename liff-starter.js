window.onload = function(){
	const useNodeJs = false;
	const defaultLiffId = "1653903563-LmMlQNl5";

	let myLiffId = "";
	var name = "";

	if (useNodeJs) {
		fetch('/send-id')
			.then(function(reqResponse){
				return reqResponse.json();
			})
			.then(function(jsonResponse){
				myLiffId = jsonResponse.id;
				initializeLiffOrDie(myLiffId);
			})
			.catch(function(error){
				document.getElementById("appContent").classList.add('hidden');
				document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
				document.getElementById("welcomeStatement").textContent = "Got error in USENODEJS: " + error;
			});
	} else{
		myLiffId = defaultLiffId;
		initializeLiffOrDie(myLiffId);
	}
};

function initializeLiffOrDie(myLiffId){
	if (!myLiffId) {
		document.getElementById("appContent").classList.add('hidden');
		document.getElementById("liffIdErrorMessage").classList.remove('hidden');
		document.getElementById("welcomeStatement").textContent = "Got error in not using myLiffId";
	} else {
		initializeLiff(myLiffId);
	}
}

function initializeLiff(myLiffId){
	liff
		.init({
			liffId: myLiffId
		})
		.then(() => {
			initializeApp();
			getUserProfile();
		})
		.catch((err) => {
			// document.getElementById("appContent").classList.add('hidden');
			console.log('error', err);
			document.getElementById("liffInitErrorMessage").classList.remove('hidden');
			document.getElementById("welcomeStatement").textContent = "Got error in LIFF Init: " + err;
			
		});
}

function initializeApp(){
	displayLiffData();
	displayIsInClientInfo();
	registerButtonHandlers();

	if (liff.isLoggedIn()) {
		document.getElementById('btnLogin').disabled = true;
		var text = "Selamat datang "+ name +" di Warmindo Pengkolan !!!"
		document.getElementById('welcomeStatement').textContent = text;
	} else {
		document.getElementById('btnLogout').disabled = true;
		document.getElementById('welcomeStatement').textContent = 'Anda belum Login, login lah dengan akun LINE anda terlebih dahulu !!';
	}
}

function displayLiffData(){
	document.getElementById('isInClient').textContent = liff.isInClient();
	document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
}

function displayIsInClientInfo(){
	if (liff.isInClient()) {
		document.getElementById('btnLogin').classList.toggle('hidden');
		document.getElementById('btnLogout').classList.toggle('hidden');
		var text = "Selamat datang "+ +" di Warmindo Pengkolan !!!"
		document.getElementById('welcomeStatement').textContent = text;
	} else{
		document.getElementById('welcomeStatement').textContent = 'Anda belum Login, login lah dengan akun LINE anda terlebih dahulu !!';
	}
}

function registerButtonHandlers(){
	document.getElementById('btnOpenWindow').addEventListener('click', function(){
		liff.openWindow({
			url: 'https://warmindo.herokuapp.com/',
			external: true
		});
	});

	document.getElementById('btnClose').addEventListener('click', function(){
		if (!liff.isInClient()) {
			sendAlertIfNotInClient();
		} else {
			liff.closeWindow();
		}
	});

	document.getElementById('btnLogin').addEventListener('click', function(){
		if (!liff.isLoggedIn()) {
			liff.login();
		}
	});

	document.getElementById('btnLogout').addEventListener('click', function(){
		if (liff.isLoggedIn()) {
			liff.logout();
			window.location.reload();
		}
	});

	document.getElementById('btnPesan').addEventListener('click', function(){
		if (!liff.isInClient()) {
			sendAlertIfNotInClient();
		} else {
			liff.sendMessages([{
				'type' : 'text',
				'text' : "Anda telah menggunakan fitur Send Message!"
			}]).then(function(){
				window.alert('Ini adalah pesan dari fitur Send Message');
			}).catch(function(error){
				window.alert('Error sending message: '+ error);
			});
		}
	});
}

function sendAlertIfNotInClient(){
	alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}

function toggleElement(elementId){
	const elem = document.getElementById(elementId);
	if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
		elem.style.display = 'none';
	} else {
		elem.style.display = 'block';
	}
}

function getUserProfile(){
	liff
		.getProfile()
		.then(profile => {
			name = profile.displayName
		})
		.catch((err) => {
			console.log('error', err);
		});
}