function csrfToken() {
    var m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.content : "";
}

function esc(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

async function searchDisease(animal) {

    const T = window.I18N || {};

    const checked = document.querySelectorAll(".symptoms input:checked");
    const symptoms = Array.from(checked).map(function (item) {
        return item.value;
    });

    if (symptoms.length === 0) {
        alert(T.js_select_one || "Please select at least one symptom.");
        return;
    }

    const result = document.getElementById("result");
    const btn = document.getElementById("check-btn");
    if (btn) { btn.disabled = true; }

    try {

        const response = await fetch("/search_disease", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken() },
            body: JSON.stringify({ animal: animal, symptoms: symptoms })
        });

        const data = await response.json();

        result.innerHTML = "";

        if (data.status === "success") {

            data.results.forEach(function (d) {

                result.innerHTML += `
                <div class="result-card">

                    <h2><i class="fa-solid fa-virus"></i> ${esc(d.disease)}</h2>

                    <div class="match">${esc(d.match)}% ${esc(T.js_match)}</div>

                    <p>
                        <strong><i class="fa-solid fa-circle-info"></i> ${esc(T.js_desc_label)}</strong><br>
                        ${esc(d.description)}
                    </p>

                    <p>
                        <strong><i class="fa-solid fa-kit-medical"></i> ${esc(T.js_treatment_label)}</strong><br>
                        ${esc(d.treatment)}
                    </p>

                    <p>
                        <strong><i class="fa-solid fa-shield-heart"></i> ${esc(T.js_prevention_label)}</strong>
                    </p>
                    <ul class="prevention-list">
                        <li>${esc(T.js_prev_1)}</li>
                        <li>${esc(T.js_prev_2)}</li>
                        <li>${esc(T.js_prev_3)}</li>
                        <li>${esc(T.js_prev_4)}</li>
                    </ul>

                </div>`;
            });

            result.innerHTML += `
                <p class="detect-note">
                    <i class="fa-solid fa-triangle-exclamation"></i> ${esc(T.js_disclaimer)}
                </p>`;

        } else {

            result.innerHTML = `
                <div class="result-card">
                    <h2>${esc(T.js_no_disease_title)}</h2>
                    <p>${esc(T.js_no_disease_msg)}</p>
                </div>`;
        }

        result.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {

        console.log(error);
        alert(T.js_server_error || "Server error");

    } finally {

        if (btn) { btn.disabled = false; }
    }
}
