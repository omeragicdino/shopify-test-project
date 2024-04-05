// Put your application javascript here

function openCart() {
    document.querySelector('.cart-drawer').classList.add('cart-drawer--active')
    updateCart()
}

function closeCart() {
    document.querySelector('.cart-drawer').classList.remove('cart-drawer--active')
}

async function updateCart() {
    const res = await fetch("?/section_id=cart-drawer");
    const text = await res.text();
    const html = document.createElement('div');
    html.innerHTML = text;
    const newBox = html.querySelector('.cart-drawer').innerHTML;
    document.querySelector('.cart-drawer').innerHTML = newBox;
    addListeners()
}

function addListeners() {
    document.querySelectorAll('.cart-drawer-header-right-close, .cart-drawer').forEach(el => {
        el.addEventListener('click', () => {
            closeCart()

        })
    })
    document.querySelector('.cart-drawer-box').addEventListener('click', e => {
        e.stopPropagation();
    })

    document.querySelectorAll('a[href="/cart"]').forEach(a => {
        a.addEventListener("click", async (e) => {
            e.preventDefault();
            openCart()

        })
    })
    document.querySelectorAll('.cart-drawer-quantity-selector button').forEach(btn => {

        btn.addEventListener('click', async () => {
            const rootItem = btn.parentElement.parentElement.parentElement.parentElement.parentElement
            const key = rootItem.getAttribute('data-line-item-key');
            const currentValue = Number(btn.parentElement.querySelector('input').value);
            const isUp = btn.classList.contains('cart-drawer-quantity-selector-plus')
            const newValue = isUp ? currentValue + 1 : currentValue - 1;
            const updates = {
                [key]: newValue
            }

            await fetch("/cart/update.js", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updates })
            })
            updateCart();
        })

    })
}


setTimeout(() => {
    document.querySelectorAll('form[action="/cart/add"]').forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // submit with ajax
            await fetch("/cart/add", {
                method: "post",
                body: new FormData(form),
            })
            openCart();
        })

    })
    addListeners()
}, 100);
