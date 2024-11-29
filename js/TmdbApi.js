export default class TmdbApi {
    constructor(apiKey, accessToken) {
        this.apiKey = apiKey;
        this.accessToken = accessToken;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async loadMovies(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
        });
        return response.json();
    }

    async discoverMovies(page = 1, language) {
        return this.loadMovies('discover/movie', { page, language });
    }

    async searchMovies(query, page = 1, language) {
        return this.loadMovies('search/movie', { query, page, language });
    }
}
