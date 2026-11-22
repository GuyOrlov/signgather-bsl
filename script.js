"use strict";

(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-navigation");
  var levelFilter = document.getElementById("level-filter");
  var formatFilter = document.getElementById("format-filter");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".course-card"));
  var courseCount = document.getElementById("course-count");
  var resetFilters = document.getElementById("reset-filters");
  var form = document.getElementById("enquiry-form");
  var output = document.getElementById("enquiry-output");
  var preview = document.getElementById("enquiry-preview");
  var copyButton = document.getElementById("copy-enquiry");
  var copyStatus = document.getElementById("copy-status");

  var year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  function updateCourses() {
    var level = levelFilter.value;
    var format = formatFilter.value;
    var count = 0;
    cards.forEach(function (card) {
      var matchLevel = level === "all" || card.dataset.level === level;
      var matchFormat = format === "all" || card.dataset.format === format;
      card.hidden = !(matchLevel && matchFormat);
      if (!card.hidden) count++;
    });
    courseCount.textContent = "Showing " + count + " planned course " + (count === 1 ? "option" : "options");
  }
  if (levelFilter && formatFilter) {
    levelFilter.addEventListener("change", updateCourses);
    formatFilter.addEventListener("change", updateCourses);
    resetFilters.addEventListener("click", function () {
      levelFilter.value = "all";
      formatFilter.value = "all";
      updateCourses();
    });
    updateCourses();
  }

  document.querySelectorAll(".course-select").forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("enquiry-level").value = button.dataset.course;
      document.getElementById("enquiry-mode").value = button.dataset.mode;
      output.hidden = true;
      copyStatus.textContent = "";
      document.getElementById("enquire").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      window.setTimeout(function () {
        document.getElementById("enquiry-name").focus({ preventScroll: true });
      }, 450);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var name = document.getElementById("enquiry-name").value.trim();
    var email = document.getElementById("enquiry-email").value.trim();
    var level = document.getElementById("enquiry-level").value;
    var mode = document.getElementById("enquiry-mode").value;
    var message = document.getElementById("enquiry-message").value.trim();
    preview.value = [
      "Subject: SignGather BSL course enquiry",
      "",
      "Hello SignGather BSL team,",
      "",
      "I'm interested in learning BSL and would like to hear about your courses.",
      "",
      "Name: " + name,
      "Email: " + email,
      "Interested level: " + level,
      "Preferred learning format: " + mode,
      "Questions: " + (message || "Please let me know about course dates, prices and enrolment."),
      "",
      "Thank you,",
      name
    ].join("\n");
    output.hidden = false;
    copyStatus.textContent = "Enquiry prepared. No information has been sent.";
    output.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  copyButton.addEventListener("click", function () {
    var text = preview.value;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyStatus.textContent = "Copied! Paste this into your email once SignGather publishes a contact address.";
      }).catch(function () {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  });

  function fallbackCopy() {
    preview.focus();
    preview.select();
    try {
      var succeeded = document.execCommand("copy");
      copyStatus.textContent = succeeded
        ? "Copied! Paste this into your email once SignGather publishes a contact address."
        : "Please select the message and copy it manually.";
    } catch (error) {
      copyStatus.textContent = "Please select the message and copy it manually.";
    }
  }
})();