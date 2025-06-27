"use strict";

// Config
const BASE_URL = "https://free-to-play-games-database.p.rapidapi.com/api";
const OPTIONS = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "f3ac487e7bmsha33f88d91a2999ep142ec3jsn40d23b04fb88",
    "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
  },
};
const TIME_OUT_DURATION = 5; // Seconds
const DEFAULT_SORT_BY = "relevance";
const DEFAULT_CATEGORY = "mmorpg";
const RESULTS_PER_PAGE = 12;
// ─────────────────────────────────────────────

// Pulling DOM ELements
const searchResults = document.getElementById("searchResults");
const modalBody = document.getElementById("modalBody");
// ─────────────────────────────────────────────

// Current State Variables
//  AJAX & API Calls
let currentCategory = DEFAULT_CATEGORY;
let currentSortBy = DEFAULT_SORT_BY;

//  Pagination & Search Results
let currentResults;
let resultsCount;
let currentPageIndex; // 0-Based
let pageCount;
let lastPageResultsCount;
// ─────────────────────────────────────────────

// Helper Function
//  Pagination Buttons
const handlePageClick = (btn) => {
  const isPrev = btn.classList.contains("prev");
  const isNext = btn.classList.contains("next");

  // Guard Clauses
  if (isPrev && currentPageIndex === 0) return;
  if (isNext && currentPageIndex === pageCount - 1) return;

  currentPageIndex += isNext ? 1 : -1;

  renderResults();
  renderPagination();
};
// ─────────────────────────────────────────────

// Rendering
const renderLoadingSpinner = (parentEl) => {
  parentEl.innerHTML = `
    <span class="loader "></span>
  `;
};

const renderErrorMessage = (parentEl) => {
  parentEl.innerHTML = `
    <div class="error">
      <div class="message-header gradientText">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8.25 17a5 5 0 0 1 1.44-1m6.06 1a5 5 0 0 0-1.44-1m4.19-2a10 10 0 0 0-3.5-2m-9.5 2A11 11 0 0 1 9 12.046M2 11c1.922-1.623 3.942-2.865 6-3.5M22 11c-1.922-1.623-3.942-2.865-6-3.5M12 20h.012m1.574-15.673c-.928-.436-2.244-.436-3.172 0c-.329.154-.459.518-.4.865L12 17l1.986-11.808c.059-.347-.071-.71-.4-.865"
            color="currentColor" />
        </svg>

        Something Went Wrong.
      </div>
      <p>Please Check your Internet Connection and Try Again!</p>
    </div>
  `;
};

const createResultsList = () => {
  const gamesWrapper = document.createElement("div");
  gamesWrapper.id = "gamesWrapper";
  gamesWrapper.classList.add(
    "wrapper",
    "row",
    "row-cols-1",
    "row-cols-sm-2",
    "row-cols-lg-3",
    "row-cols-xl-4"
  );

  return gamesWrapper;
};

const renderResults = () => {
  const gamesWrapper =
    document.getElementById("gamesWrapper") ?? createResultsList();

  const start = currentPageIndex * RESULTS_PER_PAGE;
  const end =
    start +
    (currentPageIndex === pageCount - 1
      ? lastPageResultsCount
      : RESULTS_PER_PAGE);

  gamesWrapper.innerHTML = "";
  for (let i = start; i < end; i++) {
    const curr = currentResults[i];
    gamesWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col">
          <div class="flip-card" tabindex="0" data-game-id="${curr.id}">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img
                  src="${curr.thumbnail}"
                  alt="${curr.title} Game Thumbnail"
                  width="365"
                  height="206" />

                <div class="card-footer">
                  <div class="left" title="${curr.platform}">
                  ${curr.platform}</div>
                  <div class="right">
                    <span>${curr.publisher
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}</span>
                    <span>${new Date(curr.release_date)
                      .toLocaleString("en-US", { month: "short" })
                      .toUpperCase()} ${curr.release_date.slice(0, 4)}</span>
                  </div>
                </div>
              </div>

              <div class="flip-card-back">
                <h2>${curr.title}</h2>
                <p>
                  ${curr.short_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    );
  }

  return gamesWrapper;
};

