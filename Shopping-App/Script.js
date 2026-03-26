
    // ── Cart data: keyed by product id (p1, m1, etc.) ──
    const cart = {};

    // ── Attach click listener to every "Add to Bag" button ──
    document.querySelectorAll('.btn-atb').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id    = btn.getAttribute('data-id');
            var name  = btn.getAttribute('data-name');
            var price = parseInt(btn.getAttribute('data-price'));
            var mrp   = parseInt(btn.getAttribute('data-mrp'));

            if (cart[id]) {
                cart[id].qty += 1;
            } else {
                cart[id] = { id: id, name: name, price: price, mrp: mrp, qty: 1 };
            }

            // Visual feedback on button
            btn.textContent = '✓ Added!';
            btn.style.backgroundColor = '#ff3f6c';
            btn.style.color = 'white';
            setTimeout(function() {
                btn.textContent = 'Add to Bag';
                btn.style.backgroundColor = 'rgb(178, 255, 153)';
                btn.style.color = '#000';
            }, 900);

            renderCart();
        });
    });

    // ── Remove item from cart ──
    function removeItem(id) {
        delete cart[id];
        renderCart();
    }

    // ── Change quantity (+/-) ──
    function changeQty(id, delta) {
        if (!cart[id]) return;
        cart[id].qty += delta;
        if (cart[id].qty <= 0) {
            delete cart[id];
        }
        renderCart();
    }

    // ── Render cart sidebar contents ──
    function renderCart() {
        var items      = Object.values(cart);
        var totalQty   = items.reduce(function(s, i) { return s + i.qty; }, 0);
        var totalMRP   = items.reduce(function(s, i) { return s + i.mrp   * i.qty; }, 0);
        var totalPrice = items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
        var discount   = totalMRP - totalPrice;

        // Badge
        document.getElementById('bagCount').textContent = totalQty;

        var cartItemsEl = document.getElementById('cartItems');
        var cartFooter  = document.getElementById('cartFooter');

        // Clear previous content
        cartItemsEl.innerHTML = '';

        // Empty state
        if (items.length === 0) {
            cartItemsEl.innerHTML =
                '<div class="cart-empty">' +
                    '<span class="material-symbols-outlined" style="font-size:60px;color:#ccc;">shopping_bag</span>' +
                    '<p>Your bag is empty!</p>' +
                    '<small>Add items to get started</small>' +
                '</div>';
            cartFooter.style.display = 'none';
            return;
        }

        // Render each item
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML =
                '<div class="cart-item-info">' +
                    '<div class="cart-item-name">' + item.name + '</div>' +
                    '<div class="cart-item-prices">' +
                        '<span class="cart-item-new">&#8377;' + item.price + '</span>' +
                        '<span class="cart-item-old">&#8377;' + item.mrp + '</span>' +
                        '<span class="cart-item-save">Save &#8377;' + (item.mrp - item.price) + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="cart-item-controls">' +
                    '<div class="qty-controls">' +
                        '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">&#8722;</button>' +
                        '<span class="qty-num">' + item.qty + '</span>' +
                        '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
                    '</div>' +
                    '<div class="cart-item-total">&#8377;' + (item.price * item.qty) + '</div>' +
                    '<button class="remove-btn" onclick="removeItem(\'' + item.id + '\')">&#128465; Remove</button>' +
                '</div>';
            cartItemsEl.appendChild(div);
        });

        // Summary
        document.getElementById('totalMRP').textContent      = '&#8377;' + totalMRP;
        document.getElementById('totalDiscount').textContent  = '-&#8377;' + discount;
        document.getElementById('totalAmount').textContent    = '&#8377;' + totalPrice;

        // Use innerHTML for ₹ symbol rendering
        document.getElementById('totalMRP').innerHTML      = '&#8377;' + totalMRP;
        document.getElementById('totalDiscount').innerHTML = '-&#8377;' + discount;
        document.getElementById('totalAmount').innerHTML   = '&#8377;' + totalPrice;

        cartFooter.style.display = 'block';
    }

    // ── Toggle cart sidebar ──
    function toggleCart() {
        var sidebar = document.getElementById('cartSidebar');
        var overlay = document.getElementById('cartOverlay');
        var isOpen  = sidebar.classList.contains('open');
        if (isOpen) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        } else {
            sidebar.classList.add('open');
            overlay.classList.add('open');
        }
    }

    // ── Checkout ──
    function checkout() {
        var items = Object.values(cart);
        if (items.length === 0) return;
        var total = items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
        alert('🎉 Order Placed Successfully!\n\nTotal Paid: ₹' + total + '\n\nThank you for shopping with Myntra! 🛍️');
        // Clear cart
        Object.keys(cart).forEach(function(k) { delete cart[k]; });
        renderCart();
        toggleCart();
    }

    // Initialise with empty state
    renderCart();


// tracking//-----------------------------------------
function showDeliveryDate() {
  const deliveryDays = Math.floor(Math.random() * 5) + 3;

  const today = new Date();
  today.setDate(today.getDate() + deliveryDays);

  document.getElementById("deliveryDate").textContent =
    "Delivery by: " + today.toDateString();
}

const steps = [
  "Order Placed ✅",
  "Packed 📦",
  "Shipped 🚚",
  "Out for Delivery 🏠",
  "Delivered 🎉"
];

let currentStep = 0;

function updateTracking() {
  document.getElementById("status").textContent = steps[currentStep];

  if (currentStep < steps.length - 1) {
    currentStep++;
    setTimeout(updateTracking, 3000);
  }
}

// ==================
function placeOrder() {
  alert("Order Placed Successfully!");

  showDeliveryDate();
  updateTracking();
}

// ========================================
const API = 'http://localhost:8080/api/auth';

// Check login
async function checkSession() {
    const res = await fetch(API + '/me', { credentials: 'include' });
    if (res.ok) {
        const data = await res.json();
        document.getElementById('profileName').textContent = data.username;
    }
}

// Login function
async function loginUser() {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");

    const res = await fetch(API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Welcome " + data.username);
        checkSession();
    } else {
        alert(data.message);
    }
}

// Register
async function registerUser() {
    const username = prompt("Create username:");
    const password = prompt("Create password:");

    const res = await fetch(API + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
}

// Logout
async function logoutUser() {
    await fetch(API + '/logout', { method: 'POST', credentials: 'include' });
    alert("Logged out");
    location.reload();
}

// Call session check on load
checkSession();

