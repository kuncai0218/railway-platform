// Sidebar on small screens, presentation mode (← → to turn pages, Esc to leave), and the route diagram menus.
(function () {
  const body = document.body;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode: ignore */ } },
  };

  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) menuBtn.addEventListener('click', () => body.classList.toggle('side-open'));

  const presentBtn = document.getElementById('presentBtn');
  const setPresent = on => {
    body.classList.toggle('present', on);
    if (presentBtn) presentBtn.textContent = on ? '退出演示' : '演示模式';
    store.set('platform_present', on ? '1' : '0');
  };
  if (store.get('platform_present') === '1') setPresent(true);
  if (presentBtn) presentBtn.addEventListener('click', () => setPresent(!body.classList.contains('present')));
  document.addEventListener('keydown', e => {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    if (e.key === 'Escape') { setPresent(false); closeMenu(); }
    if (!body.classList.contains('present')) return;
    const link = document.querySelector(e.key === 'ArrowRight' ? '.pager .next' : e.key === 'ArrowLeft' ? '.pager .prev' : null);
    if (link) location.href = link.href;
  });

  // route diagram: some boxes cover four data items -> small menu
  const menu = document.getElementById('routeMenu');
  function closeMenu() { if (menu) menu.hidden = true; }
  document.querySelectorAll('.route .hot[data-links]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const items = btn.dataset.links.split(';').map(x => x.split('|'));
    menu.innerHTML = `<b>${btn.dataset.title}</b>` + items.map(([name, url]) => `<a href="${url}">${name}</a>`).join('');
    menu.hidden = false;
    const r = btn.getBoundingClientRect();
    const top = window.scrollY + r.top + Math.min(r.height, 60);
    const left = Math.min(window.scrollX + r.left + 20, window.scrollX + document.documentElement.clientWidth - menu.offsetWidth - 16);
    menu.style.top = `${top}px`;
    menu.style.left = `${Math.max(8, left)}px`;
  }));
  document.addEventListener('click', e => { if (menu && !menu.contains(e.target)) closeMenu(); });
})();
