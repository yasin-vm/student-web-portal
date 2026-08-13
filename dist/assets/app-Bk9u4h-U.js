(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const d of i)if(d.type==="childList")for(const u of d.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function e(i){const d={};return i.integrity&&(d.integrity=i.integrity),i.referrerPolicy&&(d.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?d.credentials="include":i.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function o(i){if(i.ep)return;i.ep=!0;const d=e(i);fetch(i.href,d)}})();const $="student_portal_db_v2",w=[],g={getAll(){const t=localStorage.getItem($);if(t===null)return this.save(w),w;try{return JSON.parse(t)}catch(n){return console.error("Failed to parse student data, resetting to empty list",n),this.save(w),w}},save(t){localStorage.setItem($,JSON.stringify(t))},getByRoll(t){if(!t)return null;const n=String(t).padStart(2,"0");return this.getAll().find(o=>String(o.rollNumber).padStart(2,"0")===n)||null},getSubmitted(){return this.getAll().filter(t=>t.websiteSubmitted===!0)},getStats(){const t=this.getAll(),n=t.length,e=t.filter(d=>d.websiteSubmitted===!0).length,o=n-e,i=n>0?Math.round(e/n*100):0;return{total:n,submitted:e,pending:o,percentage:i}},addStudent(t){const n=this.getAll(),e=String(t.rollNumber).padStart(2,"0");if(n.some(d=>String(d.rollNumber).padStart(2,"0")===e))throw new Error(`Roll number ${e} already exists! Please use a unique roll number.`);const o=t.websiteSubmitted===!0,i={id:Date.now(),name:t.name,rollNumber:e,age:parseInt(t.age)||20,bloodGroup:t.bloodGroup||"O+",course:t.course,semester:t.semester,email:t.email,phone:t.phone,profileImage:t.profileImage||`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=4f46e5&color=fff`,websiteSubmitted:o,websiteTitle:o?t.websiteTitle||`${t.name}'s Web Project`:null,websiteDescription:o?t.websiteDescription||"Personal student project website.":null,submissionDate:o?t.submissionDate||new Date().toISOString().split("T")[0]:null,websitePath:o?t.websitePath||`submissions/${e}/index.html`:null};return n.push(i),this.save(n),i},updateStudent(t,n){const e=this.getAll(),o=String(t).padStart(2,"0"),i=e.findIndex(d=>String(d.rollNumber).padStart(2,"0")===o);if(i===-1)throw new Error(`Student with Roll No ${o} not found.`);return n.websiteSubmitted!==void 0&&(n.websiteSubmitted?(n.websitePath=n.websitePath||`submissions/${o}/index.html`,n.websiteTitle=n.websiteTitle||`${e[i].name}'s Web Project`,n.submissionDate=n.submissionDate||new Date().toISOString().split("T")[0]):(n.websitePath=null,n.websiteTitle=null,n.websiteDescription=null,n.submissionDate=null)),e[i]={...e[i],...n},this.save(e),e[i]},deleteStudent(t){let n=this.getAll();const e=String(t).padStart(2,"0");n=n.filter(o=>String(o.rollNumber).padStart(2,"0")!==e),this.save(n)},clearAll(){this.save([])},resetToDefaults(){return this.save(w),w}};function E(t,n="success"){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container",document.body.appendChild(e));const o=document.createElement("div");o.className=`toast toast-${n}`,o.innerHTML=`
    <span>${n==="success"?"✓":"ℹ️"}</span>
    <span>${t}</span>
  `,e.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100%)",setTimeout(()=>o.remove(),300)},4e3)}function N(){const t=document.querySelector(".mobile-menu-btn"),n=document.querySelector(".nav-links");t&&n&&t.addEventListener("click",()=>{n.classList.toggle("mobile-open")});const e=window.location.pathname.split("/").pop()||"index.html";document.querySelectorAll(".nav-link").forEach(o=>{const i=o.getAttribute("href");(i===e||e===""&&i==="index.html")&&o.classList.add("active")})}function x(t){const n=g.getByRoll(t);if(!n||!n.websiteSubmitted||!n.websitePath){E("No website submitted for this student.","error");return}window.open(n.websitePath,"_blank")}window.openStudentWebsite=x;function C(){const t=g.getStats(),n=document.getElementById("stat-total"),e=document.getElementById("stat-submitted"),o=document.getElementById("stat-pending"),i=document.getElementById("stat-rate");n&&(n.textContent=t.total),e&&(e.textContent=t.submitted),o&&(o.textContent=t.pending),i&&(i.textContent=`${t.percentage}%`);const d=document.getElementById("featured-students-grid");if(d){const p=g.getAll();if(p.length===0)d.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">👥</div>
          <h3>No Students Added Yet</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 0.5rem auto 1.25rem;">
            The student directory is currently empty. Go to the Admin Dashboard to add your first student record!
          </p>
          <a href="admin.html" class="btn btn-primary">➕ Add First Student</a>
        </div>
      `;else{const b=p.slice(0,4);d.innerHTML=b.map(l=>`
        <div class="student-card">
          <div class="card-header-banner">
            <div class="card-avatar-wrap">
              <img src="${l.profileImage}" alt="${l.name}" class="card-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=4f46e5&color=fff'">
            </div>
            <div class="card-status-badge">
              ${l.websiteSubmitted?`
                <span class="badge badge-submitted">
                  <span class="status-dot dot-green-pulse"></span> Submitted
                </span>
              `:`
                <span class="badge badge-null">
                  <span class="status-dot dot-gray"></span> NULL
                </span>
              `}
            </div>
          </div>
          <div class="card-body">
            <h3 class="student-name">${l.name}</h3>
            <span class="roll-tag">Roll No: ${l.rollNumber}</span>
            <div class="student-meta">
              <div class="meta-item"><span>🎓</span> <span>${l.course} (${l.semester})</span></div>
              <div class="meta-item"><span>📧</span> <span>${l.email}</span></div>
            </div>
            <div class="card-actions">
              <a href="profile.html?roll=${l.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
              ${l.websiteSubmitted?`
                <a href="${l.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
              `:`
                <span class="null-badge-btn">NULL</span>
              `}
            </div>
          </div>
        </div>
      `).join("")}}const u=document.getElementById("showcase-grid");if(u){const p=g.getSubmitted();if(p.length===0)u.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🚀</div>
          <h3>No Submitted Websites Yet</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0.5rem auto;">
            When students submit websites to <code>submissions/{rollNumber}/index.html</code>, their web design projects will automatically be showcased here!
          </p>
        </div>
      `;else{const b=p.slice(0,6);u.innerHTML=b.map(l=>`
        <div class="showcase-card">
          <div class="showcase-card-header">
            <img src="${l.profileImage}" alt="${l.name}" class="showcase-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=4f46e5&color=fff'">
            <div>
              <h4 class="showcase-student-name">${l.name}</h4>
              <span class="roll-tag">Roll No: ${l.rollNumber}</span>
            </div>
          </div>
          <div class="showcase-card-body">
            <h3 class="showcase-title">${l.websiteTitle||"Student Web Project"}</h3>
            <p class="showcase-desc">${l.websiteDescription||"Interactive web application submission."}</p>
          </div>
          <div class="showcase-card-footer">
            <span class="showcase-date">📅 ${l.submissionDate||"2026-08-10"}</span>
            <a href="${l.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              🚀 View Website
            </a>
          </div>
        </div>
      `).join("")}}}function P(){const t=document.getElementById("dir-search"),n=document.getElementById("dir-course"),e=document.getElementById("dir-semester"),o=document.getElementById("dir-status"),i=document.getElementById("dir-sort"),d=document.getElementById("directory-table-body"),u=document.getElementById("directory-empty-state"),p=document.getElementById("directory-count");let b=1;const l=12;function f(){let s=g.getAll();const r=t?t.value.trim().toLowerCase():"",m=n?n.value:"",a=e?e.value:"",h=o?o.value:"",v=i?i.value:"roll-asc";if(r&&(s=s.filter(c=>c.name.toLowerCase().includes(r)||String(c.rollNumber).toLowerCase().includes(r))),m&&(s=s.filter(c=>c.course.toLowerCase().includes(m.toLowerCase())||m===c.course)),a&&(s=s.filter(c=>c.semester===a)),h&&(h==="submitted"&&(s=s.filter(c=>c.websiteSubmitted===!0)),h==="null"&&(s=s.filter(c=>c.websiteSubmitted===!1))),s.sort((c,S)=>v==="roll-asc"?parseInt(c.rollNumber)-parseInt(S.rollNumber):v==="roll-desc"?parseInt(S.rollNumber)-parseInt(c.rollNumber):v==="name-asc"?c.name.localeCompare(S.name):v==="name-desc"?S.name.localeCompare(c.name):0),p&&(p.textContent=`Showing ${s.length} students`),s.length===0){d&&(d.innerHTML=""),u&&(u.style.display="block");return}u&&(u.style.display="none");const I=Math.ceil(s.length/l);b>I&&(b=1);const B=(b-1)*l,L=s.slice(B,B+l);d&&(d.innerHTML=L.map(c=>`
        <tr>
          <td>
            <div class="table-student-info">
              <img src="${c.profileImage}" alt="${c.name}" class="table-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=4f46e5&color=fff'">
              <div>
                <div class="table-student-name">${c.name}</div>
                <div class="table-student-email">${c.email}</div>
              </div>
            </div>
          </td>
          <td><span class="roll-tag">#${c.rollNumber}</span></td>
          <td><strong>${c.course}</strong></td>
          <td>${c.semester}</td>
          <td>
            ${c.websiteSubmitted?`
              <span class="badge badge-submitted">
                <span class="status-dot dot-green-pulse"></span> Submitted
              </span>
            `:`
              <span class="badge badge-null">
                <span class="status-dot dot-gray"></span> NULL
              </span>
            `}
          </td>
          <td>
            <div class="action-btns-group">
              <a href="profile.html?roll=${c.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
              ${c.websiteSubmitted?`
                <a href="${c.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
              `:`
                <span class="null-badge-text">NULL</span>
              `}
            </div>
          </td>
        </tr>
      `).join("")),y(I)}function y(s){const r=document.getElementById("directory-pagination");if(!r)return;if(s<=1){r.innerHTML="";return}let m="";for(let a=1;a<=s;a++)m+=`<button class="page-btn ${a===b?"active":""}" data-page="${a}">${a}</button>`;r.innerHTML=`
      <div class="pagination-wrap">
        <span style="font-size:0.9rem; color: var(--text-muted);">Page ${b} of ${s}</span>
        <div class="page-numbers">${m}</div>
      </div>
    `,r.querySelectorAll(".page-btn").forEach(a=>{a.addEventListener("click",h=>{b=parseInt(h.target.getAttribute("data-page")),f()})})}[t,n,e,o,i].forEach(s=>{s&&s.addEventListener("change",()=>{b=1,f()}),s&&s.tagName==="INPUT"&&s.addEventListener("input",()=>{b=1,f()})}),f()}function T(){const n=new URLSearchParams(window.location.search).get("roll")||"",e=g.getByRoll(n);if(!e){const I=document.getElementById("profile-content");I&&(I.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">❓</div>
          <h2>Student Not Found</h2>
          <p>No student record matches roll number "${n}".</p>
          <a href="students.html" class="btn btn-primary" style="margin-top: 1rem;">Back to Directory</a>
        </div>
      `);return}const o=document.getElementById("prof-avatar"),i=document.getElementById("prof-name"),d=document.getElementById("prof-roll"),u=document.getElementById("prof-course"),p=document.getElementById("prof-sem"),b=document.getElementById("prof-email"),l=document.getElementById("prof-phone"),f=document.getElementById("prof-age"),y=document.getElementById("prof-blood"),s=document.getElementById("prof-college"),r=document.getElementById("prof-bio"),m=document.getElementById("prof-project-box");o&&(o.src=e.profileImage,o.onerror=()=>o.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=4f46e5&color=fff`),i&&(i.textContent=e.name),d&&(d.textContent=`Roll No: ${e.rollNumber}`);const a=document.getElementById("prof-roll-val");a&&(a.textContent=`#${e.rollNumber}`),u&&(u.textContent=e.course);const h=document.getElementById("prof-course-val");h&&(h.textContent=e.course),p&&(p.textContent=e.semester);const v=document.getElementById("prof-sem-val");v&&(v.textContent=e.semester),b&&(b.textContent=e.email),l&&(l.textContent=e.phone),f&&(f.textContent=`${e.age} Years`),y&&(y.textContent=e.bloodGroup),s&&(s.textContent="Department of Computer Science & Engineering"),r&&(r.textContent=`${e.name} is a student pursuing ${e.course} currently in semester ${e.semester}.`),m&&(e.websiteSubmitted&&e.websitePath?m.innerHTML=`
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${e.websiteTitle||"Submitted Web Project"}</h3>
            <p style="color: var(--text-muted);">${e.websiteDescription||"Personal student project website."}</p>
            <span style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">Submitted on: ${e.submissionDate||"2026-08-10"}</span>
          </div>
          <a href="${e.websitePath}" target="_blank" rel="noopener" class="btn btn-primary">
            🚀 View Website (New Tab)
          </a>
        </div>
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Submission Preview Frame</h4>
          <iframe src="${e.websitePath}" class="project-preview-frame" title="Student Website Preview"></iframe>
        </div>
      `:m.innerHTML=`
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No website submitted yet.</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.25rem;">
            This student has not submitted a web development project yet. When extracted to <code>submissions/${e.rollNumber}/index.html</code>, the website link will automatically appear here.
          </p>
          <span class="badge badge-null" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Website Status: Not Submitted</span>
        </div>
      `)}function k(){const t=document.getElementById("admin-table-body"),n=document.getElementById("admin-search"),e=document.getElementById("admin-status-filter"),o=document.getElementById("modal-add-student"),i=document.getElementById("modal-edit-student");function d(){const s=g.getStats(),r=document.getElementById("adm-stat-total"),m=document.getElementById("adm-stat-sub"),a=document.getElementById("adm-stat-pend"),h=document.getElementById("adm-stat-rate");r&&(r.textContent=s.total),m&&(m.textContent=s.submitted),a&&(a.textContent=s.pending),h&&(h.textContent=`${s.percentage}%`)}function u(){let s=g.getAll();const r=n?n.value.trim().toLowerCase():"",m=e?e.value:"";r&&(s=s.filter(a=>a.name.toLowerCase().includes(r)||String(a.rollNumber).toLowerCase().includes(r))),m&&(m==="submitted"&&(s=s.filter(a=>a.websiteSubmitted===!0)),m==="null"&&(s=s.filter(a=>a.websiteSubmitted===!1))),t&&(s.length===0?t.innerHTML=`
          <tr>
            <td colspan="6" style="text-align: center; padding: 3rem 1rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
              <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 0.5rem;">No Student Records</h3>
              <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 1.25rem; font-size: 0.9rem;">
                The database is empty. Click <strong>➕ Add Student</strong> to create your first student record!
              </p>
            </td>
          </tr>
        `:t.innerHTML=s.map(a=>`
          <tr>
            <td>
              <div class="table-student-info">
                <img src="${a.profileImage}" alt="${a.name}" class="table-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=4f46e5&color=fff'">
                <div>
                  <div class="table-student-name">${a.name}</div>
                  <div class="table-student-email">${a.email}</div>
                </div>
              </div>
            </td>
            <td><span class="roll-tag">#${a.rollNumber}</span></td>
            <td>${a.course}</td>
            <td>${a.semester}</td>
            <td>
              ${a.websiteSubmitted?`
                <span class="badge badge-submitted">🟢 Submitted</span>
              `:`
                <span class="badge badge-null">⚪ Not Submitted</span>
              `}
            </td>
            <td>
              <div class="action-btns-group">
                <a href="profile.html?roll=${a.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
                ${a.websiteSubmitted?`
                  <a href="${a.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
                `:`
                  <span class="null-badge-text">Not Submitted</span>
                `}
                <button onclick="openEditModal('${a.rollNumber}')" class="btn btn-secondary btn-sm">Edit</button>
                <button onclick="deleteStudent('${a.rollNumber}')" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        `).join("")),d()}window.deleteStudent=s=>{confirm(`Are you sure you want to delete student Roll No #${s}?`)&&(g.deleteStudent(s),E(`Student #${s} deleted.`),u())},window.openEditModal=s=>{const r=g.getByRoll(s);if(!r)return;document.getElementById("edit-roll-hidden").value=r.rollNumber,document.getElementById("edit-roll-display").value=`#${r.rollNumber}`,document.getElementById("edit-name").value=r.name,document.getElementById("edit-course").value=r.course,document.getElementById("edit-sem").value=r.semester,document.getElementById("edit-email").value=r.email,document.getElementById("edit-phone").value=r.phone;const m=document.getElementById("edit-has-website"),a=document.getElementById("edit-website-fields");m.checked=r.websiteSubmitted===!0,a.style.display=m.checked?"grid":"none",document.getElementById("edit-web-title").value=r.websiteTitle||"",document.getElementById("edit-web-desc").value=r.websiteDescription||"",i.classList.add("active")};const p=document.getElementById("btn-open-add");p&&p.addEventListener("click",()=>{document.getElementById("form-add-student").reset(),document.getElementById("add-website-fields").style.display="none",o.classList.add("active")});const b=document.getElementById("add-has-website");b&&b.addEventListener("change",s=>{document.getElementById("add-website-fields").style.display=s.target.checked?"grid":"none"});const l=document.getElementById("edit-has-website");l&&l.addEventListener("change",s=>{document.getElementById("edit-website-fields").style.display=s.target.checked?"grid":"none"}),document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".modal-backdrop").forEach(r=>r.classList.remove("active"))})});const f=document.getElementById("form-add-student");f&&f.addEventListener("submit",s=>{s.preventDefault();try{const r=document.getElementById("add-roll").value.trim(),m=document.getElementById("add-has-website").checked,a={name:document.getElementById("add-name").value.trim(),rollNumber:r,course:document.getElementById("add-course").value,semester:document.getElementById("add-sem").value,age:parseInt(document.getElementById("add-age").value)||20,bloodGroup:document.getElementById("add-blood").value.trim()||"O+",email:document.getElementById("add-email").value.trim(),phone:document.getElementById("add-phone").value.trim(),websiteSubmitted:m,websiteTitle:document.getElementById("add-web-title").value.trim(),websiteDescription:document.getElementById("add-web-desc").value.trim()};g.addStudent(a),E(`Student #${a.rollNumber} added successfully!`),o.classList.remove("active"),f.reset(),u()}catch(r){E(r.message,"error")}});const y=document.getElementById("form-edit-student");y&&y.addEventListener("submit",s=>{s.preventDefault();try{const r=document.getElementById("edit-roll-hidden").value,m=document.getElementById("edit-has-website").checked;g.updateStudent(r,{name:document.getElementById("edit-name").value.trim(),course:document.getElementById("edit-course").value,semester:document.getElementById("edit-sem").value,email:document.getElementById("edit-email").value.trim(),phone:document.getElementById("edit-phone").value.trim(),websiteSubmitted:m,websiteTitle:document.getElementById("edit-web-title").value.trim(),websiteDescription:document.getElementById("edit-web-desc").value.trim()}),E(`Student #${r} updated successfully.`),i.classList.remove("active"),u()}catch(r){E(r.message,"error")}}),n&&n.addEventListener("input",u),e&&e.addEventListener("change",u),u()}document.addEventListener("DOMContentLoaded",()=>{localStorage.removeItem("student_portal_db_v1"),localStorage.getItem("student_portal_db_v2")||g.save([]),N();const t=window.location.pathname;t.endsWith("index.html")||t==="/"||t.endsWith("/")?C():t.endsWith("students.html")?P():t.endsWith("profile.html")?T():t.endsWith("admin.html")&&k()});
