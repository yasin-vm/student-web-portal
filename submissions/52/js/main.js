/**
 * NovaPulse - Core Interactive Engine
 * Canvas Particles, Asynchronous PHP API Client, Dynamic DOM Renderers
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvasParticles();
  initNavbar();
  initCounterStats();
  initPortfolio();
  initFeedbackWall();
  initContactModal();
  initNewsletter();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('novapulse_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('novapulse_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'success');
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  toggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
}

/* ==========================================================================
   2. HTML5 Canvas Particle System with Interactive Mouse Physics
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 18), 70);

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, ' : 'rgba(6, 182, 212, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion physics
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 3;
          this.y -= forceDirectionY * force * 3;
        }
      }

      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          ctx.strokeStyle = isDark
            ? `rgba(139, 92, 246, ${0.25 * (1 - dist / 130)})`
            : `rgba(6, 182, 212, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      particles[i].update();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Navbar Scroll & Mobile Menu Toggle
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }
}

/* ==========================================================================
   4. Animated Metric Stats Observer
   ========================================================================== */
function initCounterStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalVal = parseInt(target.getAttribute('data-target') || '0', 10);
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';

        animateCounter(target, 0, finalVal, 1800, prefix, suffix);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element, start, end, duration, prefix, suffix) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const currentVal = Math.floor(progress * (end - start) + start);
    element.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   5. Dynamic Portfolio Filter & Live Search
   ========================================================================== */
let allProjects = [];

function initPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const searchInput = document.getElementById('project-search');

  if (!grid) return;

  // Fetch initial project data (try PHP API first, fallback to embedded array)
  fetch('api/projects.php')
    .then(res => res.json())
    .then(res => {
      if (res.success && Array.isArray(res.data)) {
        allProjects = res.data;
      } else {
        useFallbackProjects();
      }
      renderProjects(allProjects);
    })
    .catch(() => {
      useFallbackProjects();
      renderProjects(allProjects);
    });

  // Tab Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      filterAndRender(category, searchInput?.value || '');
    });
  });

  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeCategory = document.querySelector('.tab-btn.active')?.getAttribute('data-category') || 'all';
      filterAndRender(activeCategory, e.target.value);
    });
  }
}

function useFallbackProjects() {
  allProjects = [
    { id: '1', title: 'Quantum AI Dashboard', category: 'ai', description: 'High-throughput real-time predictive analytics matrix featuring neural architecture data feeds.', image: 'images/dashboard.png', tags: ['AI Neural Net', 'WebGL', 'PHP REST API'] },
    { id: '2', title: 'Nexus Cloud SaaS Platform', category: 'saas', description: 'Enterprise cloud resource optimizer with distributed server metrics and automated load balancing.', image: 'images/hero.png', tags: ['Cloud SaaS', 'Microservices', 'Vue/PHP'] },
    { id: '3', title: 'Aether Web3 DEX Portal', category: 'web', description: 'Decentralized liquidity swapping aggregator with ultra-low latency transaction streaming.', image: 'images/dashboard.png', tags: ['Web3', 'Smart Contracts', 'JavaScript'] },
    { id: '4', title: 'Hyperion Mobile Banking App', category: 'mobile', description: 'Biometric-secured mobile payment wallet supporting multi-currency wire transfers.', image: 'images/hero.png', tags: ['Mobile Native', 'Security', 'REST API'] },
    { id: '5', title: 'Vortex Autonomous Workflow Engine', category: 'ai', description: 'No-code AI workflow orchestrator integrating 200+ third-party tools with decision tree processing.', image: 'images/dashboard.png', tags: ['AI Automation', 'Workflow', 'PHP'] },
    { id: '6', title: 'Pulse Analytics Engine', category: 'saas', description: 'Real-time user heatmaps, funnel conversion tracking, and session recording software.', image: 'images/hero.png', tags: ['SaaS Platform', 'Big Data', 'Realtime'] }
  ];
}

