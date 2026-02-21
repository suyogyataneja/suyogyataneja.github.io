const text = "Senior Full-Stack Developer | .NET | CQRS | Azure";
let i = 0;

function typeEffect() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 50);
  }
}

typeEffect();

const faders = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

faders.forEach(el => observer.observe(el));
