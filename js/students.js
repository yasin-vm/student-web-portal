/* ==========================================================================
   CENTRAL STUDENT DATABASE MODULE (EMPTY START FOR CUSTOM STUDENTS)
   ========================================================================== */

const STORAGE_KEY = 'student_portal_db_v4';

// The class roster uses sequential portal roll numbers, not university registration numbers.
const STUDENT_NAMES = [
  'ABHIRAM ANIL P.A',
  'ADWAITH K',
  'AKASH P S',
  'AMEGHA S',
  'ANANDU M',
  'ANANYA MOHAN N',
  'ANJANA K',
  'ANJANA RAJ R',
  'ANJITHA V',
  'ATHUL K SANDEEP',
  'ATHUL RAJ',
  'FATHIMA RIZA ERSHAD',
  'FATHIMA SABA M',
  'FATHIMATH SAHDIYA C',
  'FATHIMATH SHIFANA T V',
  'FATHIMATHU SUHADHA K V',
  'FATHIMA ZIYA',
  'FIDHA FATHIMA T',
  'GOPIKA T K',
  'HREDYA M',
  'HRIDUSH PRAKASH',
  'JEROME JIMMY',
  'KENZAH RAFFY K',
  'KRISHNA SAJEEVAN',
  'MARJANA K P',
  'MISHAL MAJEED K V',
  'MOHAMMED AZEEM SAMBRATH',
  'MUHAMMAD NIHAL',
  'MUHAMMED FINAS NOUFAL A P',
  'MUHAMMED MAZIN K P',
  'MUHAMMED THAHA K T',
  'MUHAMMED ZAID O V',
  'N LIYA RAZAK',
  'RAYA FATHIMA',
  'RISNA RAFEEQ B M',
  'RIYA P P',
  'RIZA MEHAK',
  'ROSHNI K',
  'SABAH SHAMEER',
  'SANKEERTHANA P',
  'SAYANAND M P',
  'SAYAND A N',
  'SAYYIDHA SHERIN K',
  'SHIJAS SHABEER K P',
  'SHIVADHA R',
  'SHYAMJITH M',
  'SOUMMYAKEERTHI K S',
  'SWETHA V',
  'YADHU SAGAR N',
  'YADU DEV M',
  'YASHIKA PRASANTH',
  'YASIN V M',
  'ZAID IBNU ABDUL GAFOOR',
  'MARIYAM P',
  'AKASH P M',
  'AKSHARA K M',
  'ANJANA K',
  'ANUSREE PRAKASHAN',
  'ASRITHA S NATH'
];

export const DEFAULT_STUDENTS = STUDENT_NAMES.map((name, index) => {
  const rollNumber = String(index + 1).padStart(2, '0');
  const websiteSubmitted = rollNumber === '52';

  return {
    id: index + 1,
    name,
    rollNumber,
    age: 20,
    bloodGroup: '',
    cgpa: '',
    internalMarks: '',
    extracurricular: '',
    course: 'B.Tech Computer Science',
    semester: 'S7',
    email: '',
    phone: '',
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`,
    websiteSubmitted,
    websiteTitle: websiteSubmitted ? 'Yasin V M | Student Profile' : `${name}'s Web Project`,
    websiteDescription: websiteSubmitted ? 'HTML, CSS, and JavaScript student profile assignment.' : 'Student web development assignment.',
    submissionDate: websiteSubmitted ? '2026-09-08' : null,
    websitePath: `submissions/${rollNumber}/index.html`
  };
});

// Student Data Controller API with LocalStorage Persistence
export const StudentDB = {
  getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      this.save(DEFAULT_STUDENTS);
      return DEFAULT_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse student data, resetting to empty list", e);
      this.save(DEFAULT_STUDENTS);
      return DEFAULT_STUDENTS;
    }
  },

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getByRoll(rollNumber) {
    if (!rollNumber) return null;
    const formatted = String(rollNumber).padStart(2, '0');
    const students = this.getAll();
    return students.find(s => String(s.rollNumber).padStart(2, '0') === formatted) || null;
  },

  getSubmitted() {
    return this.getAll().filter(s => s.websiteSubmitted === true);
  },

  getStats() {
    const students = this.getAll();
    const total = students.length;
    const submitted = students.filter(s => s.websiteSubmitted === true).length;
    const pending = total - submitted;
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return { total, submitted, pending, percentage };
  },

  addStudent(studentData) {
    const students = this.getAll();
    const rollStr = String(studentData.rollNumber).padStart(2, '0');
    if (students.some(s => String(s.rollNumber).padStart(2, '0') === rollStr)) {
      throw new Error(`Roll number ${rollStr} already exists! Please use a unique roll number.`);
    }

    const hasWebsite = studentData.websiteSubmitted === true;
    const newStudent = {
      id: Date.now(),
      name: studentData.name,
      rollNumber: rollStr,
      age: parseInt(studentData.age) || 20,
      bloodGroup: studentData.bloodGroup || 'O+',
      cgpa: studentData.cgpa || '',
      internalMarks: studentData.internalMarks || '',
      extracurricular: studentData.extracurricular || '',
      course: studentData.course,
      semester: studentData.semester,
      email: studentData.email,
      phone: studentData.phone,
      profileImage: studentData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=4f46e5&color=fff`,
      websiteSubmitted: hasWebsite,
      websiteTitle: hasWebsite ? (studentData.websiteTitle || `${studentData.name}'s Web Project`) : null,
      websiteDescription: hasWebsite ? (studentData.websiteDescription || 'Personal student project website.') : null,
      submissionDate: hasWebsite ? (studentData.submissionDate || new Date().toISOString().split('T')[0]) : null,
      websitePath: hasWebsite ? (studentData.websitePath || `submissions/${rollStr}/index.html`) : null
    };

    students.push(newStudent);
    this.save(students);
    return newStudent;
  },

  updateStudent(rollNumber, updatedFields) {
    const students = this.getAll();
    const rollStr = String(rollNumber).padStart(2, '0');
    const index = students.findIndex(s => String(s.rollNumber).padStart(2, '0') === rollStr);
    if (index === -1) throw new Error(`Student with Roll No ${rollStr} not found.`);

    if (updatedFields.websiteSubmitted !== undefined) {
      if (updatedFields.websiteSubmitted) {
        updatedFields.websitePath = updatedFields.websitePath || `submissions/${rollStr}/index.html`;
        updatedFields.websiteTitle = updatedFields.websiteTitle || `${students[index].name}'s Web Project`;
        updatedFields.submissionDate = updatedFields.submissionDate || new Date().toISOString().split('T')[0];
      } else {
        updatedFields.websitePath = null;
        updatedFields.websiteTitle = null;
        updatedFields.websiteDescription = null;
        updatedFields.submissionDate = null;
      }
    }

    students[index] = { ...students[index], ...updatedFields };
    this.save(students);
    return students[index];
  },

  deleteStudent(rollNumber) {
    let students = this.getAll();
    const rollStr = String(rollNumber).padStart(2, '0');
    students = students.filter(s => String(s.rollNumber).padStart(2, '0') !== rollStr);
    this.save(students);
  },

  clearAll() {
    this.save([]);
  },

  resetToDefaults() {
    this.save(DEFAULT_STUDENTS);
    return DEFAULT_STUDENTS;
  }
};
