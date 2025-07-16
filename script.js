// Smooth scrolling and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth animations on load
    const mainContent = document.querySelector('.main-content');
    const socialIcons = document.querySelector('.social-icons');
    const aiButton = document.querySelector('.ai-chat-button');
    
    // Fade in animations
    setTimeout(() => {
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 500);
    
    setTimeout(() => {
        socialIcons.style.opacity = '1';
        socialIcons.style.transform = 'translateX(0)';
    }, 1000);
    
    setTimeout(() => {
        aiButton.style.opacity = '1';
        aiButton.style.transform = 'scale(1)';
    }, 1500);


});

// Button functions
function exploreServices() {
    // Open pricing modal
    document.getElementById('pricingModal').style.display = 'block';
}

function getInTouch() {
    // Open contact modal or redirect to contact page
    const email = 'Ynkstudio.uw@gmail.com';
    const subject = 'Inquiry from YNK Studios Website';
    const body = 'Hello YNK Studios team,\n\nI am interested in learning more about your services.\n\nBest regards,';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

function findStudios() {
    // Open locations modal
    document.getElementById('locationsModal').style.display = 'block';
    // Initialize map after modal is shown
    setTimeout(initializeMap, 300);
}

// Pricing Modal Functions
function closePricingModal() {
    document.getElementById('pricingModal').style.display = 'none';
}

// Locations Modal Functions
function closeLocationsModal() {
    document.getElementById('locationsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const pricingModal = document.getElementById('pricingModal');
    const locationsModal = document.getElementById('locationsModal');
    
    if (event.target === pricingModal) {
        pricingModal.style.display = 'none';
    }
    if (event.target === locationsModal) {
        locationsModal.style.display = 'none';
    }
}

// Enhanced Chat Bot Functions
let chatOpen = false;
let chatMinimized = false;
let conversationHistory = [];
let chatSettings = {
    temperature: 0.7,
    maxTokens: 500
};
let messageCount = 1;
let totalTokens = 50;

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    const welcomeTime = document.getElementById('welcomeTime');
    if (welcomeTime) {
        welcomeTime.textContent = getCurrentTime();
    }
    updateCharacterCount();
    updateSendButton();
});

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function toggleChat() {
    const chatBot = document.getElementById('chatBot');
    const chatOverlay = document.getElementById('chatOverlay');
    const notification = document.getElementById('chatNotification');
    
    if (!chatOpen) {
        // Show overlay and chat with animation
        chatOverlay.classList.add('show');
        chatBot.classList.add('show');
        chatBot.style.display = 'flex';
        
        chatOpen = true;
        chatMinimized = false;
        if (notification) notification.style.display = 'none';
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus on input when chat opens (delay for animation)
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 400);
        
        // Hide suggestions after first interaction
        setTimeout(() => {
            hideSuggestions();
        }, 5000);
    } else {
        closeChat();
    }
}

function closeChat() {
    const chatBot = document.getElementById('chatBot');
    const chatOverlay = document.getElementById('chatOverlay');
    
    // Animate out
    chatBot.style.animation = 'modalSlideOut 0.3s ease-in';
    chatOverlay.style.animation = 'overlayFadeOut 0.3s ease-in';
    
    setTimeout(() => {
        chatOverlay.classList.remove('show');
        chatBot.classList.remove('show');
        chatBot.style.display = 'none';
        
        // Reset animations
        chatBot.style.animation = '';
        chatOverlay.style.animation = '';
        
        // Re-enable body scroll
        document.body.style.overflow = 'auto';
    }, 300);
    
    chatOpen = false;
    chatMinimized = false;
}

function minimizeChat() {
    const chatBot = document.getElementById('chatBot');
    if (!chatMinimized) {
        chatBot.style.height = '80px';
        chatBot.querySelector('.chat-body').style.display = 'none';
        chatBot.querySelector('.chat-suggestions').style.display = 'none';
        chatBot.querySelector('.chat-input-container').style.display = 'none';
        chatBot.style.borderRadius = '40px';
        chatMinimized = true;
    } else {
        chatBot.style.height = '700px';
        chatBot.querySelector('.chat-body').style.display = 'flex';
        chatBot.querySelector('.chat-suggestions').style.display = 'flex';
        chatBot.querySelector('.chat-input-container').style.display = 'block';
        chatBot.style.borderRadius = '24px';
        chatMinimized = false;
    }
}

