let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeshopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', () => {
    body.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

// 🛍️ Product Data (sample)
let products = [
    {
        id: 1,
        name: 'PRODUCT NAME 1',
        image: '1.PNG',
        price: 120
    },
    {
        id: 2,
        name: 'PRODUCT NAME 2',
        image: '2.PNG',
        price: 90
    },
    {
        id: 3,
        name: 'PRODUCT NAME 3',
        image: '3.PNG',
        price: 150
    },
    {
        id: 4,
        name: 'PRODUCT NAME 4',
        image: '4.PNG',
        price: 60
    },
    {
        id: 5,
        name: 'PRODUCT NAME 5',
        image: '5.PNG',
        price: 200
    },
    {
        id: 6,
        name: 'PRODUCT NAME 6',
        image: '6.PNG',
        price: 180
    },
];

let listCards = [];

function iniApp() {
    products.forEach((value, key) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="images/${value.image}" alt="${value.name}"/>
            <div class="title">${value.name}</div>
            <div class="price">R${value.price.toFixed(2)}</div>
            <button onclick="addToCart(${key})">Add To Cart</button>
        `;
        list.appendChild(newDiv);
    });
}
iniApp();

function addToCart(key) {
    if (!listCards[key]) {
        listCards[key] = { ...products[key], quantity: 1 };
    } else {
        listCards[key].quantity++;
    }
    reloadCart();
}

function reloadCart() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    listCards.forEach((value, key) => {
        if (value) {
            totalPrice += value.price * value.quantity;
            count += value.quantity;

            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="images/${value.image}" alt="${value.name}" /></div>
                <div>${value.name}</div>
                <div>R${value.price.toFixed(2)}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <span class="count">${value.quantity}</span>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>
            `;
            listCard.appendChild(newDiv);
        }
    });

    total.innerText = `R${totalPrice.toFixed(2)}`;
    quantity.innerText = count;
}

function changeQuantity(key, newQuantity) {
    if (newQuantity <= 0) {
        delete listCards[key];
    } else {
        listCards[key].quantity = newQuantity;
    }
    reloadCart();
}

// ✅ Simple Checkout Validation
function completeCheckout() {
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const postal = document.getElementById('postal').value.trim();

    if (!name || !phone || !address || !city || !postal) {
        alert('⚠️ Please fill in all fields before completing checkout.');
        return;
    }

    alert(`✅ Thank you, ${name}! Your order has been received.\n\n📦 Delivery to: ${address}, ${city}, ${postal}`);




