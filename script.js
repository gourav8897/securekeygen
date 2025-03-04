// Toggle Dark Mode
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Update Username Length Value
document.getElementById('username-length').addEventListener('input', (e) => {
    document.getElementById('username-length-value').textContent = e.target.value;
});

// Update Password Length Value
document.getElementById('password-length').addEventListener('input', (e) => {
    document.getElementById('password-length-value').textContent = e.target.value;
});

// Generate Username
document.getElementById('generate-username').addEventListener('click', () => {
    const length = parseInt(document.getElementById('username-length').value);
    const includeLowercase = document.getElementById('username-lowercase').checked;
    const includeUppercase = document.getElementById('username-uppercase').checked;
    const includeNumbers = document.getElementById('username-numbers').checked;
    const includeSymbols = document.getElementById('username-symbols').checked;

    const username = generateRandomString(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
    document.getElementById('username').value = username;
    updateStrengthBar('username-strength-bar', 'username-strength-indicator', username);
});

// Generate Password
document.getElementById('generate-password').addEventListener('click', () => {
    const length = parseInt(document.getElementById('password-length').value);
    const includeLowercase = document.getElementById('password-lowercase').checked;
    const includeUppercase = document.getElementById('password-uppercase').checked;
    const includeNumbers = document.getElementById('password-numbers').checked;
    const includeSymbols = document.getElementById('password-symbols').checked;

    const password = generateRandomString(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
    document.getElementById('password').value = password;
    updateStrengthBar('password-strength-bar', 'password-strength-indicator', password);
});

// Copy to Clipboard Functions
['username', 'password'].forEach(type => {
    document.getElementById(`copy-${type}`).addEventListener('click', () => {
        const value = document.getElementById(type).value;
        copyToClipboard(value);
    });
});

// Clear Functions
['username', 'password'].forEach(type => {
    document.getElementById(`clear-${type}`).addEventListener('click', () => {
        document.getElementById(type).value = '';
        document.getElementById(`${type}-strength-bar`).style.width = '0%';
        document.getElementById(`${type}-strength-indicator`).textContent = '';
    });
});

// Save Functions
['username', 'password'].forEach(type => {
    document.getElementById(`save-${type}`).addEventListener('click', () => {
        const value = document.getElementById(type).value;
        if (value) {
            saveGeneratedItem(type.charAt(0).toUpperCase() + type.slice(1), value);
        } else {
            alert(`No ${type} to save!`);
        }
    });
});

// Toggle Password Visibility
document.getElementById('toggle-password').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
});

// Clear Saved Items
document.getElementById('clear-saved-items').addEventListener('click', () => {
    localStorage.removeItem('savedItems');
    displaySavedItems();
});

// Submit Feedback
document.getElementById('submit-feedback').addEventListener('click', () => {
    const feedback = document.getElementById('feedback').value;
    if (feedback) {
        alert('Thank you for your feedback!');
        document.getElementById('feedback').value = '';
    } else {
        alert('Please enter your feedback.');
    }
});

// Helper Functions
function generateRandomString(length, lowercase, uppercase, numbers, symbols) {
    let charset = '';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+{}:"<>?[];\',./`~';

    if (charset === '') charset = 'abcdefghijklmnopqrstuvwxyz'; 

    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

function updateStrengthBar(barId, indicatorId, value) {
    const strength = calculateStrength(value);
    const bar = document.getElementById(barId);
    const indicator = document.getElementById(indicatorId);
    
    bar.style.width = `${strength}%`;
    bar.style.backgroundColor = 
        strength < 33 ? '#dc2626' : 
        strength < 66 ? '#eab308' : 
        '#22c55e';                   
    
    if (strength < 33) {
        indicator.textContent = 'Weak';
        indicator.style.color = '#dc2626';
    } else if (strength < 66) {
        indicator.textContent = 'Strong';
        indicator.style.color = '#eab308';
    } else {
        indicator.textContent = 'Very Strong';
        indicator.style.color = '#22c55e';
    }
}

function calculateStrength(value) {
    let strength = 0;
    strength += Math.min(40, (value.length / 20) * 40);
    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumbers = /[0-9]/.test(value);
    const hasSymbols = /[^a-zA-Z0-9]/.test(value);
    const diversityCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
    strength += (diversityCount / 4) * 60;
    return Math.min(100, strength);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Copied to clipboard!');
        } catch (err) {
            alert('Failed to copy!');
        }
        document.body.removeChild(textarea);
    }
}

function saveGeneratedItem(type, value) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.push({ type, value, timestamp: new Date().toLocaleString() });
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    displaySavedItems();
}

function displaySavedItems() {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    const savedItemsContainer = document.getElementById('saved-items');
    savedItemsContainer.innerHTML = savedItems.map(item => `
        <div class="saved-item">
            <span>${item.type}: ${item.value}</span>
            <span>${item.timestamp}</span>
        </div>
    `).join('');
}

displaySavedItems();