// Settings Panel Functions
function openChatSettings() {
    const settings = document.getElementById('chatSettings');
    settings.style.display = 'block';
}

function closeChatSettings() {
    const settings = document.getElementById('chatSettings');
    settings.style.display = 'none';
}

function updateTemperature() {
    const temp = document.getElementById('temperatureSlider').value;
    chatSettings.temperature = parseFloat(temp);
    document.getElementById('temperatureValue').textContent = temp;
}

function updateMaxTokens() {
    chatSettings.maxTokens = parseInt(document.getElementById('maxTokens').value);
}

function updateChatStatus() {
    const status = document.getElementById('chatStatus');
    status.textContent = `Online • Powered by Grok 3`;
}

// Message Management
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        conversationHistory = [];
        const chatMessages = document.getElementById('chatMessages');
        // Keep only the welcome message
        const welcomeMessage = chatMessages.firstElementChild;
        chatMessages.innerHTML = '';
        chatMessages.appendChild(welcomeMessage);
        
        messageCount = 1;
        totalTokens = 50;
        updateConversationInfo();
        showSuggestions();
    }
}

function exportChat() {
    const messages = document.querySelectorAll('.message');
    let chatText = 'YNK Studios Chat Export\n';
    chatText += '=========================\n\n';
    
    messages.forEach(message => {
        const sender = message.classList.contains('bot-message') ? 'INK AI' : 'User';
        const content = message.querySelector('p').textContent;
        chatText += `${sender}: ${content}\n\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ynk-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Input Handling
function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResizeInput() {
    const textarea = document.getElementById('chatInput');
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    updateCharacterCount();
    updateSendButton();
}

function updateCharacterCount() {
    const input = document.getElementById('chatInput');
    const count = document.getElementById('characterCount');
    if (count) {
        count.textContent = `${input.value.length}/2000`;
        
        if (input.value.length > 1800) {
            count.style.color = '#f87171';
        } else {
            count.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }
}

function updateSendButton() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendButton');
    if (sendBtn) {
        sendBtn.disabled = !input.value.trim();
    }
}

// Suggestions
function sendSuggestion(message) {
    document.getElementById('chatInput').value = message;
    updateCharacterCount();
    updateSendButton();
    sendMessage();
}

function hideSuggestions() {
    const suggestions = document.getElementById('chatSuggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
}

function showSuggestions() {
    const suggestions = document.getElementById('chatSuggestions');
    if (suggestions) {
        suggestions.style.display = 'flex';
    }
}

// Voice Input (placeholder)
function toggleVoiceInput() {
    alert('Voice input feature coming soon!');
}

// File Attachment (placeholder)
function attachFile() {
    alert('File attachment feature coming soon!');
}

// Message Actions
function copyMessage(button) {
    const messageContent = button.closest('.message-content').querySelector('p').textContent;
    navigator.clipboard.writeText(messageContent).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
}

function regenerateResponse(button) {
    if (conversationHistory.length < 2) return;
    
    // Remove last bot response from history
    conversationHistory.pop();
    
    // Remove the message from UI
    button.closest('.message').remove();
    
    // Resend the last user message
    const lastUserMessage = conversationHistory[conversationHistory.length - 1].content;
    sendMessageInternal(lastUserMessage, false);
}

// Main Send Message Function
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || message.length > 2000) return;
    
    sendMessageInternal(message, true);
}

async function sendMessageInternal(message, addToUI) {
    const input = document.getElementById('chatInput');
    
    if (addToUI) {
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        updateCharacterCount();
        updateSendButton();
        
        // Hide suggestions after first message
        hideSuggestions();
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Add user message to conversation history
        if (addToUI) {
            conversationHistory.push({
                role: 'user',
                content: message
            });
        }
        
        // Prepare messages array with YNK Studios system prompt
        let messages = [{
            role: 'system',
            content: `You are INK AI, a professional assistant for YNK Studios, a premier multimedia production company. You help customers understand our services and find what they need.

YNK Studios offers these services with pricing:

🎥 VIDEO PRODUCTION:
- Basic Social Media Video (up to 1 min): $95 | €90 | 107,000 RWF (3 days, Pro tier)
- Corporate Promo Video: $225 | €210 | 256,500 RWF (7 days, Agency tier)
- Event Video Coverage (half-day): $160 | €150 | 190,000 RWF (5 days, Studio tier)
- Short-form Reel Editing: $55 | €50 | 61,000 RWF (2 days, Starter tier)

📸 PHOTOGRAPHY:
- Product Photography (5 items): $90 | €85 | 104,000 RWF (3 days, Pro tier)
- Portrait/Branding Shoot: $95 | €90 | 107,000 RWF (2-4 days, Studio tier)
- Event Photography (Half-day): $125 | €120 | 142,500 RWF (4 days, Studio tier)
- Social Media Mini-Shoot: $55 | €50 | 61,000 RWF (2 days, Starter tier)

🎧 AUDIO PRODUCTION:
- Voice-Over Recording (up to 60s): $65 | €60 | 75,000 RWF (2 days, Pro tier)
- Podcast Editing (up to 30 min): $90 | €85 | 104,000 RWF (3 days, Pro tier)
- Music Track Mixing & Mastering: $145 | €135 | 166,500 RWF (5 days, Studio tier)
- Jingle/Intro Sound Design: $80 | €75 | 90,000 RWF (3 days, Pro tier)

🛸 DRONE SERVICES:
- Aerial Photo Pack (5 shots): $85 | €80 | 95,000 RWF (3 days, Pro tier)
- Drone Video Clip (30 sec): $105 | €100 | 123,500 RWF (3-4 days, Pro tier)
- Drone Operator Hire (per hour): $75 | €70 | 85,500 RWF (Agency tier)

🎨 GRAPHICS:
- Logo Design (3 concepts): $125 | €120 | 142,500 RWF (4-5 days, Studio tier)
- Business Card/Flyer Design: $55 | €50 | 61,000 RWF (2 days, Starter tier)
- Social Media Graphic Set (3 posts): $60 | €55 | 66,500 RWF (3 days, Pro tier)
- Brand Guideline Mini Kit: $145 | €135 | 166,500 RWF (5-6 days, Studio tier)

🌐 WEB DEVELOPMENT:
- Landing Page: $125 | €120 | 142,500 RWF (5 days, Pro tier)
- Full Website (4-6 pages): $345 | €325 | 395,000 RWF (10-14 days, Agency tier)
- E-commerce Setup (up to 10 products): $225 | €210 | 256,500 RWF (8 days, Agency tier)

💻 SOFTWARE DEVELOPMENT:
- Custom App Prototype (No-Code): $195 | €185 | 222,500 RWF (7 days, Studio tier)
- Backend Automation Script: $90 | €85 | 104,000 RWF (3-4 days, Pro tier)
- Database Design: $75 | €70 | 85,500 RWF (3 days, Pro tier)
- API Integration: $95 | €90 | 107,000 RWF (4 days, Studio tier)

📲 DIGITAL MARKETING:
- Social Media Management (per week): $105 | €100 | 123,500 RWF (Ongoing, Subscription tier)
- Ad Campaign Setup: $95 | €90 | 107,000 RWF (3 days, Pro tier)
- Email Marketing Flow (3 emails): $75 | €70 | 85,500 RWF (3 days, Pro tier)
- SEO Optimization (basic): $85 | €80 | 95,000 RWF (4 days, Pro tier)

🏢 STUDIO LOCATIONS & CONTACT:

🇷🇼 KIGALI STUDIO (Main Operations Hub):
- Address: KG 313 St, Kibagabaga, Kigali, Rwanda
- Phone: +250 784 950 661
- Email: Ynkstudio.uw@gmail.com
- Services: All multimedia services + Equipment rentals available

🇧🇪 BELGIUM STUDIO (European Operations):
- Address: Oudebaan 106, Bierbeek, Belgium
- Phone: +32 456 930 766
- Email: Ynkstudio.uw@gmail.com
- Services: International projects and European client services

📧 General Inquiries: Ynkstudio.uw@gmail.com

Be conversational, helpful, and guide customers to the right services. When discussing contact or locations, mention both studios and help them choose the most convenient one. Ask follow-up questions to understand their needs better. Keep responses engaging and informative.`
        }];
        
        // Keep only last 10 messages to avoid token limit
        let historyToSend = conversationHistory;
        if (historyToSend.length > 10) {
            historyToSend = historyToSend.slice(-10);
        }
        
        messages = messages.concat(historyToSend);
        
        // Call the API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-3',
                messages: messages,
                temperature: chatSettings.temperature,
                max_tokens: chatSettings.maxTokens
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get response from AI');
        }
        
        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        
        // Add AI response to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: aiMessage
        });
        
        // Hide typing indicator and add response
        hideTypingIndicator();
        addMessageToChat(aiMessage, 'bot');
        
        // Update usage stats
        if (data.usage) {
            totalTokens += data.usage.total_tokens || 50;
        } else {
            totalTokens += 50; // Estimate
        }
        updateConversationInfo();
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessageToChat('Sorry, I encountered an error. Please try again later. For immediate assistance, contact us at Ynkstudio.uw@gmail.com or call +250784950661.', 'bot');
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.classList.add('message-avatar');
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-brain"></i>' : '<i class="fas fa-user"></i>';
    
    // Create content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    const messageHeader = document.createElement('div');
    messageHeader.classList.add('message-header');
    messageHeader.innerHTML = `
        <span class="message-sender">${sender === 'bot' ? 'INK AI' : 'You'}</span>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    
    const messageActions = document.createElement('div');
    messageActions.classList.add('message-actions');
    messageActions.innerHTML = `
        <button class="msg-action-btn" onclick="copyMessage(this)" title="Copy">
            <i class="fas fa-copy"></i>
        </button>
        ${sender === 'bot' ? '<button class="msg-action-btn" onclick="regenerateResponse(this)" title="Regenerate"><i class="fas fa-redo"></i></button>' : ''}
    `;
    
    messageContent.appendChild(messageHeader);
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageActions);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Update message count
    if (sender === 'user') {
        messageCount++;
        updateConversationInfo();
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateConversationInfo() {
    const msgCount = document.getElementById('messageCount');
    const tokenUsage = document.getElementById('tokenUsage');
    if (msgCount) {
        msgCount.textContent = `${messageCount} message${messageCount === 1 ? '' : 's'}`;
    }
    if (tokenUsage) {
        tokenUsage.textContent = `~${totalTokens} tokens used`;
    }
}

function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.classList.add('show');
    }
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.classList.remove('show');
    }
}

