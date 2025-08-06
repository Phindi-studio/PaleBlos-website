// ✅ Mobile Navbar Toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('show');
    });
  }

  // ✅ Cart toggle elements
  const openShopping = document.querySelector('.shopping');
  const closeShopping = document.querySelector('.closeshopping');
  const cart = document.querySelector('.card');
  const body = document.querySelector('body');

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

  iniApp(); // Initialize product list when DOM is ready
});

// ✅ Cart Variables
const list = document.querySelector('.list');
const listCard = document.querySelector('.listCard');
const total = document.querySelector('.total');
const quantity = document.querySelector('.quantity');

const products = [
  
  { id: 1, name: 'FOAM BATH', image: 'foam.PNG', price: 75 },
  { id: 2, name: 'Soap', image: 'soap.PNG', price: 15 },
  // { id: 3, name: 'Product Name 3', image: '3.PNG', price: 150 },
  // Add more products as needed...
];

let listCards = [];

// ✅ Initialize Products
function iniApp() {
  if (!list) return;

  products.forEach((product, index) => {
    const newDiv = document.createElement('div');
    newDiv.classList.add('item');
    newDiv.innerHTML = `
      <img src="images/${product.image}" alt="${product.name}" onerror="this.src='images/default.png'" />
      <div class="title">${product.name}</div>
      <div class="price">R${product.price.toFixed(2)}</div>
      <button onclick="addToCart(${index})">Add To Cart</button>
    `;
    list.appendChild(newDiv);
  });
}

// ✅ Add to Cart
function addToCart(index) {
  if (!listCards[index]) {
    listCards[index] = { ...products[index], quantity: 1 };
  } else {
    listCards[index].quantity++;
  }
  reloadCart();
}

// ✅ Reload Cart Display
function reloadCart() {
  listCard.innerHTML = '';
  let count = 0;
  let totalPrice = 0;

  listCards.forEach((item, index) => {
    if (item) {
      totalPrice += item.price * item.quantity;
      count += item.quantity;

      const newDiv = document.createElement('li');
      newDiv.innerHTML = `
        <div><img src="images/${item.image}" alt="${item.name}" /></div>
        <div>${item.name}</div>
        <div>R${item.price.toFixed(2)}</div>
        <div>
          <button onclick="changeQuantity(${index}, ${item.quantity - 1})">-</button>
          <span class="count">${item.quantity}</span>
          <button onclick="changeQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
      `;
      listCard.appendChild(newDiv);
    }
  });

  total.innerText = `R${totalPrice.toFixed(2)}`;
  quantity.innerText = count;
}

// ✅ Change Quantity
function changeQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    delete listCards[index];
  } else {
    listCards[index].quantity = newQuantity;
  }
  reloadCart();
}

// ✅ Checkout Validation
function completeCheckout() {
  const name = document.getElementById('fullName')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const address = document.getElementById('address')?.value.trim();
  const city = document.getElementById('city')?.value.trim();
  const postal = document.getElementById('postal')?.value.trim();

  if (!name || !phone || !address || !city || !postal) {
    alert('⚠️ Please fill in all fields before completing checkout.');
    return;
  }

  alert(`✅ Thank you, ${name}! Your order has been received.\n\n📦 Delivery to: ${address}, ${city}, ${postal}`);
}

// ✅ Expose functions to HTML onclick
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.completeCheckout = completeCheckout;








