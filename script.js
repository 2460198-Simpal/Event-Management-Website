const eventsData = [
  {
    id: 1,
    title: "AI & ML Tech Summit 2026",
    category: "Tech",
    date: "Dec 15, 2026",
    venue: "Campus Auditorium",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
    description: "Explore future trends in Artificial Intelligence and Machine Learning with industry leaders."
  },
  {
    id: 2,
    title: "Annual Cultural Fest - Rhythm",
    category: "Cultural",
    date: "Dec 20, 2026",
    venue: "Open Air Theater",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
    description: "Join us for music, dance performances, drama acts, and global food stalls."
  },
  {
    id: 3,
    title: "Inter-College 24h Hackathon",
    category: "Tech",
    date: "Dec 28, 2026",
    venue: "School of Computer Engineering",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
    description: "Build innovative web and mobile solutions in 24 hours to win grand cash prizes."
  },
  {
    id: 4,
    title: "Annual Sports Championship",
    category: "Sports",
    date: "Jan 10, 2027",
    venue: "KIIT Stadium Complex",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500",
    description: "Track events, football, basketball, and table tennis inter-departmental matches."
  },
  {
    id: 5,
    title: "UI/UX & Web Design Workshop",
    category: "Workshop",
    date: "Jan 18, 2027",
    venue: "Design Lab 2",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500",
    description: "Master user interface layout creation, prototyping, and modern CSS techniques."
  }
];

const eventsGrid = document.getElementById("events-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const themeToggle = document.getElementById("theme-toggle");
const modal = document.getElementById("registration-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const eventSelect = document.getElementById("event-select");
const eventForm = document.getElementById("event-form");
const regCountSpan = document.getElementById("registration-count");

document.addEventListener("DOMContentLoaded", () => {
  renderEvents(eventsData);
  populateEventDropdown();
  updateRegistrationCount();
  startCountdown();
  setupEventListeners();
});

function renderEvents(events) {
  eventsGrid.innerHTML = "";

  if (events.length === 0) {
    eventsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-muted);'>No matching events found.</p>";
    return;
  }

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <img src="${event.image}" alt="${event.title}" loading="lazy">
      <div class="event-info">
        <span class="event-category">${event.category}</span>
        <h3>${event.title}</h3>
        <p class="event-details"><i class="fa-regular fa-calendar"></i> ${event.date} | <i class="fa-solid fa-location-dot"></i> ${event.venue}</p>
        <p class="event-description">${event.description}</p>
        <button class="btn-primary register-btn" data-title="${event.title}">Register Now</button>
      </div>
    `;
    eventsGrid.appendChild(card);
  });
}

function populateEventDropdown() {
  eventSelect.innerHTML = "";
  eventsData.forEach(event => {
    const option = document.createElement("option");
    option.value = event.title;
    option.textContent = event.title;
    eventSelect.appendChild(option);
  });
}

function filterEvents() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  const filtered = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm) || event.venue.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderEvents(filtered);
}

function setupEventListeners() {
  searchInput.addEventListener("input", filterEvents);
  categoryFilter.addEventListener("change", filterEvents);

  eventsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("register-btn")) {
      const title = e.target.getAttribute("data-title");
      openModal(title);
    }
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    const icon = themeToggle.querySelector("i");
    const text = themeToggle.querySelector("span");

    if (isDark) {
      icon.className = "fa-solid fa-sun";
      text.textContent = "Light Mode";
    } else {
      icon.className = "fa-solid fa-moon";
      text.textContent = "Dark Mode";
    }
  });

  closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  eventForm.addEventListener("submit", handleFormSubmit);
}

function openModal(eventTitle = "") {
  if (eventTitle) {
    eventSelect.value = eventTitle;
  }
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  clearFormErrors();
}

function clearFormErrors() {
  document.getElementById("name-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("phone-error").textContent = "";
}

function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const selectedEvent = eventSelect.value;

  clearFormErrors();
  let isValid = true;

  if (name === "") {
    document.getElementById("name-error").textContent = "Full name is required.";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("email-error").textContent = "Enter a valid email address.";
    isValid = false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById("phone-error").textContent = "Enter a valid 10-digit phone number.";
    isValid = false;
  }

  if (isValid) {
    const registrationRecord = {
      name,
      email,
      phone,
      event: selectedEvent,
      timestamp: new Date().toISOString()
    };

    try {
      const saved = JSON.parse(localStorage.getItem("registrations") || "[]");
      saved.push(registrationRecord);
      localStorage.setItem("registrations", JSON.stringify(saved));
    } catch (err) {
      console.error("LocalStorage write error:", err);
    }

    const confMsg = document.getElementById("confirmation-msg");
    confMsg.classList.remove("hidden");
    eventForm.reset();
    updateRegistrationCount();

    setTimeout(() => {
      confMsg.classList.add("hidden");
      closeModal();
    }, 2200);
  }
}

function updateRegistrationCount() {
  try {
    const saved = JSON.parse(localStorage.getItem("registrations") || "[]");
    regCountSpan.textContent = saved.length;
  } catch (e) {
    regCountSpan.textContent = "0";
  }
}

function startCountdown() {
  const targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById("days").innerText = d.toString().padStart(2, "0");
      document.getElementById("hours").innerText = h.toString().padStart(2, "0");
      document.getElementById("minutes").innerText = m.toString().padStart(2, "0");
      document.getElementById("seconds").innerText = s.toString().padStart(2, "0");
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
