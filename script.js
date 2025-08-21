document.addEventListener("DOMContentLoaded", function () {
  // Elements that may or may not exist on every page
  const openShopping = document.querySelector('.shopping');
  const closeShopping = document.querySelector('.closeshopping');
  const cart = document.querySelector('.card');
  const body = document.querySelector('body');

  const list = document.querySelector('.list');
  const listCard = document.querySelector('.listCard');
  const total = document.querySelector('.total');
  const quantity = document.querySelector('.quantity');

  const checkoutForm = document.getElementById('checkoutForm');
  const successMessage = document.getElementById('successMessage');
  const orderNumberEl = document.getElementById('orderNumber');
  const cardRadio = document.getElementById('card');
  const cardDetails = document.getElementById('cardDetails');
  const totalDisplay = document.getElementById('total');
  const shippingDisplay = document.getElementById('shipping');
  const subtotalDisplay = document.getElementById('subtotal');
  const orderItems = document.getElementById('orderItems');
  const orderSummaryField = document.getElementById('orderSummary');
  const shippingOptions = document.querySelectorAll('input[name="shippingOption"]');

  // NAVBAR TOGGLE (mobile menu)
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-navigation');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('show');  // This toggles your menu's visibility

    // Optional: You can toggle a class on body to prevent background scroll when menu open
    document.body.classList.toggle('nav-open');
  });
}


  // Products data — keep synced with your product list
  const products = [
    { id: 1, name: 'Combo', image: 'images/combo.png', price: 200 },
    { id: 2, name: 'Gift Box', image: 'images/gift box.png', price: 250},
    { id: 3, name: 'FOAM BATH (2L)', image: 'images/foam.png', price: 90 },
    { id: 4, name: 'BATH SALT (450g)', image: 'images/salt.png', price: 70 },
    { id: 5, name: 'Soap', image: 'images/soap.png', price: 20 },
    { id: 6, name: 'Fizz Balls', image: 'images/fizz balls.png', price: 20 },
   
    
  ];

  let listCards = []; // Cart array (products + quantity)

  // ---- Shopping cart open/close (only if elements exist) ----
  if (openShopping && closeShopping && cart && body) {
    openShopping.addEventListener('click', () => {
      cart.classList.add('open');
      body.classList.add('active');
    });

    closeShopping.addEventListener('click', () => {
      cart.classList.remove('open');
      body.classList.remove('active');
    });
  }

  // ---- Initialize product listing (on pages with product list container) ----
  function initApp() {
    if (!list) return; // skip if no product list container

    list.innerHTML = ''; // clear existing content

    products.forEach((product, index) => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('product-item');
      newDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="title">${product.name}</div>
        <div class="price">R${product.price.toFixed(2)}</div>
        <button class="cta-button" data-index="${index}">Add To Cart</button>
      `;
      list.appendChild(newDiv);
    });

    // Add event listeners for all add-to-cart buttons
    list.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'), 10);
        addToCart(index);
      });
    });
  }

  // ---- Add product to cart ----
  function addToCart(index) {
    if (index < 0 || index >= products.length) return;

    if (!listCards[index]) {
      listCards[index] = { ...products[index], quantity: 1 };
    } else {
      listCards[index].quantity++;
    }

    saveCartToStorage();
    reloadCart();
  }

  // ---- Reload cart UI ----
  function reloadCart() {
    if (!listCard || !total || !quantity) return;

    listCard.innerHTML = '';

    let count = 0;
    let totalPrice = 0;

    listCards = listCards.filter(item => item && item.quantity > 0);

    listCards.forEach((item, index) => {
      totalPrice += item.price * item.quantity;
      count += item.quantity;

      const newLi = document.createElement('li');
      newLi.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div>${item.name}</div>
        <div>R${item.price.toFixed(2)}</div>
        <div>
          <button class="btn-decrease" data-index="${index}">-</button>
          <span class="count">${item.quantity}</span>
          <button class="btn-increase" data-index="${index}">+</button>
        </div>
      `;
      listCard.appendChild(newLi);
    });

    total.innerText = `R${totalPrice.toFixed(2)}`;
    quantity.innerText = count;

    // Attach + and - event listeners
    listCard.querySelectorAll('.btn-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        changeQuantity(idx, listCards[idx].quantity - 1);
      });
    });

    listCard.querySelectorAll('.btn-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        changeQuantity(idx, listCards[idx].quantity + 1);
      });
    });
  }

  // ---- Change quantity of an item ----
  function changeQuantity(index, newQuantity) {
    if (index < 0 || index >= listCards.length) return;

    if (newQuantity <= 0) {
      listCards[index] = null;
    } else {
      if (listCards[index]) {
        listCards[index].quantity = newQuantity;
      }
    }

    saveCartToStorage();
    reloadCart();
  }

  // ---- Save cart to localStorage ----
  function saveCartToStorage() {
    try {
      const validItems = listCards.filter(item => item && item.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(validItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }

  // ---- Load cart from localStorage ----
  function loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        listCards = new Array(products.length).fill(null);

        cartItems.forEach(item => {
          const productIndex = products.findIndex(p => p.id === item.id);
          if (productIndex !== -1) {
            listCards[productIndex] = item;
          }
        });

        reloadCart();
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }

  // ---- Shipping options listener (if any) ----
  if (shippingOptions && shippingOptions.length > 0) {
    shippingOptions.forEach(option => {
      option.addEventListener('change', () => {
        loadCheckoutItems();
      });
    });
  }

  // ---- Load checkout page cart summary ----
  function loadCheckoutItems() {
    if (!orderItems) return;

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let subtotal = 0;
      let shipping = 0;
      let summaryText = '';

      if (cart.length > 0) {
        orderItems.innerHTML = '';

        cart.forEach(item => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          orderItems.innerHTML += `
            <div class="order-item">
              <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
              </div>
              <div class="item-price">R${itemTotal.toFixed(2)}</div>
            </div>
          `;
          summaryText += `${item.name} (x${item.quantity}) - R${itemTotal.toFixed(2)}\n`;
        });

        const needsShipping = document.querySelector('input[name="shippingOption"]:checked')?.value === 'delivery';
        if (needsShipping) {
          shipping = 65.00;
        }

        const totalVal = subtotal + shipping;

        if (subtotalDisplay) subtotalDisplay.textContent = `R${subtotal.toFixed(2)}`;
        if (shippingDisplay) shippingDisplay.textContent = `R${shipping.toFixed(2)}`;
        if (totalDisplay) totalDisplay.textContent = `R${totalVal.toFixed(2)}`;

        // Build order summary for form
        summaryText += `\nSubtotal: R${subtotal.toFixed(2)}\nShipping: R${shipping.toFixed(2)}\nTotal: R${totalVal.toFixed(2)}`;
        if(orderSummaryField) orderSummaryField.value = summaryText;

      } else {
        orderItems.innerHTML = '<p>Your cart is empty</p>';
        if(orderSummaryField) orderSummaryField.value = 'No items in cart.';
      }
    } catch (error) {
      console.error('Failed to load checkout items:', error);
      orderItems.innerHTML = '<p>Error loading cart items</p>';
    }
  }

  // ---- Payment method UI logic (optional, if you have card payment fields) ----
  if (checkoutForm) {
    const paymentMethods = checkoutForm.querySelectorAll('.payment-method');
    if (paymentMethods.length > 0) {
      paymentMethods.forEach(method => {
        method.addEventListener('click', function () {
          paymentMethods.forEach(m => m.classList.remove('selected'));
          this.classList.add('selected');

          const radio = this.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;

            if (cardDetails) {
              if (radio.value === 'card') {
                cardDetails.style.display = 'block';
                ['cardNumber', 'expiryDate', 'cvv', 'cardName'].forEach(id => {
                  const field = document.getElementById(id);
                  if (field) field.required = true;
                });
              } else {
                cardDetails.style.display = 'none';
                ['cardNumber', 'expiryDate', 'cvv', 'cardName'].forEach(id => {
                  const field = document.getElementById(id);
                  if (field) field.required = false;
                });
              }
            }
          }
        });
      });
    }
  }

  // ---- Card input formatting (if card fields exist) ----
  const cardNumberField = document.getElementById('cardNumber');
  if (cardNumberField) {
    cardNumberField.addEventListener('input', e => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      value = value.substring(0, 16);
      const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  const expiryField = document.getElementById('expiryDate');
  if (expiryField) {
    expiryField.addEventListener('input', e => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  const cvvField = document.getElementById('cvv');
  if (cvvField) {
    cvvField.addEventListener('input', e => {
      let value = e.target.value.replace(/\D/g, '');
      e.target.value = value.substring(0, 4);
    });
  }

  // ---- Checkout form submission ----
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      // Check all required fields manually
      const requiredFields = this.querySelectorAll('[required]');
      for (let field of requiredFields) {
        if (!field.value.trim()) {
          alert('⚠️ Please complete all required fields.');
          return;
        }
      }

      // Validate card details if card payment selected
      if (cardRadio && cardRadio.checked) {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const cardName = document.getElementById('cardName').value.trim();

        if (!cardNumber || !expiryDate || !cvv || !cardName) {
          alert('⚠️ Please fill in all card details.');
          return;
        }
      }

      // Generate order number & show success message
      if (orderNumberEl) {
        const orderNumber = 'PB' + Math.random().toString(36).substr(2, 9).toUpperCase();
        orderNumberEl.textContent = orderNumber;
      }

      if (successMessage) {
        successMessage.style.display = 'block';
      }

      // Hide form & reset
      this.style.display = 'none';
      this.reset();
      if (cardDetails) cardDetails.style.display = 'none';

      // Clear cart after delay
      setTimeout(() => {
        localStorage.removeItem('cart');
        listCards = [];
        reloadCart();
      }, 2000);
    });
  }

  // ---- Run app initialization ----
  initApp();
  loadCartFromStorage();
  reloadCart();
  loadCheckoutItems();
});





   

  
 
































   

  
 

























