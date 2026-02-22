document.addEventListener("DOMContentLoaded", () => {

  const username = "suyogyataneja";

  async function loadGitHubOverview() {
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);

      if (!userRes.ok || !reposRes.ok) {
        throw new Error("GitHub API failed");
      }

      const user = await userRes.json();
      const repos = await reposRes.json();

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

      const languages = {};
      repos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      const topLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(lang => lang[0]);

      const overview = document.getElementById("github-overview");

      if (overview) {
        overview.innerHTML = `
          <p><strong>Public Repositories:</strong> ${user.public_repos}</p>
          <p><strong>Followers:</strong> ${user.followers}</p>
          <p><strong>Total Stars:</strong> ${totalStars}</p>
          <p><strong>Top Languages:</strong> ${topLanguages.join(", ") || "N/A"}</p>
        `;
      }

    } catch (error) {
      console.error("GitHub error:", error);
    }
  }

  loadGitHubOverview();

  /* Fade-in animation */
  const faders = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  faders.forEach(el => observer.observe(el));

});
