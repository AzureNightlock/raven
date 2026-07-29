const btn = document.createElement("div");

btn.textContent = "TEST";
btn.className = "px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer";
btn.addEventListener("click", () => {
  console.log("HI");
});
const ptag = document.createElement("p");

ptag.textContent = "hi";

btn.appendChild(ptag);

document.body.appendChild(btn);