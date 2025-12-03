/*  © 2025 Bilal Ishtiyaque. All rights reserved. Do not copy or distribute without permission. This code is licensed for personal use only. Contact: mail@bilalishtiyaque.com */

"use strict";

// SIDEBAR
const sideBar = document.querySelector(".sidebar");
const sidebarBtn = document.querySelector(".infoBtn");
//PORTFOLIO FILTER FUNCTIONALITY
const filterSelectBtn = document.querySelector(".filterSelectBtn");
const filterSelectOptions = document.querySelectorAll(".filterSelectOption button");
const filterSelectValue = document.querySelector(".selectValue");
//PORTFOLIO FILTER FUNCTIONALITY FOR DESKTOP
const filterBtns = document.querySelectorAll(".filterItem button");
//FORM
const form = document.querySelector(".form");
const formBtn = document.querySelector(".formBtn");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
//FORM ERROR VARIABLES
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
//PAGE NAVIGATION FUNCTIONALITY
const navigationLinks = document.querySelectorAll(".navbarLink");
const articlePages = document.querySelectorAll("[data-page]");
const mainSection = document.querySelector(".mainSection");

// SIDEBAR
sidebarBtn.addEventListener("click", () => {
  sideBar.classList.toggle("active");
});


//PORTFOLIO FILTER FUNCTIONALITY
filterSelectBtn.addEventListener("click", function () {
  this.classList.toggle("active");
});

filterSelectOptions.forEach((opt) => {
  opt.addEventListener("click", function () {
    let targetedCategory = this.textContent.toLowerCase();
    filterSelectValue.textContent = this.textContent;
    filterSelectBtn.classList.toggle("active");
    handleFiltering(targetedCategory);
  });
});


//PORTFOLIO FILTER FUNCTIONALITY FOR DESKTOP
filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterBtns.forEach((elem) => elem.classList.remove("active"));
    let targetedCategory = btn.textContent.toLowerCase(); //i could also use 'this.innerText...'
    btn.classList.add("active");
    handleFiltering(targetedCategory);
  });
});


function handleFiltering(targetedCategory) {
  const projectList = document.querySelector(".projectList");
  const projectItems = document.querySelectorAll(".projectItem");
  // Convert NodeList to array and filter matching ones
  const matchingItems = Array.from(projectItems).filter(item => targetedCategory === "all" || item.dataset.category === targetedCategory || item.dataset.recent === targetedCategory);
  // First hide all
  projectItems.forEach(item => item.classList.remove("active"));
  // Remove Existing Empty Message
  const existingEmptyMessage = document.querySelector(".emptyMessage");
  if (existingEmptyMessage) existingEmptyMessage.remove();
  // Then show only matching ones
  matchingItems.forEach(item => item.classList.add("active"));
  // Optional: Handle empty state if needed
  if (matchingItems.length === 0) {
    const existingEmptyMessage = document.querySelector(".emptyMessage");
    if (existingEmptyMessage) existingEmptyMessage.remove();
    const emptyMessage = document.createElement("div");
    emptyMessage.classList.add("emptyMessage");
    emptyMessage.innerHTML = `<p style="text-align:center; color:white;">no projects of <span style="display:inline-block; text-transform:capitalize;">"${targetedCategory}"</span> yet 🙁</p>`;
    projectList.appendChild(emptyMessage);
  }
}

//PAGE NAVIGATION FUNCTIONALITY
navigationLinks.forEach((navLink) => {
  navLink.addEventListener("click", function () {
    const targetPage = navLink.textContent.toLowerCase();
    navigationLinks.forEach((elem) => elem.classList.remove("active"));
    articlePages.forEach((page) => page.classList.remove("active"));

    navLink.classList.add("active");

    const targetArticle = document.querySelector(`[data-page="${targetPage}"]`);

    if (targetArticle) {
      const existingNotFound = document.querySelector(".notFoundMessage");
      if (existingNotFound) existingNotFound.remove();
      targetArticle.classList.add("active");
      window.scrollTo(0, 0);
    } else {
      // Remove previous not found if it exists
      const existingNotFound = document.querySelector(".notFoundMessage");
      if (existingNotFound) existingNotFound.remove();
      // Create a new not-found message
      const notFoundElem = document.createElement("article");
      notFoundElem.classList.add("notFoundMessage");
      notFoundElem.style.display = "block";
      notFoundElem.innerHTML = `<p style="text-align:center; color:white;"><span style="text-transform:capitalize; display:inline-block;">"${targetPage}"</span> page not found!</p>`;
      mainSection.appendChild(notFoundElem);
    }
  });
});

//FORM VALIDATION FUNCTIONS

