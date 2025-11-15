# HackRPI 2025 Project Plan: The "Epoch" Timeline

**Project Title:** The Epoch Timeline: A Time-Shifting RPI Archive
**Theme:** Retro vs. Modern
**Core Concept:** We are taking "retro" content (RPI's archived history) and displaying it using a "modern" web application. The app's *entire user interface* will "time-shift," changing its look, feel, and sound to match the era of history the user is currently viewing (e.g., 1980s terminal, 1990s desktop, 2020s dark mode).

---

## 🛠️ Tech Stack

* **Frontend (The "Modern"):** JavaScript (React, Svelte, or Vue) for the dynamic UI, HTML, CSS (or SCSS/Tailwind) for styling.
* **Backend (The "Bridge"):** Appwrite
    * **Appwrite Databases:** To store the structured timeline data (events, facts, image URLs).
    * **Appwrite Storage:** To host the scraped images for fast loading.
* **Scraping (The "Retro"):** Python (using `BeautifulSoup` or `Scrapy`) to pull data from RPI archive sites.

---

## feature-breakdown-mvp-and-stretch-goals">Feature Breakdown (MVP & Stretch Goals)

### 🚀 MVP (Minimum Viable Product)
*(The "Must-Haves" to demo a complete project)*

1.  **A Working Data Pipeline:**
    * A Python script that scrapes at least **two** distinct eras of RPI history (e.g., 10-15 events from the 1980s and 10-15 from the 2000s).
    * This data is cleaned and structured into a single JSON file.
    * A *second* script manually uploads this JSON data into a pre-made Appwrite Database Collection. (Note: A manual upload is fine for an MVP!).

2.  **A Functional Timeline UI:**
    * A single-page web app that fetches data from Appwrite.
    * A simple, scrollable (vertical or horizontal) timeline that displays all events in chronological order.
    * Each timeline "card" shows the year, title, info, and image.

3.  **The "Time-Shift" v1.0:**
    * The core gimmick. As the user scrolls, a JavaScript `IntersectionObserver` detects which "era" is on-screen.
    * The app adds a class to the `<body>` tag (e.g., `era-1980`, `era-2000`).
    * **Two** distinct CSS themes are triggered by these classes, changing:
        * `era-1980`: `background-color`, `font-family` (to a monospace font), `color` (to green).
        * `era-2000`: `background-color`, `font-family` (to a "bubbly" web 2.0 font), card styling (to be glossy/rounded).

---

### ✨ Stretch Goals
*(The "Should-Haves" if MVP is complete)*

1.  **More Eras & Better Data:**
    * Scrape and integrate **at least four** distinct eras (e.g., 1920s, 1960s, 1990s, 2020s).
    * Flesh out the "skin" for each era (e.g., 1920s = B&W, newspaper font; 1990s = Windows 95 gray, beveled buttons).

2.  **Appwrite Storage Integration:**
    * Modify the Python script to not only scrape image *URLs* but to *download* the images and re-upload them to **Appwrite Storage**.
    * Update the frontend to pull images from Appwrite Storage for faster, more reliable loading.

3.  **Audio-Visual Flair:**
    * Add era-specific sound effects.
    * When shifting to the 1980s, play a "terminal boot-up" sound.
    * When shifting to the 1990s, play a "modem dial-up" sound.
    * Add CSS filters: `filter: grayscale(1)` for the 1920s, or a subtle `filter: blur(0.5px)` on images in the 1980s to simulate CRT.

---

### 🌟 Moonshot Goals
*(The "Could-Haves" if you are code wizards)*

1.  **"Live" Data with Appwrite Realtime:**
    * Build a simple admin panel (or use the Appwrite console).
    * Use **Appwrite Realtime** so that if you add a *new* event to the database *during the demo*, it appears on the timeline *instantly* with a "flip" animation. This is a huge "wow" factor.

2.  **Fully Interactive UIs:**
    * Make the "chrome" of the website interactive.
    * In the **1990s era**, add a fake "Start" button that, when clicked, opens a "Credits" window styled like a Windows 95 `Notepad` app.
    * In the **1980s era**, add a blinking cursor and make the header text "type" out.

3.  **"C" or "C++" Integration:**
    * This is tough in a hackathon, but...
    * You could use WebAssembly (WASM) to compile a simple C/C++ function (e.g., a "retro" image dithering algorithm) and call it from your JavaScript to process the images *live* on the frontend as you scroll into the 1980s era. This is a *massive* flex of the "Retro vs. Modern" theme.

---

## 🗺️ Project Milestones (Hackathon Timeline)

### Phase 1: The Data & Backend (First 2-4 hours)
* **Goal:** Get the data pipeline working. You can't build a frontend without data.
* **Tasks:**
    1.  **Everyone:** Identify the RPI archive site(s) to scrape.
    2.  **(Python Dev):** Write the scraping script. Get that JSON file.
    3.  **(Appwrite Dev):** Set up the Appwrite project, Database Collection, and Storage.
    4.  **(Python Dev):** Write the "uploader" script to push the JSON to Appwrite.
* **Deliverable:** A populated Appwrite Database.

### Phase 2: The Core Frontend (Next 4-6 hours)
* **Goal:** Build the "MVP" frontend.
* **Tasks:**
    1.  **(JS Dev):** Set up the web project (e.g., `create-react-app`).
    2.  **(JS Dev):** Write the Appwrite SDK integration to fetch data.
    3.  **(HTML/CSS Dev):** Build the basic, *un-styled* scrolling timeline. Just get the data showing on the page.
    4.  **(JS Dev):** Implement the `IntersectionObserver` to add the `era-` classes to the body.
* **Deliverable:** A functional (but ugly) timeline that logs class changes to the console as you scroll.

### Phase 3: The "Magic" & Polish (Remaining Time)
* **Goal:** Make it look good and hit MVP.
* **Tasks:**
    1.  **(CSS Dev):** Go all-out on the **two** MVP era themes. This is the core "wow" factor.
    2.  **(Everyone):** Test, debug, and clean up.
    3.  **Start on Stretch Goals:**
        * Add more eras.
        * Add the sound effects.
        * Polish the transitions.
* **Deliverable:** The final, demo-ready project.
