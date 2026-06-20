// ============================================
// 生貝優志 ポートフォリオ — インタラクション
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== ヘッダー：スクロールで背景を表示 =====
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== モバイルナビの開閉 =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const toggleMenu = (open) => {
    navToggle.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => toggleMenu(!navLinks.classList.contains('open')));
  // メニュー内リンクをタップしたら閉じる
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // ===== スクロールでフェードイン =====
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target); // 一度表示したら監視解除
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible')); // 非対応環境は即表示
  }

  // ===== 数字のカウントアップ =====
  const counters = document.querySelectorAll('.stat-num > span[data-target]');
  const runCounter = (el) => {
    const target = Number(el.dataset.target);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.target);
  }

  // ===== FAQ アコーディオン =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // 他を閉じる（1つだけ開く挙動）
      document.querySelectorAll('.faq-item.open').forEach(o => {
        if (o !== item) {
          o.classList.remove('open');
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          o.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      ans.style.maxHeight = !isOpen ? ans.scrollHeight + 'px' : null;
    });
  });
});
