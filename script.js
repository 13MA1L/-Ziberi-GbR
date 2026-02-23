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
        mobileBtn.addEventListener("click", () => navLinks.classList.toggle("show"));
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => navLinks.classList.remove("show"));
        });
    }

    document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.add("clicked");
            setTimeout(() => button.classList.remove("clicked"), 300);
        });
    });

    // =========================
    // Formular + Upload
    // =========================
    const form = document.querySelector("form");
    if (!form) return;

    const fileInput = document.getElementById("bilder");
    const uploadZone = document.getElementById("upload-zone");
    const uploadStatus = document.getElementById("upload-status");
    const preview = document.getElementById("image-preview");
    const errorBilder = document.getElementById("error-bilder");

    // ✅ NEU: 10 Bilder, aber Gesamt max 5120 KB
    const MAX_FILES = 10;
    const MAX_TOTAL_KB = 5120; // 5MB total (alle zusammen)
    // Optional: wenn du zusätzlich pro Bild limitieren willst, setz das hier:
    // const MAX_FILE_KB = 5120;

    const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
    let selectedFiles = [];

    const bytesToKB = (bytes) => bytes / 1024;
    const fmtKB = (kb) => Math.round(kb);

    const setFileError = (msg) => {
        if (!errorBilder) return;
        errorBilder.textContent = msg || "";
        if (fileInput) {
            if (msg) fileInput.classList.add("error");
            else fileInput.classList.remove("error");
        }
    };

    const totalKB = () => selectedFiles.reduce((sum, f) => sum + bytesToKB(f.size), 0);

    const syncInputFiles = () => {
        if (!fileInput) return;
        const dt = new DataTransfer();
        selectedFiles.forEach((f) => dt.items.add(f));
        fileInput.files = dt.files;
    };

    const updateStatus = () => {
        if (!uploadStatus) return;
        uploadStatus.textContent = `${fmtKB(totalKB())} / ${fmtKB(MAX_TOTAL_KB)} KB · ${selectedFiles.length}/${MAX_FILES} Bilder`;
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
            removeBtn.innerHTML = "&times;";
            removeBtn.addEventListener("click", () => {
                selectedFiles.splice(index, 1);
                syncInputFiles();
                renderPreview();
                updateStatus();
                setFileError("");
            });

            // ✅ Badge pro Bild: Dateigröße / Gesamtlimit
            const badge = document.createElement("div");
            badge.className = "preview-size-badge";
            badge.textContent = `${fmtKB(bytesToKB(file.size))} / ${fmtKB(MAX_TOTAL_KB)} KB`;

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

        // Typen prüfen
        for (const f of incoming) {
            if (!ALLOWED_TYPES.has(f.type)) {
                setFileError("Nur JPG, PNG oder WebP sind erlaubt.");
                return;
            }
            // Optionales per-Bild Limit:
            // if (bytesToKB(f.size) > MAX_FILE_KB) {
            //   setFileError(`Ein Bild ist zu groß. Maximal ${fmtKB(MAX_FILE_KB)} KB pro Bild.`);
            //   return;
            // }
        }

        // Duplikate vermeiden
        const key = (f) => `${f.name}_${f.size}_${f.type}`;
        const existing = new Set(selectedFiles.map(key));
        const filtered = incoming.filter((f) => !existing.has(key(f)));

        // ✅ Gesamtlimit prüfen
        const incomingKB = filtered.reduce((sum, f) => sum + bytesToKB(f.size), 0);
        const newTotal = totalKB() + incomingKB;

        if (newTotal > MAX_TOTAL_KB) {
            setFileError(`Gesamtgröße zu groß. Maximal ${fmtKB(MAX_TOTAL_KB)} KB insgesamt erlaubt.`);
            return;
        }

        selectedFiles = selectedFiles.concat(filtered);

        syncInputFiles();
        renderPreview();
        updateStatus();

        if (fileInput) fileInput.value = "";
    };

    // Klick-Auswahl
    if (fileInput) {
        fileInput.addEventListener("change", () => validateAndAddFiles(fileInput.files));
    }

    // Drag & Drop
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

        uploadZone.addEventListener("keydown", (e) => {
            if ((e.key === "Enter" || e.key === " ") && fileInput) {
                e.preventDefault();
                fileInput.click();
            }
        });
    }

    updateStatus();
});