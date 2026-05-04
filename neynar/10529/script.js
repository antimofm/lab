// Per-phone toast: every .phone gets its own overlay, centered on that frame.
const ACTION_LABELS = {
  close: 'closed mini-app',
  more: 'opened menu',
  back: 'back',
  forward: 'forward',
  share: 'shared',
  reload: 'reloaded',
  tabs: 'opened tabs',
  safari: 'open in Safari',
  'open-system': 'open in system browser',
  minimize: 'minimized to PiP',
  profile: 'opened profile',
};

document.querySelectorAll('.phone').forEach((phone) => {
  const t = document.createElement('div');
  t.className = 'phone-toast';
  t.hidden = true;
  phone.appendChild(t);
  phone._toast = t;
  phone._toastTimer = null;
});

function showToastInPhone(phone, msg) {
  if (!phone || !phone._toast) return;
  const t = phone._toast;
  t.textContent = msg;
  t.hidden = false;
  void t.offsetWidth;
  t.setAttribute('data-show', '');
  clearTimeout(phone._toastTimer);
  phone._toastTimer = setTimeout(() => {
    t.removeAttribute('data-show');
    setTimeout(() => { t.hidden = true; }, 200);
  }, 1100);
}

document.querySelectorAll('[data-action]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const phone = el.closest('.phone');
    const action = el.dataset.action;
    showToastInPhone(phone, ACTION_LABELS[action] || action);
  });
});

// Randomize skeleton-line widths so cards look like content, not grid paper.
document.querySelectorAll('.skel-row').forEach((row) => {
  const lines = row.querySelectorAll('.skel-line');
  if (lines.length >= 2) {
    lines[0].className = 'skel-line ' + (Math.random() < 0.5 ? 'w40' : 'w50');
    lines[1].className = 'skel-line ' + ['w70', 'w75', 'w80', 'w85', 'w90'][Math.floor(Math.random() * 5)];
  }
});

// Archetype 2 — Minimal: scroll-to-collapse top bar
document.querySelectorAll('[data-collapsible]').forEach((frame) => {
  const content = frame.querySelector('.content');
  let lastY = 0;
  content.addEventListener('scroll', () => {
    const y = content.scrollTop;
    if (y > 40 && y > lastY) {
      frame.setAttribute('data-collapsed', '');
    } else if (y < lastY - 4 || y < 10) {
      frame.removeAttribute('data-collapsed');
    }
    lastY = y;
  });
});

// Archetype 5 — Full-screen: edge-tap to reveal floating chrome (auto-hide)
document.querySelectorAll('[data-fullscreen]').forEach((frame) => {
  const grab = frame.querySelector('.edge-grab');
  let revealTimer;

  function reveal() {
    frame.setAttribute('data-revealed', '');
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => {
      frame.removeAttribute('data-revealed');
    }, 2400);
  }

  grab.addEventListener('click', (e) => {
    e.stopPropagation();
    reveal();
    showToastInPhone(frame.closest('.phone'), 'chrome revealed (auto-hides)');
  });
});

// Archetype 7 — Discovery: chip switching
document.querySelectorAll('.discovery-strip').forEach((strip) => {
  strip.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      strip.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      showToastInPhone(chip.closest('.phone'), `switched to ${chip.textContent}`);
    });
  });
});

// Search input — Enter triggers a navigate echo
document.querySelectorAll('.search-input').forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      showToastInPhone(input.closest('.phone'), `navigate: ${input.value.trim()}`);
      input.blur();
    }
  });
});
