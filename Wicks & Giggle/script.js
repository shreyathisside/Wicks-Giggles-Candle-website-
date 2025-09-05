document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.querySelector('.user-icon');
    const userDropdown = document.querySelector('.user-dropdown');
    const loginModal = document.querySelector('.login-modal');
    const signupModal = document.querySelector('.signup-modal');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const switchToSignup = document.querySelector('.switch-to-signup');
    const switchToLogin = document.querySelector('.switch-to-login');
    const closeModals = document.querySelectorAll('.close-modal');

    // Dropdown option
    userIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Login Button clicking
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
        userDropdown.style.display = 'none';
    });

    // Signup button clicking
    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'flex';
        userDropdown.style.display = 'none';
    });

    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    closeModals.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-icon-container')) {
            userDropdown.style.display = 'none';
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Response submissions
    document.querySelector('.login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-password').value;
        console.log('Login attempt:', { email, password });
        showMessage('Login successful!', 'success');
        loginModal.style.display = 'none';
    });

    document.querySelector('.signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('#signup-name').value;
        const email = document.querySelector('#signup-email').value;
        const password = document.querySelector('#signup-password').value;
        const confirmPassword = document.querySelector('#signup-confirm-password').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'error');
            return;
        }

        console.log('Signup attempt:', { name, email, password });
        showMessage('Account created successfully!', 'success');
        signupModal.style.display = 'none';
    });
});

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.hero, .featured-products');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    document.querySelectorAll('.hero, .featured-products').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    window.addEventListener('scroll', animateOnScroll);
    // Runs when page scrolls
    animateOnScroll();
});

// functionality of cart
let cart = [];
let total = 0;

const cartModal = document.createElement('div');
cartModal.className = 'cart-modal';
cartModal.innerHTML = `
    <div class="cart-content">
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button class="close-cart"><i class="fas fa-times"></i></button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-total">
            <span>Total: $<span class="total-amount">0.00</span></span>
        </div>
        <div class="cart-actions">
            <button class="checkout-btn">Proceed to Checkout</button>
        </div>
    </div>
`;

// Modal for order Confirmation
const confirmationModal = document.createElement('div');
confirmationModal.className = 'confirmation-modal';
confirmationModal.innerHTML = `
    <div class="confirmation-content">
        <div class="confirmation-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <button class="close-confirmation">Continue Shopping</button>
    </div>
`;
document.body.appendChild(cartModal);
document.body.appendChild(confirmationModal);

// Cart count updation(Navbar)
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Functionality of add to cart button
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('img').src;

            // Add to cart
            cart.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            // Update the total amount
            total += productPrice;
            
            // Update cart items that display and also count them
            updateCart();
            updateCartCount();

            // Added to cart successfully message
            const successMessage = document.createElement('div');
            successMessage.className = 'add-to-cart-success';
            successMessage.textContent = 'Added to cart!';
            productCard.appendChild(successMessage);

            // For removing the successful message after 2 Seconds
            setTimeout(() => {
                successMessage.remove();
            }, 2000);
        });
    });
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
    }
});

function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    if (!cartItems || !totalAmount) return;

    cartItems.innerHTML = '';
    total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">×</button>
        `;
        cartItems.appendChild(cartItem);
        
        total += item.price * item.quantity;
    });

    totalAmount.textContent = total.toFixed(2);
}

// Shows cart modal
function showCart() {
    cartModal.style.display = 'flex';
}

// Closes cart modal
document.querySelector('.close-cart').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Handles quantity changes and also the item removed
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quantity-btn')) {
        const index = parseInt(e.target.dataset.index);
        if (e.target.classList.contains('plus')) {
            cart[index].quantity++;
        } else if (e.target.classList.contains('minus')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        }
        updateCart();
        updateCartCount();
    }
    
    if (e.target.classList.contains('remove-item')) {
        const index = parseInt(e.target.dataset.index);
        cart.splice(index, 1);
        updateCart();
        updateCartCount();
    }
});

// Closing cart modal while clicking outside
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
});

// Checkout functionality
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        cartModal.style.display = 'none';
        confirmationModal.style.display = 'flex';
        cart = [];
        total = 0;
        updateCart();
        updateCartCount();
    }
});

// Closes confirmation modal
document.querySelector('.close-confirmation').addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

// Closing confirmation modal when clicks outside
window.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
});

// Featured Candle Slider
const featuredCandles = [
    {
        name: "Lavender Fields",
        description: "Experience the calming essence of fresh lavender fields with our premium soy wax candle. Perfect for creating a peaceful atmosphere in your home.",
        image: "https://img.freepik.com/free-photo/birthday-cake-decorated-with-flowers_23-2148016166.jpg?ga=GA1.1.2089959426.1739510090&semt=ais_hybrid&w=740",
        details: {
            burnTime: "60 hours",
            size: "8 oz",
            fragrance: "Lavender, Bergamot, Vanilla"
        }
    },
    {
        name: "Vanilla Dreams",
        description: "Indulge in the sweet, comforting aroma of vanilla with hints of caramel. This candle creates a warm and inviting atmosphere in any room.",
        image: "https://img.freepik.com/free-photo/fluffy-cotton-plant-with-buds_23-2151104655.jpg?ga=GA1.1.2089959426.1739510090&semt=ais_hybrid&w=740",
        details: {
            burnTime: "50 hours",
            size: "6 oz",
            fragrance: "Vanilla, Caramel, Musk"
        }
    },
    {
        name: "Ocean Breeze",
        description: "Bring the refreshing scent of the ocean into your home. This candle combines sea salt with fresh citrus notes for a clean, invigorating fragrance.",
        image: "https://img.freepik.com/free-photo/large-beautiful-candle-eucalyptus-twigs-white-background-isolated_169016-25947.jpg?ga=GA1.1.2089959426.1739510090&semt=ais_hybrid&w=740",
        details: {
            burnTime: "55 hours",
            size: "8 oz",
            fragrance: "Sea Salt, Citrus, Driftwood"
        }
    }
];

let currentSlide = 0;

function updateFeaturedCandle() {
    const candle = featuredCandles[currentSlide];
    const featuredImage = document.querySelector('.featured-image img');
    const featuredInfo = document.querySelector('.featured-info');
    
    // Preload the image to prevent flickering
    const img = new Image();
    img.src = candle.image;
    img.onload = function() {
        featuredImage.src = candle.image;
        featuredImage.alt = candle.name;
    };
    
    featuredInfo.innerHTML = `
        <h3>${candle.name}</h3>
        <p>${candle.description}</p>
        <div class="candle-details">
            <p><strong>Burn Time:</strong> ${candle.details.burnTime}</p>
            <p><strong>Size:</strong> ${candle.details.size}</p>
            <p><strong>Fragrance:</strong> ${candle.details.fragrance}</p>
        </div>
    `;
}

// Add smooth transition effect
document.querySelector('.slider-btn.prev').addEventListener('click', () => {
    const featuredImage = document.querySelector('.featured-image img');
    featuredImage.style.opacity = '0';
    setTimeout(() => {
        currentSlide = (currentSlide - 1 + featuredCandles.length) % featuredCandles.length;
        updateFeaturedCandle();
        featuredImage.style.opacity = '1';
    }, 300);
});

document.querySelector('.slider-btn.next').addEventListener('click', () => {
    const featuredImage = document.querySelector('.featured-image img');
    featuredImage.style.opacity = '0';
    setTimeout(() => {
        currentSlide = (currentSlide + 1) % featuredCandles.length;
        updateFeaturedCandle();
        featuredImage.style.opacity = '1';
    }, 300);
});

// Initialize the slider
updateFeaturedCandle(); 