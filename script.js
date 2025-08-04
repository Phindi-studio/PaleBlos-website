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

let products = [
    {
        id: 1,
        name: 'PRODUCT NAME 1',
        Image: '1.PNG',
        price: 120000
    },

     {
        id: 1,
        name: 'PRODUCT NAME 1',
        Image: '1.PNG',
        price: 120000
    },

     {
        id: 1,
        name: 'PRODUCT NAME 1',
        Image: '1.PNG',
        price: 120000
    },

     {
        id: 1,
        name: 'PRODUCT NAME 1',
        Image: '1.PNG',
        price: 120000
    },

     {
        id: 1,
        name: 'PRODUCT NAME 1',
        Image: '1.PNG',
        price: 120000
    },

     {
        id: 1,
        name: 'PRODUCT NAME 1',
        Image: '1.PNG',
        price: 120000
    },
];

let listCards = [];

function iniApp() {
    products.forEach((value, key) => {
        let newDiv = document.createElement('div'); // Fixed: should be createElement, not querySelectorAll

        list.appendChild(newDiv);
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="image/${value.image}"/> <!-- Fixed: 'scr' to 'src' -->
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCard(${key})">Add To Cart</button> <!-- Fixed: closing tag from <buttom> to </button> -->
        `;
        list.appendChild(newDiv);

    });
}
iniApp();

function addToCard(key){
    if (listCards[key] == null) {
        listCards[key] = products[key]; // FIX: products[Key] → products[key]
        listCards[key].quantity = 1; // FIX: listCard[Key] → listCards[key]
    } else {
        listCards[key].quantity += 1;
    }
    reloadCard();
}
function reloadCard() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key) => {
        if (value != null) {
            totalPrice += value.price * value.quantity;
            count += value.quantity;

            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="image/${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>${value.quantity}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>
            `;
            listCard.appendChild(newDiv);
        }
    });
    total.innerHTML = totalPrice.toLocaleString();
    quantity.innerHTML = count;
}
function  changeQuantity(key,quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key]. price  = quantity * products[key].price;
    }
    reloadCard();
}


