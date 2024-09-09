function fetchUserReview() {
    const token = localStorage.getItem('token');
	const reviewId = localStorage.getItem('reviewId');
	
	return fetch(`/reviews/review_id?review_id=${reviewId}`, {
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
			const review = body.review[0];
			console.log(review);
			const reviewContainerDiv = document.querySelector('#review-container');
			
			const reviewDiv = document.createElement('div');
			reviewDiv.classList.add('review-row');

			let ratingStars = '';
			for (let i = 0; i < review.rating; i++) {
				ratingStars += '⭐';
			}

			reviewDiv.innerHTML = `
				<h3>Review ID: ${review.reviewId}</h3>
				<p>Product Name: ${review.name}</p>
				<p>Description:  ${review.description}</p>
				<p>Unit Price: $${review.unitPrice}</p>
				<p>Rating: ${ratingStars}</p>
				<p>Review Text: ${review.reviewText}</p>
				<p>Review Date: ${review.createdAt ? review.createdAt.slice(0, 10) : ""}</p>
				<button class="update-button">Update</button>
				<button class="delete-button">Delete</button>
				<button class='back-button'>Back</button>
			`;

			reviewDiv.querySelector('.update-button').addEventListener('click', function() {
				localStorage.setItem("reviewId", review.reviewId);
				window.location.href = `/review/update`;
			});

			reviewDiv.querySelector('.delete-button').addEventListener('click', function() {
				localStorage.setItem("reviewId", review.reviewId);
				window.location.href = `/review/delete`;
			});

			reviewDiv.querySelector('.back-button').addEventListener('click', function() {
				window.location.href = `/review/retrieve/all`;
			});

			reviewContainerDiv.appendChild(reviewDiv);
		})
}

document.addEventListener('DOMContentLoaded', function () {
	fetchUserReview()
		.catch(function (error) {
			// Handle error
			console.error(error);
		});
});