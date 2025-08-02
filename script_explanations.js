

function addExplanation(type, explanation) {
  let div = document.getElementById(type+"_explanation");
  let capitalisedTitle = explanation["title"][0].toUpperCase() + explanation["title"].substr(1)
  div.innerHTML += `<h3>${capitalisedTitle}</h3>
  ${explanation["description"] || "This description has not yet been written."}`
}

for (type in explanations) {
  explanations[type].forEach(explanation => addExplanation(type, explanation))
}
