const username = "suyogyataneja";

async function loadGitHubOverview() {
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

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const overview = document.getElementById("github-overview");

  overview.innerHTML = `
    <p><strong>Public Repositories:</strong> ${user.public_repos}</p>
    <p><strong>Followers:</strong> ${user.followers}</p>
    <p><strong>Total Stars:</strong> ${totalStars}</p>
    <p><strong>Top Languages:</strong> ${topLanguages.map(lang => lang[0]).join(", ")}</p>
  `;
}

async function loadTopRepos() {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await response.json();
  const container = document.getElementById("repo-container");

  container.innerHTML = "";

  repos.slice(0, 3).forEach(repo => {
    const div = document.createElement("div");
    div.classList.add("repo-card");
    div.innerHTML = `
      <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
      <p>${repo.description || "No description provided."}</p>
      <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
    `;
    container.appendChild(div);
  });
}

loadGitHubOverview();
loadTopRepos();
