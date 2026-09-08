/* ==========================================================================
   STUDENT WEB DESIGN PORTAL - MAIN APPLICATION CONTROLLER
   ========================================================================== */

import { StudentDB } from './students.js';

// --- Shared UI Helpers ---
export function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global Nav & Mobile Menu Setup
export function initNavigation() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Highlight active page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Open Submitted Website in new tab
export function openStudentWebsite(rollNumber) {
  const student = StudentDB.getByRoll(rollNumber);
  if (!student || !student.websiteSubmitted || !student.websitePath) {
    showToast('No website submitted for this student.', 'error');
    return;
  }
  window.open(student.websitePath, '_blank');
}

// Attach event listener to window
window.openStudentWebsite = openStudentWebsite;

// --- Home Page Controller ---
export function initHomePage() {
  const stats = StudentDB.getStats();
  
  // Render stats dynamically
  const statTotal = document.getElementById('stat-total');
  const statSubmitted = document.getElementById('stat-submitted');
  const statPending = document.getElementById('stat-pending');
  const statRate = document.getElementById('stat-rate');

  if (statTotal) statTotal.textContent = stats.total;
  if (statSubmitted) statSubmitted.textContent = stats.submitted;
  if (statPending) statPending.textContent = stats.pending;
  if (statRate) statRate.textContent = `${stats.percentage}%`;

  // Render Featured Students
  const featuredContainer = document.getElementById('featured-students-grid');
  if (featuredContainer) {
    const allStudents = StudentDB.getAll();

    if (allStudents.length === 0) {
      featuredContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">👥</div>
          <h3>No Students Added Yet</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 0.5rem auto 1.25rem;">
            The student directory is currently empty. Go to the Admin Dashboard to add your first student record!
          </p>
          <a href="admin.html" class="btn btn-primary">➕ Add First Student</a>
        </div>
      `;
    } else {
      const featured = allStudents.slice(0, 4);
      featuredContainer.innerHTML = featured.map(s => `
        <div class="student-card">
          <div class="card-header-banner">
            <div class="card-avatar-wrap">
              <img src="${s.profileImage}" alt="${s.name}" class="card-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=4f46e5&color=fff'">
            </div>
            <div class="card-status-badge">
              ${s.websiteSubmitted ? `
                <span class="badge badge-submitted">
                  <span class="status-dot dot-green-pulse"></span> Submitted
                </span>
              ` : `
                <span class="badge badge-null">
                  <span class="status-dot dot-gray"></span> NULL
                </span>
              `}
            </div>
          </div>
          <div class="card-body">
            <h3 class="student-name">${s.name}</h3>
            <span class="roll-tag">Roll No: ${s.rollNumber}</span>
            <div class="student-meta">
              <div class="meta-item"><span>🎓</span> <span>${s.course} (${s.semester})</span></div>
              <div class="meta-item"><span>📧</span> <span>${s.email}</span></div>
            </div>
            <div class="card-actions">
              <a href="profile.html?roll=${s.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
              ${s.websiteSubmitted ? `
                <a href="${s.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
              ` : `
                <span class="null-badge-btn">NULL</span>
              `}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Student Website Showcase section (submitted websites)
  const showcaseContainer = document.getElementById('showcase-grid');
  if (showcaseContainer) {
    const submittedStudents = StudentDB.getSubmitted();

    if (submittedStudents.length === 0) {
      showcaseContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🚀</div>
          <h3>No Submitted Websites Yet</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0.5rem auto;">
            When students submit websites to <code>submissions/{rollNumber}/index.html</code>, their web design projects will automatically be showcased here!
          </p>
        </div>
      `;
    } else {
      const showcaseItems = submittedStudents.slice(0, 6);
      showcaseContainer.innerHTML = showcaseItems.map(s => `
        <div class="showcase-card">
          <div class="showcase-card-header">
            <img src="${s.profileImage}" alt="${s.name}" class="showcase-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=4f46e5&color=fff'">
            <div>
              <h4 class="showcase-student-name">${s.name}</h4>
              <span class="roll-tag">Roll No: ${s.rollNumber}</span>
            </div>
          </div>
          <div class="showcase-card-body">
            <h3 class="showcase-title">${s.websiteTitle || 'Student Web Project'}</h3>
            <p class="showcase-desc">${s.websiteDescription || 'Interactive web application submission.'}</p>
          </div>
          <div class="showcase-card-footer">
            <span class="showcase-date">📅 ${s.submissionDate || '2026-08-10'}</span>
            <a href="${s.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              🚀 View Website
            </a>
          </div>
        </div>
      `).join('');
    }
  }
}

// --- Directory Page Controller ---
export function initDirectoryPage() {
  const searchInput = document.getElementById('dir-search');
  const courseFilter = document.getElementById('dir-course');
  const semesterFilter = document.getElementById('dir-semester');
  const statusFilter = document.getElementById('dir-status');
  const bloodFilter = document.getElementById('dir-blood');
  const sortSelect = document.getElementById('dir-sort');
  const tableBody = document.getElementById('directory-table-body');
  const emptyState = document.getElementById('directory-empty-state');
  const countText = document.getElementById('directory-count');

  let currentPage = 1;
  const itemsPerPage = 12;

  function renderDirectory() {
    let students = StudentDB.getAll();

    // Filters
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const courseVal = courseFilter ? courseFilter.value : '';
    const semVal = semesterFilter ? semesterFilter.value : '';
    const statusVal = statusFilter ? statusFilter.value : '';
    const bloodVal = bloodFilter ? bloodFilter.value : '';
    const sortVal = sortSelect ? sortSelect.value : 'roll-asc';

    if (query) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(query) || 
        String(s.rollNumber).toLowerCase().includes(query)
      );
    }
    if (courseVal) students = students.filter(s => s.course.toLowerCase().includes(courseVal.toLowerCase()) || courseVal === s.course);
    if (semVal) students = students.filter(s => s.semester === semVal);
    if (statusVal) {
      if (statusVal === 'submitted') students = students.filter(s => s.websiteSubmitted === true);
      if (statusVal === 'null') students = students.filter(s => s.websiteSubmitted === false);
    }
    if (bloodVal) students = students.filter(s => s.bloodGroup === bloodVal);

    // Sort
    students.sort((a, b) => {
      if (sortVal === 'roll-asc') return parseInt(a.rollNumber) - parseInt(b.rollNumber);
      if (sortVal === 'roll-desc') return parseInt(b.rollNumber) - parseInt(a.rollNumber);
      if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
      if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    if (countText) countText.textContent = `Showing ${students.length} students`;

    if (students.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Pagination
    const totalPages = Math.ceil(students.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;
    const start = (currentPage - 1) * itemsPerPage;
    const pageStudents = students.slice(start, start + itemsPerPage);

    if (tableBody) {
      tableBody.innerHTML = pageStudents.map(s => `
        <tr>
          <td>
            <div class="table-student-info">
              <img src="${s.profileImage}" alt="${s.name}" class="table-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=4f46e5&color=fff'">
              <div>
                <div class="table-student-name">${s.name}</div>
                <div class="table-student-email">${s.email}</div>
              </div>
            </div>
          </td>
          <td><span class="roll-tag">#${s.rollNumber}</span></td>
          <td><strong>${s.course}</strong></td>
          <td>${s.semester}</td>
          <td>
            ${s.websiteSubmitted ? `
              <span class="badge badge-submitted">
                <span class="status-dot dot-green-pulse"></span> Submitted
              </span>
            ` : `
              <span class="badge badge-null">
                <span class="status-dot dot-gray"></span> NULL
              </span>
            `}
          </td>
          <td>
            <div class="action-btns-group">
              <a href="profile.html?roll=${s.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
              ${s.websiteSubmitted ? `
                <a href="${s.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
              ` : `
                <span class="null-badge-text">NULL</span>
              `}
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const wrap = document.getElementById('directory-pagination');
    if (!wrap) return;

    if (totalPages <= 1) {
      wrap.innerHTML = '';
      return;
    }

    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
      buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    wrap.innerHTML = `
      <div class="pagination-wrap">
        <span style="font-size:0.9rem; color: var(--text-muted);">Page ${currentPage} of ${totalPages}</span>
        <div class="page-numbers">${buttons}</div>
      </div>
    `;

    wrap.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentPage = parseInt(e.target.getAttribute('data-page'));
        renderDirectory();
      });
    });
  }

  [searchInput, courseFilter, semesterFilter, statusFilter, bloodFilter, sortSelect].forEach(el => {
    if (el) el.addEventListener('change', () => { currentPage = 1; renderDirectory(); });
    if (el && el.tagName === 'INPUT') el.addEventListener('input', () => { currentPage = 1; renderDirectory(); });
  });

  renderDirectory();
}

