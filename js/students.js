/* ==========================================================================
   CENTRAL STUDENT DATABASE MODULE (EMPTY START FOR CUSTOM STUDENTS)
   ========================================================================== */

const STORAGE_KEY = 'student_portal_db_v2';

// Empty default dataset - ready for user to add real students
export const DEFAULT_STUDENTS = [];

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
