/* ===================================================
   TEKAFRIQ – script.js
   Features:
     1. Navbar scroll shadow
     2. Hamburger mobile menu toggle
     3. Dropdown menus (click + hover)
     4. Logo carousel – seamless auto scroll
     5. Smooth anchor scroll
     6. Button hover ripple effect
     7. Active nav link highlight on scroll
=================================================== */

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
  const track = document.getElementById('logosTrack');

  if (track) {
    // Duplicate cards for seamless infinite loop
    const originalCards = Array.from(track.children);
    originalCards.forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    let offset = 0;
    const speed = 1.5;
    let paused = false;

    function getHalfWidth() {
      return track.scrollWidth / 2;
    }

    function autoScroll() {
      if (!paused) {
        offset += speed;
        if (offset >= getHalfWidth()) {
          offset = 0;
        }
        track.style.transform = 'translateX(-' + offset + 'px)';
      }
      requestAnimationFrame(autoScroll);
    }

    // Pause on hover
    track.addEventListener('mouseenter', function () { paused = true; });
    track.addEventListener('mouseleave', function () { paused = false; });

    // Arrow buttons
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');
    const ARROW_STEP = 200;

    if (scrollLeft) {
      scrollLeft.addEventListener('click', function () {
        offset = Math.max(0, offset - ARROW_STEP);
      });
    }
    if (scrollRight) {
      scrollRight.addEventListener('click', function () {
        offset = Math.min(getHalfWidth() - 1, offset + ARROW_STEP);
      });
    }

    autoScroll();
  }

  
  /* =============================================
     4B. CERTIFICATES CAROUSEL – reverse auto scroll
  ============================================= */
  const certsTrack = document.getElementById('certsTrack');

  if (certsTrack) {
    const originalCertCards = Array.from(certsTrack.children);
    originalCertCards.forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      certsTrack.appendChild(clone);
    });

    const certSpeed = 1.5;
    let certPaused = false;

    function getCertHalfWidth() {
      return certsTrack.scrollWidth / 2;
    }

    // Start from halfway so reverse scroll is visible from the start
    let certOffset = getCertHalfWidth() > 0 ? 0 : 0;

    function certAutoScroll() {
      if (!certPaused) {
        certOffset -= certSpeed; // negative = scroll right to left reversed
        if (certOffset <= 0) {
          certOffset = getCertHalfWidth();
        }
        certsTrack.style.transform = 'translateX(-' + certOffset + 'px)';
      }
      requestAnimationFrame(certAutoScroll);
    }

    certsTrack.addEventListener('mouseenter', function () { certPaused = true; });
    certsTrack.addEventListener('mouseleave', function () { certPaused = false; });

    const certScrollLeft = document.getElementById('certScrollLeft');
    const certScrollRight = document.getElementById('certScrollRight');
    const CERT_STEP = 200;

    if (certScrollLeft) {
      certScrollLeft.addEventListener('click', function () {
        certOffset = Math.min(getCertHalfWidth(), certOffset + CERT_STEP);
      });
    }
    if (certScrollRight) {
      certScrollRight.addEventListener('click', function () {
        certOffset = Math.max(0, certOffset - CERT_STEP);
      });
    }

    // Init offset at half so reverse scroll starts cleanly
    certOffset = getCertHalfWidth() / 2;
    certAutoScroll();
  }

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