// --- Profile Page Controller ---
export function initProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const rollParam = urlParams.get('roll') || '';

  const student = StudentDB.getByRoll(rollParam);

  if (!student) {
    const container = document.getElementById('profile-content');
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">❓</div>
          <h2>Student Not Found</h2>
          <p>No student record matches roll number "${rollParam}".</p>
          <a href="students.html" class="btn btn-primary" style="margin-top: 1rem;">Back to Directory</a>
        </div>
      `;
    }
    return;
  }

  // Populate Student Profile Details
  const avatarEl = document.getElementById('prof-avatar');
  const nameEl = document.getElementById('prof-name');
  const rollEl = document.getElementById('prof-roll');
  const courseEl = document.getElementById('prof-course');
  const semEl = document.getElementById('prof-sem');
  const emailEl = document.getElementById('prof-email');
  const phoneEl = document.getElementById('prof-phone');
  const ageEl = document.getElementById('prof-age');
  const bloodEl = document.getElementById('prof-blood');
  const cgpaEl = document.getElementById('prof-cgpa');
  const internalMarksEl = document.getElementById('prof-internal-marks');
  const extracurricularEl = document.getElementById('prof-extracurricular');
  const collegeEl = document.getElementById('prof-college');
  const bioEl = document.getElementById('prof-bio');
  const projectBox = document.getElementById('prof-project-box');

  if (avatarEl) {
    avatarEl.src = student.profileImage;
    avatarEl.onerror = () => avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4f46e5&color=fff`;
  }
  if (nameEl) nameEl.textContent = student.name;
  if (rollEl) rollEl.textContent = `Roll No: ${student.rollNumber}`;
  const rollValEl = document.getElementById('prof-roll-val');
  if (rollValEl) rollValEl.textContent = `#${student.rollNumber}`;
  if (courseEl) courseEl.textContent = student.course;
  const courseValEl = document.getElementById('prof-course-val');
  if (courseValEl) courseValEl.textContent = student.course;
  if (semEl) semEl.textContent = student.semester;
  const semValEl = document.getElementById('prof-sem-val');
  if (semValEl) semValEl.textContent = student.semester;
  if (emailEl) emailEl.textContent = student.email;
  if (phoneEl) phoneEl.textContent = student.phone;
  if (ageEl) ageEl.textContent = `${student.age} Years`;
  if (bloodEl) bloodEl.textContent = student.bloodGroup;
  if (cgpaEl) cgpaEl.textContent = student.cgpa || 'Not provided';
  if (internalMarksEl) internalMarksEl.textContent = student.internalMarks || 'Not provided';
  if (extracurricularEl) extracurricularEl.textContent = student.extracurricular || 'Not provided';
  if (collegeEl) collegeEl.textContent = "Department of Computer Science & Engineering";
  if (bioEl) bioEl.textContent = `${student.name} is a student pursuing ${student.course} currently in semester ${student.semester}.`;

  if (projectBox) {
    if (student.websiteSubmitted && student.websitePath) {
      projectBox.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${student.websiteTitle || 'Submitted Web Project'}</h3>
            <p style="color: var(--text-muted);">${student.websiteDescription || 'Personal student project website.'}</p>
            <span style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">Submitted on: ${student.submissionDate || '2026-08-10'}</span>
          </div>
          <a href="${student.websitePath}" target="_blank" rel="noopener" class="btn btn-primary">
            🚀 View Website (New Tab)
          </a>
        </div>
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Submission Preview Frame</h4>
          <iframe src="${student.websitePath}" class="project-preview-frame" title="Student Website Preview"></iframe>
        </div>
      `;
    } else {
      projectBox.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No website submitted yet.</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.25rem;">
            This student has not submitted a web development project yet. When extracted to <code>submissions/${student.rollNumber}/index.html</code>, the website link will automatically appear here.
          </p>
          <span class="badge badge-null" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Website Status: Not Submitted</span>
        </div>
      `;
    }
  }
}

