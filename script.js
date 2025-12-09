// Sample users data (in-memory)
const users = {}; // { email: {banned:false} }

// Hashed admin credentials (using bcryptjs for hashing)
const bcrypt = dcodeIO.bcrypt;

// Store hashed password for admin
const adminEmail = "antonkrupinski@starsclm.com";
const adminPasswordHash = "$2a$10$HkK7wbdZ1Y1cQ7kP4cV7uO1a2K6e7zRk3hhOeZpZlD5U5iA9G8V8i"; 
// Password: "201309!" hashed with bcrypt (precomputed)

// For simplicity, in this demo, we'll do client-side check with bcryptjs
// Note: In production, always do authentication server-side

// Load bcryptjs
const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js";
document.head.appendChild(script);

script.onload = () => {
  document.getElementById('login-form').addEventListener('submit', verifyLogin);
};

function verifyLogin(e) {
  e.preventDefault();
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');

  if (email === adminEmail) {
    // Compare password
    bcrypt.compare(password, adminPasswordHash, (err, res) => {
      if(res) {
        // Login success
        showAdminPanel();
      } else {
        errorDiv.innerText = "Invalid credentials.";
      }
    });
  } else {
    errorDiv.innerText = "Only admin can login.";
  }
}

function showAdminPanel() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
}

// User management functions
function addUser() {
  const email = document.getElementById('new-user-email').value;
  if(email && !users[email]) {
    users[email] = { banned: false };
    alert('User added: ' + email);
  } else {
    alert('Invalid or existing user');
  }
}

function banUser() {
  const email = document.getElementById('ban-user-email').value;
  if(users[email]) {
    users[email].banned = true;
    alert('User banned: ' + email);
  } else {
    alert('User not found');
  }
}

function removeUser() {
  const email = document.getElementById('remove-user-email').value;
  if(users[email]) {
    delete users[email];
    alert('User removed: ' + email);
  } else {
    alert('User not found');
  }
}

// Redirection with countdown
function startRedirect() {
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('redirect-page').style.display = 'block';

  let seconds = 3;
  const countdownDiv = document.getElementById('countdown');
  countdownDiv.innerText = `Redirecting in ${seconds} seconds...`;

  const interval = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      countdownDiv.innerText = `Redirecting in ${seconds} seconds...`;
    } else {
      clearInterval(interval);
      loadIframePage();
    }
  }, 1000);
}

function loadIframePage() {
  document.getElementById('redirect-page').style.display = 'none';
  document.getElementById('iframe-page').style.display = 'block';

  const iframe = document.getElementById('content-iframe');
  iframe.src = "https://www-premiumweb.starsclm.com/";
  setupIframeLinkHandling(iframe);
}

// Handle links inside iframe
function setupIframeLinkHandling(iframe) {
  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const links = doc.querySelectorAll('a[href]');
      links.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const url = link.href;
          if (url.includes('.com/')) {
            window.open(url, '_blank');
          } else {
            iframe.src = url;
          }
        });
      });
    } catch (e) {
      console.log('Cross-origin iframe, cannot access links.');
    }
  };
}