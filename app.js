// Main App Logic
// Handles nutrition tracking, goals, and app functionality

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.closest('.tab-btn').classList.add('active');
    
    // Update displays when switching tabs
    if (tabName === 'nutrition') {
        loadNutritionData();
    } else if (tabName === 'goals') {
        loadGoals();
        updateGoalProgress();
    }
}

// Update feature access based on tier
function updateFeatureAccess() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const tier = currentUser.tier;
    
    // Goals tab (PRO and above)
    const goalsTab = document.getElementById('goalsTab');
    const goalsLock = document.getElementById('goalsLock');
    
    if (tier === 'FREE') {
        goalsTab.onclick = function() {
            alert('Upgrade to Basic Pack or higher to access Nutrition Goals!\n\nClick "Upgrade" tab to unlock this feature.');
        };
        goalsLock.style.display = 'inline';
    } else {
        goalsTab.onclick = function() { switchTab('goals'); };
        goalsLock.style.display = 'none';
    }
    
    // Workouts tab (ELITE only)
    const workoutsTab = document.getElementById('workoutsTab');
    const workoutsLock = document.getElementById('workoutsLock');
    
    if (tier !== 'ELITE') {
        workoutsTab.onclick = function() {
            alert('Upgrade to Premium Pack to access Workout Plans!\n\nClick "Upgrade" tab to unlock this feature.');
        };
        workoutsLock.style.display = 'inline';
    } else {
        workoutsTab.onclick = function() { switchTab('workouts'); };
        workoutsLock.style.display = 'none';
    }
}

// Nutrition Tracking Functions

// Add nutrition entry
function addNutritionEntry() {
    const calories = parseInt(document.getElementById('caloriesInput').value) || 0;
    const protein = parseInt(document.getElementById('proteinInput').value) || 0;
    const carbs = parseInt(document.getElementById('carbsInput').value) || 0;
    const sugar = parseInt(document.getElementById('sugarInput').value) || 0;
    
    if (calories === 0 && protein === 0 && carbs === 0 && sugar === 0) {
        alert('Please enter at least one nutrition value');
        return;
    }
    
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        calories: calories,
        protein: protein,
        carbs: carbs,
        sugar: sugar
    };
    
    // Get current user's entries
    const currentUser = getCurrentUser();
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    entries.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(entries));
    
    // Clear inputs
    document.getElementById('caloriesInput').value = '';
    document.getElementById('proteinInput').value = '';
    document.getElementById('carbsInput').value = '';
    document.getElementById('sugarInput').value = '';
    
    // Reload data
    loadNutritionData();
    updateGoalProgress();
    
    // Show success feedback
    showSuccessMessage('Entry added successfully!');
}

// Load and display nutrition data
function loadNutritionData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Calculate today's totals
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    const totals = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        sugar: acc.sugar + entry.sugar
    }), { calories: 0, protein: 0, carbs: 0, sugar: 0 });
    
    // Update summary display
    document.getElementById('totalCalories').textContent = totals.calories;
    document.getElementById('totalProtein').textContent = totals.protein + 'g';
    document.getElementById('totalCarbs').textContent = totals.carbs + 'g';
    document.getElementById('totalSugar').textContent = totals.sugar + 'g';
    
    // Display entries list (most recent first)
    const entriesList = document.getElementById('entriesList');
    const recentEntries = entries.slice(-10).reverse();
    
    if (recentEntries.length === 0) {
        entriesList.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">No entries yet. Start tracking your nutrition!</p>';
    } else {
        entriesList.innerHTML = recentEntries.map(entry => {
            const entryDate = new Date(entry.date);
            const dateStr = entryDate.toLocaleDateString();
            const timeStr = entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return `
                <div class="entry-item">
                    <div>
                        <div style="color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 0.25rem;">
                            ${dateStr} at ${timeStr}
                        </div>
                        <div class="entry-data">
                            <span><strong>Cal:</strong> ${entry.calories}</span>
                            <span><strong>Protein:</strong> ${entry.protein}g</span>
                            <span><strong>Carbs:</strong> ${entry.carbs}g</span>
                            <span><strong>Sugar:</strong> ${entry.sugar}g</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Clear today's entries
function clearTodayEntries() {
    if (!confirm('Are you sure you want to clear today\'s entries?')) {
        return;
    }
    
    const currentUser = getCurrentUser();
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const today = new Date().toDateString();
    const filteredEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() !== today
    );
    
    localStorage.setItem(storageKey, JSON.stringify(filteredEntries));
    loadNutritionData();
    updateGoalProgress();
    
    showSuccessMessage('Today\'s entries cleared!');
}

// Goals Functions

// Save nutrition goals
function saveGoals() {
    const currentUser = getCurrentUser();
    
    // Check tier access
    if (currentUser.tier === 'FREE') {
        alert('Upgrade to Basic Pack or higher to set nutrition goals!');
        return;
    }
    
    const goalCalories = parseInt(document.getElementById('goalCalories').value) || 0;
    const goalProtein = parseInt(document.getElementById('goalProtein').value) || 0;
    
    if (goalCalories === 0 && goalProtein === 0) {
        alert('Please enter at least one goal');
        return;
    }
    
    const goals = {
        calories: goalCalories,
        protein: goalProtein,
        updatedAt: new Date().toISOString()
    };
    
    const storageKey = `goals_${currentUser.email}`;
    localStorage.setItem(storageKey, JSON.stringify(goals));
    
    loadGoals();
    updateGoalProgress();
    
    showSuccessMessage('Goals saved successfully!');
}

// Load goals
function loadGoals() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `goals_${currentUser.email}`;
    const goals = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // Update display
    if (goals.calories) {
        document.getElementById('displayGoalCalories').textContent = goals.calories;
        document.getElementById('goalCalories').value = goals.calories;
    } else {
        document.getElementById('displayGoalCalories').textContent = 'Not Set';
    }
    
    if (goals.protein) {
        document.getElementById('displayGoalProtein').textContent = goals.protein + 'g';
        document.getElementById('goalProtein').value = goals.protein;
    } else {
        document.getElementById('displayGoalProtein').textContent = 'Not Set';
    }
}

// Update goal progress
function updateGoalProgress() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get goals
    const goalsKey = `goals_${currentUser.email}`;
    const goals = JSON.parse(localStorage.getItem(goalsKey) || '{}');
    
    if (!goals.calories && !goals.protein) {
        return;
    }
    
    // Get today's totals
    const nutritionKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(nutritionKey) || '[]');
    
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    const totals = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein
    }), { calories: 0, protein: 0 });
    
    // Calculate progress
    if (goals.calories) {
        const caloriesProgress = Math.min((totals.calories / goals.calories) * 100, 100);
        document.getElementById('caloriesProgress').style.width = caloriesProgress + '%';
        document.getElementById('caloriesProgressText').textContent = 
            `${totals.calories} / ${goals.calories} (${Math.round(caloriesProgress)}%)`;
    }
    
    if (goals.protein) {
        const proteinProgress = Math.min((totals.protein / goals.protein) * 100, 100);
        document.getElementById('proteinProgress').style.width = proteinProgress + '%';
        document.getElementById('proteinProgressText').textContent = 
            `${totals.protein}g / ${goals.protein}g (${Math.round(proteinProgress)}%)`;
    }
}

// UI Helper Functions

// Show success message
function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--color-primary), #00dd77);
        color: var(--color-bg);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 2000);
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