// --- Admin Dashboard Controller ---
export function initAdminPage() {
  const tableBody = document.getElementById('admin-table-body');
  const searchInput = document.getElementById('admin-search');
  const statusFilter = document.getElementById('admin-status-filter');

  const addModal = document.getElementById('modal-add-student');
  const editModal = document.getElementById('modal-edit-student');

  function updateAdminStats() {
    const stats = StudentDB.getStats();
    const tEl = document.getElementById('adm-stat-total');
    const sEl = document.getElementById('adm-stat-sub');
    const pEl = document.getElementById('adm-stat-pend');
    const rEl = document.getElementById('adm-stat-rate');

    if (tEl) tEl.textContent = stats.total;
    if (sEl) sEl.textContent = stats.submitted;
    if (pEl) pEl.textContent = stats.pending;
    if (rEl) rEl.textContent = `${stats.percentage}%`;
  }

  function renderAdminTable() {
    let students = StudentDB.getAll();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const statusVal = statusFilter ? statusFilter.value : '';

    if (query) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(query) || 
        String(s.rollNumber).toLowerCase().includes(query)
      );
    }
    if (statusVal) {
      if (statusVal === 'submitted') students = students.filter(s => s.websiteSubmitted === true);
      if (statusVal === 'null') students = students.filter(s => s.websiteSubmitted === false);
    }

    if (tableBody) {
      if (students.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 3rem 1rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
              <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 0.5rem;">No Student Records</h3>
              <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 1.25rem; font-size: 0.9rem;">
                The database is empty. Click <strong>➕ Add Student</strong> to create your first student record!
              </p>
            </td>
          </tr>
        `;
      } else {
        tableBody.innerHTML = students.map(s => `
          <tr>
            <td>
              <div class="table-student-info">
                <img src="${s.profileImage}" alt="${s.name}" class="table-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=4f46e5&color=fff'">
                <div>
                  <div class="table-student-name">${s.name}</div>
                  <div class="table-student-email">${s.email}</div>
                </div>
              </div>
            </td>
            <td><span class="roll-tag">#${s.rollNumber}</span></td>
            <td>${s.course}</td>
            <td>${s.semester}</td>
            <td>
              ${s.websiteSubmitted ? `
                <span class="badge badge-submitted">🟢 Submitted</span>
              ` : `
                <span class="badge badge-null">⚪ Not Submitted</span>
              `}
            </td>
            <td>
              <div class="action-btns-group">
                <a href="profile.html?roll=${s.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
                ${s.websiteSubmitted ? `
                  <a href="${s.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
                ` : `
                  <span class="null-badge-text">Not Submitted</span>
                `}
                <button onclick="openEditModal('${s.rollNumber}')" class="btn btn-secondary btn-sm">Edit</button>
                <button onclick="deleteStudent('${s.rollNumber}')" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }

    updateAdminStats();
  }

  // Window action bindings for Table row action buttons
  window.deleteStudent = (roll) => {
    if (confirm(`Are you sure you want to delete student Roll No #${roll}?`)) {
      StudentDB.deleteStudent(roll);
      showToast(`Student #${roll} deleted.`);
      renderAdminTable();
    }
  };

  window.openEditModal = (roll) => {
    const student = StudentDB.getByRoll(roll);
    if (!student) return;

    document.getElementById('edit-roll-hidden').value = student.rollNumber;
    document.getElementById('edit-roll-display').value = `#${student.rollNumber}`;
    document.getElementById('edit-name').value = student.name;
    document.getElementById('edit-course').value = student.course;
    document.getElementById('edit-sem').value = student.semester;
    document.getElementById('edit-email').value = student.email;
    document.getElementById('edit-phone').value = student.phone;

    const hasWebCheck = document.getElementById('edit-has-website');
    const webFields = document.getElementById('edit-website-fields');

    hasWebCheck.checked = student.websiteSubmitted === true;
    webFields.style.display = hasWebCheck.checked ? 'grid' : 'none';
    document.getElementById('edit-web-title').value = student.websiteTitle || '';
    document.getElementById('edit-web-desc').value = student.websiteDescription || '';

    editModal.classList.add('active');
  };

  // Open Add Student Modal
  const openAddBtn = document.getElementById('btn-open-add');
  if (openAddBtn) {
    openAddBtn.addEventListener('click', () => {
      document.getElementById('form-add-student').reset();
      document.getElementById('add-website-fields').style.display = 'none';
      addModal.classList.add('active');
    });
  }

  // Toggle website fields in Add/Edit modals
  const addWebCheck = document.getElementById('add-has-website');
  if (addWebCheck) {
    addWebCheck.addEventListener('change', (e) => {
      document.getElementById('add-website-fields').style.display = e.target.checked ? 'grid' : 'none';
    });
  }
  const editWebCheck = document.getElementById('edit-has-website');
  if (editWebCheck) {
    editWebCheck.addEventListener('change', (e) => {
      document.getElementById('edit-website-fields').style.display = e.target.checked ? 'grid' : 'none';
    });
  }

  // Close Modal handlers
  document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    });
  });

  // Handle Add Student Submit
  const addForm = document.getElementById('form-add-student');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const rollVal = document.getElementById('add-roll').value.trim();
        const hasWeb = document.getElementById('add-has-website').checked;

        const newStudent = {
          name: document.getElementById('add-name').value.trim(),
          rollNumber: rollVal,
          course: document.getElementById('add-course').value,
          semester: document.getElementById('add-sem').value,
          age: parseInt(document.getElementById('add-age').value) || 20,
          bloodGroup: document.getElementById('add-blood').value.trim() || 'O+',
          email: document.getElementById('add-email').value.trim(),
          phone: document.getElementById('add-phone').value.trim(),
          websiteSubmitted: hasWeb,
          websiteTitle: document.getElementById('add-web-title').value.trim(),
          websiteDescription: document.getElementById('add-web-desc').value.trim()
        };

        StudentDB.addStudent(newStudent);
        showToast(`Student #${newStudent.rollNumber} added successfully!`);
        addModal.classList.remove('active');
        addForm.reset();
        renderAdminTable();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Handle Edit Student Submit
  const editForm = document.getElementById('form-edit-student');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const roll = document.getElementById('edit-roll-hidden').value;
        const hasWeb = document.getElementById('edit-has-website').checked;

        StudentDB.updateStudent(roll, {
          name: document.getElementById('edit-name').value.trim(),
          course: document.getElementById('edit-course').value,
          semester: document.getElementById('edit-sem').value,
          email: document.getElementById('edit-email').value.trim(),
          phone: document.getElementById('edit-phone').value.trim(),
          websiteSubmitted: hasWeb,
          websiteTitle: document.getElementById('edit-web-title').value.trim(),
          websiteDescription: document.getElementById('edit-web-desc').value.trim()
        });

        showToast(`Student #${roll} updated successfully.`);
        editModal.classList.remove('active');
        renderAdminTable();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', renderAdminTable);
  if (statusFilter) statusFilter.addEventListener('change', renderAdminTable);

  renderAdminTable();
}

// Global Auto-Init based on current page
document.addEventListener('DOMContentLoaded', () => {
  // Ignore legacy browser-only data so the committed roster is used.
  localStorage.removeItem('student_portal_db_v1');
  localStorage.removeItem('student_portal_db_v2');
  localStorage.removeItem('student_portal_db_v3');

  initNavigation();

  const path = window.location.pathname;
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
    initHomePage();
  } else if (path.endsWith('students.html')) {
    initDirectoryPage();
  } else if (path.endsWith('profile.html')) {
    initProfilePage();
  } else if (path.endsWith('admin.html')) {
    initAdminPage();
  }
});
