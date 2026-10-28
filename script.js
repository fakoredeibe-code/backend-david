
// Configuration
const API_URL = "http://127.0.0.1:3000";

//=== Données par défaut (exemples)
const defaultItems = [
    // cv
    {
        id: 1,
        type: "cv",
        titre: "CV Graphiste & Développeur Web",
        description: "Version complète de mon CV digital",
        fichier: "", // un lien PDG plus tard
        Image: ""
    },
    {
        id: 2,
        type: "cv",
        titre: "CV Sciences Sociales",
        description: "CV orienté recherche et analyse sociale",
        fichier: "", // un lien PDG plus tard
        Image: ""
    },

    // Graphisme
    {
        id: 3,
        type: "graphisme",
        titre: "Logo Projet David",
        description: "Identité visuelle du portfolio",
        image: "https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=logo+David", 
        fichier: ""
    },
    {
        id: 4,
        type: "graphisme",
        titre: "Affiche événement culturel",
        description: "Identité visuelle du portfolio",
        image: "https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Affiche", 
        fichier: ""
    },
    {
        id: 5,
        type: "graphisme",
        titre: "Carte de visite",
        description: "Design professionnel doré",
        image: "https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Carte+visite", 
        fichier: ""
    },

    // Web
    {
        id: 6,
        type: "web",
        titre: "Site Vitrine Artisan",
        description: "Site responsive pour un artisan local",
        lien: "https://example.com",
        image: "https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Site+Web"
    },
    {
        id: 6,
        type: "web",
        titre: "Landing Page Evénement",
        description: "Page d'inscription avec formulaire",
        lien: "https://example.com",
        image: "https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Landing+Page"
    }
];



// Réalisations
async function getItems(){
    try {
        const res = await fetch(`${API_URL}/api/items`);
        return await res.json();
    }catch(err){
        console.error("Erreur chargement réalisations:", err);
        return [];
    }
}

// Afficher les cartes
async function renderCards(){
    const items = await getItems();

    const cvList = document.getElementById("cv-list");
    const graphismeList = document.getElementById("graphisme-list");
    const webList = document.getElementById("web-list");

    if (!cvList) return;
    cvList.innerHTML = "";
    graphismeList.innerHTML = "";
    webList.innerHTML = "";

    if (items.length === 0){
        cvList.innerHTML = "<p style='color:#888;text-align:center;'>Aucune réalisation pour le moment.</p>";
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        let imageHTML = "";
        if(item.image){
            imageHTML = `<img src="${item.image}" alt=" ${item.titre}">`;
        }else{
            // Icône selon le type
            let icon = "fa-file-alt";
            if(item.type === "graphisme") icon = "fa-palette";
            if(item.type  === "web") icon = "fa-code";
            imageHTML = `<div class="placeholder"><i class="fas ${icon}"></i></div>`;
        }

        let actionHTML = "";
        if(item.type === "cv" && item.fichier) {
            actionHTML = `<a href="${item.fichier || ""}" target="_blank" class="btn">Télécharger le CV</a>`;
        }else if (item.type === "web" && item.lien){
            actionHTML = `<a href="${item.lien || item.link}" target="_blank" class="btn">Voir le site</a>`;
        }else if (item.type === "graphisme" && item.image){
            actionHTML = `<a href="${item.image || ""}" target="_blank" class="btn">Voir en grand</a>`;
        }

        card.innerHTML = `
          <div class="card-img">${imageHTML}</div>
          <div class="card-body">
             <h3>${item.title || item.titre || "Sans titre"}</h3>
             <p>${item.description || ""}</p>
             ${actionHTML}
          </div>
        `;

        if (item.type === "cv") cvList.appendChild(card);
        if (item.type === "graphisme") graphismeList.appendChild(card);
        if (item.type === "web") webList.appendChild(card);
    });
}

// Menu Mobile
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("nav");
if (menuToggle){
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}
// Formulaire contact (simulation)
const contactForm = document.getElementById("contactForm");
if (contactForm){
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = contactForm.querySelectorAll("input, textarea");
        const nom = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const message = inputs[2].value.trim();

        if(!nom || !email || !message){
            alert("Merci de remplir tous les champs.");
            return;
        }

        try{
            const res = await fetch(`${API_URL}/api/messages`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nom, name: nom, email, message, content: message}),
            });

            const data = await res.json();

            if (data.success){
                alert("Merci pour votre message ! Je vous répondrai rapidement. \n\nEmail : fakoredeibe@gmail.com\nWhatsApp : +229 01 50 56 49 13");
                contactForm.reset();
            }else{
                alert("Erreur lors de l'envoi. Réessaie plus tard.");
            }
        }catch (err){
            console.error(err);
            alert("Impossible de contacter le serveur. Vérifie que le backend est lancé.");
        }
    });
}

// Lancement
document.addEventListener("DOMContentLoaded", () => {
    renderCards();
});