// ============================================================
//  FIREBASE CONFIGURATION (REPLACE WITH YOUR OWN)
// ============================================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ============================================================
//  DOM REFS & STATE
// ============================================================
const loginWrapper = document.getElementById('loginWrapper');
const appWrapper = document.getElementById('appWrapper');
const loginMsg = document.getElementById('loginMsg');

// ============================================================
//  AUTH FUNCTIONS
// ============================================================
function showMessage(text, type = 'error') {
    loginMsg.textContent = text;
    loginMsg.className = 'msg-box show ' + type;
    setTimeout(() => loginMsg.className = 'msg-box', 5000);
}

function switchLoginTab(tab) {
    const signinBtn = document.getElementById('loginTabSignin');
    const signupBtn = document.getElementById('loginTabSignup');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    if (tab === 'signin') {
        signinBtn.classList.add('active');
        signupBtn.classList.remove('active');
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signupBtn.classList.add('active');
        signinBtn.classList.remove('active');
        signupForm.style.display = 'block';
        signinForm.style.display = 'none';
    }
    loginMsg.className = 'msg-box';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .then(() => { /* onAuthStateChanged will handle UI */ })
        .catch(err => showMessage(err.message, 'error'));
}

function handleSignup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => { /* onAuthStateChanged handles UI */ })
        .catch(err => showMessage(err.message, 'error'));
}

function sendPasswordReset() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showMessage('Enter your email address first', 'error');
        return;
    }
    auth.sendPasswordResetEmail(email)
        .then(() => showMessage('Password reset email sent!', 'success'))
        .catch(err => showMessage(err.message, 'error'));
}

function logoutUser() {
    auth.signOut();
}

// ============================================================
//  AUTH STATE LISTENER – show/hide app
// ============================================================
auth.onAuthStateChanged(user => {
    if (user) {
        loginWrapper.classList.add('hidden');
        appWrapper.classList.add('show');
        // Reset any messages
        loginMsg.className = 'msg-box';
    } else {
        loginWrapper.classList.remove('hidden');
        appWrapper.classList.remove('show');
        // Ensure login forms are in correct state
        switchLoginTab('signin');
    }
});

// ============================================================
//  TAB SWITCHING (App)
// ============================================================
function switchTab(tab) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.tab-btn[onclick*="${tab}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active-panel'));
    const panel = document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (panel) panel.classList.add('active-panel');
}

// ============================================================
//  CALCULATOR FUNCTIONS
// ============================================================
function calculatePurity() {
    const total = parseFloat(document.getElementById('purityTotal').value);
    const obtained = parseFloat(document.getElementById('purityObtained').value);
    const result = document.getElementById('purityResult');
    if (isNaN(total) || isNaN(obtained) || total <= 0) {
        result.textContent = '⚠️ Please enter valid positive numbers.';
        return;
    }
    if (obtained > total) {
        result.textContent = '⚠️ Obtained marks cannot exceed total marks.';
        return;
    }
    const percentage = (obtained / total) * 100;
    result.textContent = `💎 Purity Score: ${percentage.toFixed(2)}% (${obtained}/${total})`;
}

function calculateBMI() {
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const result = document.getElementById('bmiResult');
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        result.textContent = '⚠️ Please enter valid positive numbers.';
        return;
    }
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    result.textContent = `⚖️ BMI: ${bmi.toFixed(1)} – ${category}`;
}

function calculateCGPA() {
    const totalGPA = parseFloat(document.getElementById('cgpaTotal').value);
    const subjects = parseInt(document.getElementById('cgpaSubjects').value);
    const result = document.getElementById('cgpaResult');
    if (isNaN(totalGPA) || isNaN(subjects) || subjects <= 0) {
        result.textContent = '⚠️ Please enter valid positive numbers.';
        return;
    }
    const cgpa = totalGPA / subjects;
    result.textContent = `📊 CGPA: ${cgpa.toFixed(2)} (out of ${subjects} subjects)`;
}