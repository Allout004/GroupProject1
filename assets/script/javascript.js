/*
Sample appData:
appData = {
    actorFilters: [
        {
            id: 234,
            name: 'john travolta'
        }
    ],
    commonMovieIds: [3, 5],
    searchResults: {
        actorId: {
            actorName: 456,
            movieIds: [1, 3, 5]
        }
    }
}
*/

// Global Variables
const apiKey = '67ef4e4a60b4acfa5458eea4807a1de1';
const tmdbUrl = 'https://api.themoviedb.org/3/';

const searchField = document.getElementById('searchText');
const searchButton_1 = document.getElementById('searchButton_1');
const searchButton_2 = document.getElementById('searchButton_2');
const searchButton_3 = document.getElementById('searchButton_3');
searchButton_1.addEventListener('click', searchButton_1_Clicked)
searchButton_2.addEventListener('click', searchButton_2_Clicked)
searchButton_3.addEventListener('click', searchButton_3_Clicked)

let appData = {
    actorFilters: [],
    commonMovieIds: [],
    searchResults: {}
};

function searchButton_1_Clicked() {
    // getActorIdByActorName(searchField.value);
    getActorIdByActorName('Chris Evans');
    // showResults();
}
function searchButton_2_Clicked() {
    getActorIdByActorName('Scarlett Johansson');
    // showResults();
}
function searchButton_3_Clicked() {
    getActorIdByActorName('Robert Downey, Jr.');
    // showResults();
}


const doFetch = (url) => {
    return fetch(url)
        .then(response => {
            return response.json();
        })
        .catch(function (err) {
            console.log("Something went wrong calling this url:", url, err);
        });
};

const getActorIdByActorName = actorName => {
    const urlActorIdByActorName = makeUrlActorIdByActorName(actorName);
    doFetch(urlActorIdByActorName)
        .then((data) => {
            let actorId = data.results[0].id;
            const actor = { id: actorId, name: actorName };
            getMoviesByActorId(actor);
        });
}

const getMoviesByActorId = actor => {
    const urlMoviesByActorId = makeUrlMoviesByActorId(actor.id);
    doFetch(urlMoviesByActorId)
        .then((data) => {
            processSearchResults(actor, data);
            const movieIdsToCompare = getMovieArraysToCompare();
            if (movieIdsToCompare) {
                const commonMovieIds = findCommonMovies(movieIdsToCompare);
                // Store common movie ids.
                appData.commonMovieIds = commonMovieIds;
            }
            console.log('finally: appdata', appData)
            showResults();
        });
}


const findCommonMovies = (movieIdsToCompare) => {
    // Compare two actors at a time.
    const movieId2_1 = movieIdsToCompare[0];
    const movieIds_2 = movieIdsToCompare[1];
    const commonMovieIds = movieId2_1.filter(x => movieIds_2.includes(x));
    return commonMovieIds;
};


// Determine which 2 arrays of movie ids to compare.
// If only 1 actorFilter no point in comparing so return null.
// If 2 actors, compare arrays of their movie ids.
// If 3 or more actors, compare previous array of common movie ids to most recently added actorFilter.
const getMovieArraysToCompare = () => {
    const numberOfActorFilters = appData.actorFilters.length;
    let movieIds_1 = 0;
    let movieIds_2 = 0;
    if (numberOfActorFilters === 1) {
        console.log('enter another actor!!!!!!!!!!!!!!!!!');
        return false;
    } else if (numberOfActorFilters === 2) {
        // Compare the 2 actor filters in appData.
        const actorId_1 = appData.actorFilters[0].id;
        const actorId_2 = appData.actorFilters[1].id;
        movieIds_1 = appData.searchResults[actorId_1].movieIds;
        movieIds_2 = appData.searchResults[actorId_2].movieIds;
    } else {
        // Compare latest actorFilter to previously calculated commonMovieIds.
        movieIds_1 = appData.commonMovieIds;
        const latestActorId = appData.actorFilters[appData.actorFilters.length - 1].id;
        movieIds_2 = appData.searchResults[latestActorId].movieIds;
    }
    return [movieIds_1, movieIds_2];
};

