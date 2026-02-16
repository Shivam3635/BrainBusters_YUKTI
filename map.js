// Initialize map with a default location (Delhi fallback)
const map = L.map("map").setView([28.6139, 77.209], 12);

// Load OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Marker group for hospitals
const hospitalLayer = L.layerGroup().addTo(map);

// Fetch nearest hospitals using Overpass API
async function fetchNearbyHospitals(lat, lng) {
  hospitalLayer.clearLayers();

  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:3000, ${lat}, ${lng});
      node["amenity"="clinic"](around:3000, ${lat}, ${lng});
    );
    out body;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const res = await fetch(url, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" }
    });

    const data = await res.json();

    if (!data.elements || data.elements.length === 0) {
      alert("No nearby hospitals found. Try zooming out.");
      return;
    }

    data.elements.forEach((el) => {
      const name = el.tags?.name || "Unnamed Hospital/Clinic";
      const marker = L.marker([el.lat, el.lon]).addTo(hospitalLayer);
      marker.bindPopup(`<b>${name}</b><br/>Nearby medical facility`);
    });
  } catch (err) {
    console.error("Failed to load hospitals:", err);
    alert("Could not load nearby hospitals. Please try again.");
  }
}

// Try to get user's current location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      map.setView([lat, lng], 14);
      L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();

      // Load nearby hospitals with names
      fetchNearbyHospitals(lat, lng);
    },
    () => {
      // Fallback: Delhi
      fetchNearbyHospitals(28.6139, 77.209);
    }
  );
} else {
  // Fallback if geolocation not supported
  fetchNearbyHospitals(28.6139, 77.209);
}