// Click-to-toast on every action button so the chrome feels live
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 1100);
}

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

document.querySelectorAll('[data-action]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = el.dataset.action;
    showToast(ACTION_LABELS[action] || action);
  });
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

// Archetype 5 — Full-screen: edge-tap to reveal chrome
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
    showToast('chrome revealed (auto-hides)');
  });

  frame.addEventListener('click', (e) => {
    if (e.target === frame || e.target.classList.contains('content-edge') || e.target.closest('.app-hero')) {
      // tap on app body — do nothing
    }
  });
});

// Archetype 7 — Discovery: chip switching
document.querySelectorAll('.discovery-strip').forEach((strip) => {
  strip.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      strip.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      showToast(`switched to ${chip.textContent}`);
    });
  });
});

// Search input — focus state already CSS-handled, but echo on enter
document.querySelectorAll('.search-input').forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      showToast(`navigate: ${input.value.trim()}`);
      input.blur();
    }
  });
});
