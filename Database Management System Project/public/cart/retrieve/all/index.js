function fetchCartItems(token) {
    
    const memberId = localStorage.getItem("member_id");
    return fetch(`/carts/?member_id=${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            if (body.error) throw new Error(body.error);
            const cartItems = body.cartItems;
            console.log(cartItems);
            
            const tbody = document.querySelector("#cart-items-tbody");
            cartItems.forEach(function (cartItem) {
                const row = document.createElement("tr");
                row.classList.add("product");
                row.dataset.cartItemId = cartItem.cartItemId

                const descriptionCell = document.createElement("td");
                const countryCell = document.createElement("td");
                const quantityCell = document.createElement("td");
                const unitPriceCell = document.createElement("td");
                const subTotalCell = document.createElement("td");
                const updateButtonCell = document.createElement("td");
                const deleteButtonCell = document.createElement("td");
                const checkboxCell = document.createElement("td");
                const updateButton = document.createElement("button");
                const deleteButton = document.createElement("button");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";

                descriptionCell.textContent = cartItem.description;
                countryCell.textContent = cartItem.country;
                unitPriceCell.textContent = cartItem.unitPrice;                
                updateButtonCell.appendChild(updateButton);
                deleteButtonCell.appendChild(deleteButton);
                checkboxCell.appendChild(checkbox);

                // Make quantityCell an editable input field
                const quantityInput = document.createElement("input");
                quantityInput.type = "number";
                quantityInput.value = cartItem.quantity;
                quantityInput.min = 1;
                quantityInput.addEventListener("input", function () {
                    // Only allow numeric values
                    this.value = this.value.replace(/[^0-9]/g, "");
                });
                quantityCell.appendChild(quantityInput);
                subTotalCell.textContent = cartItem.unitPrice * cartItem.quantity;

                updateButton.textContent = "Update";
                deleteButton.textContent = "Delete";

                // Add event listener to updateButton
                updateButton.addEventListener("click", function () {
                    const updatedQuantity = quantityInput.value;
                    const updatedCartItem = {
                        quantity: Number(updatedQuantity),
                        productId: cartItem.productId, // Add the missing value for 'productId',
                        memberId: memberId,
                        cartItemId: cartItem.cartItemId
                    };

                    fetch('/carts', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedCartItem)
                    })
                        .then(function (response) {
                            if (response.status !== 200) {
                                return response.json();  // Parse and forward the error
                            }
                            alert('Cart item updated successfully');
                            location.reload();  // Reload the page on successful update
                        })
                        .then(function (body) {
                            if (body) {
                                alert(body.error);  // Alert the error if there is one
                                location.reload();  // Reload the page on error
                            }
                        });
                });
                
                deleteButton.addEventListener("click", function () {
                    const updatedCartItem = {
                        productId: cartItem.productId, // Add the missing value for 'productId',
                        memberId: memberId,
                        cartItemId: cartItem.cartItemId
                    };

                    fetch('/carts', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedCartItem)
                    })
                        .then(function (response) {
                            if (response.status !== 200) {
                                return response.json();  // Parse and forward the error
                            }
                            alert('Cart item deleted successfully');
                            location.reload();  // Reload the page on successful update
                        })
                        .then(function (body) {
                            if (body) {
                                alert(body.error);  // Alert the error if there is one
                                location.reload();  // Reload the page on error
                            }
                        });
                })

                row.appendChild(checkboxCell);
                row.appendChild(descriptionCell);
                row.appendChild(countryCell);
                row.appendChild(subTotalCell);
                row.appendChild(unitPriceCell);
                row.appendChild(quantityCell);
                row.appendChild(updateButtonCell);
                row.appendChild(deleteButtonCell);

                tbody.appendChild(row);
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

function fetchCartSummary(token) {
    const memberId = localStorage.getItem("member_id");
    return fetch(`/carts/summary/?member_id=${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            console.log(body);
            
            if (body.error) throw new Error(body.error);
            const cartSummary = body.cartSummary;
            const cartSummaryDiv = document.querySelector("#cart-summary");
            const cartSummaryLabel1 = document.createElement("label");
            cartSummaryLabel1.textContent = "Total Quantity: ";
            cartSummaryLabel1.classList.add("label");
            const cartSummaryValue1 = document.createElement("span");
            cartSummaryValue1.textContent = cartSummary.totalQuantity;
            cartSummaryValue1.classList.add("value");
            const cartSummaryLabel2 = document.createElement("label");
            cartSummaryLabel2.textContent = "Total Checkout Price: ";
            cartSummaryLabel2.classList.add("label");
            const cartSummaryValue2 = document.createElement("span");
            cartSummaryValue2.textContent = cartSummary.totalAmount;
            cartSummaryValue2.classList.add("value");
            const cartSummaryLabel3 = document.createElement("label");
            cartSummaryLabel3.textContent = "Total Unique Products: ";
            cartSummaryLabel3.classList.add("label");
            const cartSummaryValue3 = document.createElement("span");
            cartSummaryValue3.textContent = cartSummary.totalUniqueProducts;
            cartSummaryValue3.classList.add("value");

            cartSummaryDiv.appendChild(cartSummaryLabel1);
            cartSummaryDiv.appendChild(cartSummaryValue1);
            cartSummaryDiv.appendChild(document.createElement("br"));
            cartSummaryDiv.appendChild(cartSummaryLabel2);
            cartSummaryDiv.appendChild(cartSummaryValue2);
            cartSummaryDiv.appendChild(document.createElement("br"));
            cartSummaryDiv.appendChild(cartSummaryLabel3);
            cartSummaryDiv.appendChild(cartSummaryValue3);
        })
        .catch(function (error) {
            console.error(error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const bulkUpdateButton = document.querySelector("#bulk-update");
    const selectAllCheckbox = document.querySelector("#selectAll");
    const bulkDeleteButton = document.querySelector("#bulk-delete");
    const checkoutButton = document.querySelector('#checkout-button')
    const token = localStorage.getItem("token");

    selectAllCheckbox.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll("input[type='checkbox']"); 
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    bulkUpdateButton.onclick = function () {
        const memberId = localStorage.getItem("member_id");
        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        const cartItems = [];

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && checkbox.id !== "selectAll") {
                const row = checkbox.closest('tr');
                const quantityInput = row.querySelector("input[type='number']");
                const cartItemId = row.dataset.cartItemId; 

                const cartItem = {
                    quantity: Number(quantityInput.value),
                    memberId: memberId,
                    cartItemId: cartItemId
                };

                cartItems.push(cartItem);    
                            
            }
        });

        fetch('/carts/bulk', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItems })  // Send the cart items as an object
        })
        .then(function (response) {
            if (response.status !== 200) {
                return response.json();  // Parse the error response
            }
            alert('Cart items updated successfully');
            location.reload();  // Reload the page on successful update
        })
        .then(function (body) {
            if (body && body.error) {
                alert(body.error);  // Alert the error if there is one
                location.reload();  // Reload the page on error
            }
        })
        .catch(function (error) {
            console.error('Error updating cart items:', error);
            alert('An error occurred while updating cart items.');
        });
    };

    bulkDeleteButton.onclick = function () {
        const memberId = localStorage.getItem("member_id");
        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        const cartItems = [];

        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked && checkbox.id !== "selectAll") {
                const row = checkbox.closest('tr');
                const cartItemId = row.dataset.cartItemId; 

                const cartItem = {
                    memberId: memberId,
                    cartItemId: cartItemId
                };

                cartItems.push(cartItem);    
                            
            }
        });

        fetch('/carts/bulk', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cartItems })  // Send the cart items as an object
        })
        .then(function (response) {
            if (response.status !== 200) {
                return response.json();  // Parse the error response
            }
            alert('Cart items deleted successfully');
            location.reload();  // Reload the page on successful update
        })
        .then(function (body) {
            if (body && body.error) {
                alert(body.error);  // Alert the error if there is one
                location.reload();  // Reload the page on error
            }
        })
        .catch(function (error) {
            console.error('Error deleting cart items:', error);
            alert('An error occurred while deleting cart items.');
        });
    };

    checkoutButton.onclick = function () {
        const memberId = localStorage.getItem("member_id");
        fetch('/carts/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                memberId: memberId
            })  
        })
        .then(function (response) {
            if (response.status !== 200) {
                return response.json();  // Parse the error response
            }
            location.reload();  // Reload the page on successful update
            return null
        }).catch(function (error) {
            alert(error.message)
            console.error('Error checking out:', error);
            alert('An error occurred while checking out.');
        });
    }
});

window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");
    fetchCartItems(token)
        .then(function () {
            return fetchCartSummary(token);
        });
});
