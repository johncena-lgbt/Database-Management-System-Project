window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    const cartProductId = localStorage.getItem("cartProductId");

    const productIdInput = document.querySelector("input[name='productId']");
    productIdInput.value = cartProductId;    

    const quantityInput = document.querySelector("input[name='quantity']");
    quantityInput.value = 1;

    const form = document.querySelector("form");
    form.onsubmit = function(e) {
        e.preventDefault();
        const productId = form.querySelector("input[name='productId']").value;
        const quantity = form.querySelector("input[name='quantity']").value;
        const memberId = localStorage.getItem("member_id");

        fetch('/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId,
                quantity,
                memberId
            })
        })
        .then(function (response) {
            if (response.status !== 201) {
                return response.json();  // Parse and forward the error
            }
            form.reset();  // Clear the form on successful post
            alert('Added to cart Successfully');
            return null;  // No further action needed
        })
        .then(function (body) {
            if (body) {
                alert(body.error);  // Alert the error if there is one
                form.reset();
            }
        });
    }

});
