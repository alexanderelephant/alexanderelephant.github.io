

function setExplanation(type, id) {
  let explanation = explanations[type].filter(e => e.id == id)[0]
  let div = document.getElementById(type+"_explanation");
  div.innerHTML = `<h2>${topics[type]}: ${explanation["title"]}</h2>
  ${explanation["description"] || "This description has not yet been written."}`
}

function addOption(type, explanation) {
  let option = document.createElement("option")
  option.setAttribute("value", explanation.id)
  option.innerText = `${explanation.title}${explanation.description.length==0?"*":""}`
  let sel = document.getElementById(type)
  sel.appendChild(option)
}

function initSelect(type) {
  let sel = document.getElementById(type)
  sel.onchange = function(event) {
    resizeSelectElementToCurrentValue(sel)
    let id = event.target.value
    setExplanation(type, id)
  }
}

function resizeSelectElementToCurrentValue(select) {
  // remove each <option> except the current value
  const purgatory = [];
  for (let option of select.querySelectorAll('option')) {
    purgatory.push(option);
    if (option.getAttribute('value') != select.value) {
      select.removeChild(option);
    }
  }

  // allow the <select> to auto-size
  select.style.width = null;

  // copy that width to "freeze" it
  select.style.width = `${select.clientWidth}px`;

  // restore the <select>'s children
  select.innerText = '';
  for (let option of purgatory) {
    select.appendChild(option);
  }
}

for (type in explanations) {
  initSelect(type)
  setExplanation(type, explanations[type][0].id)
  explanations[type].forEach(explanation => addOption(type, explanation))
}

// auto-size on startup, or as-needed
for (select of document.querySelectorAll('select')) {
 resizeSelectElementToCurrentValue(select);
}
