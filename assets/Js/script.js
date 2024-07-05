const APIURL = "https://api.github.com/search/users?q=";

const userList = document.getElementById("userList");
const form = document.getElementById("form");
const search = document.getElementById("searchUser");
const cardContainer = document.getElementById("cardContainer");
const avatarLarge = document.getElementById("avatarLarge");
const userInfoLarge = document.getElementById("userInfoLarge");
const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");
const reposCount = document.getElementById("reposCount");
const reposLarge = document.getElementById("reposLarge");

const GITHUB_TOKEN = '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';

const axiosConfig = {
    headers: {
        Authorization: `token ${GITHUB_TOKEN}`
    }
};

async function getUsers(username) {
    try {
        const { data } = await axios.get(APIURL + username, axiosConfig);
        const users = data.items.slice(0, 25); // Limit to first 25 users

        if (users.length === 0) {
            createErrorItem("No profiles found");
            return;
        }

        userList.innerHTML = ""; // Clear previous search results

        users.forEach((user) => {
            createUserItem(user);
        });
    } catch (err) {
        createErrorItem("Error fetching users");
    }
}

function createUserItem(user) {
    const userItem = document.createElement("li");
    userItem.classList.add("user-item");

    userItem.innerHTML = `
        <div class="user-item--content">
          <div class="user-item--avatar">
            <img src="${user.avatar_url}" alt="${user.login}" />
          </div>
          <div class="user-item--name">
            <h3>${user.login}</h3>
          </div>
        </div>
        <ul class="user-item-btns">
          <a href="${user.html_url}" target="_blank" class="btn">GitHub <i class="fa-brands fa-github"></i></a>
          <a href="#" onclick="showProfile('${user.login}')" class="btn">Overview <i class="fa-solid fa-eye"></i></a>
        </ul>
    `;

    userList.appendChild(userItem);
    userList.style.borderTop = "1px solid #ccc";
}

function createErrorItem(msg) {
    const errorItem = document.createElement("li");
    errorItem.classList.add("user-item");

    errorItem.innerHTML = `<h3>${msg}</h3>`;

    userList.innerHTML = ""; // Clear previous search results
    userList.appendChild(errorItem);
}

async function showProfile(username) {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${username}`, axiosConfig);

        const userID = data.name || data.login;
        const userBio = data.bio ? data.bio : "";
        const followers = data.followers;
        const following = data.following;
        const publicRepos = data.public_repos;

        avatarLarge.src = data.avatar_url;
        avatarLarge.alt = userID;

        userInfoLarge.innerHTML = `
          <div class="user-item--name">
            <h3>${userID}</h3>
          </div>
          <p>${userBio}</p>
          <ul>
            <li>
              <span id="followersCount">${followers}</span> <strong> Followers</strong>
            </li>
            <li>
              <span id="followingCount">${following}</span> <strong> Following</strong>
            </li>
            <li><span id="reposCount">${publicRepos}</span> <strong> Repos</strong></li>
          </ul>
          <div id="reposLarge"></div>
        `;

        cardContainer.style.display = "block";
        getRepos(username);
    } catch (err) {
        console.error("Error fetching user profile", err);
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${username}/repos?sort=created`, axiosConfig);
        const reposLarge = document.getElementById("reposLarge");
        reposLarge.innerHTML = ""; // Clear previous repos

        data.slice(0, 40).forEach((repo) => {
            const repoItem = document.createElement("a");
            repoItem.classList.add("repo");
            repoItem.href = repo.html_url;
            repoItem.target = "_blank";
            repoItem.innerText = repo.name;
            reposLarge.appendChild(repoItem);
        });

    } catch (err) {
        console.error("Error fetching repos", err);
    }
}

function closeCard() {
    cardContainer.style.display = "none";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm) {
        getUsers(searchTerm);
        search.value = "";
        closeCard();
    }
});

// Event listener to close card when clicking outside
window.addEventListener("click", (e) => {
    if (e.target !== cardContainer) {
        closeCard();
    }
});
