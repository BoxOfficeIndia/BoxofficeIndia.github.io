"use strict";

const MOBILE_NAV_QUERY = window.matchMedia("(max-width: 700px)");

const NAV_LINKS = [
    ["/", "Home"],
    ["/livesales/", "Live Advance Sales"],
    ["/livetracking/", "Live Collection Tracking"],
    ["/collections/", "Collection Reports"],
    ["/collections/#boxoffice-records", "Box Office Records"],
    ["/advancesales/", "Advance Sales Reports"],
    ["/OSadvancesales/", "Overseas Advance Sales"],
    ["/blogs-articles/", "News"],
    ["/gallery/", "Gallery"],
    ["/site%20data/about.html", "About Us"],
];

function addStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.referrerPolicy = "no-referrer";
    document.head.appendChild(link);
}

function addWatermark() {
    if (!document.body || document.getElementById("watermark")) return;
    const watermark = document.createElement("p");
    watermark.id = "watermark";
    watermark.setAttribute("aria-hidden", "true");
    watermark.textContent = Array(120).fill("TrackBO").join(" ");
    document.body.appendChild(watermark);
}

function navigationMarkup(isMobile) {
    const links = NAV_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
    return isMobile
        ? `<button type="button" class="closebtn" aria-label="Close navigation" onclick="closeNav()">&times;</button>${links}`
        : links;
}

function setupNavigation() {
    const nav = document.getElementById("topnav");
    const trigger = document.getElementById("navpoint");
    if (!nav || !trigger) return;

    const isMobile = MOBILE_NAV_QUERY.matches;
    nav.innerHTML = navigationMarkup(isMobile);
    nav.style.width = isMobile ? "0" : "100%";

    trigger.innerHTML = isMobile ? "&#9776;" : "";
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", isMobile ? "0" : "-1");
    trigger.setAttribute("aria-label", "Open navigation");
    trigger.setAttribute("aria-expanded", "false");
    trigger.hidden = !isMobile;
    trigger.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openNav();
        }
    };
}

function openNav() {
    const nav = document.getElementById("topnav");
    const trigger = document.getElementById("navpoint");
    if (!nav || !MOBILE_NAV_QUERY.matches) return;
    nav.style.width = "250px";
    if (trigger) trigger.setAttribute("aria-expanded", "true");
}

function closeNav() {
    const nav = document.getElementById("topnav");
    const trigger = document.getElementById("navpoint");
    if (!nav || !MOBILE_NAV_QUERY.matches) return;
    nav.style.width = "0";
    if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
    }
}

function addShareButtons(anchorElement) {
    if (!anchorElement || document.getElementById("share_container")) return;

    const shareContainer = document.createElement("div");
    shareContainer.id = "share_container";
    shareContainer.classList.add("share-container");

    const twitterButton = document.querySelector(".twitter-share-button");
    if (twitterButton) shareContainer.appendChild(twitterButton);

    const whatsappButton = document.createElement("a");
    whatsappButton.href = `https://wa.me/?text=${encodeURIComponent(window.location.href)}`;
    whatsappButton.target = "_blank";
    whatsappButton.rel = "noopener noreferrer";
    whatsappButton.classList.add("share-button", "whatsapp-button");
    whatsappButton.setAttribute("aria-label", "Share on WhatsApp");
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i>';
    shareContainer.appendChild(whatsappButton);

    if (navigator.share) {
        const nativeShareButton = document.createElement("button");
        nativeShareButton.type = "button";
        nativeShareButton.classList.add("share-button", "native-share-button");
        nativeShareButton.setAttribute("aria-label", "Share this page");
        nativeShareButton.innerHTML = '<i class="fas fa-share-alt" aria-hidden="true"></i>';
        nativeShareButton.addEventListener("click", async () => {
            try {
                await navigator.share({ title: document.title, url: window.location.href });
            } catch (error) {
                if (error.name !== "AbortError") console.warn("Unable to share page", error);
            }
        });
        shareContainer.appendChild(nativeShareButton);
    }

    anchorElement.insertAdjacentElement("afterend", shareContainer);
}

function displayPageActions() {
    const pageTitle = document.getElementById("p_heading");
    if (!pageTitle) return;
    addShareButtons(pageTitle);
}

let slideIndex = 0;

function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    if (!slides.length) return;

    for (const slide of slides) slide.style.display = "none";
    slideIndex = (slideIndex % slides.length) + 1;
    for (const dot of dots) dot.className = dot.className.replace(" active", "");
    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
    window.setTimeout(showSlides, 5000);
}

function slides_disp() {
    const body = document.getElementById("homepage_body");
    if (!body) return;

    const container = document.createElement("div");
    container.className = "slideshow-container";
    body.appendChild(container);
    const dots = document.createElement("div");
    dots.className = "slideshow-dots";
    body.appendChild(dots);

    for (const imageUrl of ["/images/slideshow-images/avatar-2.jpeg"]) {
        const slide = document.createElement("div");
        slide.className = "mySlides fade";
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = "Featured movie";
        image.loading = "lazy";
        slide.appendChild(image);
        container.appendChild(slide);

        const dot = document.createElement("span");
        dot.className = "dot";
        dots.appendChild(dot);
    }
    showSlides();
}

function img_disp() {
    const body = document.getElementById("homepage_body");
    if (!body) return;
    const image = document.createElement("img");
    image.src = "/images/slideshow-images/photo-output.JPG";
    image.alt = "Featured movie";
    image.loading = "lazy";
    image.style.maxWidth = "100%";
    body.appendChild(image);
}

function initializeSite() {
    addStylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
    addWatermark();
    setupNavigation();
    displayPageActions();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
} else {
    initializeSite();
}

if (typeof MOBILE_NAV_QUERY.addEventListener === "function") {
    MOBILE_NAV_QUERY.addEventListener("change", setupNavigation);
} else {
    MOBILE_NAV_QUERY.addListener(setupNavigation);
}