const createPaginationContainer = () => {
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");
  paginationContainer.id = "paginationContainer";
  return paginationContainer;
};

const renderPagination = () => {
  const paginationContainer =
    document.getElementById("paginationContainer") ??
    createPaginationContainer();

  const btn1 =
    currentPageIndex === 0
      ? ""
      : `
          <button class="prev" onClick="handlePageClick(this)">
            <svg
              aria-label="Go to Previous Page"
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20 12H4m0 0l6-6m-6 6l6 6"></path>
            </svg>

            Page ${currentPageIndex}
          </button>
        `;

  const btn2 =
    currentPageIndex === pageCount - 1
      ? ""
      : `
        <button class="next" onClick="handlePageClick(this)">
          Page ${currentPageIndex + 2}

          <svg
            aria-label="Go to Next Page"
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 12h16m0 0l-6-6m6 6l-6 6"></path>
          </svg>
        </button>
      `;

  paginationContainer.innerHTML = `
    ${btn1}
    <p>Page <span>${
      currentPageIndex + 1
    }</span> Of <span>${pageCount}</span></p>
    ${btn2}
  `;

  return paginationContainer;
};

const renderGameDetails = (data) => {
  modalBody.innerHTML = `
    <section class="modal-header">
      <h1>GAME DETAILS</h1>
      <button
        class="close-btn"
        onclick="modal.close()"
        aria-label="CLose Modal">
        <svg
          class="outline"
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m19.05 21.6l-2.925-2.9l-1.5 1.5q-.275.275-.7.275t-.7-.275q-.575-.575-.575-1.425t.575-1.425l4.225-4.225q.575-.575 1.425-.575t1.425.575q.275.275.275.7t-.275.7l-1.5 1.5l2.9 2.925q.3.3.3.7t-.3.7l-1.25 1.25q-.3.3-.7.3t-.7-.3M21.7 6.2L10.65 17.25l.125.1q.575.575.575 1.425t-.575 1.425q-.275.275-.7.275t-.7-.275l-1.5-1.5l-2.925 2.9q-.3.3-.7.3t-.7-.3L2.3 20.35q-.3-.3-.3-.7t.3-.7l2.9-2.925l-1.5-1.5q-.275-.275-.275-.7t.275-.7q.575-.575 1.425-.575t1.425.575l.1.125L17.425 2.475q.275-.275.638-.425t.762-.15H21q.425 0 .713.288T22 2.9v2.575q0 .2-.075.388T21.7 6.2M8.35 9.425l.6-.575l.575-.6l-.575.6zm-2.125.7l-3.65-3.65Q2.3 6.2 2.15 5.838T2 5.075V2.9q0-.425.288-.712T3 1.9h2.175q.4 0 .763.15t.637.425L10.25 6.15q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288L5.175 3.9H4v1.175l3.65 3.65q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3m3.025 5.7L20 5.075V3.9h-1.175L8.075 14.65zm0 0l-.6-.575l-.575-.6l.575.6z" />
        </svg>

        <svg
          class="solid"
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m19.05 21.6l-2.925-2.9l-1.5 1.5q-.275.275-.7.275t-.7-.275q-.575-.575-.575-1.425t.575-1.425l4.225-4.225q.575-.575 1.425-.575t1.425.575q.275.275.275.7t-.275.7l-1.5 1.5l2.9 2.925q.3.3.3.7t-.3.7l-1.25 1.25q-.3.3-.7.3t-.7-.3M21.7 6.2L10.65 17.25l.125.1q.575.575.575 1.425t-.575 1.425q-.275.275-.7.275t-.7-.275l-1.5-1.5l-2.925 2.9q-.3.3-.7.3t-.7-.3L2.3 20.35q-.3-.3-.3-.7t.3-.7l2.9-2.925l-1.5-1.5q-.275-.275-.275-.7t.275-.7q.575-.575 1.425-.575t1.425.575l.1.125L17.425 2.475q.275-.275.638-.425t.762-.15H21q.425 0 .713.288T22 2.9v2.575q0 .2-.075.388T21.7 6.2M6.225 10.125l-3.65-3.65Q2.3 6.2 2.15 5.838T2 5.075V2.9q0-.425.288-.712T3 1.9h2.175q.4 0 .763.15t.637.425l3.65 3.65q.3.3.3.713t-.3.712L7.65 10.125q-.3.3-.712.3t-.713-.3" />
        </svg>
      </button>
    </section>

    <section class="modal-content">
      <div class="game-info row gx-md-5 gy-3 gy-lg-0">
        <div class="game-thumbnail col col-12 col-lg-4">
          <img
            tabindex="0"
            src="${data.thumbnail}"
            alt="${data.title} Game Thumbnail" />
        </div>

        <div class="game-details col col-12 col-lg-8">
          <h2>${data.title}</h2>

          <div
            class="game-meta row row-cols-1 row-cols-sm-2 row-cols-xxl-4">
            <div class="col">
              <div class="meta-item" tabindex="0">
                <div class="meta-label">Status</div>
                <div class="meta-value">${data.status}</div>
              </div>
            </div>

            <div class="col">
              <div class="meta-item" tabindex="0">
                <div class="meta-label">Platform</div>
                <div class="meta-value">${data.platform}</div>
              </div>
            </div>

            <div class="col">
              <div class="meta-item" tabindex="0">
                <div class="meta-label">Publisher</div>
                <div class="meta-value">${data.publisher}</div>
              </div>
            </div>

            <div class="col">
              <div class="meta-item" tabindex="0">
                <div class="meta-label">Release Date</div>
                <div class="meta-value">
                  ${new Date(data.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div class="description-section">
            <h3>About This Game</h3>
            <div class="description-text">${data.description}</div>
          </div>

          <a
            class="game-link"
            href="${data.game_url}"
            target="_blank">
            Visit Game
          </a>
        </div>
      </div>
    </section>
  `;
};
// ─────────────────────────────────────────────

