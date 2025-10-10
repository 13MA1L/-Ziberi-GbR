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
