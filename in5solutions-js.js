document.addEventListener('DOMContentLoaded', function() {
    // Dropdown-menu funktionalitet
    const dropdown = document.querySelector('.dropdown');

    if (dropdown) {
        // Toggle dropdown menu
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation(); // Forhindrer klik-event i at lukke menuen
            dropdown.classList.toggle('active'); // Tilføjer 'active' til '.dropdown'
        });

        // Luk dropdown, hvis der klikkes udenfor
        document.addEventListener('click', function(event) {
            const isClickInsideDropdown = dropdown.contains(event.target);
            if (!isClickInsideDropdown && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Mobile menu funktionalitet
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        // Toggle mobile menu
        menuToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Forhindrer klik-event i at boble op
            navMenu.classList.toggle('active');
        });

        // Luk mobilmenuen, når der klikkes udenfor
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            if (!isClickInsideMenu && !isClickOnMenuToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                // Luk mobilmenuen efter klik på link
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Tilføj 'active' klasse til nav-items ved scroll (med debounce)
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-menu a');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 70) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }, 66);
    }, false);

    // Kontaktformular submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const jsonData = {};
            formData.forEach((value, key) => { jsonData[key] = value });

            fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                if (response.ok) {
                    alert('Tak for din besked. Vi vender tilbage hurtigst muligt!');
                    contactForm.reset();
                } else {
                    alert('Ups! Der opstod et problem med at sende din formular');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ups! Der opstod et problem med at sende din formular');
            });
        });
    }

    // *** Start af koden fra blog.js ***

    const blogContainer = document.getElementById('blog-posts');
    const searchInput = document.getElementById('search');
    const categoryLinks = document.querySelectorAll('.category');

    if (blogContainer && searchInput) {
        let allPosts = [];

        // Fetch blog data
        fetch('blogData.json')
            .then(response => response.json())
            .then(posts => {
                allPosts = posts;
                displayPosts(allPosts); // Initially display all posts
                searchInput.addEventListener('input', () => filterPosts(searchInput.value));
                categoryLinks.forEach(category => category.addEventListener('click', filterByCategory));
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

        function filterPosts(query) {
            const filteredPosts = allPosts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.content.toLowerCase().includes(query.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            displayPosts(filteredPosts);
        }

        function filterByCategory(e) {
            const selectedCategory = e.currentTarget.getAttribute('data-category');
            const filteredPosts = allPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());
            displayPosts(filteredPosts);
        }
    }
    // *** Slut af koden fra blog.js ***
});
