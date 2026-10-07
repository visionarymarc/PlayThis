// ========================================
// PLAYTHIS - PLAYLIST GENERATOR
// ========================================

// Get the Build Playlist button
const buildButton = document.getElementById("build-button");


// ========================================
// BUILD PLAYLIST
// ========================================

buildButton.addEventListener("click", async function () {

    // Get the user's selections
    const vibe = document.getElementById("vibe").value;
    const genre = document.getElementById("genre").value;
    const artistsInput = document.getElementById("artists").value;
    const songsInput = document.getElementById("songs").value;
    const length = parseInt(document.getElementById("length").value);

    // Get the results elements
    const results = document.getElementById("results");
    const description = document.getElementById("playlist-description");
    const playlistContainer = document.getElementById("playlist-container");


    // Show the results section
    results.style.display = "block";


    // Show loading message
    playlistContainer.innerHTML =
        "<p>Building your playlist...</p>";


    // Display playlist description
    description.textContent =
        vibe + " • " +
        genre + " • " +
        length + " songs";


    // Turn comma-separated artists into an array
    const artists = artistsInput
        .split(",")
        .map(function (artist) {
            return artist.trim();
        })
        .filter(function (artist) {
            return artist !== "";
        });


    // Array that will contain all songs
    let allSongs = [];


    try {

        // ----------------------------------------
        // IF THE USER ENTERED ARTISTS
        // ----------------------------------------

        if (artists.length > 0) {

            // Search each artist separately
            for (const artist of artists) {

                const searchTerm =
                    artist + " " + genre;


                // Build iTunes API URL
                const url =
                    "https://itunes.apple.com/search?term=" +
                    encodeURIComponent(searchTerm) +
                    "&media=music&entity=song&limit=15";


                // Request songs from iTunes
                const response = await fetch(url);


                // Convert response into JavaScript data
                const data = await response.json();


                // Add the songs to our array
                allSongs = allSongs.concat(data.results);
            }

        } else {

            // ----------------------------------------
            // IF NO ARTISTS WERE ENTERED
            // ----------------------------------------

            // Search using vibe and genre
            const searchTerm =
                vibe + " " + genre;


            // Build iTunes API URL
            const url =
                "https://itunes.apple.com/search?term=" +
                encodeURIComponent(searchTerm) +
                "&media=music&entity=song&limit=50";


            // Request songs
            const response = await fetch(url);


            // Convert response into JavaScript data
            const data = await response.json();


            // Store results
            allSongs = data.results;
        }


        // ----------------------------------------
        // REMOVE DUPLICATE SONGS
        // ----------------------------------------

        allSongs = allSongs.filter(function (song, index, array) {

            return index === array.findIndex(function (item) {

                return item.trackId === song.trackId;

            });

        });


        // ----------------------------------------
        // SHUFFLE SONGS
        // ----------------------------------------

        allSongs.sort(function () {

            return Math.random() - 0.5;

        });


        // ----------------------------------------
        // LIMIT PLAYLIST SIZE
        // ----------------------------------------

        const finalPlaylist =
            allSongs.slice(0, length);


        // Display playlist
        displayPlaylist(finalPlaylist);


        // Scroll down to playlist
        results.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        // Show error in console
        console.log(error);


        // Show error on website
        playlistContainer.innerHTML =
            "<p>Something went wrong while building your playlist.</p>";
    }

});


// ========================================
// DISPLAY PLAYLIST
// ========================================

