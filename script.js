document.addEventListener("DOMContentLoaded", function () {
  // Elements
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

  // NAVBAR toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      primaryNav.classList.toggle('show');
      document.body.classList.toggle('nav-open');
    });
  }

  // Products
  const products = [
    { id: 1, name: 'Combo', image: 'images/combo.png', price: 200, 
      flavours: [
        { name: "Berry", image: "images/combo berry.png" },
        { name: "Sea", image: "images/combo sea.png" },
        { name: "strawberry & Pomegranate", image: "images/combo strawberry.png" }
      ]
    },

    { id: 2, name: 'Gift Box', image: 'images/gift box.png', price: 290,
      flavours: [
        { name: "Berry", image: "images/gift box berry.png" },
        { name: "Sea", image: "images/gift box sea.png" },
        { name: "strawberry & Pomegranate", image: "images/gift box strawberry.png" }
      ]
     },
    {
      id: 3, name: 'FOAM BATH (2L)', image: 'images/foam.png', price: 90,
      flavours: [
        { name: "Berry", image: "images/salt-vanilla.png" },
        { name: "Sea", image: "images/salt-coconut.png" },
        { name: "strawerry & Pomegranate", image: "images/salt-mint.png" }
      ]
    },
    {
      id: 4, name: 'BATH SALT (450g)', image: 'images/salt.png', price: 70,
      flavours: [
        { name: "Berry", image: "images/salt-vanilla.png" },
        { name: "Sea", image: "images/salt-coconut.png" },
        { name: "strawerry & Pomegranate", image: "images/salt-mint.png" }
      ]
    },
    { id: 5, name: 'Soap', image: 'images/soap.png', price: 20 },
    {
      id: 6, name: 'Fizz Balls', image: 'images/fizz balls.png', price: 20,
    }
  ];

  let listCards = []; // cart array

  // ---- Cart toggle ----
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

  // ---- Initialize product listing ----
  function initApp() {
    if (!list) return;
    list.innerHTML = '';

    products.forEach((product, index) => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('product-item');

      const productImg = document.createElement('img');
      productImg.src = product.image;
      productImg.alt = product.name;
      newDiv.appendChild(productImg);

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      titleDiv.textContent = product.name;
      newDiv.appendChild(titleDiv);

      const priceDiv = document.createElement('div');
      priceDiv.classList.add('price');
      priceDiv.textContent = `R${product.price.toFixed(2)}`;
      newDiv.appendChild(priceDiv);

      // Flavour select
      let flavourSelect = null;
      if (product.flavours && product.flavours.length > 0) {
        flavourSelect = document.createElement('select');
        product.flavours.forEach(flavour => {
          const option = document.createElement('option');
          option.value = flavour.name;
          option.textContent = flavour.name;
          flavourSelect.appendChild(option);
        });
        newDiv.appendChild(flavourSelect);

        // Change image when flavour changes
        flavourSelect.addEventListener('change', () => {
          const selectedFlavour = product.flavours.find(f => f.name === flavourSelect.value);
          if (selectedFlavour) productImg.src = selectedFlavour.image;
        });
      }

      // Add to cart button
      const button = document.createElement('button');
      button.classList.add('cta-button');
      button.textContent = 'Add To Cart';
      button.addEventListener('click', () => {
        const chosenFlavour = flavourSelect ? flavourSelect.value : null;
        addToCart(index, chosenFlavour);
      });
      newDiv.appendChild(button);

      list.appendChild(newDiv);
    });
  }

  // ---- Add to cart ----
