// Authentication System
// Manages user registration, login, and session handling using LocalStorage

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Check if user is already authenticated
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        showApp(userData);
    } else {
        showAuthModal();
    }
}

// Show authentication modal
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

// Show the main app
function showApp(userData) {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    // Update user info in header
    document.getElementById('userEmail').textContent = userData.email || 'Guest User';
    updateTierDisplay();
    
    // Load app data
    loadNutritionData();
    loadGoals();
    updateFeatureAccess();
}

// Handle user registration
function handleRegister() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    
    // Validation
    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        alert('An account with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        email: email,
        password: password, // Note: In production, this should be hashed
        createdAt: new Date().toISOString(),
        tier: 'FREE'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    const currentUser = {
        email: email,
        tier: 'FREE',
        isGuest: false
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show success and redirect to app
    alert('Account created successfully!');
    showApp(currentUser);
}

// Handle user login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('Invalid email or password');
        return;
    }
    
    // Set as current user
    const currentUser = {
        email: email,
        tier: user.tier || 'FREE',
        isGuest: false
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showApp(currentUser);
}

// Handle guest access
function handleGuest() {
    const currentUser = {
        email: 'Guest User',
        tier: 'FREE',
        isGuest: true
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showApp(currentUser);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        
        // Clear form fields
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPasswordConfirm').value = '';
        
        showAuthModal();
    }
}

// Switch to register form
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Switch to login form
function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Update user tier
function updateUserTier(newTier) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    currentUser.tier = newTier;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array if not guest
    if (!currentUser.isGuest) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].tier = newTier;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    updateTierDisplay();
    updateFeatureAccess();
}

// Update tier display in header
function updateTierDisplay() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const tierElement = document.getElementById('userTier');
    tierElement.textContent = currentUser.tier;
    
    // Update tier styling
    tierElement.className = 'user-tier';
    if (currentUser.tier === 'PRO') {
        tierElement.style.background = 'linear-gradient(135deg, var(--color-primary), #00dd77)';
    } else if (currentUser.tier === 'STANDARD') {
        tierElement.style.background = 'linear-gradient(135deg, #3366ff, #6699ff)';
    } else if (currentUser.tier === 'ELITE') {
        tierElement.style.background = 'linear-gradient(135deg, var(--color-accent), #ff6699)';
    } else {
        tierElement.style.background = 'linear-gradient(135deg, #666, #888)';
    }
}