const processSearchResults = (actor, data) => {
    const movieIds = processMovieList(data);
    const searchResult = {
        actorName: actor.name,
        movieIds: movieIds
    };
    appData.searchResults[actor.id] = searchResult;
    appData.actorFilters.push({ id: actor.id, name: actor.name });
};

const processMovieList = data => {
    const dataMovies = data.cast;
    let movieIds = [];
    for (let i = 0; i < dataMovies.length; i++) {
        const dataMovie = dataMovies[i];
        movieIds.push(dataMovie.id);
    }
    return movieIds;
};

// Utility Functions. //////////////////////////////////
function makeUrlActorIdByActorName(actorName) {
    // Example: https://api.themoviedb.org/3/search/person?api_key=67ef4e4a60b4acfa5458eea4807a1de1&query=john%20travolta&include_adult=false
    let url = tmdbUrl;
    url += 'search/person';
    url += '?api_key=' + apiKey;
    url += '&query=' + actorName;
    url += '&include_adult=false';
    return url;
}

function makeUrlMoviesByActorId(actorId) {
    // Example: https://api.themoviedb.org/3/person/8891/movie_credits?api_key=67ef4e4a60b4acfa5458eea4807a1de1
    let url = tmdbUrl;
    url += 'person/' + actorId;
    url += '/movie_credits';
    url += '?api_key=' + apiKey;
    return url;
}

//Results populaton
const resultsCol = document.querySelector("#resultsCol");

function showResults() {

    let movieResultIds = appData.commonMovieIds;

    resultsCol.innerHTML = "";
    
    for (var i = 0; i < movieResultIds.length; i++) {

        let movieUrl = tmdbUrl;
        movieUrl += "movie/";
        movieUrl += movieResultIds[i];
        movieUrl += '?api_key=' + apiKey;
        
        doFetch(movieUrl)
            .then((data) => {
                let imgUrl = "https://image.tmdb.org/t/p/w500";
                imgUrl += data.poster_path;
                imgUrl += '?api_key=' + apiKey;

                // let movieTitle = data.title;
                // let movieYear = data.release_date.substring(0,4);
                let movieData = [data.title, data.release_date.substring(0,4), imgUrl];
                // let directorName = ;
                createCard(movieData);
            });
    }

}

function createCard(movieData) {
    let imgUrl = movieData[2];
    let movieTitle = movieData[0];
    let movieYear = movieData[1];

    let containerDiv = resultsCol.appendChild(document.createElement("div"));
    containerDiv.setAttribute("class", "container");

        let hoverDiv = containerDiv.appendChild(document.createElement("div"));
        hoverDiv.setAttribute("class", "col s12 m6 hoverable");

            let cardHorizDiv = hoverDiv.appendChild(document.createElement("div"));
            cardHorizDiv.setAttribute("class", "card-horizontal");

                let cardImageDiv = cardHorizDiv.appendChild(document.createElement("div"));
                cardImageDiv.setAttribute("class", "card-image");
                cardImageDiv.setAttribute("id", "poster-image");

                    let posterImg = cardImageDiv.appendChild(document.createElement("img"));
                    posterImg.setAttribute("src", imgUrl);

                let cardStackedDiv = cardHorizDiv.appendChild(document.createElement("div"));
                cardStackedDiv.setAttribute("class", "card-stacked");

                    let cardContentDiv = cardStackedDiv.appendChild(document.createElement("div"));
                    cardContentDiv.setAttribute("class", "card-content");

                        let movieTitleDiv = cardContentDiv.appendChild(document.createElement("div"));
                        movieTitleDiv.setAttribute("id", "movies-title");
                        movieTitleDiv.textContent = movieTitle;

                        let movieYearDiv = cardContentDiv.appendChild(document.createElement("div"));
                        movieYearDiv.setAttribute("id", "year");
                        movieYearDiv.textContent = "(" + movieYear + ")";

                        let directorNameDiv = cardContentDiv.appendChild(document.createElement("div"));
                        directorNameDiv.setAttribute("id", "director");
}