// Promisification & AJAX
const timeout = function (s) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(new Error(`Request Took Too Long!`));
    }, s * 1000)
  );
};

const fetchGameResults = async () => {
  try {
    // Show Spinner
    renderLoadingSpinner(searchResults);

    // Fetch Data
    const response = await Promise.race([
      timeout(TIME_OUT_DURATION),
      fetch(
        `${BASE_URL}/games?category=${currentCategory}&sort-by=${currentSortBy}`,
        OPTIONS
      ),
    ]);

    // Store & Update Current State Variables
    currentResults = await response.json();
    resultsCount = currentResults.length;
    currentPageIndex = 0;
    pageCount = Math.ceil(resultsCount / RESULTS_PER_PAGE);
    const remainder = resultsCount % RESULTS_PER_PAGE;
    lastPageResultsCount = remainder === 0 ? RESULTS_PER_PAGE : remainder;

    // Rendering
    const searchResultsEl = renderResults();
    const paginationEl = renderPagination();
    searchResults.innerHTML = "";
    searchResults.append(searchResultsEl);
    searchResults.append(paginationEl);

    // Start Observing Clicks
    observeFlipCards();
  } catch (error) {
    renderErrorMessage(searchResults);
  }
};

const fetchGameDetails = async (game_id) => {
  try {
    modal.open();
    renderLoadingSpinner(modalBody);

    const response = await Promise.race([
      timeout(TIME_OUT_DURATION),
      fetch(`${BASE_URL}/game?id=${game_id}`, OPTIONS),
    ]);

    const data = await response.json();
    renderGameDetails(data);
  } catch (error) {
    console.log(error.message);
    renderErrorMessage(modalBody);
  }
};
// ─────────────────────────────────────────────

// Event Listeners & Controllers
//  Load Results On Load
window.addEventListener("load", fetchGameResults);

//  Flip-Card Effect & Opening Game Details Modal
const observeFlipCards = () => {
  const gamesWrapper = document.getElementById("gamesWrapper");

  // Flipping Game Cards On Clicking
  gamesWrapper?.addEventListener("click", function (e) {
    const currCard = e.target.closest(".flip-card");

    gamesWrapper
      .querySelectorAll(".flip-card")
      .forEach((card) => currCard !== card && card.classList.remove("clicked"));

    currCard && currCard.classList.toggle("clicked");
  });

  // Opening Game Details On Double Clicking
  gamesWrapper?.addEventListener("dblclick", function (e) {
    const currCard = e.target.closest(".flip-card");
    if (!currCard) return;

    const game_id = currCard.dataset.gameId;
    fetchGameDetails(game_id);
  });
};
// ─────────────────────────────────────────────

