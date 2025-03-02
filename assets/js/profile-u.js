// Ensure modal shows and profile data loads after DOM is fully loaded
window.onload = function() {
    console.log('Page loaded, checking user data and profile setup status...');
    loadUserData();

    if (!localStorage.getItem('profileSetup')) {
        console.log('Profile setup not completed, showing modal');
        const modal = document.getElementById('welcome-modal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.error('Modal element not found');
        }
    } else {
        console.log('Profile setup already completed, skipping modal');
    }
};

// Load user data from localStorage and populate the profile
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        console.log('User data found in localStorage:', user);

        // Update Personal Information
        document.getElementById('name').textContent = user.simHolderName || 'Not set';
        document.getElementById('number').textContent = user.number || 'Not set';
        document.querySelector('.info-item:nth-child(3) .info-value').textContent = user.dateOfBirth || 'Not set';
        document.querySelector('.info-item:nth-child(4) .info-value').textContent = user.dateOfActivation || 'Not set';

        // Update Address
        document.getElementById('address').textContent = user.address || 'Not set';
        document.getElementById('state').textContent = (user.placeOfSupply === "TamilNadu" ? "Tamil Nadu" : user.placeOfSupply) || 'Not set';

        // Update Account Settings
        document.getElementById('username-value').textContent = user.username || 'Not set';
        document.getElementById('email-value').textContent = user.email || 'Not set';

        // Update avatar with user's initial
        const avatar = document.querySelector('.user-avatar');
        if (user.simHolderName) {
            avatar.textContent = user.simHolderName.charAt(0).toUpperCase();
        }

        // Ensure .info-grid uses grid layout
        const infoGrids = document.querySelectorAll('.info-grid');
        infoGrids.forEach(grid => {
            grid.style.display = 'grid'; // Force grid layout
        });
    } else {
        console.error('No user data found in localStorage');
        showToastMessage('Please log in to view your profile.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

// Modal control functions
function startSetup() {
    console.log('Start Setup clicked');
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    toggleEdit('username');
}

function dismissModal() {
    console.log('Dismiss Modal clicked');
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Logout functionality
document.getElementById('logout-button').addEventListener('click', function() {
    console.log('Logout button clicked');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('profileSetup');
    showToastMessage('Logged out successfully.');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

function toggleEdit(field) {
    console.log(`Toggling edit for field: ${field}`);
    const display = document.getElementById(`${field}-display`);
    const edit = document.getElementById(`${field}-edit`);
    const form = document.getElementById('account-form');
    
    if (display && edit && form) {
        display.classList.add('hidden');
        edit.style.display = 'block';
        form.classList.remove('hidden');
        
        const input = document.getElementById(`${field}-input`);
        if (input) {
            const currentValue = document.getElementById(`${field}-value`).textContent;
            input.value = currentValue === 'Not set' ? '' : currentValue;
            input.focus();
        }
    } else {
        console.error(`Error toggling edit for ${field}: display, edit, or form element not found`);
    }
}

function saveAccountChanges(event) {
    event.preventDefault();
    console.log('Saving account changes');

    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');

    // Reset error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });

    let hasErrors = false;
    let changesMade = false;

    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    // Username validation
    if (usernameInput && document.getElementById('username-edit').style.display !== 'none') {
        const username = usernameInput.value.trim();
        console.log(`Validating username: "${username}"`);
        if (username) {
            if (username.length < 3) {
                showError('username-error', 'Username must be at least 3 characters');
                hasErrors = true;
            } else {
                changesMade = true;
                user.username = username;
                document.getElementById('username-value').textContent = username;
                document.getElementById('username-value').style.color = 'var(--text-color)';
                document.getElementById('username-value').style.fontStyle = 'normal';
            }
        }
    }

    // Email validation
    if (emailInput && document.getElementById('email-edit').style.display !== 'none') {
        const email = emailInput.value.trim();
        console.log(`Validating email: "${email}"`);
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('email-error', 'Please enter a valid email address');
                hasErrors = true;
            } else {
                changesMade = true;
                user.email = email;
                document.getElementById('email-value').textContent = email;
                document.getElementById('email-value').style.color = 'var(--text-color)';
                document.getElementById('email-value').style.fontStyle = 'normal';
            }
        }
    }

    if (!hasErrors && changesMade) {
        console.log('Form validated successfully, saving changes');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        resetForm();
        showToastMessage('Details Updated');
        localStorage.setItem('profileSetup', 'true');
    } else {
        console.log('Form validation failed or no changes made');
    }
}

function showError(elementId, message) {
    console.log(`Showing error for ${elementId}: ${message}`);
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function showToastMessage(message) {
    console.log(`Showing toast message: ${message}`);
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

function resetForm() {
    console.log('Resetting form');
    const displayElements = ['username-display', 'email-display'];
    const editElements = ['username-edit', 'email-edit'];

    displayElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.remove('hidden');
    });

    editElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });

    const form = document.getElementById('account-form');
    if (form) form.classList.add('hidden');

    const inputs = document.querySelectorAll('#account-form input');
    inputs.forEach(input => input.value = '');
}