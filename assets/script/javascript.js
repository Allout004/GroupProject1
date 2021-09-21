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

const searchField = document.getElementById('searchBar');
const searchButton_1 = document.getElementById('searchButton_1'); // Remove later.
const searchButton_2 = document.getElementById('searchButton_2'); // Remove later.
const searchButton_3 = document.getElementById('searchButton_3'); // Remove later.
const actorFiltersDiv = document.getElementById('actorFilters');
// remove at end
searchButton_1.addEventListener('click', searchButton_1_Clicked); // Remove later.
searchButton_2.addEventListener('click', searchButton_2_Clicked); // Remove later.
searchButton_3.addEventListener('click', searchButton_3_Clicked); // Remove later.
actorFiltersDiv.addEventListener('click', actorFilterClicked);


let appData = {
    actorFilters: [],
    commonMovieIds: [],
    searchResults: {}
};

function searchButton_1_Clicked() { // Remove later.
    // getActorIdByActorName(searchField.value);
    searchForActor('Chris Evans');
}
function searchButton_2_Clicked() { // Remove later.
    searchForActor('Scarlett Johansson');
}
function searchButton_3_Clicked() { // Remove later.
    searchForActor('Robert Downey, Jr.');
}

const searchForActor = searchString => {
    const urlActorIdBySearchString = makeUrlActorIdBySearchString(searchString);
    doFetch(urlActorIdBySearchString)
        .then((data) => {
            const actor = makeActor(data);
            saveAppData('actor', actor);
            doDerivedData(actor);
        });
};

const doDerivedData = actor => {
    const urlMoviesByActorId = makeUrlMoviesByActorId(actor.id);
    doFetch(urlMoviesByActorId)
        .then((data) => {
            const searchResults = processSearchResults(actor, data);
            saveAppData(actor.id, searchResults);
            updateCommonMovieIds();
            // Now, FINALLY refresh the display with what's now in appData.
            refreshDisplay();
        });
};

const processSearchResults = (actor, data) => {
    const movieIds = processMovieList(data);
    const searchResult = {
        actorName: actor.name,
        movieIds: movieIds
    };
    return searchResult;
};

const processMovieList = data => {
    const dataMovies = data.cast;
    let movieIds = [];
    for (let i = 0; i < dataMovies.length; i++) {
        movieIds.push(dataMovies[i].id);
    }
    return movieIds;
};

// Updates appData.commonMovieIds.
const updateCommonMovieIds = () => {
    const movieIdsToCompare = getMovieArraysToCompare();
    if (movieIdsToCompare) {
        const commonMovieIds = findCommonMovies(movieIdsToCompare);
        // Store common movie ids.
        saveAppData('common', commonMovieIds);
    }
};


// Functions for display //////////////////////////////////////////////////////////
// Call this whenever appData has been updated.
const refreshDisplay = () => {
    updateActorFilters();
    showResults();
};

