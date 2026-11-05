
// ==========================================
// NOVA MOTORS INTERNATIONAL
// SCRIPT PRINCIPAL
// ==========================================


// ==========================================
// 1. MENU MOBILE
// ==========================================

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        navigation.classList.toggle("active");
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
        });
    });
}


// ==========================================
// 2. RECHERCHE ET FILTRES DU CATALOGUE
// ==========================================

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const fuelSelect = document.getElementById("fuel");
const carCards = document.querySelectorAll(".car-card");
const noResults = document.getElementById("no-results");

function filterCars() {
    if (!searchInput || !categorySelect) return;

    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categorySelect.value;
    const fuelValue = fuelSelect ? fuelSelect.value : "all";

    let visibleCars = 0;

    carCards.forEach(card => {
        const name = (card.dataset.name || "").toLowerCase();
        const category = card.dataset.category || "";
        const fuel = card.dataset.fuel || "";

        const matchesSearch = name.includes(searchValue);
        const matchesCategory =
            categoryValue === "all" || category === categoryValue;
        const matchesFuel =
            fuelValue === "all" || fuel === fuelValue;

        const visible =
            matchesSearch && matchesCategory && matchesFuel;

        card.style.display = visible ? "block" : "none";

        if (visible) visibleCars++;
    });

    if (noResults) {
        noResults.hidden = visibleCars !== 0;
    }
}

if (searchInput) {
    searchInput.addEventListener("input", filterCars);
}

if (categorySelect) {
    categorySelect.addEventListener("change", filterCars);
}

if (fuelSelect) {
    fuelSelect.addEventListener("change", filterCars);
}


// ==========================================
// 3. PRÉREMPLISSAGE DU FORMULAIRE
// ==========================================

document.querySelectorAll(".car-link").forEach(link => {
    link.addEventListener("click", () => {
        const message = document.getElementById("message");

        if (message) {
            message.value =
                "Bonjour, je souhaite obtenir des informations sur le modèle " +
                link.dataset.model +
                ". Merci de me préciser sa disponibilité, ses versions et son prix.";
        }
    });
});


