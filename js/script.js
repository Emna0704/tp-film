import TmdbApi from './TmdbApi.js';

const API_KEY = 'e78c4c5705e8e6dcc4ade19a7444dc41';
const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNzhjNGM1NzA1ZThlNmRjYzRhZGUxOWE3NDQ0ZGM0MSIsIm5iZiI6MTczMjg4Mjg2Ni42NTE0MzY2LCJzdWIiOiI2NzQ5YjBjMjZhM2Y1ZDA1YTdkYzdmNTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.fRLFNRjka0rj2AxlZW5tvJ_ZgTPSYHmB415Hvzw_S5U';

const api = new TmdbApi(API_KEY, ACCESS_TOKEN);

const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const paginationContainer = document.getElementById('pagination');
const languageSelect= document.getElementById('language-select')

let currentPage = 1;
let totalPages = 1;
let language="en-US"


function renderMovies(movies) {
    movieList.innerHTML = '';

    if (movies.length === 0) {
        movieList.innerHTML = '<p>Aucun film trouvé.</p>';
        paginationContainer.style.display = 'none';
        return;
    }

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie';
        movieDiv.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <p>${movie.overview.slice(0, 100)}...</p>
    `;
        movieList.appendChild(movieDiv);
    });

    paginationContainer.style.display = 'block';
    renderPagination();
}


function renderPagination() {
    paginationContainer.innerHTML = '';

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            pageButton.addEventListener('click', () => changePage(i));
            paginationContainer.appendChild(pageButton);
        }
    }
}


function changePage(page) {
    currentPage = page;
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        loadDiscoverMovies();
    }
}


async function loadDiscoverMovies() {
    try {
        const data = await api.discoverMovies(currentPage, language);
        renderMovies(data.results);
        paginationContainer.innerHTML = '';

    } catch (error) {
        console.error('Erreur lors du chargement des films à découvrir :', error);
    }
}


async function searchMovies(query) {
    try {
        const data = await api.searchMovies(query, currentPage,language);
        totalPages = data.total_pages;
        renderMovies(data.results);

    } catch (error) {
        console.error('Erreur lors de la recherche de films :', error);
    }
}


searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {

        currentPage = 1;
        searchMovies(query);


    } else {
        currentPage = 1;


        loadDiscoverMovies();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    loadDiscoverMovies();
});

languageSelect.addEventListener('change',(event)=>{
    language=event.target.value
    loadDiscoverMovies()
    
})

