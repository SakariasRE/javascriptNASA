const API_KEY = "wnwakBmeUOtb6ouYeFcsVwSNy2MFMBAz5dhja1E7";

// Huvudcontainer
const container = document.getElementById("content");

// lagrar tidigare sökningar
let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// skriva ut text
function showMessage(message) {
    container.innerHTML = `<p>${message}</p>`;
}

// sparar datum i array och storage
function saveSearchDate(date) {
    // Lägger till datum om det inte redan finns
    if (!recentSearches.includes(date)) {
        recentSearches.push(date);

        // 5 datum visas
        if (recentSearches.length > 5) {
            recentSearches.shift();
        }

        // Spara i storage
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
}

// lista med tidigare sökningar
function renderSearchHistory() {
    const historyBox = document.getElementById("history");

    if (!historyBox) return; // Finns ej på alla sidor

    if (recentSearches.length === 0) {
        historyBox.innerHTML = "<p>Inga tidigare sökningar.</p>";
        return;
    }

    let html = "<h3>Tidigare sökta datum:</h3><ul>";

    // loop för sökningar
    recentSearches.forEach(date => {
        html += `<li>${date}</li>`;
    });

    html += "</ul>";

    historyBox.innerHTML = html;
}

// Hämtar APOD data
async function loadAPOD(date = "") {
    try {
        showMessage("Laddar data från NASA...");

        let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        if (date) url += `&date=${date}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("DATA från NASA:", data);

        if (data.code) {
            showMessage(`Fel: ${data.msg || "Okänt problem"}`);
            return;
        }

        // sparar sökta datum
        if (date) {
            saveSearchDate(date);
            renderSearchHistory();
        }

        renderAPOD(data);

    } catch (err) {
        showMessage("Ett fel inträffade vid hämtning av data.");
        console.error(err);
    }
}

// bild eller video och text
function renderAPOD(data) {
    let html = `
        <h2>${data.title}</h2>
        <p><strong>Datum:</strong> ${data.date}</p>
    `;

    if (data.media_type === "video") {
        html += `
            <iframe width="100%" height="400" src="${data.url}" allowfullscreen></iframe>
        `;
    } else {
        html += `
            <img src="${data.url}" alt="${data.title}" style="width: 100%; border-radius: 10px; margin-top: 15px;">
        `;
    }

    html += `<p style="margin-top: 20px;">${data.explanation}</p>`;

    container.innerHTML = html;
}

// När sidan är laddad
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("dateInput");
    const searchBtn = document.getElementById("searchBtn");

    // Visa sökhistorik
    renderSearchHistory();

    // söker i arkiv
    if (dateInput && searchBtn) {

        searchBtn.addEventListener("click", () => {
            if (!dateInput.value) {
                showMessage("Välj ett datum!");
                return;
            }
            loadAPOD(dateInput.value);
        });
    } else {
        // dagens bild
        loadAPOD();
    }
});
