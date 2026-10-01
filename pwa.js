(() => {
  const button = document.getElementById('installApp');
  const status = document.getElementById('installStatus');
  const help = document.getElementById('installHelp');
  let promptEvent = null;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  function installed() { button.hidden = true; help.hidden = true; status.textContent = 'ホーム画面からアプリとして利用中です。'; }
  if (standalone()) installed();
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event;
    if (!standalone()) { button.hidden = false; status.textContent = 'ホーム画面に追加して、アプリとして使えます。'; }
  });
  button.addEventListener('click', async () => {
    if (!promptEvent) return;
    const event = promptEvent; promptEvent = null; button.hidden = true;
    await event.prompt(); const choice = await event.userChoice;
    status.textContent = choice.outcome === 'accepted' ? '追加を受け付けました。ホーム画面を確認してください。' : 'メニューからもホーム画面に追加できます。';
  });
  window.addEventListener('appinstalled', installed);
  if (location.protocol === 'file:') {
    status.textContent = 'ホーム画面に追加するには、GitHub Pagesの公開URLで開いてください。';
    return;
  }
  if (!window.isSecureContext) {
    status.textContent = 'ホーム画面への追加とオフライン利用にはHTTPSの公開URLが必要です。'; return;
  }
  if (!('serviceWorker' in navigator)) return;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (refreshing) location.reload(); });
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {scope: './'});
      const offerUpdate = () => {
        if (!registration.waiting) return;
        document.getElementById('updateBar').hidden = false;
        document.getElementById('applyUpdate').onclick = () => {
          if (!registration.waiting) return;
          refreshing = true; registration.waiting.postMessage({type: 'SKIP_WAITING'});
        };
      };
      offerUpdate();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (worker) worker.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(); });
      });
      await navigator.serviceWorker.ready;
      if (!standalone() && !promptEvent) status.textContent = 'オフラインでも計算できます。追加方法は下をご覧ください。';
    } catch {
      status.textContent = 'オフラインの準備ができませんでした。接続中は計算できます。';
    }
  });
})();
