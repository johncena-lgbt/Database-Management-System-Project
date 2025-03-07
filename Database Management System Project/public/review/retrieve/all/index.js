function fetchUserReviews() {
	const token = localStorage.getItem("token");
	const memberId = localStorage.getItem("member_id");

	return fetch(`/reviews/?member_id=${memberId}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (body) {

			if (body.error) throw new Error(body.error);
			const reviews = body.reviews;
			console.log(reviews);
			const reviewContainerDiv = document.querySelector('#review-container');
			
			reviews.forEach(function (review) {
				const reviewDiv = document.createElement('div');
				reviewDiv.classList.add('review-row');

				let ratingStars = '';
				for (let i = 0; i < review.rating; i++) {
					ratingStars += '⭐';
				}

				reviewDiv.innerHTML = `
					<h3>Review ID: ${review.reviewId}</h3>
					<p>Product Name: ${review.name}</p>
					<p>Rating: ${ratingStars}</p>
					<p>Review Text: ${review.reviewText}</p>
					<p>Review Date: ${review.createdAt ? review.createdAt.slice(0, 10) : ""}</p>
					<button class="update-button">Update</button>
					<button class="delete-button">Delete</button>
					<button class="view-button">View More</button>
				`;

				reviewDiv.querySelector('.update-button').addEventListener('click', function() {
					localStorage.setItem("reviewId", review.reviewId);
					window.location.href = `/review/update`;
				});

				reviewDiv.querySelector('.delete-button').addEventListener('click', function() {
					localStorage.setItem("reviewId", review.reviewId);
					window.location.href = `/review/delete`;
				});

				reviewDiv.querySelector('.view-button').addEventListener('click', function() {
					localStorage.setItem("reviewId", review.reviewId);
					window.location.href = `/review/retrieve`;
				});

				reviewContainerDiv.appendChild(reviewDiv);
			});
		})
		.catch(function (error) {
			console.error(error);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	fetchUserReviews()
		.catch(function (error) {
			// Handle error
			console.error(error);
		});
});