window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    // Fetch sale orders on page load
    fetch('/saleOrders', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (body) {
        if (body.error) throw new Error(body.error);
        const saleOrders = body.saleOrders;
        const tbody = document.querySelector("#product-tbody");

        // Populate table with sale orders
        saleOrders.forEach(function (saleOrder) {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const unitPriceCell = document.createElement("td");
            const quantityCell = document.createElement("td");
            const countryCell = document.createElement("td");
            const imageUrlCell = document.createElement("td");
            const orderIdCell = document.createElement("td");
            const orderDatetimeCell = document.createElement("td");
            const statusCell = document.createElement("td");
            const createReviewCell = document.createElement("td");

            nameCell.textContent = saleOrder.name;
            descriptionCell.textContent = saleOrder.description;
            unitPriceCell.textContent = saleOrder.unitPrice;
            quantityCell.textContent = saleOrder.quantity;
            countryCell.textContent = saleOrder.country;
            imageUrlCell.innerHTML = `<img src="${saleOrder.imageUrl}" alt="Product Image">`;
            orderIdCell.textContent = saleOrder.orderId;
            orderDatetimeCell.textContent = new Date(saleOrder.orderDatetime).toLocaleString();
            statusCell.textContent = saleOrder.status;

            const viewProductButton = document.createElement("button");
            viewProductButton.textContent = "Create Review";
            viewProductButton.addEventListener('click', function () {
                document.querySelector("#review-product-id").innerHTML = saleOrder.name;
                document.querySelector("input[name='productId']").value = saleOrder.productId;
                document.querySelector("input[name='saleOrderItemId']").value = saleOrder.saleOrderItemId;
            });

            createReviewCell.appendChild(viewProductButton);

            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(imageUrlCell);
            row.appendChild(unitPriceCell);
            row.appendChild(quantityCell);
            row.appendChild(countryCell);
            row.appendChild(orderIdCell);
            row.appendChild(orderDatetimeCell);
            row.appendChild(statusCell);
            row.appendChild(createReviewCell);

            tbody.appendChild(row);
        });
    })
    .catch(function (error) {
        console.error(error);
    });

    // Handle form submission for creating a review
    const form = document.querySelector("form");
    form.onsubmit = function(e) {
        e.preventDefault();
        const productId = form.querySelector("input[name='productId']").value;
        const saleOrderItemId = form.querySelector("input[name='saleOrderItemId']").value;
        const rating = form.querySelector("input[name='rating']").value;
        const reviewText = form.querySelector("textarea[name='reviewText']").value;
        const memberId = localStorage.getItem("member_id");

        fetch('/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                memberId,
                productId,
                saleOrderItemId,
                rating,
                reviewText
            })
        })
        .then(function (response) {
            if (response.status !== 201) {
                return response.json();  // Parse and forward the error
            }
            form.reset();  // Clear the form on successful post
            alert('Review Successfully Created');
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
