(function(){
  var $ = function(id){ return document.getElementById(id); };
  var form = $('form'), errorEl = $('error');
  var SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  var ENDINGS = [
    'Peacefully in sleep, after one last bull run',
    'Laughing too hard at a meme',
    'Peacefully, still waiting for the altseason that was promised',
    'Quietly, mid-scroll, with a bag full of green candles',
    'Peacefully, right after the airdrop finally landed',
    'Happily asleep during a three-hour Twitter Space',
    'Smiling, after one final "gm" to the timeline',
    'Peacefully, the day Bitcoin hit a new all time high',
    'Calmly, after explaining blockchain to the grandkids one last time',
    'Peacefully in a hammock, with the whole portfolio in profit',
    'Laughing at a reply guy, surrounded by family',
    'In deep sleep, dreaming of a 100x',
    'Peacefully, after finally reading the whole whitepaper',
    'Content and calm, with zero unread DMs',
    'Quietly, the moment gas fees hit zero',
    'Peacefully, right after saying "this time is different"',
    'Smiling, the day the last bear market ended',
    'Asleep in a comfy chair, with a winning trade still open',
    'Peacefully, after touching grass for the very first time',
    'Happily, after one final, perfectly timed exit',
    'In peace, after a long life of saying wagmi and meaning it',
    'Mid-nap, during a very long token unlock',
    'Laughing at old screenshots from 2021',
    'Calmly, the day the mempool finally cleared',
    'Peacefully, with a cup of chai and a green portfolio',
    'Smiling, after being right about everything on the timeline',
    'Quietly, after the last NFT in the collection finally sold',
    'Peacefully in sleep, with notifications off for once',
    'Happily, right after one last viral post',
    'Peacefully, at a ripe old age, still bullish'
  ];

  // ---------- deterministic randomness ----------
  function hash(str){
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0; i < str.length; i++){
      var c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    return h1 >>> 0;
  }
  function rng(seed){
    return function(){
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pick(r, min, max){ return min + Math.floor(r() * (max - min + 1)); }

  // ---------- real astro ----------
  function ageFrom(y, m, d){
    var now = new Date();
    var a = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a--;
    return a;
  }
  function sunSign(m, d){
    var edges = [20,19,21,20,21,21,23,23,23,23,22,22]; // first day of the sign starting in that month
    var startSign = [10,11,0,1,2,3,4,5,6,7,8,9];      // sign that starts in month m
    var idx = d >= edges[m-1] ? startSign[m-1] : (startSign[m-1] + 11) % 12;
    return SIGNS[idx];
  }
  function moonSign(y, m, d, hh, mm){
    // Local time assumed IST (UTC+5:30)
    var utc = Date.UTC(y, m - 1, d, hh, mm) - 330 * 60000;
    var lon = Astronomy.EclipticGeoMoon(new Date(utc)).lon; // tropical, of date
    lon = ((lon % 360) + 360) % 360;
    return { sign: SIGNS[Math.floor(lon / 30)], lon: lon };
  }

  // ---------- avatar ----------
  function withTimeout(p, ms){
    return Promise.race([p, new Promise(function(_, rej){ setTimeout(function(){ rej(new Error('timeout')); }, ms); })]);
  }
  function blobToDataURL(blob){
    return new Promise(function(res, rej){ var fr = new FileReader(); fr.onload = function(){ res(fr.result); }; fr.onerror = rej; fr.readAsDataURL(blob); });
  }
  function fetchImage(url){
    return withTimeout(fetch(url, { mode: 'cors' }), 8000).then(function(r){
      if (!r.ok) throw new Error('bad ' + r.status);
      var t = r.headers.get('content-type') || '';
      if (t.indexOf('image') !== 0) throw new Error('not image');
      return r.blob();
    }).then(blobToDataURL);
  }
  function initialsAvatar(name){
    var parts = name.trim().split(/\s+/);
    var ini = ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
      '<rect width="400" height="400" fill="#1b2338"/><circle cx="200" cy="200" r="150" fill="none" stroke="#c9a96a" stroke-opacity=".35"/>' +
      '<text x="200" y="200" dy=".35em" text-anchor="middle" font-family="Georgia, serif" font-size="150" fill="#e0c58f">' + ini.replace(/[<>&]/g, '') + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }
  function getAvatar(handle, name){
    return withTimeout(fetch('https://api.fxtwitter.com/' + encodeURIComponent(handle)), 8000)
      .then(function(r){ return r.json(); })
      .then(function(j){
        var u = j && j.user && j.user.avatar_url;
        if (!u) throw new Error('no avatar');
        return fetchImage(u.replace('_normal.', '_400x400.'));
      })
      .catch(function(){ return fetchImage('https://unavatar.io/x/' + encodeURIComponent(handle) + '?fallback=false'); })
      .catch(function(){ return initialsAvatar(name); });
  }

  // ---------- render ----------
  var current = null;
  function fit(){
    var stage = $('stage'); if (!stage) return;
    $('scaler').style.transform = 'scale(' + (stage.clientWidth / 1600) + ')';
  }
  window.addEventListener('resize', fit);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    errorEl.textContent = '';
    var name = $('name').value.trim().replace(/\s+/g, ' ');
    var dob = $('dob').value;
    var tob = $('tob').value;
    var place = $('place').value.trim();
    var handle = $('handle').value.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '').split(/[/?#]/)[0];

    if (!name) return fail('Please enter your full name.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return fail('Please enter your date of birth.');
    var p = dob.split('-').map(Number), y = p[0], m = p[1], d = p[2];
    if (y < 1900 || new Date(y, m - 1, d) > new Date()) return fail('That date of birth does not look right.');
    if (!place) return fail('Please enter your birth place.');
    if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) return fail('Please enter a valid X handle, like @yourname.');

    var btn = $('go'); btn.disabled = true; btn.textContent = 'Reading the stars...';

    var age = ageFrom(y, m, d);
    var hh = 12, mm = 0, approx = true;
    if (/^\d{2}:\d{2}/.test(tob)){ hh = +tob.slice(0, 2); mm = +tob.slice(3, 5); approx = false; }
    var moon = moonSign(y, m, d, hh, mm);
    var r = rng(hash(name.toLowerCase() + '|' + dob));
    var deathAge = pick(r, 75, 98);
    if (deathAge < age + 2) deathAge = age + 2 + pick(r, 0, 6);
    var marriageAge = pick(r, 22, 34);
    var kids = pick(r, 0, 3);
    var love = r() < 0.5;
    var ending = ENDINGS[pick(r, 0, ENDINGS.length - 1)];

    current = { name: name, handle: handle, age: age, deathYear: y + deathAge, deathAge: deathAge, marriageAge: marriageAge, love: love, kids: kids, ending: ending, sun: sunSign(m, d), moon: moon.sign };

    $('c-name').textContent = name;
    $('c-name').className = name.length > 16 ? 'long' : '';
    $('c-handle').textContent = '@' + handle;
    var dateStr = new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    $('c-meta').textContent = 'Born ' + dateStr + ', ' + place;
    $('c-age').textContent = age;
    $('c-sun').textContent = current.sun;
    $('c-moon').textContent = moon.sign;
    $('c-moonnote').textContent = approx ? '(approx)' : '';
    $('c-moonimg').src = ZODIAC.svg(moon.sign);
    $('c-mage').textContent = marriageAge;
    $('c-mtype').textContent = love ? 'Love' : 'Arranged';
    $('c-kids').textContent = kids === 0 ? 'None' : kids;
    $('c-dyear').textContent = y + deathAge;
    $('c-dage').textContent = 'at age ' + deathAge;
    $('c-how').textContent = ending;

    var pfp = $('c-pfp');
    pfp.src = initialsAvatar(name);
    getAvatar(handle, name).then(function(src){
      pfp.src = src;
      return pfp.decode ? pfp.decode().catch(function(){}) : null;
    }).then(function(){
      $('intro').hidden = true;
      $('result').hidden = false;
      fit();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      btn.disabled = false; btn.textContent = 'Reveal my card';
      document.body.setAttribute('data-ready', '1');
    });
  });

  function fail(msg){ errorEl.textContent = msg; return false; }

  $('again').addEventListener('click', function(){
    $('result').hidden = true; $('intro').hidden = false;
    document.body.removeAttribute('data-ready');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function renderCanvas(){
    return document.fonts.ready.then(function(){
      return html2canvas($('card'), {
        width: 1600, height: 900, scale: 1, useCORS: true, backgroundColor: '#0f1422',
        windowWidth: 1600, windowHeight: 900, scrollX: 0, scrollY: 0, logging: false,
        onclone: function(doc){
          var st = doc.getElementById('stage');
          st.style.width = '1600px'; st.style.height = '900px'; st.style.maxWidth = 'none'; st.style.borderRadius = '0';
          doc.getElementById('scaler').style.transform = 'none';
        }
      });
    });
  }
  window.__renderCard = function(){ return renderCanvas().then(function(c){ return c.toDataURL('image/png'); }); };

  $('dl').addEventListener('click', function(){
    var b = this; b.disabled = true; b.textContent = 'Preparing...';
    renderCanvas().then(function(c){
      var a = document.createElement('a');
      a.download = 'destiny-card-' + (current ? current.handle : 'me') + '.png';
      a.href = c.toDataURL('image/png');
      document.body.appendChild(a); a.click(); a.remove();
    }).catch(function(){ alert('Could not create the image. Please try again.'); })
      .finally(function(){ b.disabled = false; b.textContent = 'Download'; });
  });

  $('share').addEventListener('click', function(){
    if (!current) return;
    var text = 'My Destiny Card: ' + current.sun + ' sun, ' + current.moon + ' moon. Married at ' + current.marriageAge +
      ' (' + (current.love ? 'love' : 'arranged') + '), ' + (current.kids === 0 ? 'no kids' : current.kids + (current.kids === 1 ? ' kid' : ' kids')) +
      ', and the end comes in ' + current.deathYear + ': ' + current.ending.charAt(0).toLowerCase() + current.ending.slice(1) + '.\n\nFor fun only. Get yours:';
    var url = 'https://somu2may.github.io/destiny-card/';
    window.open('https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'noopener');
  });
})();
