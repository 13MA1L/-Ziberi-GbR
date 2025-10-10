document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navbar = document.querySelector(".navbar");
    const mobileBtn = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");
    const navLinksAll = navLinks.querySelectorAll("a");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("visible", entry.isIntersecting);
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.classList.add("hidden");
        observer.observe(section);
    });

    mobileBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    navLinksAll.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
        });
    });

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.add("clicked");
            setTimeout(() => {
                button.classList.remove("clicked");
            }, 300);
        });
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");

    if (cookieBanner && acceptBtn) {
        const hasAccepted = localStorage.getItem("cookiesAccepted") === "true";

        if (!hasAccepted) {
            cookieBanner.style.display = "flex";
        } else {
            cookieBanner.style.display = "none";
        }

        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "true");
            cookieBanner.style.display = "none";
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        let valid = true;

        const showError = (id, message) => {
            const input = document.getElementById(id);
            const error = document.getElementById("error-" + id);
            input.classList.add("error");
            error.textContent = message;
        };

        const clearError = (id) => {
            const input = document.getElementById(id);
            const error = document.getElementById("error-" + id);
            input.classList.remove("error");
            error.textContent = "";
        };

        // Regex-Muster
        const namePattern = /^[A-Za-zÀ-ÿäöüÄÖÜß\-'\s]+$/;
        const addressPattern = /[A-Za-zÀ-ÿäöüÄÖÜß\s]+\s+\d+/;
        const plzPattern = /^\d{4,6}$/; // nur Zahlen, mind. 4–6 Stellen

        // Felder holen
        const email = document.getElementById("email");
        const vorname = document.getElementById("vorname");
        const nachname = document.getElementById("nachname");
        const ort = document.getElementById("ort");
        const plz = document.getElementById("plz");
        const adresse = document.getElementById("adresse");
        const beschreibung = document.getElementById("beschreibung");
        const datenschutz = document.getElementById("datenschutz");

        // E-Mail
        if (!email.value.trim()) {
            showError("email", "E-Mail ist erforderlich.");
            valid = false;
        } else {
            clearError("email");
        }

        // Vorname
        if (!vorname.value.trim() || !namePattern.test(vorname.value)) {
            showError("vorname", "Nur Buchstaben erlaubt (inkl. é, ä, ü, ...).");
            valid = false;
        } else {
            clearError("vorname");
        }

        // Nachname
        if (!nachname.value.trim() || !namePattern.test(nachname.value)) {
            showError("nachname", "Nur Buchstaben erlaubt (inkl. é, ä, ü, ...).");
            valid = false;
        } else {
            clearError("nachname");
        }

        // Ort
        if (!ort.value.trim() || !namePattern.test(ort.value)) {
            showError("ort", "Nur Buchstaben erlaubt.");
            valid = false;
        } else {
            clearError("ort");
        }

        // Postleitzahl (nur Zahlen)
        if (!plz.value.trim() || !plzPattern.test(plz.value)) {
            showError("plz", "Nur Zahlen erlaubt (z. B. 46045).");
            valid = false;
        } else {
            clearError("plz");
        }

        // Adresse (muss Zahl enthalten)
        if (!adresse.value.trim() || !addressPattern.test(adresse.value)) {
            showError("adresse", "Adresse muss Straße und Hausnummer enthalten.");
            valid = false;
        } else {
            clearError("adresse");
        }

        // Beschreibung
        if (!beschreibung.value.trim()) {
            showError("beschreibung", "Beschreibung darf nicht leer sein.");
            valid = false;
        } else {
            clearError("beschreibung");
        }

        // Datenschutz (Pflicht)
        const errorDatenschutz = document.getElementById("error-datenschutz");
        if (!datenschutz.checked) {
            datenschutz.classList.add("error");
            errorDatenschutz.textContent = "Bitte Datenschutzrichtlinien akzeptieren.";
            valid = false;
        } else {
            datenschutz.classList.remove("error");
            errorDatenschutz.textContent = "";
        }

        if (!valid) {
            e.preventDefault(); // Formular nicht absenden
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        let valid = true;

        const showError = (id, message) => {
            const input = document.getElementById(id);
            const error = document.getElementById("error-" + id);
            input.classList.add("error");
            error.textContent = message;
        };

        const clearError = (id) => {
            const input = document.getElementById(id);
            const error = document.getElementById("error-" + id);
            input.classList.remove("error");
            error.textContent = "";
        };

        // Regex-Muster
        const namePattern = /^[A-Za-zÀ-ÿäöüÄÖÜß\-'\s]+$/;
        const addressPattern = /[A-Za-zÀ-ÿäöüÄÖÜß\s]+\s+\d+/;
        const plzPattern = /^\d{4,6}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const fields = [
            { id: "email", type: "email" },
            { id: "vorname", type: "name" },
            { id: "nachname", type: "name" },
            { id: "ort", type: "name" },
            { id: "plz", type: "plz" },
            { id: "adresse", type: "adresse" },
            { id: "beschreibung", type: "text" }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const value = input.value.trim();

            if (!value) {
                showError(field.id, "Feld darf nicht leer sein.");
                valid = false;
                return;
            }

            if (field.type === "name" && !namePattern.test(value)) {
                showError(field.id, "Nur Buchstaben erlaubt (inkl. é, ä, ü, ß...).");
                valid = false;
            } else if (field.type === "plz" && !plzPattern.test(value)) {
                showError(field.id, "Nur Zahlen erlaubt (4–6 Stellen).");
                valid = false;
            } else if (field.type === "adresse" && !addressPattern.test(value)) {
                showError(field.id, "Adresse muss Straße und Hausnummer enthalten.");
                valid = false;
            } else if (field.type === "email" && !emailPattern.test(value)) {
                showError(field.id, "Bitte eine gültige E-Mail-Adresse eingeben.");
                valid = false;
            } else {
                clearError(field.id);
            }
        });

        // Datenschutz prüfen
        const datenschutz = document.getElementById("datenschutz");
        const errorDatenschutz = document.getElementById("error-datenschutz");
        if (!datenschutz.checked) {
            datenschutz.classList.add("error");
            errorDatenschutz.textContent = "Bitte Datenschutzrichtlinien akzeptieren.";
            valid = false;
        } else {
            datenschutz.classList.remove("error");
            errorDatenschutz.textContent = "";
        }

        if (!valid) {
            e.preventDefault(); // blockiere Absenden
        }
    });
});
