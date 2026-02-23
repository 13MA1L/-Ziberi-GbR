document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // Navigation / Animationen
    // =========================
    const sections = document.querySelectorAll("section");
    const mobileBtn = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");

    if (sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("visible", entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        sections.forEach((section) => {
            section.classList.add("hidden");
            observer.observe(section);
        });
    }

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });

        const navLinksAll = navLinks.querySelectorAll("a");
        navLinksAll.forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
            });
        });
    }

    // Fix: buttons war vorher nicht definiert
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.add("clicked");
            setTimeout(() => button.classList.remove("clicked"), 300);
        });
    });

    // =========================
    // Cookie Banner
    // =========================
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");

    if (cookieBanner && acceptBtn) {
        const hasAccepted = localStorage.getItem("cookiesAccepted") === "true";
        cookieBanner.style.display = hasAccepted ? "none" : "flex";

        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "true");
            cookieBanner.style.display = "none";
        });
    }

    // =========================
    // Formular Validierung + Upload
    // =========================
    const form = document.querySelector("form");
    if (!form) return;

    const fileInput = document.getElementById("bilder");
    const uploadZone = document.getElementById("upload-zone");
    const uploadStatus = document.getElementById("upload-status");
    const preview = document.getElementById("image-preview");
    const errorBilder = document.getElementById("error-bilder");

    const MAX_FILES = 5;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

    let selectedFiles = [];

    const bytesToMB = (bytes) => bytes / (1024 * 1024);
    const fmtMB = (mb) => mb.toFixed(mb >= 10 ? 0 : 1);

    const setFileError = (msg) => {
        if (!errorBilder) return;
        errorBilder.textContent = msg || "";
        if (fileInput) {
            if (msg) fileInput.classList.add("error");
            else fileInput.classList.remove("error");
        }
    };

    const syncInputFiles = () => {
        if (!fileInput) return;
        const dt = new DataTransfer();
        selectedFiles.forEach((f) => dt.items.add(f));
        fileInput.files = dt.files;
    };

    const updateStatus = () => {
        if (!uploadStatus) return;
        const totalMB = selectedFiles.reduce((sum, f) => sum + bytesToMB(f.size), 0);
        uploadStatus.textContent = `${fmtMB(totalMB)} / ${fmtMB(bytesToMB(MAX_SIZE))} MB · ${selectedFiles.length}/${MAX_FILES} Bilder`;
    };

    const renderPreview = () => {
        if (!preview) return;
        preview.innerHTML = "";

        selectedFiles.forEach((file, index) => {
            const card = document.createElement("div");
            card.className = "preview-card";

            const img = document.createElement("img");
            img.alt = "Vorschau Bild";

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "preview-remove";
            removeBtn.setAttribute("aria-label", "Bild entfernen");
            removeBtn.innerHTML = "&times;";
            removeBtn.addEventListener("click", () => {
                selectedFiles.splice(index, 1);
                syncInputFiles();
                renderPreview();
                updateStatus();
                setFileError("");
            });

            // ✅ Badge: "0.8 / 5 MB" pro Bild
            const badge = document.createElement("div");
            badge.className = "preview-size-badge";
            badge.textContent = `${fmtMB(bytesToMB(file.size))} / ${fmtMB(bytesToMB(MAX_SIZE))} MB`;

            card.appendChild(img);
            card.appendChild(removeBtn);
            card.appendChild(badge);
            preview.appendChild(card);

            const reader = new FileReader();
            reader.onload = (e) => (img.src = e.target.result);
            reader.readAsDataURL(file);
        });
    };

    const validateAndAddFiles = (files) => {
        setFileError("");
        const incoming = Array.from(files || []);
        if (incoming.length === 0) return;

        if (selectedFiles.length + incoming.length > MAX_FILES) {
            setFileError(`Maximal ${MAX_FILES} Bilder erlaubt.`);
            return;
        }

        for (const f of incoming) {
            if (!ALLOWED_TYPES.has(f.type)) {
                setFileError("Nur JPG, PNG oder WebP sind erlaubt.");
                return;
            }
            if (f.size > MAX_SIZE) {
                setFileError(`Ein Bild ist zu groß. Maximal ${fmtMB(bytesToMB(MAX_SIZE))} MB pro Bild.`);
                return;
            }
        }

        // Duplikate vermeiden (Name+Size+Type)
        const key = (f) => `${f.name}__${f.size}__${f.type}`;
        const existing = new Set(selectedFiles.map(key));
        const filtered = incoming.filter((f) => !existing.has(key(f)));

        selectedFiles = selectedFiles.concat(filtered);
        syncInputFiles();
        renderPreview();
        updateStatus();

        // erlaubt erneute Auswahl derselben Datei
        if (fileInput) fileInput.value = "";
    };

    // ✅ Change (Klick-Auswahl)
    if (fileInput) {
        fileInput.addEventListener("change", () => {
            validateAndAddFiles(fileInput.files);
        });
    }

    // ✅ Drag & Drop
    if (uploadZone) {
        const prevent = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        ["dragenter", "dragover"].forEach((evt) => {
            uploadZone.addEventListener(evt, (e) => {
                prevent(e);
                uploadZone.classList.add("dragover");
            });
        });

        ["dragleave", "drop"].forEach((evt) => {
            uploadZone.addEventListener(evt, (e) => {
                prevent(e);
                uploadZone.classList.remove("dragover");
            });
        });

        uploadZone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files) validateAndAddFiles(dt.files);
        });

        // Enter/Space öffnet Dateiauswahl
        uploadZone.addEventListener("keydown", (e) => {
            if ((e.key === "Enter" || e.key === " ") && fileInput) {
                e.preventDefault();
                fileInput.click();
            }
        });
    }

    // init status
    updateStatus();

    // =========================
    // Formular Validierung (Textfelder)
    // =========================
    const showError = (id, message) => {
        const input = document.getElementById(id);
        const error = document.getElementById("error-" + id);
        if (input) input.classList.add("error");
        if (error) error.textContent = message;
    };

    const clearError = (id) => {
        const input = document.getElementById(id);
        const error = document.getElementById("error-" + id);
        if (input) input.classList.remove("error");
        if (error) error.textContent = "";
    };

    form.addEventListener("submit", function (e) {
        let valid = true;

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

        fields.forEach((field) => {
            const input = document.getElementById(field.id);
            if (!input) return;

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

        const datenschutz = document.getElementById("datenschutz");
        const errorDatenschutz = document.getElementById("error-datenschutz");
        if (datenschutz && errorDatenschutz) {
            if (!datenschutz.checked) {
                datenschutz.classList.add("error");
                errorDatenschutz.textContent = "Bitte Datenschutzrichtlinien akzeptieren.";
                valid = false;
            } else {
                datenschutz.classList.remove("error");
                errorDatenschutz.textContent = "";
            }
        }

        // Upload nochmal checken (optional)
        if (selectedFiles.length > MAX_FILES) {
            setFileError(`Maximal ${MAX_FILES} Bilder erlaubt.`);
            valid = false;
        }
        for (const f of selectedFiles) {
            if (!ALLOWED_TYPES.has(f.type)) {
                setFileError("Nur JPG, PNG oder WebP sind erlaubt.");
                valid = false;
                break;
            }
            if (f.size > MAX_SIZE) {
                setFileError(`Ein Bild ist zu groß. Maximal ${fmtMB(bytesToMB(MAX_SIZE))} MB pro Bild.`);
                valid = false;
                break;
            }
        }

        if (!valid) e.preventDefault();
    });
});