let topics = {
  people: "Who the Alexander Technique helps",
  causes: "The root cause",
  skills: "What is learned",
  methods: "How it is taught",
  mechanisms: "Why it works",
};

function setExplanation(type, id) {
  let explanation = explanations[type].filter((e) => e.id == id)[0];
  let div = document.getElementById(type + "_explanation");
  //${topics[type]}:
  let dom = explanation.dom.cloneNode(true);
  let title = dom.firstElementChild.innerText;
  title = title[0].toLowerCase() + title.substr(1);
  let h2 = document.createElement("h2");
  h2.innerText = `${topics[type]}: ${title}`;
  dom.replaceChild(h2, dom.firstElementChild);
  div.replaceChildren(dom);
}

function addOption(type, explanation) {
  let option = document.createElement("option");
  option.setAttribute("value", explanation.id);
  option.innerText = explanation.title;
  let sel = document.getElementById(type);
  sel.appendChild(option);
}

function initSelect(type) {
  let sel = document.getElementById(type);
  sel.onchange = function (event) {
    resizeSelectElementToCurrentValue(sel);
    let id = event.target.value;
    setExplanation(type, id);
  };
}

function resizeSelectElementToCurrentValue(select) {
  // remove each <option> except the current value
  const purgatory = [];
  for (let option of select.querySelectorAll("option")) {
    purgatory.push(option);
    if (option.getAttribute("value") != select.value) {
      select.removeChild(option);
    }
  }

  // allow the <select> to auto-size
  select.style.width = null;

  // copy that width to "freeze" it
  select.style.width = `${select.clientWidth}px`;

  // restore the <select>'s children
  select.innerText = "";
  for (let option of purgatory) {
    select.appendChild(option);
  }
}

function parseExplanations() {
  let explanations = {};
  let intros = {};
  for (topic in topics) {
    explanations[topic] = [];
    let topicDiv = document.getElementById(topic + "_explanation");
    intros[topic] = document.getElementById(topic + "_intro");
    for (explanationDiv of topicDiv.querySelectorAll("div")) {
      if (explanationDiv.id.endsWith("intro")) continue;
      explanations[topic].push({
        id: explanationDiv.id,
        title: explanationDiv.firstElementChild.innerText,
        dom: explanationDiv,
      });
    }
    topicDiv.innerHTML = "";
  }
  return [explanations, intros];
}

function addExplanation(type, explanation) {
  let div = document.getElementById(type + "_explanation");
  div.appendChild(explanation.dom);
}

let currentPage = "madlib";

function setMenuForCurrentPage(nextElement) {
  for (let activeLink of document.querySelectorAll("a[class='menu-active']")) {
    activeLink.classList.remove("menu-active");
    activeLink.removeAttribute("aria-current");
    let nextLink = nextElement(activeLink.parentElement).firstElementChild;
    nextLink.classList.add("menu-active");
    nextLink.setAttribute("aria-current", "page");
  }
}

[explanations, intros] = parseExplanations();

function displayMadlib() {
  document.getElementById("explain").parentElement.removeAttribute("style");
  document
    .getElementById("explanations_intro")
    .setAttribute("style", "display:none");
  for (let topic in explanations) {
    initSelect(topic);
    setExplanation(topic, explanations[topic][0].id);
    explanations[topic].forEach((explanation) => addOption(topic, explanation));
  }

  // auto-size on startup, or as-needed
  for (select of document.querySelectorAll("select")) {
    resizeSelectElementToCurrentValue(select);
  }
}

function displayAllExplanations() {
  document
    .getElementById("explain")
    .parentElement.setAttribute("style", "display:none");
  document.getElementById("explanations_intro").removeAttribute("style");
  for (type in explanations) {
    document
      .getElementById(type + "_explanation")
      .replaceChildren(intros[type]);
    explanations[type].forEach((explanation) =>
      addExplanation(type, explanation)
    );
  }
}

function displayUiBasedOnHash() {
  if (window.location.hash && window.location.hash.endsWith("_explanation")) {
    if (currentPage == "madlib") {
      currentPage = "allexplanations";
      setMenuForCurrentPage((li) => li.nextElementSibling);
      displayAllExplanations();
    } else {
      // do nothing
    }
  } else if (currentPage == "allexplanations") {
    currentPage = "madlib";
    setMenuForCurrentPage((li) => li.previousElementSibling);
    displayMadlib();
  } else {
    displayMadlib();
  }
}

window.addEventListener("hashchange", displayUiBasedOnHash);

displayUiBasedOnHash();