function validateFullName(name) {
  const trimmed = name.trim();
  // Check for empty name
  if (!trimmed) return "Full name is required";
  // Separate checks for leading and trailing spaces
  if (name.startsWith(" ")) return "Name starts with a space";
  if (name.endsWith(" ")) return "Name ends with a space";
  // Check for minimum length
  if (trimmed.length < 3) return "At least 3 characters long";
  // Check for maximum length
  if (trimmed.length > 35) return "Too long — limit is 35 characters";
  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(trimmed)) return "Name has extra spaces between words";
  // Check for numbers
  if (/\d/.test(trimmed)) return "Name contains numbers";
  // Check for special characters (allow only letters, spaces, hyphens, apostrophes)
  if (/[^ \p{L}'-]/u.test(trimmed)) return "Name must not contain special characters";
  // Check for repeated characters (3 or more same character)
  if (/(.)\1{2,}/.test(trimmed)) return "Avoid repeating a character more than twice";
  // If all checks passed
  return ""; // Valid name
}

function validateEmail(email) {
  const trimmed = email.trim();
  // Check for empty input
  if (!trimmed) { return "Email is required"; }
  // Check for length
  if (trimmed.length > 70) { return "Email must not exceed 70 characters"; }
  // Check for forbidden characters (quotes)
  if (/['"]/.test(trimmed)) { return "Email looks valid, but quotes aren't ideal"; }
  // Check for consecutive dots
  if (/\.\./.test(trimmed)) { return "Email contains consecutive dots"; }
  // Must contain exactly one "@"
  const parts = trimmed.split("@");
  if (parts.length !== 2) { return "Email must contain exactly one '@' symbol"; }
  const [local, domain] = parts;
  // Check if local part starts or ends with special characters
  if (/^[.\-_+]|[.\-_+]$/.test(local)) return "Email can’t start or end with a special character";
  // Check allowed characters in local part
  if (!/^[a-zA-Z0-9._+-]+$/.test(local)) return "Only letters, numbers, and . _ + - allowed";
  // Disallow IP address in domain part
  if (/^\[.*\]$/.test(domain)) return "No IP addresses as domains";
  // Check domain format
  if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/.test(domain)) return "Email domain format is invalid";
  // Disposable email check (keyword-based before last dot)
  const disposableKeywords = ["tempmail", "10minutemail", "mailinator", "fakeinbox", "guerrillamail", "dispostable", "getnada", "throwawaymail", "trashmail", "tempail", "mintemail", "maildrop", "moakt", "mytempemail", "yopmail", "spambog", "mailcatch", "spamgourmet", "emailondeck", "burnermail", "instantemail", "inboxkitten", "mailnesia", "nowmymail", "anonaddy", "easytrashmail", "dropmail", "tempr.email", "fakemail", "spam4.me", "luxusmail", "shitmail", "deadaddress", "relay.email", "mailsac", "trashmailbox"];
  const domainBeforeLastDot = domain.substring(0, domain.lastIndexOf(".")).toLowerCase();
  if (disposableKeywords.some((keyword) => domainBeforeLastDot.includes(keyword))) {
    return "Disposable email addresses are not allowed";
  }
  return ""; // Valid email
}

function validateMessage(message) {
  // Trim the message for checks
  const trimmedMessage = message.trim();
  // Check for minimum word count (at least 5 words)
  const wordCount = trimmedMessage.split(/\s+/).length;
  if (wordCount < 5) { return "At least 5 words..."; }
  // Check for maximum character length (1000 characters max)
  if (trimmedMessage.length > 1000) { return "Message cannot exceed 1000 characters"; }
  // Check for forbidden URLs (spammy content)
  const spammyRegex = /\b(free|offer|discount|cheap|promo|sale|subscribe|limited time|win|winner|cash|money|credit card|loan|earn|guaranteed|viagra|porn|sex|sexy|fuck|fuck you|nude|xxx|adult|dating|escort|casino|gamble|mom|mother|sister|sis|sibling|investment|miracle|weight loss|ass|dick|mouth)\b/i;;
  if (spammyRegex.test(trimmedMessage)) return "Please remove promotional or inappropriate words";
  // Check for multiple consecutive spaces inside the message
  if (/\s{10,}/.test(trimmedMessage)) return "Message has too many spaces between words";
  // If all checks pass, return an empty string (valid message)
  return "";
}


function checkFormValidity() {
  const isValidFullName = validateFullName(fullNameInput.value) === "";
  const isValidEmail = validateEmail(emailInput.value) === "";
  const isValidMessage = validateMessage(messageInput.value) === "";

  const isFormValid = isValidFullName && isValidEmail && isValidMessage;

  formBtn.disabled = !isFormValid;

  return isFormValid;
}


function debounce(func, delay = 800) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

fullNameInput.addEventListener("input", debounce(() => {
  const result = validateFullName(fullNameInput.value);
  fullNameError.textContent = result;
  checkFormValidity();
})
);

emailInput.addEventListener("input", debounce(() => {
  const result = validateEmail(emailInput.value);
  emailError.textContent = result;
  checkFormValidity();
})
);

messageInput.addEventListener("input", debounce(() => {
  const result = validateMessage(messageInput.value);
  messageError.textContent = result;
  checkFormValidity();
})
);


// Submit handler
form.addEventListener("submit", function (event) {
  const isValid = checkFormValidity();

  if (!isValid) {
    event.preventDefault();  // Stop submission if invalid

    // Show submit error if needed
    const existingMessage = form.querySelector(".submitError");
    if (!existingMessage) {
      const errorMessage = document.createElement("p");
      errorMessage.innerText = "Hmm...Some fields are empty or invalid. Please fix the errors in the form.";
      errorMessage.classList.add("submitError");
      form.appendChild(errorMessage);

      setTimeout(() => {
        errorMessage.remove();
      }, 9000);
    }
    return;
  }
  // If valid, allow form to submit natively (no fetch needed)
  // Formspree will handle the POST submission as intended.
  formBtn.disabled = true;
});

// Github Calender JS

GitHubCalendar(".calendar", "Bilal-Ishtiyaque", {
  global_stats: false, // Optional: show or hide global stats
  responsive: true, // Optional: enable responsive styling
  tooltips: true, // Optional: enable tooltips on hover
});