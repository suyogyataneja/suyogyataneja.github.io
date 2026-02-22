document.addEventListener("DOMContentLoaded", () => {
  const username = "suyogyataneja";

  async function loadGitHubOverview() {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Animate numbers
    animateValue("repoCount", 0, user.public_repos, 800);
    animateValue("followerCount", 0, user.followers, 800);
    animateValue("starCount", 0, totalStars, 800);

    // Create language bars
    const totalLangCount = sortedLanguages.reduce((sum, l) => sum + l[1], 0);
    const langContainer = document.getElementById("languageBars");
    langContainer.innerHTML = "";

    sortedLanguages.forEach(([lang, count]) => {
      const percentage = Math.round((count / totalLangCount) * 100);

      const div = document.createElement("div");
      div.classList.add("language-bar");

      div.innerHTML = `
        <span>${lang} (${percentage}%)</span>
        <div class="progress">
          <div class="progress-fill" style="width:${percentage}%"></div>
        </div>
      `;

      langContainer.appendChild(div);
    });

  } catch (error) {
    console.error("GitHub load error:", error);
  }
}

// Counter animation
function animateValue(id, start, end, duration) {
  let range = end - start;
  let current = start;
  let increment = end > start ? 1 : -1;
  let stepTime = Math.abs(Math.floor(duration / range));
  let obj = document.getElementById(id);

  let timer = setInterval(function () {
    current += increment;
    obj.textContent = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}
  loadGitHubOverview();
});
