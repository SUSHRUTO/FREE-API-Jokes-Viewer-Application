const API_URL =
  "https://api.freeapi.app/api/v1/public/randomjokes";

const container =
  document.getElementById("jokes-container");

const loadingText =
  document.getElementById("loading");

const searchInput =
  document.getElementById("search-input");

const featuredJoke =
  document.getElementById("featured-joke");

let allJokes = [];
let currentCategory = "all";

// LOAD JOKES
async function loadJokes() {

  try {

    container.innerHTML = "";

    loadingText.classList.remove("hidden");

    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch jokes");
    }

    const result = await res.json();

    loadingText.classList.add("hidden");

    let jokes =
      result?.data?.data ||
      result?.data ||
      [];

    if (!Array.isArray(jokes)) {
      jokes = [jokes];
    }

    jokes = createJokeCollection();

    allJokes = jokes.map((joke, index) => ({
      ...joke,
      category: detectCategory(
        joke.content || "",
        index
      )
    }));

    displayJokes(allJokes);

    generateFeaturedJoke();

  } catch (error) {

    console.error(error);

    loadingText.innerText =
      "Failed to load jokes";

    showFallbackJokes();
  }
}

// CREATE JOKE COLLECTION
function createJokeCollection() {

  return [

    // FUNNY
    {
      content:
        "Why don’t skeletons fight each other? They don’t have the guts 😂"
    },

    {
      content:
        "Parallel lines have so much in common. It’s a shame they’ll never meet 😂"
    },

    {
      content:
        "Why did the scarecrow win an award? Because he was outstanding in his field 😂"
    },

    {
      content:
        "I invented a new word: Plagiarism 😂"
    },

    // SCHOOL
    {
      content:
        "Why did the student eat his homework? Because the teacher said it was a piece of cake 😂"
    },

    {
      content:
        "Teacher: Why are you late? Student: Because of the sign. School Ahead, Go Slow 😂"
    },

    {
      content:
        "Why was the math book sad? Because it had too many problems 😂"
    },

    {
      content:
        "Why did the teacher wear sunglasses? Because her students were so bright 😂"
    },

    // CODING
    {
      content:
        "Why do programmers prefer dark mode? Because light attracts bugs 😂"
    },

    {
      content:
        "Why did the developer go broke? Because he used up all his cache 😂"
    },

    {
      content:
        "A SQL query walks into a bar and asks: Can I join you? 😂"
    },

    {
      content:
        "Debugging: Being the detective in a crime movie where you are also the murderer 😂"
    },

    // ANIMALS
    {
      content:
        "Why don’t cats play poker in the jungle? Too many cheetahs 😂"
    },

    {
      content:
        "What do you call a fish wearing a bowtie? Sofishticated 😂"
    },

    {
      content:
        "Why did the cow become an astronaut? To visit the moooon 😂"
    },

    {
      content:
        "Why are frogs always so happy? Because they eat whatever bugs them 😂"
    }

  ];
}

// RANDOM FEATURED JOKE
function generateFeaturedJoke() {

  if (allJokes.length === 0) return;

  const random =
    allJokes[
      Math.floor(
        Math.random() * allJokes.length
      )
    ];

  featuredJoke.innerText =
    random.content;
}

// CUSTOM PROFESSIONAL JOKE GENERATOR
function generateCustomJoke() {

  const input =
    document
      .getElementById("custom-input")
      .value
      .trim();

  const output =
    document.getElementById(
      "custom-joke-output"
    );

  if (input === "") {

    output.innerText =
      "Please enter some words.";

    return;
  }

  const words =
    input.split(" ");

  const templates = [

    `Why did ${words[0]} become a developer? Because it loved solving problems 😂`,

    `${words.join(" ")} and coding make the perfect debugging team 🚀`,

    `Why do programmers love ${words[0]}? Because it helps remove bugs 😂`,

    `${words[0]} entered the server room... now production is down 😭`,

    `A developer used ${words.join(" ")} and accidentally deployed on Friday 😂`,

    `Why was ${words[0]} always calm? Because it handled exceptions properly 😎`,

    `${words.join(" ")} is basically the secret ingredient of every coding interview 🚀`,

    `Why did the software engineer trust ${words[0]}? Because it passed all the test cases 😂`,

    `${words[0]} + coding = unlimited debugging sessions 😭`,

    `The developer added ${words.join(" ")} to the project... now even the compiler is confused 😂`

  ];

  const randomJoke =
    templates[
      Math.floor(
        Math.random() * templates.length
      )
    ];

  output.innerText =
    randomJoke;
}

// DISPLAY JOKES
function displayJokes(jokes) {

  container.innerHTML = "";

  jokes.forEach((joke) => {

    container.appendChild(
      createJokeCard(joke)
    );

  });
}

// CREATE CARD
function createJokeCard(joke) {

  const div =
    document.createElement("div");

  div.className =
    "bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl hover:-translate-y-2 hover:shadow-yellow-400/20 transition duration-300";

  div.innerHTML = `
    <div class="text-5xl mb-5">
      😂
    </div>

    <p class="text-lg text-gray-200 leading-relaxed min-h-[160px]">
      ${joke.content}
    </p>

    <div class="mt-8 flex justify-between items-center">

      <span class="text-yellow-400 text-sm capitalize">
        ${joke.category}
      </span>

      <button
        onclick="copyJoke('${joke.content.replace(/'/g, "\\'")}')"
        class="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Copy
      </button>

    </div>
  `;

  return div;
}

// CATEGORY
function detectCategory(text, index) {

  const lower =
    text.toLowerCase();

  if (
    lower.includes("teacher") ||
    lower.includes("exam") ||
    lower.includes("student")
  ) {
    return "school";
  }

  if (
    lower.includes("developer") ||
    lower.includes("coding") ||
    lower.includes("sql") ||
    lower.includes("compiler") ||
    lower.includes("bug")
  ) {
    return "coding";
  }

  if (
    lower.includes("cat") ||
    lower.includes("cow") ||
    lower.includes("frog") ||
    lower.includes("fish")
  ) {
    return "animals";
  }

  return "funny";
}

// FILTER
function filterJokes(category, button) {

  currentCategory = category;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {
      btn.classList.remove("active-filter");
    });

  button.classList.add("active-filter");

  if (category === "all") {

    displayJokes(allJokes);

    return;
  }

  const filtered =
    allJokes.filter(
      joke =>
        joke.category === category
    );

  displayJokes(filtered);
}

// SEARCH
searchInput.addEventListener(
  "input",
  (e) => {

    const value =
      e.target.value
        .trim()
        .toLowerCase();

    if (value === "") {

      displayJokes(allJokes);

      return;
    }

    const filtered =
      allJokes.filter(joke => {

        const content =
          joke.content.toLowerCase();

        const category =
          joke.category.toLowerCase();

        return (
          content.includes(value) ||
          category.includes(value)
        );
      });

    displayJokes(filtered);
  }
);

// COPY
function copyJoke(text) {

  navigator.clipboard.writeText(text);

  alert("Joke copied!");
}

// FALLBACK
function showFallbackJokes() {

  allJokes = [

    {
      content:
        "Why do programmers prefer dark mode? Because light attracts bugs 😂",
      category:
        "coding"
    },

    {
      content:
        "Why did the student eat his homework? Because the teacher said it was a piece of cake 😂",
      category:
        "school"
    },

    {
      content:
        "Why don’t cats play poker in the jungle? Too many cheetahs 😂",
      category:
        "animals"
    }

  ];

  displayJokes(allJokes);

  generateFeaturedJoke();
}

// INITIAL LOAD
loadJokes();