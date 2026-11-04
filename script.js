
// MENU MOBILE
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("active");
    });
});

// RECHERCHE ET FILTRES DES VEHICULES
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const carCards = document.querySelectorAll(".car-card");
const noResults = document.getElementById("no-results");

function filterCars() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categorySelect.value;

    let visibleCars = 0;

    carCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = name.includes(searchValue);
        const matchesCategory =
            categoryValue === "all" || category === categoryValue;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
            visibleCars++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.hidden = visibleCars !== 0;
}

searchInput.addEventListener("input", filterCars);
categorySelect.addEventListener("change", filterCars);

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

    const mailSubject = encodeURIComponent(
        "Demande automobile : " + subject
    );

    const mailBody = encodeURIComponent(
        "Nom : " + name +
        "\nE-mail : " + email +
        "\nDemande : " + subject +
        "\n\nMessage :\n" + message
    );

    formStatus.textContent = "Ouverture de votre application de messagerie...";

    window.location.href =
        `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
});

// ANNEE AUTOMATIQUE
document.getElementById("year").textContent =
    new Date().getFullYear();

