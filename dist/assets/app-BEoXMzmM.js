(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function e(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(a){if(a.ep)return;a.ep=!0;const c=e(a);fetch(a.href,c)}})();const $="student_portal_db_v5",H=["ABHIRAM ANIL P.A","ADWAITH K","AKASH P S","AMEGHA S","ANANDU M","ANANYA MOHAN N","ANJANA K","ANJANA RAJ R","ANJITHA V","ATHUL K SANDEEP","ATHUL RAJ","FATHIMA RIZA ERSHAD","FATHIMA SABA M","FATHIMATH SAHDIYA C","FATHIMATH SHIFANA T V","FATHIMATHU SUHADHA K V","FATHIMA ZIYA","FIDHA FATHIMA T","GOPIKA T K","HREDYA M","HRIDUSH PRAKASH","JEROME JIMMY","KENZAH RAFFY K","KRISHNA SAJEEVAN","MARJANA K P","MISHAL MAJEED K V","MOHAMMED AZEEM SAMBRATH","MUHAMMAD NIHAL","MUHAMMED FINAS NOUFAL A P","MUHAMMED MAZIN K P","MUHAMMED THAHA K T","MUHAMMED ZAID O V","N LIYA RAZAK","RAYA FATHIMA","RISNA RAFEEQ B M","RIYA P P","RIZA MEHAK","ROSHNI K","SABAH SHAMEER","SANKEERTHANA P","SAYANAND M P","SAYAND A N","SAYYIDHA SHERIN K","SHIJAS SHABEER K P","SHIVADHA R","SHYAMJITH M","SOUMMYAKEERTHI K S","SWETHA V","YADHU SAGAR N","YADU DEV M","YASHIKA PRASANTH","YASIN V M","ZAID IBNU ABDUL GAFOOR","MARIYAM P","AKASH P M","AKSHARA K M","ANJANA K","ANUSREE PRAKASHAN","ASRITHA S NATH"],E=H.map((t,n)=>{const e=String(n+1).padStart(2,"0"),o=e==="52";return{id:n+1,name:t,rollNumber:e,age:20,bloodGroup:"",cgpa:"",internalMarks:"",extracurricular:"",course:"B.Tech Computer Science",semester:"S7",email:"",phone:"",profileImage:`https://ui-avatars.com/api/?name=${encodeURIComponent(t)}&background=4f46e5&color=fff`,websiteSubmitted:o,websiteTitle:o?"Yasin V M | Student Profile":`${t}'s Web Project`,websiteDescription:o?"HTML, CSS, and JavaScript student profile assignment.":"Student web development assignment.",submissionDate:o?"2026-09-08":null,websitePath:`submissions/${e}/index.html`}}),f={getAll(){const t=localStorage.getItem($);if(t===null)return this.save(E),E;try{const n=JSON.parse(t),e=n.find(o=>String(o.rollNumber).padStart(2,"0")==="53");return e!=null&&e.websiteSubmitted&&(e.websiteSubmitted=!1,e.websiteTitle=null,e.websiteDescription=null,e.submissionDate=null,e.websitePath=null,this.save(n)),n}catch(n){return console.error("Failed to parse student data, resetting to empty list",n),this.save(E),E}},save(t){localStorage.setItem($,JSON.stringify(t))},getByRoll(t){if(!t)return null;const n=String(t).padStart(2,"0");return this.getAll().find(o=>String(o.rollNumber).padStart(2,"0")===n)||null},getSubmitted(){return this.getAll().filter(t=>t.websiteSubmitted===!0)},getStats(){const t=this.getAll(),n=t.length,e=t.filter(c=>c.websiteSubmitted===!0).length,o=n-e,a=n>0?Math.round(e/n*100):0;return{total:n,submitted:e,pending:o,percentage:a}},addStudent(t){const n=this.getAll(),e=String(t.rollNumber).padStart(2,"0");if(n.some(c=>String(c.rollNumber).padStart(2,"0")===e))throw new Error(`Roll number ${e} already exists! Please use a unique roll number.`);const o=t.websiteSubmitted===!0,a={id:Date.now(),name:t.name,rollNumber:e,age:parseInt(t.age)||20,bloodGroup:t.bloodGroup||"O+",cgpa:t.cgpa||"",internalMarks:t.internalMarks||"",extracurricular:t.extracurricular||"",course:t.course,semester:t.semester,email:t.email,phone:t.phone,profileImage:t.profileImage||`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=4f46e5&color=fff`,websiteSubmitted:o,websiteTitle:o?t.websiteTitle||`${t.name}'s Web Project`:null,websiteDescription:o?t.websiteDescription||"Personal student project website.":null,submissionDate:o?t.submissionDate||new Date().toISOString().split("T")[0]:null,websitePath:o?t.websitePath||`submissions/${e}/index.html`:null};return n.push(a),this.save(n),a},updateStudent(t,n){const e=this.getAll(),o=String(t).padStart(2,"0"),a=e.findIndex(c=>String(c.rollNumber).padStart(2,"0")===o);if(a===-1)throw new Error(`Student with Roll No ${o} not found.`);return n.websiteSubmitted!==void 0&&(n.websiteSubmitted?(n.websitePath=n.websitePath||`submissions/${o}/index.html`,n.websiteTitle=n.websiteTitle||`${e[a].name}'s Web Project`,n.submissionDate=n.submissionDate||new Date().toISOString().split("T")[0]):(n.websitePath=null,n.websiteTitle=null,n.websiteDescription=null,n.submissionDate=null)),e[a]={...e[a],...n},this.save(e),e[a]},deleteStudent(t){let n=this.getAll();const e=String(t).padStart(2,"0");n=n.filter(o=>String(o.rollNumber).padStart(2,"0")!==e),this.save(n)},clearAll(){this.save([])},resetToDefaults(){return this.save(E),E}};function S(t,n="success"){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container",document.body.appendChild(e));const o=document.createElement("div");o.className=`toast toast-${n}`,o.innerHTML=`
    <span>${n==="success"?"✓":"ℹ️"}</span>
    <span>${t}</span>
  `,e.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100%)",setTimeout(()=>o.remove(),300)},4e3)}function T(){const t=document.querySelector(".mobile-menu-btn"),n=document.querySelector(".nav-links");t&&n&&t.addEventListener("click",()=>{n.classList.toggle("mobile-open")});const e=window.location.pathname.split("/").pop()||"index.html";document.querySelectorAll(".nav-link").forEach(o=>{const a=o.getAttribute("href");(a===e||e===""&&a==="index.html")&&o.classList.add("active")})}function L(t){const n=f.getByRoll(t);if(!n||!n.websiteSubmitted||!n.websitePath){S("No website submitted for this student.","error");return}window.open(n.websitePath,"_blank")}window.openStudentWebsite=L;function x(){const t=f.getStats(),n=document.getElementById("stat-total"),e=document.getElementById("stat-submitted"),o=document.getElementById("stat-pending"),a=document.getElementById("stat-rate");n&&(n.textContent=t.total),e&&(e.textContent=t.submitted),o&&(o.textContent=t.pending),a&&(a.textContent=`${t.percentage}%`);const c=document.getElementById("featured-students-grid");if(c){const b=f.getAll();if(b.length===0)c.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">👥</div>
          <h3>No Students Added Yet</h3>
          <p style="color: var(--text-muted); max-width: 420px; margin: 0.5rem auto 1.25rem;">
            The student directory is currently empty. Go to the Admin Dashboard to add your first student record!
          </p>
          <a href="admin.html" class="btn btn-primary">➕ Add First Student</a>
        </div>
      `;else{const g=b.slice(0,4);c.innerHTML=g.map(r=>`
        <div class="student-card">
          <div class="card-header-banner">
            <div class="card-avatar-wrap">
              <img src="${r.profileImage}" alt="${r.name}" class="card-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=4f46e5&color=fff'">
            </div>
            <div class="card-status-badge">
              ${r.websiteSubmitted?`
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
            <h3 class="student-name">${r.name}</h3>
            <span class="roll-tag">Roll No: ${r.rollNumber}</span>
            <div class="student-meta">
              <div class="meta-item"><span>🎓</span> <span>${r.course} (${r.semester})</span></div>
              <div class="meta-item"><span>📧</span> <span>${r.email}</span></div>
            </div>
            <div class="card-actions">
              <a href="profile.html?roll=${r.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
              ${r.websiteSubmitted?`
                <a href="${r.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
              `:`
                <span class="null-badge-btn">NULL</span>
              `}
            </div>
          </div>
        </div>
      `).join("")}}const u=document.getElementById("showcase-grid");if(u){const b=f.getSubmitted();if(b.length===0)u.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🚀</div>
          <h3>No Submitted Websites Yet</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0.5rem auto;">
            When students submit websites to <code>submissions/{rollNumber}/index.html</code>, their web design projects will automatically be showcased here!
          </p>
        </div>
      `;else{const g=b.slice(0,6);u.innerHTML=g.map(r=>`
        <div class="showcase-card">
          <div class="showcase-card-header">
            <img src="${r.profileImage}" alt="${r.name}" class="showcase-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=4f46e5&color=fff'">
            <div>
              <h4 class="showcase-student-name">${r.name}</h4>
              <span class="roll-tag">Roll No: ${r.rollNumber}</span>
            </div>
          </div>
          <div class="showcase-card-body">
            <h3 class="showcase-title">${r.websiteTitle||"Student Web Project"}</h3>
            <p class="showcase-desc">${r.websiteDescription||"Interactive web application submission."}</p>
          </div>
          <div class="showcase-card-footer">
            <span class="showcase-date">📅 ${r.submissionDate||"2026-08-10"}</span>
            <a href="${r.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              🚀 View Website
            </a>
          </div>
        </div>
      `).join("")}}}function P(){const t=document.getElementById("dir-search"),n=document.getElementById("dir-course"),e=document.getElementById("dir-semester"),o=document.getElementById("dir-status"),a=document.getElementById("dir-blood"),c=document.getElementById("dir-sort"),u=document.getElementById("directory-table-body"),b=document.getElementById("directory-empty-state"),g=document.getElementById("directory-count");let r=1;const h=12;function y(){let s=f.getAll();const m=t?t.value.trim().toLowerCase():"",i=n?n.value:"",p=e?e.value:"",v=o?o.value:"",w=a?a.value:"",A=c?c.value:"roll-asc";if(m&&(s=s.filter(d=>d.name.toLowerCase().includes(m)||String(d.rollNumber).toLowerCase().includes(m))),i&&(s=s.filter(d=>d.course.toLowerCase().includes(i.toLowerCase())||i===d.course)),p&&(s=s.filter(d=>d.semester===p)),v&&(v==="submitted"&&(s=s.filter(d=>d.websiteSubmitted===!0)),v==="null"&&(s=s.filter(d=>d.websiteSubmitted===!1))),w&&(s=s.filter(d=>d.bloodGroup===w)),s.sort((d,B)=>A==="roll-asc"?parseInt(d.rollNumber)-parseInt(B.rollNumber):A==="roll-desc"?parseInt(B.rollNumber)-parseInt(d.rollNumber):A==="name-asc"?d.name.localeCompare(B.name):A==="name-desc"?B.name.localeCompare(d.name):0),g&&(g.textContent=`Showing ${s.length} students`),s.length===0){u&&(u.innerHTML=""),b&&(b.style.display="block");return}b&&(b.style.display="none");const I=Math.ceil(s.length/h);r>I&&(r=1);const N=(r-1)*h,M=s.slice(N,N+h);u&&(u.innerHTML=M.map(d=>`
        <tr>
          <td>
            <div class="table-student-info">
              <img src="${d.profileImage}" alt="${d.name}" class="table-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=4f46e5&color=fff'">
              <div>
                <div class="table-student-name">${d.name}</div>
                <div class="table-student-email">${d.email}</div>
              </div>
            </div>
          </td>
          <td><span class="roll-tag">#${d.rollNumber}</span></td>
          <td><strong>${d.course}</strong></td>
          <td>${d.semester}</td>
          <td>
            ${d.websiteSubmitted?`
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
              <a href="profile.html?roll=${d.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
              ${d.websiteSubmitted?`
                <a href="${d.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
              `:`
                <span class="null-badge-text">NULL</span>
              `}
            </div>
          </td>
        </tr>
      `).join("")),l(I)}function l(s){const m=document.getElementById("directory-pagination");if(!m)return;if(s<=1){m.innerHTML="";return}let i="";for(let p=1;p<=s;p++)i+=`<button class="page-btn ${p===r?"active":""}" data-page="${p}">${p}</button>`;m.innerHTML=`
      <div class="pagination-wrap">
        <span style="font-size:0.9rem; color: var(--text-muted);">Page ${r} of ${s}</span>
        <div class="page-numbers">${i}</div>
      </div>
    `,m.querySelectorAll(".page-btn").forEach(p=>{p.addEventListener("click",v=>{r=parseInt(v.target.getAttribute("data-page")),y()})})}[t,n,e,o,a,c].forEach(s=>{s&&s.addEventListener("change",()=>{r=1,y()}),s&&s.tagName==="INPUT"&&s.addEventListener("input",()=>{r=1,y()})}),y()}function R(){const n=new URLSearchParams(window.location.search).get("roll")||"",e=f.getByRoll(n);if(!e){const N=document.getElementById("profile-content");N&&(N.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">❓</div>
          <h2>Student Not Found</h2>
          <p>No student record matches roll number "${n}".</p>
          <a href="students.html" class="btn btn-primary" style="margin-top: 1rem;">Back to Directory</a>
        </div>
      `);return}const o=document.getElementById("prof-avatar"),a=document.getElementById("prof-name"),c=document.getElementById("prof-roll"),u=document.getElementById("prof-course"),b=document.getElementById("prof-sem"),g=document.getElementById("prof-email"),r=document.getElementById("prof-phone"),h=document.getElementById("prof-age"),y=document.getElementById("prof-blood"),l=document.getElementById("prof-cgpa"),s=document.getElementById("prof-internal-marks"),m=document.getElementById("prof-extracurricular"),i=document.getElementById("prof-college"),p=document.getElementById("prof-bio"),v=document.getElementById("prof-project-box");o&&(o.src=e.profileImage,o.onerror=()=>o.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(e.name)}&background=4f46e5&color=fff`),a&&(a.textContent=e.name),c&&(c.textContent=`Roll No: ${e.rollNumber}`);const w=document.getElementById("prof-roll-val");w&&(w.textContent=`#${e.rollNumber}`),u&&(u.textContent=e.course);const A=document.getElementById("prof-course-val");A&&(A.textContent=e.course),b&&(b.textContent=e.semester);const I=document.getElementById("prof-sem-val");I&&(I.textContent=e.semester),g&&(g.textContent=e.email),r&&(r.textContent=e.phone),h&&(h.textContent=`${e.age} Years`),y&&(y.textContent=e.bloodGroup),l&&(l.textContent=e.cgpa||"Not provided"),s&&(s.textContent=e.internalMarks||"Not provided"),m&&(m.textContent=e.extracurricular||"Not provided"),i&&(i.textContent="Department of Computer Science & Engineering"),p&&(p.textContent=`${e.name} is a student pursuing ${e.course} currently in semester ${e.semester}.`),v&&(e.websiteSubmitted&&e.websitePath?v.innerHTML=`
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
      `:v.innerHTML=`
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">No website submitted yet.</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.25rem;">
            This student has not submitted a web development project yet. When extracted to <code>submissions/${e.rollNumber}/index.html</code>, the website link will automatically appear here.
          </p>
          <span class="badge badge-null" style="font-size: 0.9rem; padding: 0.5rem 1rem;">Website Status: Not Submitted</span>
        </div>
      `)}function C(){const t=document.getElementById("admin-table-body"),n=document.getElementById("admin-search"),e=document.getElementById("admin-status-filter"),o=document.getElementById("modal-add-student"),a=document.getElementById("modal-edit-student");function c(){const l=f.getStats(),s=document.getElementById("adm-stat-total"),m=document.getElementById("adm-stat-sub"),i=document.getElementById("adm-stat-pend"),p=document.getElementById("adm-stat-rate");s&&(s.textContent=l.total),m&&(m.textContent=l.submitted),i&&(i.textContent=l.pending),p&&(p.textContent=`${l.percentage}%`)}function u(){let l=f.getAll();const s=n?n.value.trim().toLowerCase():"",m=e?e.value:"";s&&(l=l.filter(i=>i.name.toLowerCase().includes(s)||String(i.rollNumber).toLowerCase().includes(s))),m&&(m==="submitted"&&(l=l.filter(i=>i.websiteSubmitted===!0)),m==="null"&&(l=l.filter(i=>i.websiteSubmitted===!1))),t&&(l.length===0?t.innerHTML=`
          <tr>
            <td colspan="6" style="text-align: center; padding: 3rem 1rem;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👥</div>
              <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 0.5rem;">No Student Records</h3>
              <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 1.25rem; font-size: 0.9rem;">
                The database is empty. Click <strong>➕ Add Student</strong> to create your first student record!
              </p>
            </td>
          </tr>
        `:t.innerHTML=l.map(i=>`
          <tr>
            <td>
              <div class="table-student-info">
                <img src="${i.profileImage}" alt="${i.name}" class="table-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(i.name)}&background=4f46e5&color=fff'">
                <div>
                  <div class="table-student-name">${i.name}</div>
                  <div class="table-student-email">${i.email}</div>
                </div>
              </div>
            </td>
            <td><span class="roll-tag">#${i.rollNumber}</span></td>
            <td>${i.course}</td>
            <td>${i.semester}</td>
            <td>
              ${i.websiteSubmitted?`
                <span class="badge badge-submitted">🟢 Submitted</span>
              `:`
                <span class="badge badge-null">⚪ Not Submitted</span>
              `}
            </td>
            <td>
              <div class="action-btns-group">
                <a href="profile.html?roll=${i.rollNumber}" class="btn btn-secondary btn-sm">View Profile</a>
                ${i.websiteSubmitted?`
                  <a href="${i.websitePath}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">View Website</a>
                `:`
                  <span class="null-badge-text">Not Submitted</span>
                `}
                <button onclick="openEditModal('${i.rollNumber}')" class="btn btn-secondary btn-sm">Edit</button>
                <button onclick="deleteStudent('${i.rollNumber}')" class="btn btn-danger btn-sm">Delete</button>
              </div>
            </td>
          </tr>
        `).join("")),c()}window.deleteStudent=l=>{confirm(`Are you sure you want to delete student Roll No #${l}?`)&&(f.deleteStudent(l),S(`Student #${l} deleted.`),u())},window.openEditModal=l=>{const s=f.getByRoll(l);if(!s)return;document.getElementById("edit-roll-hidden").value=s.rollNumber,document.getElementById("edit-roll-display").value=`#${s.rollNumber}`,document.getElementById("edit-name").value=s.name,document.getElementById("edit-course").value=s.course,document.getElementById("edit-sem").value=s.semester,document.getElementById("edit-email").value=s.email,document.getElementById("edit-phone").value=s.phone;const m=document.getElementById("edit-has-website"),i=document.getElementById("edit-website-fields");m.checked=s.websiteSubmitted===!0,i.style.display=m.checked?"grid":"none",document.getElementById("edit-web-title").value=s.websiteTitle||"",document.getElementById("edit-web-desc").value=s.websiteDescription||"",a.classList.add("active")};const b=document.getElementById("btn-open-add");b&&b.addEventListener("click",()=>{document.getElementById("form-add-student").reset(),document.getElementById("add-website-fields").style.display="none",o.classList.add("active")});const g=document.getElementById("add-has-website");g&&g.addEventListener("change",l=>{document.getElementById("add-website-fields").style.display=l.target.checked?"grid":"none"});const r=document.getElementById("edit-has-website");r&&r.addEventListener("change",l=>{document.getElementById("edit-website-fields").style.display=l.target.checked?"grid":"none"}),document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(l=>{l.addEventListener("click",()=>{document.querySelectorAll(".modal-backdrop").forEach(s=>s.classList.remove("active"))})});const h=document.getElementById("form-add-student");h&&h.addEventListener("submit",l=>{l.preventDefault();try{const s=document.getElementById("add-roll").value.trim(),m=document.getElementById("add-has-website").checked,i={name:document.getElementById("add-name").value.trim(),rollNumber:s,course:document.getElementById("add-course").value,semester:document.getElementById("add-sem").value,age:parseInt(document.getElementById("add-age").value)||20,bloodGroup:document.getElementById("add-blood").value.trim()||"O+",email:document.getElementById("add-email").value.trim(),phone:document.getElementById("add-phone").value.trim(),websiteSubmitted:m,websiteTitle:document.getElementById("add-web-title").value.trim(),websiteDescription:document.getElementById("add-web-desc").value.trim()};f.addStudent(i),S(`Student #${i.rollNumber} added successfully!`),o.classList.remove("active"),h.reset(),u()}catch(s){S(s.message,"error")}});const y=document.getElementById("form-edit-student");y&&y.addEventListener("submit",l=>{l.preventDefault();try{const s=document.getElementById("edit-roll-hidden").value,m=document.getElementById("edit-has-website").checked;f.updateStudent(s,{name:document.getElementById("edit-name").value.trim(),course:document.getElementById("edit-course").value,semester:document.getElementById("edit-sem").value,email:document.getElementById("edit-email").value.trim(),phone:document.getElementById("edit-phone").value.trim(),websiteSubmitted:m,websiteTitle:document.getElementById("edit-web-title").value.trim(),websiteDescription:document.getElementById("edit-web-desc").value.trim()}),S(`Student #${s} updated successfully.`),a.classList.remove("active"),u()}catch(s){S(s.message,"error")}}),n&&n.addEventListener("input",u),e&&e.addEventListener("change",u),u()}document.addEventListener("DOMContentLoaded",()=>{localStorage.removeItem("student_portal_db_v1"),localStorage.removeItem("student_portal_db_v2"),localStorage.removeItem("student_portal_db_v3"),localStorage.removeItem("student_portal_db_v4"),T();const t=window.location.pathname;t.endsWith("index.html")||t==="/"||t.endsWith("/")?x():t.endsWith("students.html")?P():t.endsWith("profile.html")?R():t.endsWith("admin.html")&&C()});
