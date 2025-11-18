const API_BASE_URL = 'http://localhost:5000/chill-gamer';

export const apiService = {
    // Reviews
    async getAllReviews() {
        const response = await fetch(`${API_BASE_URL}/reviews`);
        return await response.json();
    },

    async getHighestRatedReviews() {
        const response = await fetch(`${API_BASE_URL}/reviews/highest-rated`);
        return await response.json();
    },

    async getReviewById(id) {
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
        return await response.json();
    },

    async getUserReviews(email) {
        const response = await fetch(`${API_BASE_URL}/reviews/user/${email}`);
        return await response.json();
    },

    async createReview(reviewData) {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });
        return await response.json();
    },

    async updateReview(id, reviewData) {
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });
        return await response.json();
    },

    async deleteReview(id) {
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
            method: 'DELETE',
        });
        return await response.json();
    },

    // Watchlist
    async getWatchlist(email) {
        const response = await fetch(`${API_BASE_URL}/watchlist/${email}`);
        return await response.json();
    },

    async addToWatchlist(watchlistData) {
        const response = await fetch(`${API_BASE_URL}/watchlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(watchlistData),
        });
        return await response.json();
    },

    async removeFromWatchlist(id) {
        const response = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
            method: 'DELETE',
        });
        return await response.json();
    },

    // Games
    async getAllGames() {
        const response = await fetch(`${API_BASE_URL}/games`);
        return await response.json();
    },

    // Search
    async searchReviews(query, genre, minRating) {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (genre) params.append('genre', genre);
        if (minRating) params.append('minRating', minRating);

        const response = await fetch(`${API_BASE_URL}/search/reviews?${params}`);
        return await response.json();
    },

    async getGenres() {
        const response = await fetch(`${API_BASE_URL}/genres`);
        return await response.json();
    }
};