// Legacy functions for backward compatibility
async function quickAction(action) {
    let message = '';
    switch(action) {
        case 'services':
            message = 'I\'d like to know about your services';
            break;
        case 'pricing':
            message = 'Can you show me your pricing?';
            break;
        case 'contact':
            message = 'How can I contact you?';
            break;
    }
    
    sendSuggestion(message);
}

// Compatibility functions for old typing indicator
function addTypingIndicator() {
    showTypingIndicator();
}

function removeTypingIndicator() {
    hideTypingIndicator();
}

// Tab functionality for pricing modal
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event.target;
    clickedButton.classList.add('active');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(139, 69, 196, 0.95);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 1000;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        transition: background 0.2s ease;
    }
    
    .notification .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .main-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .social-icons {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.8s ease;
    }
    
    .ai-chat-button {
        opacity: 0;
        transform: scale(0);
        transition: all 0.8s ease;
    }
`;
document.head.appendChild(style);

// Parallax effect for background elements
window.addEventListener('mousemove', (e) => {
    const circles = document.querySelectorAll('.circle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        
        circle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Scroll indicator functionality
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Map initialization for locations modal
let locationsMap = null;

function initializeMap() {
    // Only initialize if map container exists and is visible
    const mapContainer = document.getElementById('locations-map');
    if (!mapContainer || mapContainer.offsetWidth === 0) {
        return;
    }

    // Remove existing map if it exists
    if (locationsMap) {
        locationsMap.remove();
        locationsMap = null;
    }

    try {
        // Initialize the map
        locationsMap = L.map('locations-map', {
            zoomControl: true,
            scrollWheelZoom: false,
            doubleClickZoom: true,
            touchZoom: true,
            dragging: true,
            zoomSnap: 0.5
        }).setView([25.0, 17.0], 2.5);

        // Add tile layer matching website dark theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 18
        }).addTo(locationsMap);

        // Custom studio icon
        var studioIcon = L.divIcon({
            html: '<div style="background: linear-gradient(135deg, #8a2be2 0%, #9932cc 100%); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; box-shadow: 0 8px 20px rgba(138, 43, 226, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.3); cursor: pointer; border: 2px solid rgba(255, 255, 255, 0.2);">🐱</div>',
            className: 'ynk-studio-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add markers
        var kigaliMarker = L.marker([-1.9441, 30.0619], {icon: studioIcon}).addTo(locationsMap);
        kigaliMarker.bindPopup(`
            <div class="map-popup">
                <h4>🇷🇼 Kigali Studio</h4>
                <p><strong>📍</strong> KG 313 St, Kibagabaga</p>
                <p><strong>📞</strong> +250 784 950 661</p>
                <p><strong>🎯</strong> Main Operations & Equipment</p>
                <a href="tel:+250784950661" class="map-popup-btn">📞 Call Studio</a>
            </div>
        `);

        var belgiumMarker = L.marker([50.8298, 4.7605], {icon: studioIcon}).addTo(locationsMap);
        belgiumMarker.bindPopup(`
            <div class="map-popup">
                <h4>🇧🇪 Belgium Studio</h4>
                <p><strong>📍</strong> Oudebaan 106, Bierbeek</p>
                <p><strong>📞</strong> +32 456 930 766</p>
                <p><strong>🎯</strong> European Operations</p>
                <a href="tel:+32456930766" class="map-popup-btn">📞 Call Studio</a>
            </div>
        `);

        // Connection line between studios
        var connectionLine = L.polyline([
            [-1.9441, 30.0619], // Kigali
            [50.8298, 4.7605]   // Belgium
        ], {
            color: '#8a2be2',
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 12'
        }).addTo(locationsMap);

        // Fit bounds to show both markers
        var group = new L.featureGroup([kigaliMarker, belgiumMarker]);
        locationsMap.fitBounds(group.getBounds().pad(0.15));

        // Interactive studio cards
        document.querySelectorAll('.studio-card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons
                if (e.target.closest('.studio-btn')) return;

                const studio = card.getAttribute('data-studio');

                if (studio === 'kigali') {
                    locationsMap.setView([-1.9441, 30.0619], 10);
                    setTimeout(() => kigaliMarker.openPopup(), 500);
                } else {
                    locationsMap.setView([50.8298, 4.7605], 10);
                    setTimeout(() => belgiumMarker.openPopup(), 500);
                }
            });
        });

        console.log('YNK Studios locations map initialized successfully');

    } catch (error) {
        console.error('Error initializing map:', error);
        // Show fallback content
        const mapContainer = document.getElementById('locations-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #2d1b4e 0%, #4a2c6b 100%); color: white; text-align: center; padding: 40px; border-radius: 15px;">
                    <div>
                        <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                        <h3>Studio Locations</h3>
                        <p><strong>🇷🇼 Kigali:</strong> KG 313 St, Kibagabaga</p>
                        <p><strong>🇧🇪 Belgium:</strong> Oudebaan 106, Bierbeek</p>
                    </div>
                </div>
            `;
        }
    }
} 