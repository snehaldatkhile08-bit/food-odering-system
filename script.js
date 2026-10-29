const foods = [
  {id:1,name:'Classic Cheeseburger',category:'Burger',price:179,emoji:'🍔',desc:'Juicy veggie patty, cheese, lettuce and house sauce.'},
  {id:2,name:'Crispy Chicken Burger',category:'Burger',price:219,emoji:'🍔',desc:'Crunchy chicken, fresh lettuce and creamy mayo.'},
  {id:3,name:'Margherita Pizza',category:'Pizza',price:249,emoji:'🍕',desc:'Classic tomato, mozzarella and fragrant basil.'},
  {id:4,name:'Farmhouse Pizza',category:'Pizza',price:329,emoji:'🍕',desc:'Loaded with peppers, onion, tomato and cheese.'},
  {id:5,name:'Paneer Tikka Bowl',category:'Indian',price:229,emoji:'🍛',desc:'Spiced paneer served with rice and mint chutney.'},
  {id:6,name:'Masala Dosa',category:'Indian',price:149,emoji:'🥞',desc:'Golden dosa with potato masala and sambar.'},
  {id:7,name:'French Fries',category:'Burger',price:99,emoji:'🍟',desc:'Golden, crispy fries with a pinch of seasoning.'},
  {id:8,name:'Fresh Lime Soda',category:'Drinks',price:69,emoji:'🥤',desc:'Refreshing lime soda, sweet or salted.'},
  {id:9,name:'Chocolate Milkshake',category:'Drinks',price:129,emoji:'🥤',desc:'Rich chocolate shake topped with creamy foam.'}
];
let cart = [];
let activeCategory = 'All';
const grid = document.getElementById('food-grid');
const cartPanel = document.getElementById('cart-panel');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');

function renderFoods(){
  const term = document.getElementById('search').value.toLowerCase().trim();
  const filtered = foods.filter(f => (activeCategory === 'All' || f.category === activeCategory) && (f.name.toLowerCase().includes(term) || f.desc.toLowerCase().includes(term)));
  grid.innerHTML = filtered.length ? filtered.map(f => `
    <article class="food-card">
      <div class="food-image">${f.emoji}</div>
      <div class="food-info"><h3>${f.name}</h3><p>${f.desc}</p>
        <div class="food-bottom"><span class="price">₹${f.price}</span><button class="add-button" onclick="addToCart(${f.id})">+ Add</button></div>
      </div>
    </article>`).join('') : '<p>No dishes match your search.</p>';
}
function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty++; else cart.push({...foods.find(f => f.id === id),qty:1});
  renderCart(); showToast('Added to cart');
}
function changeQty(id,delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}
function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = '₹' + total;
  document.getElementById('checkout').disabled = count === 0;
  const target = document.getElementById('cart-items');
  target.innerHTML = cart.length ? cart.map(item=>`
    <div class="cart-item"><div><h4>${item.emoji} ${item.name}</h4><small>₹${item.price} each</small>
      <div class="qty"><button onclick="changeQty(${item.id},-1)" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button onclick="changeQty(${item.id},1)" aria-label="Increase quantity">+</button></div>
    </div><strong>₹${item.price*item.qty}</strong></div>`).join('') : '<p class="empty">Your cart is empty.</p>';
}
function openCart(){cartPanel.classList.add('open');overlay.classList.add('show')}
function closeCart(){cartPanel.classList.remove('open');overlay.classList.remove('show')}
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}
document.getElementById('filters').addEventListener('click',e=>{
  const btn=e.target.closest('button[data-category]');if(!btn)return;
  activeCategory=btn.dataset.category;
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));renderFoods();
});
document.getElementById('search').addEventListener('input',renderFoods);
document.getElementById('cart-toggle').addEventListener('click',openCart);
document.getElementById('close-cart').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);
document.getElementById('checkout').addEventListener('click',()=>{closeCart();document.getElementById('checkout-modal').classList.remove('hidden')});
document.getElementById('close-modal').addEventListener('click',()=>document.getElementById('checkout-modal').classList.add('hidden'));
document.getElementById('checkout-form').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const orderId='FD'+Math.floor(100000+Math.random()*900000);
  const summary=cart.map(i=>`${i.name} x${i.qty}`).join(', ');
  alert(`Order placed successfully!\nOrder ID: ${orderId}\nItems: ${summary}\nTotal: ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}\nPayment: ${data.get('payment')}\n\nThis is a demo order; no payment or delivery request was sent.`);
  cart=[];renderCart();e.target.reset();document.getElementById('checkout-modal').classList.add('hidden');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();document.getElementById('checkout-modal').classList.add('hidden')}});
renderFoods();renderCart();
