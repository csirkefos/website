document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('search-results');
    const normalList = document.getElementById('normal-list');
    const normalContent = document.getElementById('normal-content');
    const paginationControls = document.getElementById('pagination-controls');
    
    let postsData = null;

    if (!searchInput) return;

    searchInput.addEventListener('input', async function(e) {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            // Restore normal view
            searchResults.style.display = 'none';
            if (normalList) normalList.style.display = 'flex';
            if (normalContent) normalContent.style.display = 'block';
            if (paginationControls) paginationControls.style.display = 'flex';
            return;
        }

        // Hide normal views and show results container
        if (normalList) normalList.style.display = 'none';
        if (normalContent) normalContent.style.display = 'none';
        if (paginationControls) paginationControls.style.display = 'none';
        searchResults.style.display = 'flex';

        // Load data if not already loaded
        if (!postsData) {
            try {
                // Try to load metadata.json from root
                let metaUrl = 'metadata.json';
                // If we are on page-X.html or article.html, it should still be in root
                // Usually relative path is fine since everything is in root folder
                const response = await fetch(metaUrl);
                if (response.ok) {
                    postsData = await response.json();
                    // Reverse the loaded posts to show newest first
                    postsData = postsData.reverse();
                } else {
                    console.error("Failed to load metadata.");
                    postsData = [];
                }
            } catch (error) {
                console.error("Error fetching metadata:", error);
                postsData = [];
            }
        }

        // Filter and render
        const matches = postsData.filter(post => {
            return post.title.toLowerCase().includes(query) || 
                   post.excerpt.toLowerCase().includes(query);
        });

        renderResults(matches, query);
    });

    function renderResults(posts, query) {
        searchResults.innerHTML = ''; // Clear previous

        if (posts.length === 0) {
            searchResults.innerHTML = `
                <div style="text-align:center; padding: 50px; color: #999; width: 100%;">
                    <h2>Nincs találat erre: "${query}"</h2>
                    <p>Próbálj meg más keresőszót megadani.</p>
                </div>
            `;
            return;
        }

        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'article-item';
            
            article.innerHTML = `
                <div class="article-item-img">
                    <a href="${post.slug}.html">
                        <img src="images/${post.slug}-featured.jpg" alt="${post.title}" onerror="this.src='https://via.placeholder.com/600x400/eeeeee/aaaaaa?text=No+Image'">
                    </a>
                </div>
                <div class="article-item-content">
                    <h2 class="article-item-title">
                        <a href="${post.slug}.html">${post.title}</a>
                    </h2>
                    <div class="article-item-meta">${post.date}</div>
                    <p class="article-item-excerpt">${post.excerpt}</p>
                </div>
            `;
            searchResults.appendChild(article);
        });
    }
});
