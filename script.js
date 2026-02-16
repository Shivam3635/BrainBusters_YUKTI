// Get DOM elements
const analyzeBtn = document.getElementById("analyzeBtn");
const symptomsInput = document.getElementById("symptomsInput");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");
const disclaimer = document.getElementById("disclaimer");
const themeToggle = document.getElementById("themeToggle");
const langToggle = document.getElementById("langToggle");
const followUpBox = document.getElementById("followUpBox");
const chips = document.querySelectorAll(".chip");

let lastSymptoms = "";
let selectedDays = null;

// Try to extract duration (days) from user sentence
function extractDaysFromText(text) {
  const lower = text.toLowerCase();

  // Patterns like: 1 day, 2 days, 1 week, 2 weeks
  const dayMatch = lower.match(/(\d+)\s*(day|days)/);
  const weekMatch = lower.match(/(\d+)\s*(week|weeks)/);

  if (weekMatch) {
    return Number(weekMatch[1]) * 7; // convert weeks to days
  }

  if (dayMatch) {
    return Number(dayMatch[1]);
  }

  return null; // duration not found
}

// Emergency keyword scan
function hasEmergencyKeywords(text) {
  const t = text.toLowerCase();
  return (
    t.includes("unconscious") ||
    t.includes("not breathing") ||
    t.includes("breathing problem") ||
    t.includes("severe bleeding") ||
    t.includes("chest pain") ||
    t.includes("fainted") ||
    t.includes("no breath")
  );
}

// Core analysis logic
function analyzeSymptoms(symptoms, days = null) {
  const text = symptoms.toLowerCase();

  // Direct emergency detection
  if (hasEmergencyKeywords(text)) {
    return { level: "RED", msg: "Emergency symptoms detected (breathing/unconscious). Go to the hospital immediately." };
  }

  // If duration is more than 1 week -> Emergency RED
  if (days && days > 7) {
    return { level: "RED", msg: "Symptoms for more than a week can be serious. Seek immediate medical help." };
  }

  // Medium risk conditions
  if (text.includes("fever") || text.includes("vomiting") || text.includes("severe pain")) {
    if (!days) {
      return { level: "ASK_DAYS", msg: "Please select how long you have had these symptoms." };
    }
    if (days >= 3) {
      return { level: "YELLOW", msg: "Symptoms lasting more than 2 days. Visit a nearby clinic." };
    }
    return { level: "GREEN", msg: "Mild symptoms for short duration. Rest and stay hydrated." };
  }

  // Low risk
  if (text.includes("headache") || text.includes("cold") || text.includes("cough")) {
    return { level: "GREEN", msg: "Low risk symptoms. Take rest, fluids, and basic care." };
  }

  return { level: "GREEN", msg: "Symptoms are unclear. Monitor your condition or consult a doctor if it worsens." };
}

// Update UI result card + traffic light
function showResultCard(result) {
  resultBox.classList.remove("hidden", "green", "yellow", "red");
  resultText.innerText = result.msg;

  if (result.level === "GREEN") resultBox.classList.add("green");
  if (result.level === "YELLOW") resultBox.classList.add("yellow");
  if (result.level === "RED") resultBox.classList.add("red");

  // Show follow-up only if duration missing
  if (result.level === "ASK_DAYS") {
    followUpBox.classList.remove("hidden");
  } else {
    followUpBox.classList.add("hidden");
  }
}

// Analyze button
analyzeBtn.addEventListener("click", () => {
  const symptoms = symptomsInput.value.trim();
  if (!symptoms) {
    alert("Please enter some symptoms.");
    return;
  }

  lastSymptoms = symptoms;

  // Auto-detect duration from sentence
  const detectedDays = extractDaysFromText(symptoms);
  selectedDays = detectedDays;

  const result = analyzeSymptoms(symptoms, detectedDays);
  showResultCard(result);
  disclaimer.classList.remove("hidden");
});

// Auto-update on input change
symptomsInput.addEventListener("input", () => {
  const val = symptomsInput.value.trim();
  if (val.length > 3) {
    lastSymptoms = val;
    const detectedDays = extractDaysFromText(val);
    selectedDays = detectedDays;

    const result = analyzeSymptoms(val, detectedDays);
    showResultCard(result);
  } else {
    resultBox.classList.add("hidden");
    followUpBox.classList.add("hidden");
  }
});

// Follow-up chip clicks (only when duration missing)
chips.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedDays = Number(btn.dataset.days);
    const result = analyzeSymptoms(lastSymptoms, selectedDays);
    showResultCard(result);
  });
});

// Dark / Light mode toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.innerText = document.body.classList.contains("light") ? "🌙 Dark" : "☀️ Light";
});

// Language toggle (UI demo)
langToggle.addEventListener("click", () => {
  const h2 = document.querySelector("h2");
  if (langToggle.innerText === "🌐 EN") {
    langToggle.innerText = "🌐 HI";
    h2.innerText = "अपने लक्षण दर्ज करें";
  } else {
    langToggle.innerText = "🌐 EN";
    h2.innerText = "Enter Your Symptoms";
  }
});