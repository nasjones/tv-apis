/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	let response = await axios.get(
		`http://api.tvmaze.com/search/shows?q=${query}`
	);

	let output = [];

	for (let data of response.data) {
		let show = data.show;

		let newShow = {
			id: show.id,
			name: show.name,
			summary: show.summary,
			image: show.image
				? show.image.original
				: "https://tinyurl.com/tv-missing",
		};
		output.push(newShow);
	}

	return output;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

async function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button class="ep-button">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#search-query").val();
	if (!query) return;

	$("#episodes-area").hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above

	let response = await axios.get(
		`http://api.tvmaze.com/shows/${id}/episodes`
	);

	let output = [];

	for (let data of response.data) {
		let newEpisode = {
			id: data.id,
			name: data.name,
			season: data.season,
			number: data.number,
		};
		output.push(newEpisode);
	}

	return output;
}

function populateEpisodes(eps) {
	for (let episode of eps) {
		let $episodeItem = $(
			`<li>${episode.name}(season ${episode.name}, number ${episode.name})</li>`
		);
		$("#episodes-list").append($episodeItem);
	}
}

$(document).on("click", ".ep-button", async (e) => {
	$("#episodes-list").empty();
	$("#episodes-area").show();
	let parent = e.target.closest(".card");
	let showId = $(parent).data().showId;
	let episodes = await getEpisodes(showId);
	populateEpisodes(episodes);
});
