document.addEventListener('DOMContentLoaded', function () {

  /* =============================================
     1. NAVBAR – add shadow on scroll
  ============================================= */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* =============================================
     2. HAMBURGER TOGGLE
  ============================================= */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }


  /* =============================================
     3. DROPDOWN MENUS (click support for mobile)
  ============================================= */
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(function (dropdown) {
    const toggle = dropdown.querySelector('.dropdown-toggle');

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('open');

          dropdowns.forEach(function (other) {
            if (other !== dropdown) other.classList.remove('open');
          });
        }
      });
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(function (d) { d.classList.remove('open'); });
    }
  });


  /* =============================================
     4. LOGO CAROUSEL – seamless auto scroll
  ============================================= */
  function initCarousel({
  trackId,
  prevBtnId,
  nextBtnId,
  interval = 2000,
  direction = 'forward'
}) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const cards = track.querySelectorAll('.logo-card');
  let index = 0;
  let isTransitioning = false;

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  function getHalf() {
    return cards.length / 2; // because you duplicated manually
  }

  function updatePosition(animate = true) {
    const cardWidth = getCardWidth();

    if (!animate) {
      track.style.transition = 'none';
      track.style.transform = `translateX(-${index * cardWidth}px)`;

      // force reflow
      track.offsetHeight;

      track.style.transition = 'transform 0.4s ease';
    } else {
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    index++;
    updatePosition(true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    index--;
    updatePosition(true);
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;

    const half = getHalf();

    // Passed the duplicated end → reset to start
    if (index >= half) {
      index = 0;
      updatePosition(false);
    }

    // Passed the start → jump to duplicate end
    if (index < 0) {
      index = half - 1;
      updatePosition(false);
    }
  });

  // Buttons
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Auto scroll
  function autoMove() {
    direction === 'forward' ? nextSlide() : prevSlide();
  }

  let autoScroll = setInterval(autoMove, interval);

  track.addEventListener('mouseenter', () => clearInterval(autoScroll));
  track.addEventListener('mouseleave', () => {
    autoScroll = setInterval(autoMove, interval);
  });

  updatePosition(false);
}
initCarousel({
  trackId: 'logosTrack',
  prevBtnId: 'scrollLeft',
  nextBtnId: 'scrollRight',
  interval: 1500,
  direction: 'forward'
});



  /* =============================================
     5. SMOOTH ANCHOR SCROLL (offset for fixed nav)
  ============================================= */
  const navHeight = 70;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* =============================================
     6. BUTTON HOVER RIPPLE EFFECT
  ============================================= */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = [
        'position: absolute',
        'border-radius: 50%',
        'background: rgba(255,255,255,0.3)',
        'pointer-events: none',
        'width: ' + size + 'px',
        'height: ' + size + 'px',
        'left: ' + x + 'px',
        'top: ' + y + 'px',
        'transform: scale(0)',
        'animation: rippleAnim 0.55s linear',
      ].join(';');

      const prevPosition = window.getComputedStyle(btn).position;
      if (prevPosition === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  });

  if (!document.getElementById('tekafriq-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'tekafriq-ripple-style';
    style.textContent = '@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }';
    document.head.appendChild(style);
  }


  /* =============================================
     7. ACTIVE NAV LINK – highlight on scroll
  ============================================= */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 40;
      if (window.scrollY >= sectionTop) {
        current = '#' + section.id;
      }
    });

    navAnchors.forEach(function (a) {
      a.style.color = '';
      if (a.getAttribute('href') === current) {
        a.style.color = 'var(--red)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

}); // end DOMContentLoaded
