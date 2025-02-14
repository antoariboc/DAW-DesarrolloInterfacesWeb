//todo de claude
// API endpoints
const API_URL = 'http://localhost:3000';
const endpoints = {
    students: `${API_URL}/students`,
    grades: `${API_URL}/grades`
};

// Cache DOM elements
const elements = {
    studentForm: document.getElementById('studentForm'),
    gradeForm: document.getElementById('gradeForm'),
    studentTable: document.getElementById('studentTable'),
    searchInput: document.getElementById('searchInput'),
    studentSelect: document.getElementById('studentSelect'),
    studentModal: document.getElementById('studentModal'),
    studentDetails: document.getElementById('studentDetails')
};

// Initialize Bootstrap modal
const studentModal = new bootstrap.Modal(elements.studentModal);

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
});

function setupEventListeners() {
    // Form submissions
    elements.studentForm.addEventListener('submit', handleStudentSubmit);
    elements.gradeForm.addEventListener('submit', handleGradeSubmit);
    
    // Search functionality
    elements.searchInput.addEventListener('input', handleSearch);
}

// Student Form Handler
async function handleStudentSubmit(e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const studentId = document.getElementById('studentId').value;

    try {
        const response = await fetch(endpoints.students, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: studentName, studentId })
        });

        if (response.ok) {
            await loadStudents();
            elements.studentForm.reset();
            showAlert('Student added successfully!', 'success');
        }
    } catch (error) {
        showAlert('Error adding student', 'danger');
        console.error('Error:', error);
    }
}

// Grade Form Handler
async function handleGradeSubmit(e) {
    e.preventDefault();
    const studentId = elements.studentSelect.value;
    const assignmentName = document.getElementById('assignmentName').value;
    const grade = document.getElementById('grade').value;

    try {
        const response = await fetch(endpoints.grades, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, assignmentName, grade })
        });

        if (response.ok) {
            await loadStudents();
            elements.gradeForm.reset();
            showAlert('Grade recorded successfully!', 'success');
        }
    } catch (error) {
        showAlert('Error recording grade', 'danger');
        console.error('Error:', error);
    }
}

// Load Students
async function loadStudents() {
    try {
        const response = await fetch(endpoints.students);
        const students = await response.json();
        updateStudentTable(students);
        updateStudentSelect(students);
    } catch (error) {
        showAlert('Error loading students', 'danger');
        console.error('Error:', error);
    }
}

// Update Student Table
function updateStudentTable(students) {
    elements.studentTable.innerHTML = students.map(student => `
        <tr>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${calculateAverage(student.grades)}%</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewStudent('${student.studentId}')">
                    View Details
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.studentId}')">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Student Select Dropdown
function updateStudentSelect(students) {
    elements.studentSelect.innerHTML = `
        <option value="">Select Student</option>
        ${students.map(student => `
            <option value="${student.studentId}">${student.name}</option>
        `).join('')}
    `;
}

// Calculate Average Grade
function calculateAverage(grades) {
    if (!grades || grades.length === 0) return 'N/A';
    const sum = grades.reduce((acc, grade) => acc + Number(grade.score), 0);
    return (sum / grades.length).toFixed(1);
}

// Search Functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = elements.studentTable.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// View Student Details
async function viewStudent(studentId) {
    try {
        const response = await fetch(`${endpoints.students}/${studentId}`);
        const student = await response.json();
        
        elements.studentDetails.innerHTML = `
            <h4>${student.name}</h4>
            <p><strong>Student ID:</strong> ${student.studentId}</p>
            <h5>Grades:</h5>
            <table class="table">
                <thead>
                    <tr>
                        <th>Assignment</th>
                        <th>Grade</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${student.grades.map(grade => `
                        <tr>
                            <td>${grade.assignmentName}</td>
                            <td>${grade.score}%</td>
                            <td>${new Date(grade.date).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        studentModal.show();
    } catch (error) {
        showAlert('Error loading student details', 'danger');
        console.error('Error:', error);
    }
}

// Delete Student
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`${endpoints.students}/${studentId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadStudents();
            showAlert('Student deleted successfully!', 'success');
        }
    } catch (error) {
        showAlert('Error deleting student', 'danger');
        console.error('Error:', error);
    }
}

// Utility function for showing alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.card'));
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}