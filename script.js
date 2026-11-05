// MENU MOBILE
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navigation.classList.remove("active"));
});

// RECHERCHE ET FILTRES DU CATALOGUE
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const fuelSelect = document.getElementById("fuel");
const carCards = document.querySelectorAll(".car-card");
const noResults = document.getElementById("no-results");

function filterCars() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categorySelect.value;
    const fuelValue = fuelSelect.value;
    let visibleCars = 0;

    carCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;
        const fuel = card.dataset.fuel;
        const matchesSearch = name.includes(searchValue);
        const matchesCategory = categoryValue === "all" || category === categoryValue;
        const matchesFuel = fuelValue === "all" || fuel === fuelValue;
        const visible = matchesSearch && matchesCategory && matchesFuel;

        card.style.display = visible ? "block" : "none";
        if (visible) visibleCars++;
    });

    noResults.hidden = visibleCars !== 0;
}

searchInput.addEventListener("input", filterCars);
categorySelect.addEventListener("change", filterCars);
fuelSelect.addEventListener("change", filterCars);

// Préremplir le formulaire avec le modèle choisi
document.querySelectorAll(".car-link").forEach(link => {
    link.addEventListener("click", () => {
        const message = document.getElementById("message");
        message.value = "Bonjour, je souhaite obtenir des informations sur le modèle " + link.dataset.model + ". Merci de me préciser sa disponibilité, ses versions et son prix.";
    });
});

// FORMULAIRE DE CONTACT
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();
    const recipient = "contact@votreconcession.com";

    const mailSubject = encodeURIComponent("Demande automobile : " + subject);
    const mailBody = encodeURIComponent("Nom : " + name + "\nE-mail : " + email + "\nDemande : " + subject + "\n\nMessage :\n" + message);
    formStatus.textContent = "Ouverture de votre application de messagerie...";
    window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
});

// ANNEE AUTOMATIQUE
document.getElementById("year").textContent = new Date().getFullYear();


 
// OUVERTURE DES FICHES DETAILLEES
const vehicleModal = document.getElementById("vehicle-modal");
const modalPhoto = document.getElementById("vehicle-modal-photo");
const modalTitle = document.getElementById("vehicle-modal-title");
const modalCategory = document.getElementById("vehicle-modal-category");
const modalDescription = document.getElementById("vehicle-modal-description");
const modalBody = document.getElementById("vehicle-modal-body");
const modalFuel = document.getElementById("vehicle-modal-fuel");
const modalPrice = document.getElementById("vehicle-modal-price");
const modalQuote = document.getElementById("vehicle-modal-quote");
let lastFocusedElement = null;

const fuelLabels = {
    essence: "Essence",
    diesel: "Diesel",
    hybride: "Hybride",
    "hybride-rechargeable": "Hybride rechargeable",
    electrique: "100 % électrique",
};

function openVehicleDetails(button) {
    const card = button.closest(".car-card");
    if (!card) return;

    const image = card.querySelector(".car-image img");
    const title = card.querySelector("h3").textContent.trim();
    const category = card.querySelector(".car-type").textContent.trim();
    const description = card.querySelector(".car-details").cloneNode(true);
    const motorNote = description.querySelector(".car-motor-note");
    if (motorNote) motorNote.remove();

    lastFocusedElement = button;
    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDescription.textContent = description.textContent.trim();
    modalBody.textContent = category.split(" · ")[0];
    modalFuel.textContent = fuelLabels[card.dataset.fuel] || "À confirmer selon la version";
    modalPrice.textContent = card.dataset.price ? card.dataset.price : "Prix sur demande";
    modalPhoto.src = image ? image.src : "";
    modalPhoto.alt = title + " - photo du véhicule";
    modalPhoto.style.display = image && image.style.display !== "none" ? "block" : "none";
    resetVehicleConfigurator();
    modalQuote.dataset.model = title;

    vehicleModal.classList.add("is-open");
    vehicleModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    vehicleModal.querySelector(".vehicle-modal-close").focus();
}

function closeVehicleDetails() {
    vehicleModal.classList.remove("is-open");
    vehicleModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
}

// Le bouton, la photo, le titre ou toute zone vide de la carte ouvrent la fiche.
document.querySelectorAll(".car-card").forEach(card => {
    card.addEventListener("click", event => {
        // Les contrôles restent prioritaires : le bouton ouvre la fiche lui-même.
        if (event.target.closest("a, button, input, select, textarea")) return;
        openVehicleDetails(card.querySelector(".view-car-details"));
    });

    card.addEventListener("keydown", event => {
        if ((event.key === "Enter" || event.key === " ") && event.target === card) {
            event.preventDefault();
            openVehicleDetails(card.querySelector(".view-car-details"));
        }
    });
});

document.querySelectorAll(".view-car-details").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();
        openVehicleDetails(button);
    });
});

vehicleModal.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeVehicleDetails);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && vehicleModal.classList.contains("is-open")) {
        closeVehicleDetails();
    }
});

modalQuote.addEventListener("click", () => {
    document.getElementById("message").value =
        "Bonjour, je souhaite obtenir un devis pour le modèle " +
        modalQuote.dataset.model +
        ". Ma configuration souhaitée : " + configSummary.textContent.replace("Configuration : ", "") +
        ". Merci de me confirmer les couleurs, selleries, jantes et options réellement disponibles ainsi que le prix final.";
    closeVehicleDetails();
});


// CONFIGURATEUR VISUEL : la teinte recolore uniquement la carrosserie de l'illustration.
const paintOptions = document.getElementById("paint-options");
const paintPreviewBody = document.getElementById("paint-preview-body");
const configInterior = document.getElementById("config-interior");
const configWheels = document.getElementById("config-wheels");
const configSummary = document.getElementById("config-summary");
let selectedPaint = "Noir";
let selectedPaintColor = "#171717";

function refreshConfigSummary() {
    configSummary.textContent = "Configuration : carrosserie " + selectedPaint +
        " · sellerie " + configInterior.value + " · jantes " + configWheels.value;
}

function resetVehicleConfigurator() {
    selectedPaint = "Noir";
    selectedPaintColor = "#171717";
    paintOptions.querySelectorAll(".paint-swatch").forEach((swatch, index) => {
        const selected = index === 0;
        swatch.classList.toggle("is-selected", selected);
        swatch.setAttribute("aria-pressed", String(selected));
    });
    paintPreviewBody.setAttribute("fill", selectedPaintColor);
    configInterior.value = "Noir";
    configWheels.value = "Design standard";
    refreshConfigSummary();
}

paintOptions.addEventListener("click", event => {
    const swatch = event.target.closest(".paint-swatch");
    if (!swatch) return;

    selectedPaint = swatch.dataset.paint;
    selectedPaintColor = swatch.dataset.color;
    paintOptions.querySelectorAll(".paint-swatch").forEach(item => {
        const selected = item === swatch;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
    });

    paintPreviewBody.setAttribute("fill", selectedPaintColor);
    refreshConfigSummary();
});

configInterior.addEventListener("change", refreshConfigSummary);
configWheels.addEventListener("change", refreshConfigSummary);
