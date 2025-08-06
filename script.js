document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const openShopping = document.querySelector('.shopping');
  const closeShopping = document.querySelector('.closeshopping');
  const cart = document.querySelector('.card');
  const body = document.querySelector('body');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

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

  iniApp();
});

const list = document.querySelector('.list');
const listCard = document.querySelector('.listCard');
const total = document.querySelector('.total');
const quantity = document.querySelector('.quantity');

const products = [
  { id: 1, name: 'FOAM BATH', image: 'foam.png', price: 75 },
  { id: 2, name: 'Soap', image: 'soap.png', price: 15 },
  // add more if needed
];

let listCards = [];

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

function addToCart(index) {
  if (!listCards[index]) {
    listCards[index] = { ...products[index], quantity: 1 };
  } else {
    listCards[index].quantity++;
  }
  reloadCart();
}

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

function changeQuantity(index, newQuantity) {
  if (newQuantity <= 0) {
    delete listCards[index];
  } else {
    listCards[index].quantity = newQuantity;
  }
  reloadCart();
}

   

  
 







