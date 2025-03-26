// Firebase configuration (replace with your own)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM elements
const usernameInput = document.getElementById('username');
const signInBtn = document.getElementById('signInBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');

let username = '';

// Sign in function
signInBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
        username = name;
        usernameInput.disabled = true;
        signInBtn.disabled = true;
        messageInput.disabled = false;
        sendBtn.disabled = false;
        
        // Load previous messages
        loadMessages();
    }
});

// Send message function
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const message = {
            text: messageText,
            sender: username,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        // Push message to Firebase
        database.ref('messages').push(message);
        messageInput.value = '';
    }
}

// Load and listen for new messages
function loadMessages() {
    database.ref('messages').on('child_added', (snapshot) => {
        const message = snapshot.val();
        displayMessage(message);
    });
}

// Display a message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Style differently if it's the current user's message
    if (message.sender === username) {
        messageElement.style.marginLeft = 'auto';
        messageElement.style.backgroundColor = '#4285f4';
        messageElement.style.color = 'white';
    }
    
    messageElement.innerHTML = `
        <strong>${message.sender}:</strong> ${message.text}
        <div class="timestamp" style="font-size: 0.8em; color: #666;">
            ${new Date(message.timestamp).toLocaleTimeString()}
        </div>
    `;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
