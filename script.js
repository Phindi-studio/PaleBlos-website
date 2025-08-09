document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
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
  const taxDisplay = document.getElementById('tax');
  const shippingDisplay = document.getElementById('shipping');
  const subtotalDisplay = document.getElementById('subtotal');
  const orderItems = document.getElementById('orderItems');

  // Products data
  const products = [
    { id: 1, name: 'FOAM BATH (2L)', image: 'Foam.png', price: 75 },
    { id: 2, name: 'Soap', image: 'Soap.png', price: 15 },
    { id: 3, name: 'BATH SALT (450g)', image: 'Salt.png', price: 40 }
  ];

  // Cart array: stores cart items aligned with products array indexes
  let listCards = [];

  // -------- Shopping cart toggle --------
  if (openShopping && closeShopping && cart) {
    openShopping.addEventListener('click', () => {
      cart.classList.add('show');
      body.classList.add('active');
    });

    closeShopping.addEventListener('click', () => {
      cart.classList.remove('show');
      body.classList.remove('active');
    });
  }

  // -------- Initialize product listing --------
  function initApp() {
    if (!list) return;

    list.innerHTML = ''; // Clear existing

    products.forEach((product, index) => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('item');
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

  // -------- Add product to cart --------
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

  // -------- Reload cart UI --------
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

    // Attach event listeners for + and - buttons
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

  // -------- Change item quantity --------
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

  // -------- Cart persistence --------
  function saveCartToStorage() {
    try {
      const validItems = listCards.filter(item => item && item.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(validItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }

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

  // -------- Payment method UI logic --------
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

  // -------- Card input formatting --------
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

  // -------- Checkout form submission --------
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      // Check required fields manually (in case HTML5 validation is bypassed)
      const requiredFields = this.querySelectorAll('[required]');
      for (let field of requiredFields) {
        if (!field.value.trim()) {
          alert('⚠️ Please complete all required fields.');
          return;
        }
      }

      // If card payment selected, validate card details
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

      // Hide form and reset inputs
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

  // -------- Load cart items on checkout page --------
  function loadCheckoutItems() {
    if (!orderItems) return;

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length > 0) {
        orderItems.innerHTML = '';

        let subtotal = 0;

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
        });

        const shipping = 65.00;
        const tax = subtotal * 0.15; // 15%
        const totalVal = subtotal + shipping + tax;

        if (subtotalDisplay) subtotalDisplay.textContent = `R${subtotal.toFixed(2)}`;
        if (taxDisplay) taxDisplay.textContent = `R${tax.toFixed(2)}`;
        if (shippingDisplay) shippingDisplay.textContent = `R${shipping.toFixed(2)}`;
        if (totalDisplay) totalDisplay.textContent = `R${totalVal.toFixed(2)}`;
      } else {
        orderItems.innerHTML = '<p>Your cart is empty</p>';
      }
    } catch (error) {
      console.error('Failed to load checkout items:', error);
      orderItems.innerHTML = '<p>Error loading cart items</p>';
    }
  }

  // Initialize app functions
  initApp();
  loadCartFromStorage();
  reloadCart();
  loadCheckoutItems();
});




   

  
 












