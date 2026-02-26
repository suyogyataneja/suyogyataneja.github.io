document.addEventListener("DOMContentLoaded", () => {

  const username = "suyogyataneja";

  async function loadGitHubOverview() {
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);

      const user = await userRes.json();
      const repos = await reposRes.json();

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

      // Prevent multiple animations
      if (!window.statsAnimated) {
        document.getElementById("repoCount").textContent = user.public_repos;
        document.getElementById("followerCount").textContent = user.followers;
        document.getElementById("starCount").textContent = totalStars;
        window.statsAnimated = true;
      }

      // Language calculation
      const languages = {};
      repos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      const sortedLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

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

async function loadCommitStats() {
  try {
    const res = await fetch("stats.json");

    if (!res.ok) {
      throw new Error("Failed to fetch stats.json");
    }

    const data = await res.json();
    console.log("Loaded stats:", data);

    //const thisYear = data.data.user.thisYear.totalCommitContributions;
    //const lastYear = data.data.user.lastYear.totalCommitContributions;
    const thisYear = data.data.user.thisYear.contributionCalendar.totalContributions;
    const lastYear = data.data.user.lastYear.contributionCalendar.totalContributions;
    document.getElementById("commitsThisYear").textContent = thisYear;
    document.getElementById("commitsLastYear").textContent = lastYear;

  } catch (err) {
    console.error("Stats load error:", err);
  }
}


  loadGitHubOverview();
  loadCommitStats();

});