function filterAndRender(category, query) {
  const q = query.toLowerCase().trim();
  const filtered = allProjects.filter(p => {
    const matchesCat = category === 'all' || p.category === category;
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  renderProjects(filtered);
}

function renderProjects(projects) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">No project matches found</p>
        <p style="font-size: 0.9rem;">Try adjusting your search terms or selecting another category tab.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map(p => `
    <div class="project-card" data-category="${p.category}">
      <div class="project-image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="project-badge">${p.category.toUpperCase()}</span>
      </div>
      <div class="project-content">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   6. Live Asynchronous Community Feedback Wall (PHP API Powered)
   ========================================================================== */
function initFeedbackWall() {
  const grid = document.getElementById('feedback-grid');
  const form = document.getElementById('feedback-form');

  if (!grid) return;

  loadFeedback();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fb-name').value.trim();
      const role = document.getElementById('fb-role').value.trim();
      const message = document.getElementById('fb-message').value.trim();
      const rating = parseInt(document.getElementById('fb-rating').value, 10);

      if (!name || !message) {
        showToast('Please provide your name and feedback message.', 'error');
        return;
      }

      const payload = { name, role, message, rating };

      // Submit to PHP API endpoint
      fetch('api/feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          showToast(res.message, 'success');
          form.reset();
          loadFeedback();
        } else {
          showToast(res.message || 'Error saving review.', 'error');
        }
      })
      .catch(() => {
        // Local fallback for standalone static HTML
        const fallbackItem = {
          id: 'fb-local-' + Date.now(),
          name,
          role: role || 'Client',
          rating,
          avatar: name.substr(0, 2).toUpperCase(),
          message,
          date: 'Just now'
        };
        appendFeedbackCard(fallbackItem);
        showToast('Thank you! Your feedback has been displayed on the wall.', 'success');
        form.reset();
      });
    });
  }
}

function loadFeedback() {
  const grid = document.getElementById('feedback-grid');
  if (!grid) return;

  fetch('api/feedback.php')
    .then(res => res.json())
    .then(res => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        grid.innerHTML = res.data.map(item => createFeedbackCardHTML(item)).join('');
      } else {
        useFallbackFeedback();
      }
    })
    .catch(() => {
      useFallbackFeedback();
    });
}

function useFallbackFeedback() {
  const grid = document.getElementById('feedback-grid');
  if (!grid) return;
  const initialList = [
    { name: 'Sarah Jenkins', role: 'CTO at TechScale', rating: 5, avatar: 'SJ', message: 'NovaPulse transformed our enterprise cloud infrastructure in record time. The glassmorphic UI and PHP API backends are blisteringly fast!' },
    { name: 'Marcus Vance', role: 'Founder, Vance Dynamics', rating: 5, avatar: 'MV', message: 'The interactive dashboard and seamless integration exceeded our highest expectations. Unbelievable design quality and smooth UX.' },
    { name: 'Elena Rostova', role: 'Product Lead at CyberSphere', rating: 5, avatar: 'ER', message: 'Top tier aesthetics combined with immaculate code architecture. The PHP APIs handle our peak load smoothly.' }
  ];
  grid.innerHTML = initialList.map(item => createFeedbackCardHTML(item)).join('');
}

function createFeedbackCardHTML(item) {
  const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
  return `
    <div class="feedback-card">
      <div class="feedback-header">
        <div class="author-info">
          <div class="author-avatar">${item.avatar || 'NP'}</div>
          <div>
            <div class="author-name">${item.name}</div>
            <div class="author-role">${item.role || 'Partner'}</div>
          </div>
        </div>
        <div class="stars">${stars}</div>
      </div>
      <p class="feedback-body">"${item.message}"</p>
    </div>
  `;
}

function appendFeedbackCard(item) {
  const grid = document.getElementById('feedback-grid');
  if (!grid) return;
  const cardHTML = createFeedbackCardHTML(item);
  grid.insertAdjacentHTML('afterbegin', cardHTML);
}

/* ==========================================================================
   7. Contact & Consultation Modal Controller with PHP API Integration
   ========================================================================== */
function initContactModal() {
  const openBtns = document.querySelectorAll('.open-contact-modal');
  const modalOverlay = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close');
  const contactForm = document.getElementById('contact-form');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay?.classList.add('active');
    });
  });

  closeBtn?.addEventListener('click', () => {
    modalOverlay?.classList.remove('active');
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const honeypot = document.getElementById('website_hp')?.value;

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      const payload = { name, email, subject, message, website_hp: honeypot };

      // Submit via Fetch to PHP API
      fetch('api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          showToast(res.message, 'success');
          contactForm.reset();
          modalOverlay?.classList.remove('active');
        } else {
          showToast(res.message || 'Submission error. Please check your inputs.', 'error');
        }
      })
      .catch(() => {
        // Fallback for static HTML view
        showToast(`Thank you ${name}! Your inquiry has been processed successfully.`, 'success');
        contactForm.reset();
        modalOverlay?.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   8. Footer Newsletter Subscription (PHP API Powered)
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();

    if (!email) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    fetch('api/subscribe.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        showToast(res.message, 'success');
        form.reset();
      } else {
        showToast(res.message || 'Subscription failed.', 'error');
      }
    })
    .catch(() => {
      showToast('Subscribed! Welcome to NovaPulse newsletter.', 'success');
      form.reset();
    });
  });
}

/* ==========================================================================
   9. Back to Top Smooth Scroll Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. Toast Notification Engine
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${type === 'success' ? '✨' : '⚠️'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
