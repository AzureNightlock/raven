// ---- the helper (write once, reuse forever) ----
function state(initialValue) {
  let value = initialValue;
  const subscribers = []; // the "phonebook" — functions that care about this value

  return {
    get value() {
      return value;
    },
    set value(newValue) {
      value = newValue;
      subscribers.forEach((fn) => fn()); // notify everyone
    },
    subscribe(fn) {
      subscribers.push(fn);
      fn(); // run once immediately so the display starts correct
    },
  };
}
const countDisplay = document.getElementById("count");
const countDisplay1 = document.getElementById("count1");
const button = document.getElementById("incrementBtn");

const count = state(0);

// each display watches the state — one line each
count.subscribe(() => (countDisplay.textContent = count.value));
count.subscribe(() => (countDisplay1.textContent = count.value * 2));

// click handler knows NOTHING about the displays
button.addEventListener("click", () => {
  count.value++;
});
