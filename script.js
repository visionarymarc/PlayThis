const buildButton = document.getElementById("build-button");

buildButton.addEventListener("click", async function () {

    // Get user selections
    const vibe = document.getElementById("vibe").value;
    const genre = document.getElementById("genre").value;
    const artists = document.getElementById("artists").value;
    const songs = document.getElementById("songs").value;
    const length = document.getElementById("length").value;

    const results = document.getElementById("results");
    const description = document.getElementById("playlist-description");
    const playlistContainer = document.getElementById("playlist-container");

    // Show loading message
    results.style.display = "block";
    playlistContainer.innerHTML = "<p>Building your playlist...</p>";

    description.textContent =
        vibe + " • " +
        genre + " • " +
        length + " songs";

    // Build a search using the user's choices
    let searchTerm = vibe + " " + genre;

    if (artists.trim() !== "") {
        searchTerm += " " + artists;
    }

    if (songs.trim() !== "") {
        searchTerm += " " + songs;
    }

    try {

        const url =
            "https://itunes.apple.com/search?term=" +
            encodeURIComponent(searchTerm) +
            "&media=music&entity=song&limit=" +
            length;

        const response = await fetch(url);

        const data = await response.json();

        displayPlaylist(data.results);

    } catch (error) {

        console.log(error);

        playlistContainer.innerHTML =
            "<p>Something went wrong while building your playlist.</p>";
    }

});


function displayPlaylist(songs) {

    const playlistContainer =
        document.getElementById("playlist-container");

    playlistContainer.innerHTML = "";

    if (songs.length === 0) {

        playlistContainer.innerHTML =
            "<p>No songs found. Try different artists or selections.</p>";

        return;
    }

    songs.forEach(function (song, index) {

        const songRow = document.createElement("div");

        songRow.classList.add("song");

        songRow.innerHTML = `
            <span class="song-number">${index + 1}</span>

            <img
                src="${song.artworkUrl100}"
                alt="${song.trackName} album artwork"
            >

            <div class="song-info">
                <strong>${song.trackName}</strong>
                <span>${song.artistName}</span>
            </div>

            ${
                song.previewUrl
                ? `<audio controls src="${song.previewUrl}"></audio>`
                : `<span>Preview unavailable</span>`
            }
        `;

        playlistContainer.appendChild(songRow);

    });

}