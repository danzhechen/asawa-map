// Initialize the map centered on San Francisco
const map = L.map('map').setView([37.7749, -122.4194], 13);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add zoom controls
document.getElementById('zoom-in').addEventListener('click', () => {
    map.zoomIn();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    map.zoomOut();
});

// Art locations data
const artLocations = [
    {
        name: "Andrea, Ghirardelli Square",
        location: [37.8058, -122.4226],
        year: "1966-1968",
        description: "A monumental fountain sculpture that transformed Ghirardelli Square's courtyard. Asawa's first major public commission, it features a series of interconnected bronze forms that create a mesmerizing water display.",
        image: "./images/andrea-ghirardelli.jpg",
        source: "https://ruthasawa.com/andrea-ghirardelli-square-1966-1968/"
    },
    {
        name: "San Francisco Fountain, Union Square",
        location: [37.7879, -122.4074],
        year: "1970-1973",
        description: "A beloved fountain that has become an iconic part of Union Square. The sculpture features a series of interconnected bronze forms that create a dynamic water display.",
        image: "./images/union-square-fountain.jpg",
        source: "https://ruthasawa.com/san-francisco-fountain-union-square-1970-1973/"
    },
    {
        name: "Aurora, The Embarcadero",
        location: [37.7955, -122.3937],
        year: "1984-1986",
        description: "A stunning wire sculpture that seems to float above the Embarcadero. The work's delicate, transparent quality creates an ever-changing play of light and shadow.",
        image: "./images/aurora-embarcadero.jpg",
        source: "https://ruthasawa.com/aurora-the-embarcadero-1984-1986/"
    },
    {
        name: "Garden of Remembrance, SF State",
        location: [37.7219, -122.4782],
        year: "2000-2002",
        description: "A contemplative space that honors the Japanese American experience during World War II. The garden features a series of bronze panels with relief sculptures.",
        image: "./images/garden-remembrance.jpg",
        source: "https://ruthasawa.com/garden-of-remembrance-sf-state-2000-2002/"
    },
    {
        name: "Growth, Bethany Center",
        location: [37.7219, -122.4782],
        year: "1968-1969",
        description: "A series of wire sculptures that seem to grow organically from the building's architecture. The work demonstrates Asawa's ability to create pieces that interact harmoniously with their surroundings.",
        image: "./images/growth-bethany.jpg",
        source: "https://ruthasawa.com/growth-bethany-center-1968-1969/"
    },
    {
        name: "Origami Fountains, Japantown",
        location: [37.7852, -122.4297],
        year: "1975-1976, 1999",
        description: "A series of fountains inspired by traditional Japanese origami. The sculptures combine Asawa's interest in Japanese culture with her innovative approach to public art.",
        image: "./images/origami-fountains.jpg",
        source: "https://ruthasawa.com/origami-fountains-japantown-1975-1976-1999/"
    },
    {
        name: "Tied-Wire Sculpture, Oakland Museum of CA",
        location: [37.8000, -122.2658],
        year: "1974",
        description: "A significant example of Asawa's tied-wire technique, where she created complex forms by tying wire together. This work showcases her innovative approach to sculpture.",
        image: "./images/tied-wire-oakland.jpg",
        source: "https://ruthasawa.com/tied-wire-sculpture-oakland-museum-of-ca-1974/"
    },
    {
        name: "Japanese American Internment Memorial, San Jose",
        location: [37.3337, -121.8907],
        year: "1990-1994",
        description: "A powerful memorial that tells the story of Japanese American internment during World War II. The work combines bronze relief panels with a contemplative garden space.",
        image: "./images/internment-memorial.jpg",
        source: "https://ruthasawa.com/japanese-american-internment-memorial-san-jose-1990-1994/"
    },
    {
        name: "History of Wine, Beringer, St. Helena",
        location: [38.5025, -122.4608],
        year: "1987-1988",
        description: "A series of bronze panels that tell the story of winemaking in Napa Valley. The work combines Asawa's interest in local history with her innovative approach to public art.",
        image: "./images/history-wine.jpg",
        source: "https://ruthasawa.com/history-of-wine-beringer-st-helena-1987-1988/"
    },
    {
        name: "San Francisco Yesterday and Today, Parc 55 Hotel",
        location: [37.7847, -122.4092],
        year: "1983-1984",
        description: "A series of bronze panels that depict the history and evolution of San Francisco. The work showcases Asawa's ability to tell complex stories through her art.",
        image: "./images/sf-yesterday-today.jpg",
        source: "https://ruthasawa.com/san-francisco-yesterday-and-today-parc-55-hotel-1983-1984/"
    },
    {
        name: "The Faces of Ruth Asawa, Cantor Arts Center",
        location: [37.4331, -122.1697],
        year: "1966-2000",
        description: "A collection of portraits that showcase Asawa's skill in capturing the human form. The works demonstrate her ability to create intimate, personal pieces.",
        image: "./images/faces-cantor.jpg",
        source: "https://ruthasawa.com/the-faces-of-ruth-asawa-cantor-arts-center-1966-2000/"
    }
];

// Create a marker cluster group
const markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        return L.divIcon({
            html: `<div style="background-color: rgba(231, 76, 60, 0.8); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${cluster.getChildCount()}</div>`,
            className: 'custom-cluster',
            iconSize: L.point(40, 40)
        });
    }
});

// Create custom icon for individual markers
const customIcon = L.divIcon({
    html: `<div style="background-color: #2c3e50; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
        <div style="position: absolute; width: 8px; height: 8px; background-color: #e74c3c; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
    </div>`,
    className: 'custom-marker',
    iconSize: L.point(24, 24),
    iconAnchor: [12, 12]
});

// Add markers to the cluster group
artLocations.forEach(art => {
    const marker = L.marker(art.location, { icon: customIcon });
    
    // Create popup content with error handling for images
    const popupContent = `
        <div class="info">
            <h4><a href="${art.source}" target="_blank">${art.name}</a></h4>
            <img src="${art.image}" alt="${art.name}" onerror="this.src='./images/placeholder.jpg'">
            <p><strong class="year">Year:</strong> ${art.year}</p>
            <p>${art.description}</p>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    markers.addLayer(marker);
});

// Add the cluster group to the map
map.addLayer(markers);

// Fit the map bounds to show all markers
map.fitBounds(markers.getBounds());

// Add Google Maps button functionality
document.getElementById('open-google-maps').addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/2ffNpqwoNZHwQ4dq9', '_blank');
});

// Add share button functionality
document.getElementById('share-button').addEventListener('click', async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: "Ruth Asawa's Art Journey",
                text: "Explore Ruth Asawa's public art in San Francisco",
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('Link copied to clipboard!');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
}); 