const updateActorFilters = () => {
    // Loop over appData actorFilters and create a button for each.
    // Sample: <h4 class="header hoverable chip" id="search-filter-1">(Search Filter Placeholder) <button>close</button></h4>
    // First, clear out old entries.
    while (actorFiltersDiv.firstChild) {
        actorFiltersDiv.removeChild(actorFiltersDiv.firstChild);
    }
    const actorFilters = appData.actorFilters;
    for (let i = 0; i < actorFilters.length; i++) {
        const actorFilter = actorFilters[i];

        const hTag = document.createElement('h4');
        hTag.classList.add('header', 'hoverable', 'chip');
        hTag.setAttribute('id', 'search-filter-' + actorFilter.id);
        hTag.textContent = actorFilter.name;

        const button = document.createElement('button')
        button.setAttribute('id', 'search-filter-' + actorFilter.id);
        button.classList.add('btn')
        button.textContent = 'X';
        hTag.appendChild(button);

        actorFiltersDiv.appendChild(hTag)
    }
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

const findCommonMovies = (movieIdsToCompare) => {
    // Compare two actors at a time.
    const movieId2_1 = movieIdsToCompare[0];
    const movieIds_2 = movieIdsToCompare[1];
    const commonMovieIds = movieId2_1.filter(x => movieIds_2.includes(x));
    return commonMovieIds;
};



// Event Handlers //////////////////////////////////////////////////////////
function actorFilterClicked(event) {
    if (!event.target.matches('button')) return;
    // Get id from target since it has actor id in it.
    const idAttributeValue = event.target.attributes.getNamedItem('id').value;
    const idAttributeValueSplit = idAttributeValue.split('-');
    const actorId = parseInt(idAttributeValueSplit[2]);
    saveAppData('actorDelete', actorId);
    refreshDisplay();
};


// Utility Functions. //////////////////////////////////
const saveAppData = (key, value) => {
    if (key === 'actor') {
        appData.actorFilters.push(value);
    } else if (key === 'actorDelete') {
        // Find the index of the actor to delete in actorFilters. 
        const actorToDeleteIndex = appData.actorFilters.findIndex((element) => {
            return element.id === value;
        });
        // splice the array.
        appData.actorFilters.splice(actorToDeleteIndex, 1);
        // Remove actorId from search results.
        delete appData.searchResults[value];
    } else if (key === 'common') {
        appData.commonMovieIds = value;
    } else {
        appData.searchResults[key] = value;
    }
    console.log('appData is now:', appData)
};

const makeActor = data => {
    const dataResult = data.results[0];
    const actorId = dataResult.id;
    const actorName = dataResult.name;
    const actor = { id: actorId, name: actorName };
    return actor;
};

const doFetch = (url) => {
    return fetch(url)
        .then(response => {
            return response.json();
        })
        .catch(function (err) {
            console.log("Something went wrong calling this url:", url, err);
        });
};

const makeUrlActorIdBySearchString = actorName => {
    // Example: https://api.themoviedb.org/3/search/person?api_key=67ef4e4a60b4acfa5458eea4807a1de1&query=john%20travolta&include_adult=false
    let url = tmdbUrl;
    url += 'search/person';
    url += '?api_key=' + apiKey;
    url += '&query=' + actorName;
    url += '&include_adult=false';
    return url;
};

const makeUrlMoviesByActorId = actorId => {
    // Example: https://api.themoviedb.org/3/person/8891/movie_credits?api_key=67ef4e4a60b4acfa5458eea4807a1de1
    let url = tmdbUrl;
    url += 'person/' + actorId;
    url += '/movie_credits';
    url += '?api_key=' + apiKey;
    return url;
}

const init = () => {
    searchField.focus();
};
init();

//Results populaton
const resultsCol = document.querySelector("#resultsCol");

function showResults() {

    let movieResultIds = appData.commonMovieIds;

    resultsCol.innerHTML = "";
    
    for (var i = 0; i < movieResultIds.length; i++) {

        let movieUrl = tmdbUrl;
        movieUrl += "movie/";
        movieUrl += movieResultIds[i];
        movieUrl += "?api_key=" + apiKey;
        movieUrl += "&append_to_response=credits";
        
        doFetch(movieUrl)
            .then((data) => {
                let imgUrl = "https://image.tmdb.org/t/p/w500";
                imgUrl += data.poster_path;
                imgUrl += '?api_key=' + apiKey;
                
                // console.log(data.credits.crew);
                // console.log(Object.entries(data.credits.crew)); //FIGURE OUT HOW TO GET THE DIRECTOR NAME

                // console.log((Object.entries(data.credits.crew).filter(item => item.job === 'Director').map(item => item.name)));

                let movieData = [imgUrl, data.title, data.release_date.substring(0,4), data.credits];
                
                // let directorName = ;
                createCard(movieData);
                // console.log(data);
            });
    }

}

function createCard(movieData) {
    let imgUrl = movieData[0];
    let movieTitle = movieData[1];
    let movieYear = movieData[2];
    // let directorName = ;

    let containerDiv = resultsCol.appendChild(document.createElement("div"));
    containerDiv.setAttribute("class", "container, left-align"); //changed

        let hoverDiv = containerDiv.appendChild(document.createElement("div"));
        hoverDiv.setAttribute("class", "col s12 m6 hoverable");
        hoverDiv.setAttribute("id", "results-card-holder"); //changed

            let cardHorizDiv = hoverDiv.appendChild(document.createElement("div"));
            cardHorizDiv.setAttribute("class", "card-horizontal");

                let cardImageDiv = cardHorizDiv.appendChild(document.createElement("div"));
                cardImageDiv.setAttribute("class", "card-image-holder"); //changed
                cardImageDiv.setAttribute("id", "poster-image");

                    let posterImg = cardImageDiv.appendChild(document.createElement("img"));
                    posterImg.setAttribute("class", "card-image");
                    posterImg.setAttribute("src", imgUrl);

                let cardStackedDiv = cardHorizDiv.appendChild(document.createElement("div"));
                cardStackedDiv.setAttribute("class", "card-stacked");

                    let cardContentDiv = cardStackedDiv.appendChild(document.createElement("div"));
                    cardContentDiv.setAttribute("class", "card-content");

                        let movieTitleDiv = cardContentDiv.appendChild(document.createElement("h4"));
                        movieTitleDiv.setAttribute("id", "movies-title");
                        movieTitleDiv.textContent = movieTitle;

                        let movieYearDiv = cardContentDiv.appendChild(document.createElement("div"));
                        movieYearDiv.setAttribute("id", "year");
                        movieYearDiv.textContent = "(" + movieYear + ")";

                        let directorNameDiv = cardContentDiv.appendChild(document.createElement("div"));
                        directorNameDiv.setAttribute("id", "director");
}

