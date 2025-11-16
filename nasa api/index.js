const API_KEY = "wnwakBmeUOtb6ouYeFcsVwSNy2MFMBAz5dhja1E7";

// Huvudcontainer
const container = document.getElementById("content");

// skriva ut text
function showMessage(message) {
    container.innerHTML = `<p>${message}</p>`;
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
            // NASA API fel
            showMessage(`Fel: ${data.msg || "Okänt problem"}`);
            return;
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
    // akriv sökning
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
