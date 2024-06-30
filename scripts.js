const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 10,
    quantity: 5,
    image: 'https://via.placeholder.com/150',
    description: 'Description for Product 1',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 20,
    quantity: 2,
    image: 'https://via.placeholder.com/150',
    description: 'Description for Product 2',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 30,
    quantity: 3,
    image: 'https://via.placeholder.com/150',
    description: 'Description for Product 3',
  },
];

let cart = [];

function renderProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = products
    .map(
      (product) => `
        <div class="col-md-4 mb-4">
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h5>${product.name}</h5>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <p>In stock: ${product.quantity}</p>
            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(event.target.getAttribute('data-id'));
      addToCart(productId);
    });
  });
}

function renderCart() {
  const cartList = document.getElementById('cart-list');
  const floatingCartList = document.getElementById('floating-cart-list');
  const checkoutCartList = document.getElementById('checkout-cart-list');

  const cartHtml = cart
    .map(
      (item) => `
        <li class="list-group-item d-flex justify-content-between align-items-center cart-item">
          ${item.name} - $${item.price} (x${item.quantity})
          <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">Remove</button>
        </li>
      `
    )
    .join('');

  cartList.innerHTML = cartHtml;
  floatingCartList.innerHTML = cartHtml;
  checkoutCartList.innerHTML = cartHtml;

  document.querySelectorAll('.remove-from-cart').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(event.target.getAttribute('data-id'));
      removeFromCart(productId);
    });
  });

  updateCartTotal();
}

function updateCartTotal() {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });

  document
    .querySelectorAll('.cart-total')
    .forEach((el) => (el.textContent = `$${total.toFixed(2)}`));
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product && product.quantity > 0) {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    product.quantity -= 1;
    renderProducts();
    renderCart();
  } else {
    alert('Product is out of stock');
  }
}

function removeFromCart(productId) {
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex > -1) {
    const product = cart[productIndex];
    products.find((p) => p.id === productId).quantity += product.quantity;
    cart.splice(productIndex, 1);
    renderProducts();
    renderCart();
  }
}

function completeOrder() {
  let orderDetails = 'Order completed with the following items:\n';
  cart.forEach((item) => {
    orderDetails += `${item.name} - $${item.price} (x${item.quantity})\n`;
  });

  alert(orderDetails);

  cart.length = 0;
  renderCart();
  renderProducts();
  document.getElementById('orderModal').classList.remove('show');
  document.getElementById('orderModal').style.display = 'none';
  document.body.classList.remove('modal-open');
  document.querySelector('.modal-backdrop').remove();
}

function emptyCart() {
  cart.length = 0;
  renderCart();
  renderProducts();
  document.getElementById('emptyCartModal').classList.remove('show');
  document.getElementById('emptyCartModal').style.display = 'none';
  document.body.classList.remove('modal-open');
  document.querySelector('.modal-backdrop').remove();
  document
    .getElementById('product-list')
    .scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  document.getElementById('orderModal').classList.add('show');
  document.getElementById('orderModal').style.display = 'block';
  document.body.classList.add('modal-open');
  document.body.insertAdjacentHTML(
    'beforeend',
    '<div class="modal-backdrop fade show"></div>'
  );
});

document
  .getElementById('confirm-order')
  .addEventListener('click', completeOrder);

document.getElementById('view-cart').addEventListener('click', () => {
  document.getElementById('emptyCartModal').classList.add('show');
  document.getElementById('emptyCartModal').style.display = 'block';
  document.body.classList.add('modal-open');
  document.body.insertAdjacentHTML(
    'beforeend',
    '<div class="modal-backdrop fade show"></div>'
  );
});

document
  .getElementById('confirm-empty-cart')
  .addEventListener('click', emptyCart);

document.getElementById('view-cart-topbar').addEventListener('click', () => {
  document
    .getElementById('floating-cart')
    .scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('goto-checkout-btn').addEventListener('click', () => {
  document
    .getElementById('checkout-area')
    .scrollIntoView({ behavior: 'smooth' });
});

document
  .getElementById('final-checkout-btn')
  .addEventListener('click', completeOrder);

renderProducts();
