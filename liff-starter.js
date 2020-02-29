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
		})
		.catch((err) => {
			// document.getElementById("appContent").classList.add('hidden');
			console.log('error', err);
			document.getElementById("liffInitErrorMessage").classList.remove('hidden');
			document.getElementById("welcomeStatement").textContent = "Got error in LIFF Init: " + err;
			
		});
}

function initializeApp(){
	getUserProfile();
	displayLiffData();
	displayIsInClientInfo();
	registerButtonHandlers();

	if (liff.isLoggedIn()) {
		document.getElementById('btnLogin').disabled = true;
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
			var jmlhGoreng = parseInt(document.getElementById("jmlh-goreng").textContent)
			var jmlhRebus = parseInt(document.getElementById("jmlh-rebus").textContent)
			var jmlhRendang = parseInt(document.getElementById("jmlh-rendang").textContent)
			var jmlhKari = parseInt(document.getElementById("jmlh-kari").textContent)

			var textTemp = ""

			if(jmlhGoreng !=0 ){
				textTemp +=  jmlhGoreng + " Indomie Goreng\n";
			}

			if(jmlhRebus !=0 ){
				textTemp +=  jmlhRebus + " Indomie Rebus\n";
			}

			if(jmlhRendang !=0 ){
				textTemp +=  jmlhRendang + " Indomie Rendang\n";
			}

			if(jmlhKari !=0 ){
				textTemp +=  jmlhKari + " Indomie Kari\n";
			}

			liff.sendMessages([{
				'type' : 'text',
				'text' : "Anda telah Memesan: \n\n" + textTemp + "\nTerima Kasih telah memesan di Warmindo Pengkolan Pesanan akan segera diantar oleh jasa Ojek onlen \n\n Terimakasih."
			}]).then(function(){
				window.alert('Ini adalah pesan dari fitur Send Message');
			}).catch(function(error){
				window.alert('Error sending message: '+ error);
			});
		}
	});

	document.getElementById('btnMinGoreng').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-goreng").textContent);
		if(jumlah != 0){
			jumlah--;
			document.getElementById("jmlh-goreng").textContent = jumlah;
		}
	});

	document.getElementById('btnPlusGoreng').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-goreng").textContent);

		jumlah++;
		document.getElementById("jmlh-goreng").textContent = jumlah;
		
	});

	document.getElementById('btnMinRebus').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-rebus").textContent);
		if(jumlah != 0){
			jumlah--;
			document.getElementById("jmlh-rebus").textContent = jumlah;
		}
	});

	document.getElementById('btnPlusRebus').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-rebus").textContent);
		
		jumlah++;
		document.getElementById("jmlh-rebus").textContent = jumlah;
		
	});

	document.getElementById('btnMinRendang').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-rendang").textContent);
		if(jumlah != 0){
			jumlah--;
			document.getElementById("jmlh-rendang").textContent = jumlah;
		}
	});

	document.getElementById('btnPlusRendang').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-rendang").textContent);
		
		jumlah++;
		document.getElementById("jmlh-rendang").textContent = jumlah;
		
	});

	document.getElementById('btnMinKari').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-Kari").textContent);
		if(jumlah != 0){
			jumlah--;
			document.getElementById("jmlh-kari").textContent = jumlah;
		}
	});

	document.getElementById('btnPlusKari').addEventListener('click', function(){
		var jumlah = parseInt(document.getElementById("jmlh-kari").textContent);
		
		jumlah++;
		document.getElementById("jmlh-kari").textContent = jumlah;
		
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
			const name = profile.displayName
			var text = "Selamat datang "+ name +" di Warmindo Pengkolan !!!"
			document.getElementById('welcomeStatement').textContent = text;
		})
		.catch((err) => {
			console.log('error', err);
		});

}