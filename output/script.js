const btn = document.createElement("button");

btn.textContent = "Click Me!";
btn.className = "px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer";
btn.addEventListener("click", () => {
  console.log("hi");
});

document.body.appendChild(btn);