const healthQuotes = [
    "\"The greatest wealth is health.\" - Virgil",
    "\"Heal yourself, change the world.\" - Nicole Foss",
    "\"Health is a state of complete harmony of the body, mind and spirit. - B.K.S. Iyengar\"",
    "\"Take care of your body. It's the only place you have to live. - Jim Rohn\"",
    "\"To enjoy the glow of good health, you must exercise. - Gene Tunney\""
];

// Only run quote animation if the element exists (homepage only)
const quoteTextElement = document.getElementById('quote-text');
if (quoteTextElement) {
    let currentQuoteIndex = 0;

    function changeAndAnimateQuote() {
        quoteTextElement.classList.add('fade-out');
        
        setTimeout(() => {
            quoteTextElement.textContent = healthQuotes[currentQuoteIndex];
            currentQuoteIndex = (currentQuoteIndex + 1) % healthQuotes.length;
            quoteTextElement.classList.remove('fade-out');
        }, 1000);
    }

    quoteTextElement.textContent = healthQuotes[currentQuoteIndex];
    currentQuoteIndex = 1;
    setInterval(changeAndAnimateQuote, 30 * 1000);
}

//Header shrink function 
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', function() {
        const logo = document.querySelector('.logo');
        const hamburger = document.querySelector('.hamburger');
        
        if (!logo) return;
        
        if (window.innerWidth > 768) {
            const minHeight = 50;
            const maxHeight = 100;
            const minLogoWidth = 100;
            const maxLogoWidth = 200;
            const scrollY = Math.min(window.scrollY, 100);
            const newHeight = maxHeight - ((maxHeight - minHeight) * (scrollY / 100));
            const newLogoWidth = maxLogoWidth - ((maxLogoWidth - minLogoWidth) * (scrollY / 100));
            
            header.style.minHeight = `${newHeight}px`;
            logo.style.width = `${newLogoWidth}px`;
        } else {
            if (window.scrollY > 30) {
                header.classList.add('shrink-mobile');
            } else {
                header.classList.remove('shrink-mobile');
            }
        }
    });
}

// Hamburger menu functionality 
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const body = document.body;

if (hamburger && nav) {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on overlay
    overlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        this.classList.remove('active');
        body.style.overflow = '';
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });
}


//daily tip part

// Four daily tips that change throughout the day
const tipSets = [
    // Set 1
    [
        { tip: "Drink at least 8 glasses of water today", emoji: "💧" },
        { tip: "Include vegetables in every meal", emoji: "🥦" },
        { tip: "Take a 15-minute walk outside", emoji: "🚶‍♀️" },
        { tip: "Practice 5 minutes of deep breathing", emoji: "🌬️" }
    ],
    // Set 2
    [
        { tip: "Choose whole fruits over processed snacks", emoji: "🍎" },
        { tip: "Get 7-8 hours of quality sleep", emoji: "😴" },
        { tip: "Stretch for 5 minutes when you wake up", emoji: "🧘‍♀️" },
        { tip: "Limit screen time before bed", emoji: "📵" }
    ],
    // Set 3
    [
        { tip: "Add protein to each meal", emoji: "🥚" },
        { tip: "Take the stairs instead of elevator", emoji: "🪜" },
        { tip: "Practice gratitude journaling", emoji: "📔" },
        { tip: "Choose water over sugary drinks", emoji: "💦" }
    ],
    // Set 4
    [
        { tip: "Include healthy fats like avocado", emoji: "🥑" },
        { tip: "Stand up and move every hour", emoji: "✨" },
        { tip: "Meditate for 3 minutes", emoji: "🧠" },
        { tip: "Get sunlight exposure daily", emoji: "☀️" }
    ],
    // Set 5
    [
        { tip: "Eat mindfully without distractions", emoji: "🍽️" },
        { tip: "Try a new physical activity", emoji: "🎯" },
        { tip: "Practice positive self-talk", emoji: "💬" },
        { tip: "Stay hydrated with herbal tea", emoji: "🍵" }
    ]
];

function showDailyTips() {
    const tipContainer = document.getElementById('daily-tip-content');
    if (!tipContainer) return;
    
    // Get day of the year to select which set to show
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Select tip set based on day of year
    const tipSetIndex = dayOfYear % tipSets.length;
    const dailyTips = tipSets[tipSetIndex];
    
    // Clear previous tips
    tipContainer.innerHTML = '';
    
    // Add all 4 tips from the selected set
    dailyTips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.innerHTML = `

            <p class="tip-text">${tip.emoji} ${tip.tip}</p>
        `;
        tipContainer.appendChild(tipElement);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    showDailyTips();
});

// Newsletter subscription functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const subscriptionMessage = document.getElementById('subscription-message');
    
    // Check if user is already subscribed
    const subscribedEmail = localStorage.getItem('newsletterSubscribed');
    if (subscribedEmail) {
        subscriptionMessage.textContent = `You're subscribed with: ${subscribedEmail}`;
        subscriptionMessage.style.color = '#90EE90'; // Light green
    }
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            // Store email in localStorage
            localStorage.setItem('newsletterSubscribed', email);
            
            // Show success message
            subscriptionMessage.textContent = 'Thank you for subscribing!';
            subscriptionMessage.style.color = '#90EE90'; // Light green
            
            // Clear input
            emailInput.value = '';
        } else {
            // Show error message
            subscriptionMessage.textContent = 'Please enter a valid email address.';
            subscriptionMessage.style.color = '#FF6B6B'; // Light red
        }
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});