// ==========================================
// 4. FORMULAIRE DE CONTACT
// ==========================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const subject = document.getElementById("subject")?.value || "";
        const message = document.getElementById("message")?.value.trim() || "";

        const recipient = "contact.novamotorsinternational@gmail.com";

        const mailSubject = encodeURIComponent(
            "Demande automobile : " + subject
        );

        const mailBody = encodeURIComponent(
            "Nom : " + name +
            "\nE-mail : " + email +
            "\nDemande : " + subject +
            "\n\nMessage :\n" + message
        );

        if (formStatus) {
            formStatus.textContent =
                "Ouverture de votre application de messagerie...";
        }

        window.location.href =
            `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
    });
}


// ==========================================
// 5. ANNÉE AUTOMATIQUE
// ==========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ==========================================
// 6. FICHES DÉTAILLÉES DES VÉHICULES
// ==========================================

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
    electrique: "100 % électrique"
};

function openVehicleDetails(button) {
    if (!vehicleModal || !button) return;

    const card = button.closest(".car-card");
    if (!card) return;

    const image = card.querySelector(".car-image img");
    const titleElement = card.querySelector("h3");
    const categoryElement = card.querySelector(".car-type");
    const detailsElement = card.querySelector(".car-details");

    if (!titleElement || !categoryElement) return;

    const title = titleElement.textContent.trim();
    const category = categoryElement.textContent.trim();

    const description = detailsElement
        ? detailsElement.cloneNode(true)
        : null;

    if (description) {
        const motorNote = description.querySelector(".car-motor-note");
        if (motorNote) motorNote.remove();
    }

    lastFocusedElement = button;

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;

    if (modalDescription) {
        modalDescription.textContent =
            description ? description.textContent.trim() : "";
    }

    if (modalBody) {
        modalBody.textContent = category.split(" · ")[0];
    }

    if (modalFuel) {
        modalFuel.textContent =
            fuelLabels[card.dataset.fuel] ||
            "À confirmer selon la version";
    }

    if (modalPrice) {
        modalPrice.textContent =
            card.dataset.price || "Prix sur demande";
    }

    if (modalPhoto) {
        modalPhoto.src = image ? image.src : "";
        modalPhoto.alt = title + " - photo du véhicule";
        modalPhoto.style.display =
            image && image.style.display !== "none" ? "block" : "none";
    }

    if (typeof resetVehicleConfigurator === "function") {
        resetVehicleConfigurator();
    }

    if (modalQuote) {
        modalQuote.dataset.model = title;
    }

    vehicleModal.classList.add("is-open");
    vehicleModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton =
        vehicleModal.querySelector(".vehicle-modal-close");

    if (closeButton) closeButton.focus();
}

function closeVehicleDetails() {
    if (!vehicleModal) return;

    vehicleModal.classList.remove("is-open");
    vehicleModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}


// Ouverture des fiches depuis les cartes

document.querySelectorAll(".car-card").forEach(card => {
    card.addEventListener("click", event => {
        if (event.target.closest("a, button, input, select, textarea")) {
            return;
        }

        const button = card.querySelector(".view-car-details");

        if (button) {
            openVehicleDetails(button);
        }
    });

    card.addEventListener("keydown", event => {
        if (
            (event.key === "Enter" || event.key === " ") &&
            event.target === card
        ) {
            event.preventDefault();

            const button = card.querySelector(".view-car-details");

            if (button) {
                openVehicleDetails(button);
            }
        }
    });
});

document.querySelectorAll(".view-car-details").forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();
        openVehicleDetails(button);
    });
});

if (vehicleModal) {
    vehicleModal.querySelectorAll("[data-close-modal]").forEach(element => {
        element.addEventListener("click", closeVehicleDetails);
    });
}

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        vehicleModal &&
        vehicleModal.classList.contains("is-open")
    ) {
        closeVehicleDetails();
    }
});


// ==========================================
// 7. CONFIGURATEUR PHOTO
// ==========================================

const paintOptions = document.getElementById("paint-options");
const configInterior = document.getElementById("config-interior");
const configWheels = document.getElementById("config-wheels");
const configSummary = document.getElementById("config-summary");

const photoFrame = document.querySelector(".vehicle-modal-image");

const bodyOverlay = document.getElementById(
    "vehicle-photo-body-overlay"
);

const wheelOverlay = document.getElementById(
    "vehicle-photo-wheel-overlay"
);

const paintSurface = document.getElementById(
    "vehicle-photo-paint-surface"
);

const bodyModeButton = document.getElementById("paint-body-mode");
const wheelModeButton = document.getElementById("paint-wheel-mode");
const clearMaskButton = document.getElementById("clear-photo-mask");
const maskInstruction = document.getElementById("mask-instruction");

const bodyMask = document.createElement("canvas");
const wheelMask = document.createElement("canvas");

let bodyMaskContext = bodyMask.getContext("2d");
let wheelMaskContext = wheelMask.getContext("2d");

let selectedPaint = "Noir";
let selectedPaintColor = "#171717";
let activePaintTarget = "body";
let isPainting = false;
let currentMaskKey = "";

const wheelColors = {
    "Design standard": "#b8bec5",
    "Sport": "#707782",
    "Noir brillant": "#17191d",
    "Alliage premium": "#d7dde4"
};


// Résumé de configuration

function refreshConfigSummary() {
    if (!configSummary) return;

    configSummary.textContent =
        "Configuration : carrosserie " +
        selectedPaint +
        " · sellerie " +
        (configInterior ? configInterior.value : "Noir") +
        " · jantes " +
        (configWheels ? configWheels.value : "Design standard");
}


// Sélection du masque actif

function activeMaskCanvas() {
    return activePaintTarget === "body" ? bodyMask : wheelMask;
}

function activeMaskContext() {
    return activePaintTarget === "body"
        ? bodyMaskContext
        : wheelMaskContext;
}


// Stockage local des zones peintes

function maskStorageKey(target) {
    return "nova-photo-mask:" + currentMaskKey + ":" + target;
}

function saveActiveMask() {
    try {
        localStorage.setItem(
            maskStorageKey(activePaintTarget),
            activeMaskCanvas().toDataURL("image/png")
        );
    } catch (error) {
        // Le pinceau reste utilisable si le stockage est indisponible.
    }
}

function loadMask(canvas, context, target) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
        const saved = localStorage.getItem(maskStorageKey(target));

        if (!saved) return;

        const image = new Image();

        image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );

            renderPhotoOverlays();
        };

        image.src = saved;

    } catch (error) {
        // Aucun masque enregistré.
    }
}


// Redimensionnement des masques

function resizeMaskCanvas(canvas, context, width, height) {
    const old = document.createElement("canvas");

    old.width = canvas.width;
    old.height = canvas.height;

    if (old.width && old.height) {
        old.getContext("2d").drawImage(canvas, 0, 0);
    }

    canvas.width = width;
    canvas.height = height;

    if (old.width && old.height) {
        context.drawImage(old, 0, 0, width, height);
    }
}


// Application de la couleur sur la vraie photo

function renderOneOverlay(output, mask, color) {
    if (!output || !mask.width || !mask.height) return;

    const context = output.getContext("2d");

    if (
        output.width !== mask.width ||
        output.height !== mask.height
    ) {
        output.width = mask.width;
        output.height = mask.height;
    }

    context.clearRect(0, 0, output.width, output.height);

    context.globalCompositeOperation = "source-over";
    context.fillStyle = color;

    context.fillRect(
        0,
        0,
        output.width,
        output.height
    );

    context.globalCompositeOperation = "destination-in";
    context.drawImage(mask, 0, 0);

    context.globalCompositeOperation = "source-over";
}

function renderPhotoOverlays() {
    if (!bodyMask.width || !bodyMask.height) return;

    renderOneOverlay(
        bodyOverlay,
        bodyMask,
        selectedPaintColor
    );

    renderOneOverlay(
        wheelOverlay,
        wheelMask,
        wheelColors[
            configWheels
                ? configWheels.value
                : "Design standard"
        ] || wheelColors["Design standard"]
    );
}


// Initialisation des masques sur la photo

function initializePhotoMasks() {
    if (!photoFrame || !modalPhoto || !bodyOverlay ||
        !wheelOverlay || !paintSurface) return;

    const rect = photoFrame.getBoundingClientRect();

    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    resizeMaskCanvas(bodyMask, bodyMaskContext, width, height);
    resizeMaskCanvas(wheelMask, wheelMaskContext, width, height);

    [bodyOverlay, wheelOverlay, paintSurface].forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
    });

    currentMaskKey =
        (modalTitle ? modalTitle.textContent : "vehicle").trim();

    loadMask(bodyMask, bodyMaskContext, "body");
    loadMask(wheelMask, wheelMaskContext, "wheels");

    renderPhotoOverlays();
}

if (modalPhoto) {
    modalPhoto.addEventListener("load", () => {
        if (
            vehicleModal &&
            vehicleModal.classList.contains("is-open")
        ) {
            initializePhotoMasks();
        }
    });
}


// Sélection de la zone à personnaliser

function setPaintTarget(target) {
    activePaintTarget = target;

    const bodySelected = target === "body";

    if (bodyModeButton) {
        bodyModeButton.classList.toggle("is-active", bodySelected);
        bodyModeButton.setAttribute(
            "aria-pressed",
            String(bodySelected)
        );
    }

    if (wheelModeButton) {
        wheelModeButton.classList.toggle("is-active", !bodySelected);
        wheelModeButton.setAttribute(
            "aria-pressed",
            String(!bodySelected)
        );
    }

    if (paintSurface) {
        paintSurface.classList.add("is-painting");
        paintSurface.style.pointerEvents = "auto";
    }

    if (maskInstruction) {
        maskInstruction.textContent = bodySelected
            ? "Passe le pinceau sur la carrosserie de la photo. Évite les vitres, les pneus et le décor."
            : "Passe le pinceau sur les jantes de la photo pour modifier leur finition.";
    }
}


// Remise à zéro de la configuration

function resetVehicleConfigurator() {
    selectedPaint = "Noir";
    selectedPaintColor = "#171717";

    if (paintOptions) {
        paintOptions.querySelectorAll(".paint-swatch").forEach(
            (swatch, index) => {
                const selected = index === 0;

                swatch.classList.toggle("is-selected", selected);

                swatch.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            }
        );
    }

    if (configInterior) {
        configInterior.value = "Noir";
    }

    if (configWheels) {
        configWheels.value = "Design standard";
    }

    setPaintTarget("body");
    renderPhotoOverlays();
    refreshConfigSummary();
}


// Choix des couleurs de carrosserie

if (paintOptions) {
    paintOptions.addEventListener("click", event => {
        const swatch = event.target.closest(".paint-swatch");

        if (!swatch) return;

        selectedPaint = swatch.dataset.paint;
        selectedPaintColor = swatch.dataset.color;

        paintOptions.querySelectorAll(".paint-swatch").forEach(item => {
            const selected = item === swatch;

            item.classList.toggle("is-selected", selected);

            item.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });

        renderPhotoOverlays();
        refreshConfigSummary();
    });
}


// Choix carrosserie / jantes

if (bodyModeButton) {
    bodyModeButton.addEventListener("click", () => {
        setPaintTarget("body");
    });
}

if (wheelModeButton) {
    wheelModeButton.addEventListener("click", () => {
        setPaintTarget("wheels");
    });
}


// Effacement du masque actif

if (clearMaskButton) {
    clearMaskButton.addEventListener("click", () => {
        const canvas = activeMaskCanvas();
        const context = activeMaskContext();

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        saveActiveMask();
        renderPhotoOverlays();
    });
}


// Dessin du pinceau sur la photo

function paintAt(event) {
    if (!paintSurface) return;

    const rect = paintSurface.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x =
        (event.clientX - rect.left) *
        (paintSurface.width / rect.width);

    const y =
        (event.clientY - rect.top) *
        (paintSurface.height / rect.height);

    const context = activeMaskContext();

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#fff";
    context.fillStyle = "#fff";

    context.lineWidth = Math.max(
        12,
        paintSurface.width * 0.045
    );

    if (event.type === "pointerdown") {
        context.beginPath();

        context.arc(
            x,
            y,
            context.lineWidth / 2,
            0,
            Math.PI * 2
        );

        context.fill();

        context.beginPath();
        context.moveTo(x, y);

    } else {
        context.lineTo(x, y);
        context.stroke();
    }

    renderPhotoOverlays();
}

if (paintSurface) {
    paintSurface.addEventListener("pointerdown", event => {
        if (paintSurface.style.pointerEvents !== "auto") return;

        isPainting = true;

        paintSurface.setPointerCapture(event.pointerId);

        paintAt(event);
    });

    paintSurface.addEventListener("pointermove", event => {
        if (isPainting) {
            paintAt(event);
        }
    });
}

function finishPainting() {
    if (!isPainting) return;

    isPainting = false;
    saveActiveMask();
}

if (paintSurface) {
    paintSurface.addEventListener("pointerup", finishPainting);
    paintSurface.addEventListener("pointercancel", finishPainting);
}


// Choix de la sellerie

if (configInterior) {
    configInterior.addEventListener(
        "change",
        refreshConfigSummary
    );
}


// Choix des jantes

if (configWheels) {
    configWheels.addEventListener("change", () => {
        renderPhotoOverlays();
        refreshConfigSummary();
    });
}


// ==========================================
// 8. DEMANDE DE DEVIS AVEC CONFIGURATION
// ==========================================

if (modalQuote) {
    modalQuote.addEventListener("click", () => {
        const message = document.getElementById("message");

        if (message) {
            const summary = configSummary
                ? configSummary.textContent.replace(
                    "Configuration : ",
                    ""
                )
                : "À définir";

            message.value =
                "Bonjour, je souhaite obtenir un devis pour le modèle " +
                modalQuote.dataset.model +
                ". Ma configuration souhaitée : " +
                summary +
                ". Merci de me confirmer les couleurs, selleries, jantes et options réellement disponibles ainsi que le prix final.";
        }

        closeVehicleDetails();
    });
}


// ==========================================
// 9. REDIMENSIONNEMENT DE LA PHOTO
// ==========================================

window.addEventListener("resize", () => {
    if (
        vehicleModal &&
        vehicleModal.classList.contains("is-open") &&
        modalPhoto &&
        modalPhoto.complete &&
        modalPhoto.naturalWidth
    ) {
        initializePhotoMasks();
    }
});


// ==========================================
// FIN DU SCRIPT
// ==========================================
