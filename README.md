# 🏥 SymptoCare – Smart Symptom Analysis Web App

SymptoCare is a **frontend-based healthcare assistance web application** that analyzes user‑entered symptoms and provides **risk‑based guidance** using simple logic — without any paid APIs.

> ⚠️ This project is **NOT a medical diagnosis system**. It is only for awareness and guidance.

---

## 🚀 Features

- 🔍 **Symptom Analysis**
  - User can enter symptoms in plain text (English / Hinglish).
  - Example: `3 days fever and cough`

- ⏱️ **Duration Selection**
  - Buttons for **1 Day, 2 Days, 3 Days, 7+ Days**
  - If duration is already mentioned in text, buttons are ignored.

- 🚦 **Risk Level Detection**
  | Level | Color | Meaning |
  |------|-------|--------|
  | Low | 🟢 Green | Minor issue |
  | Medium | 🟡 Yellow | Needs attention |
  | High | 🔴 Red | Emergency |

- 🚨 **Emergency Detection**
  - Keywords like:
    - `unconscious`
    - `breathing problem`
    - `chest pain`
    - `seizure`
  - Triggers **instant emergency alert**

- 🗺️ **Nearby Hospital Finder**
  - Uses browser location
  - Shows nearby hospitals on Google Maps (free)

- 💻 **Fully Frontend**
  - No backend
  - No paid API
  - Hackathon‑safe

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Google Maps Embed**
- **Geolocation API**

---

## 📁 Project Structure
