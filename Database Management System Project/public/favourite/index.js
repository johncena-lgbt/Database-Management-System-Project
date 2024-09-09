function fetchUserFavourites() {
    const token = localStorage.getItem('token');
    const memberId = localStorage.getItem('member_id');

    return fetch(`/favourites/${memberId}`, {
        method: 'GET',
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
            const favouritesContainerDiv = document.querySelector('#favourite-container');

            favourites.forEach(function (favourite) {
                const favouriteDiv = document.createElement('div');
                favouriteDiv.classList.add('favourite-row');

                favouriteDiv.innerHTML = `
                    <h3>Favourite ID: ${favourite.id}</h3>
                    <p>Product ID: ${favourite.productId}</p>
                    <p>Product Name: ${favourite.productName}</p>
                    <p>Member ID: ${favourite.memberId}</p>
                    <p>Date Added: ${favourite.createdAt ? favourite.createdAt.slice(0, 10) : ""}</p>
                    <button class="delete-button">Delete</button>
                `;

                favouriteDiv.querySelector('.delete-button').addEventListener('click', function () {
                    localStorage.setItem('favouriteId', favourite.id);
                    deleteFavourite(favourite.id);
                });

                favouritesContainerDiv.appendChild(favouriteDiv);
            });
        })
}

document.addEventListener('DOMContentLoaded', function () {
	fetchUserFavourites()
		.catch(function (error) {
			// Handle error
			console.error(error);
		});
});

function deleteFavourite() {
    const token = localStorage.getItem('token');
    const favouriteId = localStorage.getItem('favouriteId');

    return fetch(`/favourites/${favouriteId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(function (body) {
        if (body.error) {
            throw new Error(body.error);
        }
        console.log('Favourite deleted:', body);
        alert('Favourite deleted successfully!');
        window.location.reload(); // Optionally reload to update the UI
    })
    .catch(error => {
        console.error('Error deleting favourite:', error);
    });
}

