$(document).ready(function () {
  const mikrofon = document.getElementById("mikrofon");
  const mesajInput = document.getElementById("mesaj");
  let sesTanici;

  if ('webkitSpeechRecognition' in window) {
    sesTanici = new webkitSpeechRecognition();
    sesTanici.continuous = true;
    sesTanici.interimResults = false;
    sesTanici.lang = 'tr-TR';

    sesTanici.onresult = function (event) {
      const sesSonucu = event.results[event.resultIndex][0].transcript;
      mesajInput.value = sesSonucu;
      console.log('Algılanan ses:', sesSonucu);

      sendMessage(sesSonucu);

      $('.hosgeldin').hide();
    };

    sesTanici.onerror = function (event) {
      console.error('Ses tanıma hatası:', event.error);
      sesTanici.stop();
      sesTanici.start();
    };

    mikrofon.addEventListener("click", function () {
      sesTanici.start();
      console.log('Ses tanıma başlatıldı.');

      const audioElement = document.getElementById("audio-element");
      audioElement.muted = true;
    });
  } else {
    console.log("Bu tarayıcı ses tanıma desteklemiyor.");
  }

  function sendMessage(message) {
    appendMessage('user', message);
    $.ajax({
      url: '/chat',
      type: 'POST',
      data: { 'user_input': message },
      success: function (data) {
        console.log("Başarılı yanıt:", data);
        appendMessage('bot', data.response);
        $('#mesaj').val('');
      },
      error: function (xhr) {
        console.error("Hata yanıtı:", xhr);
        appendMessage('bot', 'Bir hata oluştu: ' + (xhr.responseJSON ? xhr.responseJSON.response : 'Bilinmeyen hata'));
      }
    });
  }

  function appendMessage(sender, message) {
    let messageElement = $('<div>').addClass('message ' + sender);
    messageElement.html(message);
    $('#chat-box').append(messageElement);

    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);

    setTimeout(() => {
      messageElement.addClass('visible');
    }, 100);
  }

  $('#gonder').click(function () {
    let mesaj = $('#mesaj').val().trim();
    if (mesaj !== "") {
      sendMessage(mesaj);
      $('#mesaj').val('');
      $('.hosgeldin').hide();
    }
  });

  $('#mesaj').keydown(function (e) {
    if (e.key === 'Enter') {
      $('#gonder').click();
    }
  });

  $('.prompt-kutu').click(function () {
    let selectedMessage = $(this).find('h5').text();
    sendMessage(selectedMessage);
    $('.hosgeldin').hide();
  });
});

document.getElementById("gonder").addEventListener("click", function () { var m = document.getElementById("mesaj").value; if (m.trim() !== "") { var c = document.createElement("div"); c.textContent = m; document.querySelector(".kullanici-container").appendChild(c); document.getElementById("mesaj").value = ""; } }); var i = document.getElementById("mesaj"); var g = document.getElementById("gonder"); i.addEventListener("input", function () { if (i.value.trim() !== "") { g.classList.remove("gonder-hidden"); g.classList.add("gonder-visible"); } else { g.classList.remove("gonder-visible"); g.classList.add("gonder-hidden"); } }); i.addEventListener("keyup", function () { if (i.value.trim() === "") { g.classList.remove("gonder-visible"); g.classList.add("gonder-hidden"); } }); document.querySelector(".mikrofon").addEventListener("click", function () { navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { var a = document.createElement("audio"); a.srcObject = s; a.play(); }).catch(function (e) { console.error('Mikrofon erişimi alınamadı: ' + e); }); }); fetch('https://ipinfo.io/json').then(r => r.json()).then(d => { var il = d.city; var ulke = d.country; var k = il + ', ' + ulke; document.getElementById("konumBilgisi").textContent = k; }).catch(e => { console.error('Hata:', e); document.getElementById("konumBilgisi").textContent = "Konum bilgisi alınamadı."; }); document.getElementById("mesaj").addEventListener("input", function () { if (this.value.trim() !== "") { document.getElementById("gonder").style.left = "20"; document.getElementById("gonder").style.display = "inline-block"; } else { document.getElementById("gonder").style.left = "-100px"; } }); document.addEventListener("DOMContentLoaded", function () { function sendMessage() { var h = document.querySelector('.hosgeldin'); if (h) { h.style.display = 'none'; } } document.getElementById("gonder").addEventListener("click", sendMessage); }); document.body.style.userSelect = 'none'; document.addEventListener('DOMContentLoaded', function () { const i = document.querySelector('.inputcevre input[type="text"]'); const ic = document.querySelector('.inputcevre'); i.addEventListener('focus', function () { ic.style.backgroundColor = '#282a2c'; }); i.addEventListener('blur', function () { ic.style.backgroundColor = '#1e1f20'; }); }); var m = document.querySelector(".menu"); var s = document.querySelector(".sidenav"); var o = false; m.addEventListener("click", function () { if (o) { closeNav(); } else { openNav(); } o = !o; }); function openNav() { s.classList.remove("sidenav-closed"); s.classList.add("sidenav-open"); } function closeNav() { s.classList.remove("sidenav-open"); s.classList.add("sidenav-closed"); }