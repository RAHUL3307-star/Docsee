// DocSee Interactive Controller
document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification System
  const toastContainer = document.getElementById('toast-container');
  
  function showToast(message, duration = 4000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'mk-toast';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: hsl(15 71% 52%);"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // 2. Language Selector Dropdown
  const btnLanguage = document.querySelector('[data-testid="button-language"]') || document.getElementById('button-language');
  const menuLanguage = document.getElementById('menu-language');

  if (btnLanguage && menuLanguage) {
    btnLanguage.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = menuLanguage.style.display === 'block';
      menuLanguage.style.display = isVisible ? 'none' : 'block';
      btnLanguage.setAttribute('aria-expanded', !isVisible);
    });

    const langOptions = menuLanguage.querySelectorAll('.mk-lang-option');
    langOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        langOptions.forEach(o => o.textContent = o.textContent.replace('✓ ', ''));
        opt.textContent = '✓ ' + opt.textContent;
        const langName = opt.textContent.replace('✓ ', '').trim();
        
        // Update button text while preserving SVG icons
        const svgs = btnLanguage.querySelectorAll('svg');
        btnLanguage.innerHTML = '';
        if (svgs[0]) btnLanguage.appendChild(svgs[0]);
        btnLanguage.appendChild(document.createTextNode(' ' + langName.split(' ')[0] + ' '));
        if (svgs[1]) btnLanguage.appendChild(svgs[1]);
        
        menuLanguage.style.display = 'none';
        btnLanguage.setAttribute('aria-expanded', 'false');
        showToast(`Intake language updated to ${langName}`);
      });
    });

    document.addEventListener('click', (e) => {
      if (!btnLanguage.contains(e.target) && !menuLanguage.contains(e.target)) {
        menuLanguage.style.display = 'none';
        btnLanguage.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Interactive Product Demo ("A closer look") Switcher
  const btnDemoPatient = document.querySelector('[data-testid="button-demo-patient"]') || document.getElementById('button-demo-patient');
  const btnDemoClinician = document.querySelector('[data-testid="button-demo-clinician"]') || document.getElementById('button-demo-clinician');
  const displayClinician = document.querySelector('[data-testid="display-clinician-view"]') || document.getElementById('display-clinician-view');
  const displayPatient = document.querySelector('[data-testid="display-patient-view"]') || document.getElementById('display-patient-view');
  const demoCard = document.querySelector('[data-testid="display-product-demo"]') || document.getElementById('display-product-demo');
  const windowbarTitle = demoCard ? demoCard.querySelector('.mk-demo-windowbar span:nth-child(2)') : null;

  function switchDemoView(isPatient) {
    if (btnDemoPatient) btnDemoPatient.setAttribute('aria-selected', isPatient ? 'true' : 'false');
    if (btnDemoClinician) btnDemoClinician.setAttribute('aria-selected', isPatient ? 'false' : 'true');

    if (displayClinician && displayPatient) {
      if (isPatient) {
        displayClinician.style.display = 'none';
        displayPatient.style.display = 'grid';
        displayPatient.style.opacity = '0';
        setTimeout(() => { displayPatient.style.opacity = '1'; }, 20);
        if (windowbarTitle) windowbarTitle.textContent = 'DocSee / PATIENT KIOSK (TOUCH & VOICE)';
      } else {
        displayPatient.style.display = 'none';
        displayClinician.style.display = 'grid';
        displayClinician.style.opacity = '0';
        setTimeout(() => { displayClinician.style.opacity = '1'; }, 20);
        if (windowbarTitle) windowbarTitle.textContent = 'DocSee / CLINICIAN DESK';
      }
    }
  }

  if (btnDemoPatient) {
    btnDemoPatient.addEventListener('click', () => switchDemoView(true));
  }
  if (btnDemoClinician) {
    btnDemoClinician.addEventListener('click', () => switchDemoView(false));
  }

  // 4. FAQ Accordion Toggle
  for (let i = 0; i < 4; i++) {
    const trigger = document.querySelector(`[data-testid="button-faq-${i}"]`) || document.getElementById(`button-faq-${i}`);
    const answer = document.querySelector(`[data-testid="text-faq-answer-${i}"]`) || document.getElementById(`text-faq-answer-${i}`);

    if (trigger && answer) {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
          answer.style.display = 'none';
        } else {
          answer.style.display = 'block';
          answer.style.opacity = '0';
          setTimeout(() => { answer.style.opacity = '1'; }, 10);
        }
      });
    }
  }

  // 5. Hospital Pilot Modal Dialog
  const modal = document.getElementById('pilot-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const pilotForm = document.getElementById('pilot-form');
  const modalSubmit = document.getElementById('modal-submit');

  const openButtons = [
    document.querySelector('[data-testid="button-nav-contact"]'),
    document.querySelector('[data-testid="button-hero-contact"]'),
    document.querySelector('[data-testid="button-implementation-contact"]'),
    document.querySelector('[data-testid="button-footer-contact"]'),
    document.getElementById('button-mobile-contact')
  ].filter(Boolean);

  function openModal() {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });

  if (pilotForm) {
    pilotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const hospitalName = document.getElementById('input-hospital').value;
      const originalText = modalSubmit.innerHTML;
      
      modalSubmit.disabled = true;
      modalSubmit.innerHTML = 'Scheduling Pilot...';

      setTimeout(() => {
        modalSubmit.disabled = false;
        modalSubmit.innerHTML = originalText;
        pilotForm.reset();
        closeModal();
        showToast(`✓ Pilot Request Confirmed for ${hospitalName}! Our clinical deployment lead will contact you.`);
      }, 900);
    });
  }

  // 6. Mobile Navigation Drawer
  const btnMobileMenu = document.querySelector('[data-testid="button-mobile-menu"]') || document.getElementById('button-mobile-menu');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  if (btnMobileMenu && mobileDrawer) {
    btnMobileMenu.addEventListener('click', () => {
      mobileDrawer.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
        document.body.style.overflow = '';
      });
    }

    mobileDrawer.querySelectorAll('.mk-mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
        document.body.style.overflow = '';
      });
    });
  }

  // 7. Smooth Scrolling for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Live Dashboard Modal Logic
  const dashboardOverlay = document.getElementById('live-dashboard-overlay');
  const closeDashboardBtn = document.getElementById('close-dashboard');
  const openDashboard = () => {
    if (dashboardOverlay) dashboardOverlay.classList.remove('hidden');
  };
  const closeDashboard = () => {
    if (dashboardOverlay) dashboardOverlay.classList.add('hidden');
  };
  if (closeDashboardBtn) closeDashboardBtn.addEventListener('click', closeDashboard);

  // 8. "See the patient journey" hero button opens dashboard.html
  const btnHeroJourney = document.querySelector('[data-testid="button-hero-journey"]');
  if (btnHeroJourney) {
    btnHeroJourney.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }

  // 9. "See how it works" footer button opens dashboard.html
  const btnFooterJourney = document.querySelector('[data-testid="button-footer-journey"]');
  if (btnFooterJourney) {
    btnFooterJourney.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }

  // 10. Scroll Reveal Animations (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.mk-reveal').forEach(el => observer.observe(el));
  }
});
