function fetchFavoritesSummarised() {
    const token = localStorage.getItem("token");
    
    return fetch('/dashboard/favouriteSummary', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            if (body.error) throw new Error(body.error);

            const favourites = body.favourites;
            console.log(favourites);
            const tbody = document.querySelector('#favourite-tbody');

            // Clear existing rows
            tbody.innerHTML = '';

            // Create a row for each favourite item
            favourites.forEach(function(favourite) {
                const row = document.createElement("tr");
                row.classList.add("favourite");

                const productIdCell = document.createElement("td");
                const totalFavoritesCell = document.createElement("td");

                productIdCell.textContent = favourite.productId;
                totalFavoritesCell.textContent = favourite.totalFavorites;

                row.appendChild(productIdCell);
                row.appendChild(totalFavoritesCell);
                tbody.appendChild(row);
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    fetchFavoritesSummarised();
});