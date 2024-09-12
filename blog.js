document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.getElementById('blog-posts');
  const searchInput = document.getElementById('search');

  // Fetch blog data
  fetch('blogData.json')
    .then(response => response.json())
    .then(posts => {
      displayPosts(posts);
      searchInput.addEventListener('input', () => filterPosts(posts, searchInput.value));
    });

  function displayPosts(posts) {
    blogContainer.innerHTML = posts.map(post => `
      <article>
        <h2>${post.title}</h2>
        ${post.subheadlines.map(sub => `<h3>${sub}</h3>`).join('')}
        <img src="${post.image}" alt="${post.title}">
        <p>${post.content}</p>
        ${post.links.map(link => `<a href="${link}" target="_blank">${link}</a>`).join('')}
        <p>Tags: ${post.tags.join(', ')}</p>
      </article>
    `).join('');
  }

  function filterPosts(posts, query) {
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    displayPosts(filteredPosts);
  }
});
