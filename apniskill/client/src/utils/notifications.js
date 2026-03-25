const CONTAINER_ID = 'apniskill-toast-root';

function ensureToastContainer() {
  if (typeof document === 'undefined') {
    return null;
  }

  let container = document.getElementById(CONTAINER_ID);

  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.width = 'min(92vw, 360px)';
    document.body.appendChild(container);
  }

  return container;
}

function show(type, message) {
  const container = ensureToastContainer();

  if (!container) {
    console.log(`${type.toUpperCase()}: ${message}`);
    return;
  }

  const toast = document.createElement('div');
  const accent =
    type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#38bdf8';

  toast.textContent = message;
  toast.style.padding = '14px 16px';
  toast.style.borderRadius = '18px';
  toast.style.border = `1px solid ${accent}55`;
  toast.style.background = 'rgba(15, 23, 42, 0.92)';
  toast.style.color = '#f8fafc';
  toast.style.backdropFilter = 'blur(14px)';
  toast.style.boxShadow = '0 12px 40px rgba(2, 6, 23, 0.35)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-8px)';
  toast.style.transition = 'opacity 180ms ease, transform 180ms ease';

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';

    window.setTimeout(() => {
      toast.remove();
    }, 180);
  }, 2600);
}

export const toast = {
  success(message) {
    show('success', message);
  },
  error(message) {
    show('error', message);
  },
  info(message) {
    show('info', message);
  },
};

export function showToast(type, message) {
  if (typeof toast[type] === 'function') {
    toast[type](message);
    return;
  }

  toast.info(message);
}
