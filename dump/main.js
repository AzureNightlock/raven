const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let currentEffect = null;

function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  function get() {
    if (currentEffect) {
      subscribers.add(currentEffect);
    }
    return value;
  }

  function set(newValue) {
    // Check if newValue is a function (e.g., prev => prev + 1)
    if (typeof newValue === "function") {
      value = newValue(value);
    } else {
      value = newValue;
    }

    for (const sub of subscribers) {
      sub();
    }
  }

  return [get, set];
}

function createEffect(fn) {
  const wrapped = () => {
    currentEffect = wrapped;
    fn();
    currentEffect = null;
  };
  wrapped();
}

const [count, setCount] = createSignal(2);

// 1. Create the elements
const p1 = document.createElement("p");
const p2 = document.createElement("p");
const button = document.createElement("button");

button.textContent = "Increment Count";
p1.id = "p1";
p2.id = "p2";

// 2. Register effect to auto-update UI on signal changes
createEffect(() => {
  p1.textContent = `P1 count: ${count()}`;
  p2.textContent = `P2 count: ${count() * 2}`;
  console.log("DOM updated with count:", count());
});

// 3. Append elements to the body
document.body.appendChild(p1);
document.body.appendChild(p2);
document.body.appendChild(button);

// 4. Attach click listener
button.addEventListener("click", (e) => {
  setCount((prev) => prev + 1);
});