// Classes & Self Contained Functionalities
//  Categories
class CategorySelector {
  constructor(
    onSelect = () => {},
    listId = "categoriesList",
    itemSelector = "a"
  ) {
    this.container = document.getElementById(listId);
    this.itemSelector = itemSelector;
    this.onSelect = onSelect;

    if (!this.container) {
      console.warn("CategorySelector: container not found");
      return;
    }

    this.#initEvents();
  }

  #initEvents() {
    this.container.addEventListener("click", (e) => {
      const clicked = e.target.closest(this.itemSelector);
      e.preventDefault();

      if (!clicked) return;

      const category = clicked.dataset.category;
      if (currentCategory === category) return;

      // Update Active Class
      this.container.querySelectorAll(this.itemSelector).forEach((el) => {
        el.classList.remove("active");
      });
      clicked.classList.add("active");

      // Update External State
      currentCategory = category;
      this.onSelect(category);
    });
  }
}

//  Dropdown (Sort By)
class Dropdown {
  constructor(
    onSelect = () => {},
    triggerId = "sortTrigger",
    menuId = "sortMenu",
    optionSelector = ".dropdown-option"
  ) {
    this.trigger = document.getElementById(triggerId);
    this.menu = document.getElementById(menuId);
    this.options = this.menu?.querySelectorAll(optionSelector) || [];
    this.onSelect = onSelect;

    if (!this.trigger || !this.menu || this.options.length === 0) {
      console.warn("Dropdown: Required Elements NOT Found");
      return;
    }

    this.#initEvents();
  }

  #toggle() {
    const isOpen = this.menu.classList.contains("show");

    this.menu.classList.toggle("show");
    this.trigger.classList.toggle("active");
    this.trigger.setAttribute("aria-expanded", String(!isOpen));
  }

  #close() {
    this.menu.classList.remove("show");
    this.trigger.classList.remove("active");
    this.trigger.setAttribute("aria-expanded", "false");
  }

  #handleSelection(option) {
    if (option.classList.contains("selected")) return;

    this.options.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    this.#close();

    const value = option.dataset.value;
    this.onSelect(value);
  }

  #initEvents() {
    this.trigger.addEventListener("click", () => this.#toggle());

    this.options.forEach((option) =>
      option.addEventListener("click", () => this.#handleSelection(option))
    );

    document.addEventListener("click", (e) => {
      if (!this.trigger.contains(e.target) && !this.menu.contains(e.target)) {
        this.#close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.menu.classList.contains("show")) {
        this.#close();
        this.trigger.focus();
      }
    });
  }
}

//  Modal
class Modal {
  constructor(overlayId = "overlay", modalId = "modal") {
    this.overlay = document.getElementById(overlayId);
    this.modal = document.getElementById(modalId);

    if (!this.overlay || !this.modal) {
      console.warn("Modal or Overlay NOT Found");
      return;
    }

    this.#initEvents();
  }

  open() {
    document.body.style.overflow = "hidden";
    this.overlay.classList.add("fade-in");

    setTimeout(() => {
      this.modal.classList.remove("fade-out");
    }, 300);
  }

  close() {
    document.body.style.overflow = "";
    this.modal.classList.add("fade-out");

    setTimeout(() => {
      this.overlay.classList.remove("fade-in");
    }, 600);
  }

  #initEvents() {
    // Clicking Outside Modal
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Escape Key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.overlay.classList.contains("fade-in")) {
        this.close();
      }
    });
  }
}

//  INIT
new CategorySelector(() => {
  fetchGameResults();
});
new Dropdown((selected) => {
  if (currentSortBy === selected) return;
  currentSortBy = selected;
  fetchGameResults();
});
const modal = new Modal();
// ─────────────────────────────────────────────
