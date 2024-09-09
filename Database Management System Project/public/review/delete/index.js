window.addEventListener('DOMContentLoaded', function () {

    const token = localStorage.getItem('token');
    const reviewId = localStorage.getItem('reviewId');
    const memberId = localStorage.getItem('member_id');


    const form = document.querySelector('form'); // Only have 1 form in this HTML
    form.querySelector('input[name=reviewId]').value = reviewId;
    form.onsubmit = function (e) {
        e.preventDefault(); // prevent using the default submit behavior

        // update review details by reviewId using fetch API with method PUT
        fetch(`/reviews`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewId: document.querySelector('input[name=reviewId]').value,
                memberId: memberId
            }),
        })
            .then(function (response) {
                if (response.ok) {
                    alert(`Review deleted!`);
                    window.location.href = '/review/retrieve/all';
                } else {
                    // If fail, show the error message
                    response.json().then(function (data) {
                        console.log(data);
                        alert(`Error deleting review - ${data.error}`);
                    });
                }
            })
            .catch(function (error) {
                alert(`Error updating review`);
                throw error;
            });
    };
});
