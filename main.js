/* ZULIAN — ARCHITETTURA DIGITALE
   Brand bridge: aggiorna la vecchia identità visuale senza toccare layout/animazioni.
   Il codice originale del sito resta in main-core.js.
*/
(function () {
  const brandAlt = 'Zulian — Architettura Digitale';

  const headerLogo = document.querySelector('#nav-logo');
  if (headerLogo) {
    const img = headerLogo.querySelector('img');
    if (img) {
      img.src = 'images/zulian-logo-dark.svg';
      img.alt = brandAlt;
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.height = '52px';
      img.style.width = 'auto';
      img.style.maxWidth = 'min(310px, 62vw)';
      img.style.marginRight = '0';
      img.style.borderRadius = '0';
      img.style.objectFit = 'contain';
    }
    const oldText = headerLogo.querySelector('.navigation-logo-text');
    if (oldText) oldText.remove();
    headerLogo.setAttribute('aria-label', brandAlt);
  }

  const footerBrand = document.querySelector('.footer-brand-name');
  if (footerBrand) {
    footerBrand.innerHTML = '<img src="images/zulian-logo-dark.svg" alt="' + brandAlt + '" class="zulian-footer-logo" />';
  }

  const copyright = document.querySelector('.footer-bottom p');
  if (copyright) {
    copyright.innerHTML = '&copy; 2026 Zulian — Architettura Digitale. Tutti i diritti riservati.';
  }

  document.title = 'Zulian — Architettura Digitale | Siti, App, Software e Automazioni';

  let favicon = document.querySelector('link[rel~="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.type = 'image/svg+xml';
  favicon.href = 'images/zulian-mark.svg';

  const brandStyle = document.createElement('style');
  brandStyle.setAttribute('data-zulian-brand', '2026');
  brandStyle.textContent = `
    #nav-logo { min-width: 0; }
    #nav-logo > img { display: block; }
    .zulian-footer-logo {
      display: block;
      width: min(300px, 78vw);
      height: auto;
      margin: 0 0 1rem 0;
    }
    @media (max-width: 640px) {
      #nav-logo > img { height: 44px !important; max-width: 64vw !important; }
      .navigation-header { padding-top: 1rem; padding-bottom: 1rem; }
      .zulian-footer-logo { width: min(260px, 82vw); }
    }
  `;
  document.head.appendChild(brandStyle);

  // Mantiene invariato il comportamento del sito caricando il JS originale
  // nello stesso punto della pagina in cui prima veniva eseguito main.js.
  document.write('<script src="main-core.js"><\\/script>');
})();
