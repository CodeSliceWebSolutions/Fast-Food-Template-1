/* =========================
   MENU DATA (FULL MENU)
========================= */
const menuData = [
  {
    name: "Kota Menu",
    image: "images/kota.jpg",
    items: [
      ["Chips French Special Vienna Cheese", 30],
      ["Chips French Special Beef Patty Egg Cheese", 40],
      ["Chips French Special Cheese Egg Russian", 50],
      ["Chips French Special Cheese Egg Vienna Russian", 60],
      ["Chips French Special Cheese Egg Beef Patty Russian", 70],
      ["Chips French Special Cheese Egg Burger Russian", 80],
      ["Chips French Special Cheese Egg Vienna Burger", 90],
      ["Bacon Russian", 100]
    ]
  },
  {
    name: "Kota Loaf",
    image: "images/loaf.jpg",
    items: [
      ["Chips French Special Cheese x2 Vienna x2 Burger x2 Rib Burger", 250]
    ]
  },
  {
    name: "Dawgwood Menu",
    image: "images/dawgwood.jpg",
    items: [
      ["Chips Lettuce French Burger Cheese", 30],
      ["Chips Lettuce French Burger Cheese Vienna", 40],
      ["Chips Lettuce French Burger Cheese Vienna Egg", 50],
      ["Chips Lettuce French Burger Cheese Vienna Egg Russian", 70],
      ["Chips Lettuce French Burger Cheese Egg Vienna Russian", 90],
      ["Chips Lettuce French Burger Cheese Egg Vienna Russian Bacon", 120]
    ]
  },
  {
    name: "Solid Meals",
    image: "images/solid.jpg",
    items: [
      ["Isibhindi", 50],
      ["Ihliziyo", 60],
      ["Mix (Isibhindi & Ihliziyo)", 100],
      ["Steak & Pap", 70],
      ["Steak & Wors", 80],
      ["Wors & Pap", 50],
      ["Steak Wors & Heart", 90],
      ["Steak Wors & Heart Large", 120],
      ["Chicken & Pap", 60]
    ]
  },
  {
    name: "Mswenko Grill",
    image: "images/grill.jpg",
    items: [
      ["Chips & Wings", 70],
      ["Chips & Ribs", 100],
      ["Chips & Chicken", 90],
      ["Chips & Steak", 110],
      ["Chips & Russian", 60],
      ["Chips & Fish", 60]
    ]
  },
  {
    name: "Platters",
    image: "images/platters.jpg",
    items: [
      ["Chicken Steak Wors with Chips & Salad", 150],
      ["Steak & Wors Ribs with Chips & Salad", 180]
    ]
  },
  {
    name: "Inyama Yenhloko",
    image: "images/inyama.jpg",
    items: [
      ["Single", 35],
      ["2 People", 60],
      ["4 People", 100]
    ]
  }
];

/* =========================
   STATE
========================= */
let cart = {};

/* =========================
   DOM REFERENCES
========================= */
const menu = document.getElementById("menu");
const cartItems = document.getElementById("cartItems");
const cartQty = document.getElementById("cartQty");
const cartTotal = document.getElementById("cartTotal");
const finalTotal = document.getElementById("finalTotal");
const cartModal = document.getElementById("cartModal");
const cartButton = document.getElementById("cartButton");
const orderDate = document.getElementById("orderDate");
const pickupTime = document.getElementById("pickupTime");
const custName = document.getElementById("custName");
const custPhone = document.getElementById("custPhone");

/* =========================
   BUILD MENU
========================= */
menuData.forEach(cat => {
  const section = document.createElement("section");
  section.className = "category";
  section.innerHTML = `<h2>${cat.name}</h2><img src="${cat.image}">`;

  cat.items.forEach(([name, price]) => {
    section.innerHTML += `
      <div class="item">
        <span>${name} – R${price}</span>
        <button onclick="addItem('${name}', ${price})">Add</button>
      </div>
    `;
  });

  menu.appendChild(section);
});

/* =========================
   CART FUNCTIONS
========================= */
function addItem(name, price) {
  if (!cart[name]) cart[name] = { price, qty: 0 };
  cart[name].qty++;
  updateCart();
}

function changeQty(name, change) {
  cart[name].qty += change;
  if (cart[name].qty <= 0) delete cart[name];
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let qty = 0;

  for (let item in cart) {
    const data = cart[item];
    total += data.price * data.qty;
    qty += data.qty;

    cartItems.innerHTML += `
      <div class="cart-row">
        <span>${item}</span>
        <div class="qty">
          <button onclick="changeQty('${item}', -1)">−</button>
          ${data.qty}
          <button onclick="changeQty('${item}', 1)">+</button>
        </div>
      </div>
    `;
  }

  cartQty.textContent = qty;
  cartTotal.textContent = "R" + total;
  finalTotal.textContent = "R" + total;

  /* 🔥 CART BUTTON FEEDBACK (RESTORED) */
  if (qty > 0) {
    cartButton.classList.add("active");
  } else {
    cartButton.classList.remove("active");
  }
}

/* =========================
   MODAL
========================= */
function toggleCart() {
  cartModal.style.display =
    cartModal.style.display === "block" ? "none" : "block";
}

/* =========================
   DATE & TIME SETUP
========================= */
const today = new Date().toISOString().split("T")[0];
orderDate.value = today;
orderDate.min = today;

pickupTime.innerHTML = `<option value="">Select pickup time</option>`;
for (let h = 9; h <= 20; h++) {
  for (let m = 0; m < 60; m += 15) {
    const t = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    pickupTime.innerHTML += `<option value="${t}">${t}</option>`;
  }
}

/* =========================
   SEND ORDER
========================= */
function sendOrder() {
  if (
    !custName.value ||
    !custPhone.value ||
    !orderDate.value ||
    !pickupTime.value ||
    Object.keys(cart).length === 0
  ) {
    alert("Please complete all fields and add items to cart.");
    return;
  }

  let message = `*NEW FOOD ORDER*%0A`;
  message += `Name: ${custName.value}%0A`;
  message += `Phone: ${custPhone.value}%0A`;
  message += `Date: ${orderDate.value}%0A`;
  message += `Pickup Time: ${pickupTime.value}%0A%0A`;

  let total = 0;

  for (let item in cart) {
    const qty = cart[item].qty;
    const price = cart[item].price;
    const lineTotal = price * qty;

    message += `• ${item} – R${price} x${qty} = R${lineTotal}%0A`;
    total += lineTotal;
  }


  message += `%0A*Total: R${total}*`;

  window.open(
    "https://wa.me/27602527222?text=" + message,
    "_blank"
  );
}
