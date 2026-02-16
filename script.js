let selectedDays = null;

// Emergency call
function callEmergency(){
  window.location.href = "tel:112";
}

// Duration select
function setDuration(days){
  selectedDays = days;
  document.querySelectorAll(".duration-box button")
    .forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// Risk detection
function detectRiskLevel(text){
  text = text.toLowerCase();

  const emergencyWords = [
    "unconscious","behosh","breathing","saans",
    "chest pain","seene","blood","fit","seizure"
  ];

  const mediumWords = [
    "fever","bukhar","cough","khansi",
    "pain","dard","vomit","headache"
  ];

  // Duration priority
  if(selectedDays !== null){
    if(selectedDays > 7) return "high";
    if(selectedDays >= 3) return "medium";
  }

  // Duration from text
  const match = text.match(/(\d+)\s*(day|days|din)/);
  if(match){
    const days = parseInt(match[1]);
    if(days > 7) return "high";
    if(days >= 3) return "medium";
  }

  if(emergencyWords.some(w => text.includes(w))) return "high";
  if(mediumWords.some(w => text.includes(w))) return "medium";

  return "low";
}

// Main analysis
function analyzeSymptoms(){
  const input = document.getElementById("symptomInput").value;
  const resultBox = document.getElementById("resultBox");

  if(!input){
    alert("Please enter symptoms");
    return;
  }

  let condition = "Symptoms unclear. Please consult a doctor.";
  if(input.includes("fever") || input.includes("bukhar")){
    condition = "Possible Condition: Viral Fever or Flu";
  } else if(input.includes("cough") || input.includes("khansi")){
    condition = "Possible Condition: Cold or Respiratory Infection";
  } else if(input.includes("headache") || input.includes("sir")){
    condition = "Possible Condition: Headache or Migraine";
  }

  const risk = detectRiskLevel(input);

  let color = "#2ecc71";
  let label = "Low Risk";

  if(risk === "medium"){
    color = "#f1c40f";
    label = "Medium Risk";
  }

  if(risk === "high"){
    color = "#e74c3c";
    label = "Emergency";
    alert("🚨 Emergency detected! Seek medical help immediately.");
  }

  resultBox.innerHTML = `
    <h3>Analysis Result</h3>
    <p>${condition}</p>
    <div style="
      margin-top:15px;
      padding:12px;
      border-radius:12px;
      background:${color};
      color:white;
      font-weight:600;
      text-align:center;">
      Risk Level: ${label}
    </div>
  `;

  resultBox.style.display = "block";
}

// Nearby hospitals
function findClinics(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      document.getElementById("mapFrame").src =
        `https://www.google.com/maps?q=hospital+near+${lat},${lon}&output=embed`;
    });
  }
}