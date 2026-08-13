<?php
/**
 * NovaPulse - Next-Gen Web Platform & Tech Agency Template
 * Server-side PHP script rendering dynamic header, CSRF security tokens, and visitor stats.
 */

session_start();

// Generate CSRF Token for Forms
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf_token'];

// Simple Visitor Counter Logic in PHP
$counterFile = __DIR__ . '/data/visitor_count.txt';
$visitorCount = 12480;

if (file_exists($counterFile)) {
    $visitorCount = (int)file_get_contents($counterFile) + 1;
} else {
    if (!is_dir(__DIR__ . '/data')) {
        mkdir(__DIR__ . '/data', 0777, true);
    }
}
file_put_contents($counterFile, (string)$visitorCount);

// Dynamic Current Year & Date
$currentYear = date('Y');
$serverTimeFormatted = date('M d, Y H:i T');
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="NovaPulse - Next-Gen Tech & Creative Digital Platform powered by AI, HTML5, CSS3, JS, and PHP APIs.">
  <meta name="keywords" content="Web Development, PHP API, Modern UI, Glassmorphism, AI Solutions, SaaS Dashboard">
  <meta name="author" content="NovaPulse Engineering">

  <title>NovaPulse | Next-Gen Digital Platform & SaaS Solutions</title>

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">

  <!-- Core Stylesheet -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

  <!-- Background Particle Network Canvas -->
  <canvas id="particles-canvas"></canvas>

  <!-- Top Navigation Bar -->
  <header class="navbar">
    <div class="container nav-container">
      <a href="#" class="nav-logo">
        <div class="nav-logo-icon">⚡</div>
        <span>Nova<span class="text-gradient">Pulse</span></span>
      </a>

      <ul class="nav-links" id="nav-links">
        <li><a href="#hero" class="nav-link active">Home</a></li>
        <li><a href="#services" class="nav-link">Services</a></li>
        <li><a href="#portfolio" class="nav-link">Portfolio</a></li>
        <li><a href="#feedback" class="nav-link">Community</a></li>
        <li><a href="#contact" class="nav-link open-contact-modal">Contact</a></li>
      </ul>

      <div class="nav-actions">
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Theme">☀️</button>
        <a href="#contact" class="btn btn-primary btn-sm open-contact-modal">Get Started</a>
        <button class="mobile-toggle" id="mobile-toggle" aria-label="Toggle Navigation Menu">☰</button>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="section-badge">
              <span>🚀 Powered by HTML, CSS, JS & PHP Backend APIs</span>
            </div>
            <h1>Architecting <span class="text-gradient">Future-Ready</span> Digital Experiences</h1>
            <p class="hero-description">
              We craft ultra-responsive web applications, AI-driven SaaS dashboards, and high-throughput PHP backend systems designed to wow your users.
            </p>
            <div class="hero-cta">
              <a href="#portfolio" class="btn btn-primary">Explore Portfolio &rarr;</a>
              <a href="#contact" class="btn btn-secondary open-contact-modal">Schedule Consultation</a>
            </div>

            <!-- Dynamic Stats Bar -->
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number" data-target="99" data-suffix="%">0%</span>
                <span class="stat-label">Client Satisfaction</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" data-target="150" data-suffix="+">0+</span>
                <span class="stat-label">Deployments</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" data-target="<?php echo $visitorCount; ?>" data-suffix="">0</span>
                <span class="stat-label">Live Visitors Tracked</span>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-image-wrapper">
              <img src="images/hero.png" alt="NovaPulse Digital Architecture Platform">
            </div>
            <div class="floating-badge badge-top-right">
              <div class="badge-icon">⚡</div>
              <div>
                <strong style="display:block; font-size:0.9rem;">Ultra Fast</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">PHP REST Engine</span>
              </div>
            </div>
            <div class="floating-badge badge-bottom-left">
              <div class="badge-icon" style="background:var(--gradient-accent);">💎</div>
              <div>
                <strong style="display:block; font-size:0.9rem;">Glassmorphism</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">Modern CSS Token System</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services / Solutions Section -->
    <section id="services" class="section-padding bg-alt">
      <div class="container">
        <div class="text-center">
          <div class="section-badge">Solutions</div>
          <h2 class="section-title">Engineered For <span class="text-gradient">Maximum Impact</span></h2>
          <p class="section-subtitle">Combining cutting-edge frontend interfaces with resilient PHP API services for scalable growth.</p>
        </div>

        <div class="features-grid">
          <div class="card">
            <div class="card-icon">🧠</div>
            <h3 class="card-title">AI & Data Analytics</h3>
            <p class="card-text">Custom predictive algorithms, real-time metrics dashboards, and automated data pipelines tuned for high performance.</p>
          </div>
          <div class="card">
            <div class="card-icon">💻</div>
            <h3 class="card-title">Modern Web Development</h3>
            <p class="card-text">Pixel-perfect, accessible HTML5/CSS3 layouts featuring smooth micro-animations, glassmorphism, and instant loading speeds.</p>
          </div>
          <div class="card">
            <div class="card-icon">⚙️</div>
            <h3 class="card-title">PHP REST API Backends</h3>
            <p class="card-text">Secure, lightweight PHP endpoints handling user data, asynchronous AJAX processing, input sanitization, and JSON persistence.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio & Projects Section -->
    <section id="portfolio" class="section-padding">
      <div class="container">
        <div class="text-center">
          <div class="section-badge">Showcase</div>
          <h2 class="section-title">Featured <span class="text-gradient-alt">Projects</span></h2>
          <p class="section-subtitle">Explore our latest web applications, SaaS dashboards, and AI portals.</p>
        </div>

        <div class="portfolio-controls">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="project-search" placeholder="Search projects by keyword, tech, or title..." aria-label="Search Projects">
          </div>

          <div class="filter-tabs">
            <button class="tab-btn active" data-category="all">All Projects</button>
            <button class="tab-btn" data-category="ai">AI Platforms</button>
            <button class="tab-btn" data-category="saas">SaaS Apps</button>
            <button class="tab-btn" data-category="web">Web Applications</button>
            <button class="tab-btn" data-category="mobile">Mobile Systems</button>
          </div>
        </div>

        <div id="portfolio-grid" class="portfolio-grid">
          <!-- Dynamic JavaScript rendering target -->
        </div>
      </div>
    </section>

    <!-- Community Feedback Wall (PHP API Powered) -->
    <section id="feedback" class="section-padding bg-alt feedback-section">
      <div class="container">
        <div class="text-center">
          <div class="section-badge">Community Wall</div>
          <h2 class="section-title">What Clients Say <span class="text-gradient">About Us</span></h2>
          <p class="section-subtitle">Real feedback submitted asynchronously via our live PHP backend API.</p>
        </div>

        <div id="feedback-grid" class="feedback-grid">
          <!-- Dynamic PHP/JS Render target -->
        </div>

        <!-- Add Feedback Form Card -->
        <div class="add-feedback-card">
          <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem; text-align: center;">Leave Your Feedback</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; text-align: center; margin-bottom: 1.5rem;">Submit your review directly to our live PHP backend endpoint.</p>

          <form id="feedback-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label for="fb-name" class="form-label">Your Name</label>
                <input type="text" id="fb-name" class="form-input" placeholder="e.g. Alex Mercer" required>
              </div>
              <div class="form-group">
                <label for="fb-role" class="form-label">Role / Organization</label>
                <input type="text" id="fb-role" class="form-input" placeholder="e.g. Director at NovaCorp">
              </div>
            </div>

            <div class="form-group">
              <label for="fb-rating" class="form-label">Rating</label>
              <select id="fb-rating" class="form-select">
                <option value="5">⭐⭐⭐⭐⭐ (5/5 Stars - Outstanding)</option>
                <option value="4">⭐⭐⭐⭐ (4/5 Stars - Great)</option>
                <option value="3">⭐⭐⭐ (3/5 Stars - Good)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="fb-message" class="form-label">Review / Message</label>
              <textarea id="fb-message" class="form-textarea" placeholder="Share your experience working with NovaPulse..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Review to PHP API</button>
          </form>
        </div>
      </div>
    </section>
  </main>

  <!-- Contact Modal -->
  <div id="contact-modal" class="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="modal-content">
      <button id="modal-close" class="modal-close" aria-label="Close Modal">✕</button>
      <h2 id="modal-title" style="font-size: 1.8rem; margin-bottom: 0.5rem;">Start Your Project</h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
        Fill out the consultation form below. Handled asynchronously by <code>api/contact.php</code>.
      </p>

      <form id="contact-form">
        <!-- Anti-spam Honeypot -->
        <input type="text" name="website_hp" id="website_hp" class="hp-field" tabindex="-1" autocomplete="off">
        <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">

        <div class="form-group">
          <label for="contact-name" class="form-label">Full Name</label>
          <input type="text" id="contact-name" class="form-input" placeholder="John Doe" required>
        </div>

        <div class="form-group">
          <label for="contact-email" class="form-label">Email Address</label>
          <input type="email" id="contact-email" class="form-input" placeholder="john@example.com" required>
        </div>

        <div class="form-group">
          <label for="contact-subject" class="form-label">Project Type</label>
          <select id="contact-subject" class="form-select">
            <option value="Custom Web App">Custom Web Application</option>
            <option value="PHP Backend & API">PHP Backend & API Development</option>
            <option value="SaaS Platform">SaaS Dashboard & Analytics</option>
            <option value="UI/UX Redesign">UI/UX Modernization</option>
          </select>
        </div>

        <div class="form-group">
          <label for="contact-message" class="form-label">Project Details</label>
          <textarea id="contact-message" class="form-textarea" placeholder="Tell us about your objectives, scope, and timeline..." required></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Consultation Request</button>
      </form>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="nav-logo" style="margin-bottom: 0.5rem;">
            <div class="nav-logo-icon">⚡</div>
            <span>Nova<span class="text-gradient">Pulse</span></span>
          </a>
          <p>Next-generation digital experiences built with HTML5, CSS3, JavaScript, and PHP.</p>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Server Time: <?php echo $serverTimeFormatted; ?>
          </div>
        </div>

        <div>
          <h4 class="footer-title">Navigation</h4>
          <ul class="footer-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#feedback">Community Wall</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Technology</h4>
          <ul class="footer-links">
            <li><a href="#">HTML5 / Semantic Web</a></li>
            <li><a href="#">Vanilla CSS3 Tokens</a></li>
            <li><a href="#">JavaScript ES6+ Canvas</a></li>
            <li><a href="#">PHP 8+ Asynchronous APIs</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">Newsletter</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">Subscribe for updates powered by <code>api/subscribe.php</code>.</p>
          <form id="newsletter-form" class="newsletter-form">
            <input type="email" placeholder="Enter your email..." required aria-label="Newsletter Email">
            <button type="submit" class="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; <?php echo $currentYear; ?> NovaPulse Platform. All rights reserved.</div>
        <div style="display: flex; gap: 1.5rem;">
          <a href="#" style="color: var(--text-muted); text-decoration: none;">Privacy Policy</a>
          <a href="#" style="color: var(--text-muted); text-decoration: none;">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Back to Top Button -->
  <button id="back-to-top" class="back-to-top" aria-label="Back to top">↑</button>

  <!-- Core JavaScript -->
  <script src="js/main.js"></script>
</body>
</html>