function displayPlaylist(songs) {

    // Get playlist container
    const playlistContainer =
        document.getElementById("playlist-container");


    // Clear old playlist
    playlistContainer.innerHTML = "";


    // Check if songs were found
    if (songs.length === 0) {

        playlistContainer.innerHTML =
            "<p>No songs found. Try different artists or selections.</p>";

        return;
    }


    // Create a row for every song
    songs.forEach(function (song, index) {

        // Create song div
        const songRow =
            document.createElement("div");


        // Add CSS class
        songRow.classList.add("song");


        // Add song information
        songRow.innerHTML = `

            <span class="song-number">
                ${index + 1}
            </span>

            <img
                src="${song.artworkUrl100}"
                alt="${song.trackName} album artwork"
            >

            <div class="song-info">

                <strong>
                    ${song.trackName}
                </strong>

                <span>
                    ${song.artistName}
                </span>

            </div>

            ${
                song.previewUrl

                ? `<audio
                       controls
                       src="${song.previewUrl}">
                   </audio>`

                : `<span>Preview unavailable</span>`
            }

        `;


        // Add song to playlist
        playlistContainer.appendChild(songRow);

    });

}



// ========================================
// MUSIC BACKGROUND VISUALIZER
// ========================================

// Get canvas
const canvas =
    document.getElementById("music-visualizer");


// Get drawing context
const ctx =
    canvas.getContext("2d");


// Tracks whether music is playing
let musicPlaying = false;


// Controls wave movement
let animationTime = 0;



// ========================================
// RESIZE CANVAS
// ========================================

function resizeCanvas() {

    // Match canvas to browser size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}


// Run once when page loads
resizeCanvas();


// Resize canvas if browser size changes
window.addEventListener(
    "resize",
    resizeCanvas
);



// ========================================
// DRAW ONE WAVE
// ========================================

function drawWave(color, speed, height, offset) {

    // Start drawing
    ctx.beginPath();


    // Start wave on left side
    ctx.moveTo(
        0,
        canvas.height / 2
    );


    // Draw wave across screen
    for (
        let x = 0;
        x < canvas.width;
        x += 10
    ) {

        const y =
            canvas.height / 2 +

            Math.sin(
                x * 0.008 +
                animationTime * speed +
                offset
            ) * height;


        ctx.lineTo(x, y);

    }


    // Wave color
    ctx.strokeStyle = color;


    // Wave thickness
    ctx.lineWidth = 4;


    // Glow effect
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;


    // Draw wave
    ctx.stroke();

}



// ========================================
// ANIMATE WAVES
// ========================================

function animateVisualizer() {

    // Clear previous frame
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Waves get bigger while music plays
    const energy =
        musicPlaying ? 70 : 20;


    // Green wave
    drawWave(
        "#b6f13d",
        2,
        energy,
        0
    );


    // Purple wave
    drawWave(
        "#987cff",
        1.5,
        energy * 0.8,
        2
    );


    // Pink wave
    drawWave(
        "#ff4fa3",
        1.2,
        energy * 0.6,
        4
    );


    // Move faster while music is playing
    if (musicPlaying) {

        animationTime += 0.025;

    } else {

        animationTime += 0.006;

    }


    // Continue animation
    requestAnimationFrame(
        animateVisualizer
    );

}


// Start visualizer
animateVisualizer();



// ========================================
// AUDIO PLAY EVENT
// ========================================

document.addEventListener(
    "play",

    function (event) {

        // Only respond to audio players
        if (event.target.tagName === "AUDIO") {

            // Pause every other song
            document
                .querySelectorAll("audio")
                .forEach(function (audio) {

                    if (audio !== event.target) {

                        audio.pause();

                    }

                });


            // Increase visualizer energy
            musicPlaying = true;

        }

    },

    true
);



// ========================================
// AUDIO PAUSE EVENT
// ========================================

document.addEventListener(
    "pause",

    function (event) {

        // Only respond to audio players
        if (event.target.tagName === "AUDIO") {

            // Check if another song is playing
            const anyPlaying =
                Array
                    .from(
                        document.querySelectorAll("audio")
                    )
                    .some(function (audio) {

                        return !audio.paused;

                    });


            // Update visualizer
            musicPlaying = anyPlaying;

        }

    },

    true
);



// ========================================
// AUDIO ENDED EVENT
// ========================================

document.addEventListener(
    "ended",

    function (event) {

        // Only respond to audio players
        if (event.target.tagName === "AUDIO") {

            // Calm visualizer
            musicPlaying = false;

        }

    },

    true
);