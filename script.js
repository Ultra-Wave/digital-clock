// Professional Digital Clock — script.js
(() => {
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  const tzEl = document.getElementById('tz');
  const formatToggle = document.getElementById('formatToggle');

  const STORAGE_KEY = 'clock_24h';

  const saved = localStorage.getItem(STORAGE_KEY);
  formatToggle.checked = saved === 'true';

  function pad(n){ return n.toString().padStart(2, '0'); }

  function formatTime(date, use24) {
    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    let ampm = '';
    if (!use24) {
      ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
    }
    return {
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s),
      ampm
    };
  }

  function formatDate(date){
    return date.toLocaleDateString(undefined, { weekday: 'long', year:'numeric', month:'short', day:'numeric' });
  }

  function createDigits() {
    timeEl.innerHTML = '';
    const parts = ['h1','h2','colon1','m1','m2','colon2','s1','s2'];
    parts.forEach(part => {
      if (part.startsWith('colon')) {
        const span = document.createElement('span');
        span.className = 'colon';
        span.textContent = ':';
        timeEl.appendChild(span);
      } else {
        const span = document.createElement('span');
        span.className = 'digit';

        if (part.startsWith('h')) span.classList.add('hour');
        span.textContent = '0';
        timeEl.appendChild(span);
      }
    });
  }

  function updateDigits(timeObj) {
    const nodes = Array.from(timeEl.querySelectorAll('.digit, .colon'));
    const HH = timeObj.hours;
    const MM = timeObj.minutes;
    const SS = timeObj.seconds;

    const values = [
      HH.charAt(0), HH.charAt(1),
      ':',
      MM.charAt(0), MM.charAt(1),
      ':',
      SS.charAt(0), SS.charAt(1)
    ];

    nodes.forEach((node, i) => {
      const newVal = values[i];
      if (node.classList.contains('colon')) {
        return;
      }
      if (node.textContent !== newVal) {
        node.classList.add('tick');
        requestAnimationFrame(() => {
          node.textContent = newVal;
          setTimeout(() => node.classList.remove('tick'), 280);
        });
      }
    });
  }

  function update() {
    const now = new Date();
    const use24 = formatToggle.checked;
    const t = formatTime(now, use24);
    updateDigits(t);
    dateEl.textContent = formatDate(now);
    try {
      tzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) {
      tzEl.textContent = '';
    }
  }

  createDigits();
  update();
  const now = Date.now();
  const delay = 1000 - (now % 1000);
  setTimeout(() => {
    update();
    setInterval(update, 1000);
  }, delay);

  formatToggle.addEventListener('change', () => {
    localStorage.setItem(STORAGE_KEY, String(formatToggle.checked));
    update();
  });

  formatToggle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      formatToggle.checked = !formatToggle.checked;
      formatToggle.dispatchEvent(new Event('change'));
    }
  });
})();