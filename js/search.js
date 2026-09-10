(() => {
  "use strict";

  const input = document.querySelector("[data-search], #searchInput, .search-input");
  if (!input) return;

  const items = [...document.querySelectorAll("[data-search-item]")];
  const results = document.querySelector("[data-search-results], #searchResults, .search-results");

  function filter() {
    const q = input.value.trim().toLowerCase();
    if (results) results.hidden = !q;
    items.forEach(item => {
      const text = `${item.textContent} ${item.dataset.searchItem || ""}`.toLowerCase();
      item.hidden = Boolean(q && !text.includes(q));
    });
  }

  input.addEventListener("input", filter);
  input.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      input.value = "";
      filter();
      input.blur();
    }
  });
})();
