(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const originalBtnHtml = button?.innerHTML;

  const setStatus = (msg, type) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (type || '');
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    const endpoint = form.getAttribute('action');
    if (!endpoint || endpoint.includes('TODO_FORMSPREE_ID')) {
      setStatus(
        'Form backend not yet configured. Email us directly at contact@strixeye.ma.',
        'error'
      );
      return;
    }

    if (button) {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    }
    setStatus('', '');

    try {
      const data = new FormData(form);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.reset();
        setStatus('Thanks — your message was sent. We respond within 24 hours.', 'success');
        if (button) button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Sent';
        setTimeout(() => {
          if (button) {
            button.innerHTML = originalBtnHtml;
            button.disabled = false;
          }
        }, 4000);
      } else {
        const json = await res.json().catch(() => ({}));
        const msg = json?.errors?.[0]?.message || 'Could not send. Please try again or email us directly.';
        setStatus(msg, 'error');
        if (button) { button.innerHTML = originalBtnHtml; button.disabled = false; }
      }
    } catch (err) {
      setStatus('Network error. Email us at contact@strixeye.ma.', 'error');
      if (button) { button.innerHTML = originalBtnHtml; button.disabled = false; }
    }
  });
})();