function addToCart(index, chosenFlavour = null) {
  const product = products[index];

  // Find correct flavour object
  let flavourObj = null;
  if (chosenFlavour) {
    flavourObj = product.flavours?.find(f => f.name === chosenFlavour);
  }

  // Unique key: product+flavour
  const cartKey = product.id + (chosenFlavour ? '-' + chosenFlavour : '');

  // Try to find existing cart item with same key
  let existingItem = listCards.find(item => item && item.cartKey === cartKey);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    listCards.push({
      ...product,
      cartKey,
      quantity: 1,
      selectedFlavour: chosenFlavour,
      image: flavourObj ? flavourObj.image : product.image // ✅ flavour-specific image
    });
  }

  saveCartToStorage();
  reloadCart();
}


  // ---- Reload cart ----
  function reloadCart() {
    if (!listCard || !total || !quantity) return;

    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    listCards = listCards.filter(item => item && item.quantity > 0);

    listCards.forEach((item, idx) => {
      totalPrice += item.price * item.quantity;
      count += item.quantity;

      const newLi = document.createElement('li');
      newLi.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div>${item.name}${item.selectedFlavour ? ' (' + item.selectedFlavour + ')' : ''}</div>
        <div>R${item.price.toFixed(2)}</div>
        <div>
          <button class="btn-decrease" data-index="${idx}">-</button>
          <span class="count">${item.quantity}</span>
          <button class="btn-increase" data-index="${idx}">+</button>
        </div>
      `;
      listCard.appendChild(newLi);
    });

    total.innerText = `R${totalPrice.toFixed(2)}`;
    quantity.innerText = count;

    // Quantity buttons
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

  function changeQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
      listCards[index] = null;
    } else {
      listCards[index].quantity = newQuantity;
    }
    saveCartToStorage();
    reloadCart();
  }

  // ---- Local storage ----
  function saveCartToStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(listCards.filter(i => i)));
    } catch (e) { console.error(e); }
  }
  function loadCartFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      listCards = new Array(products.length).fill(null);
      saved.forEach(item => {
        const idx = products.findIndex(p => p.id === item.id);
        if (idx !== -1) listCards[idx] = item;
      });
      reloadCart();
    } catch (e) { console.error(e); }
  }

  // ---- Checkout page ----
  function loadCheckoutItems() {
    if (!orderItems) return;
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    let subtotal = 0;
    let shipping = 0;
    let summaryText = '';

    if (cartData.length > 0) {
      orderItems.innerHTML = '';
      cartData.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        orderItems.innerHTML += `
          <div class="order-item">
            <div>${item.name}${item.selectedFlavour ? ' ('+item.selectedFlavour+')' : ''} x ${item.quantity}</div>
            <div>R${itemTotal.toFixed(2)}</div>
          </div>
        `;
        summaryText += `${item.name}${item.selectedFlavour ? ' ('+item.selectedFlavour+')' : ''} (x${item.quantity}) - R${itemTotal.toFixed(2)}\n`;
      });

      const needsShipping = document.querySelector('input[name="shippingOption"]:checked')?.value === 'delivery';
      if (needsShipping) shipping = 65.00;
      const totalVal = subtotal + shipping;

      if (subtotalDisplay) subtotalDisplay.textContent = `R${subtotal.toFixed(2)}`;
      if (shippingDisplay) shippingDisplay.textContent = `R${shipping.toFixed(2)}`;
      if (totalDisplay) totalDisplay.textContent = `R${totalVal.toFixed(2)}`;

      summaryText += `\nSubtotal: R${subtotal.toFixed(2)}\nShipping: R${shipping.toFixed(2)}\nTotal: R${totalVal.toFixed(2)}`;
      if (orderSummaryField) orderSummaryField.value = summaryText;
    } else {
      orderItems.innerHTML = '<p>Your cart is empty</p>';
      if (orderSummaryField) orderSummaryField.value = 'No items in cart.';
    }
  }

  if (shippingOptions) {
    shippingOptions.forEach(option => option.addEventListener('change', loadCheckoutItems));
  }

  // ---- Payment method UI ----
  if (checkoutForm) {
    const paymentMethods = checkoutForm.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
      method.addEventListener('click', function () {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        this.classList.add('selected');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          if (cardDetails) cardDetails.style.display = radio.value === 'card' ? 'block' : 'none';
        }
      });
    });

    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) return this.reportValidity();
      if (orderNumberEl) orderNumberEl.textContent = 'PB' + Math.random().toString(36).substr(2, 9).toUpperCase();
      if (successMessage) successMessage.style.display = 'block';
      this.style.display = 'none';
      setTimeout(() => {
        localStorage.removeItem('cart');
        listCards = [];
        reloadCart();
      }, 2000);
    });
  }

  // ---- Initialize ----
  initApp();
  loadCartFromStorage();
  reloadCart();
  loadCheckoutItems();
});





   

  
 
































   

  
 




























