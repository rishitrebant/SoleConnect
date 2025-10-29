// Import ProductManager (you'll need to add type="module" to your script tag)
// Or we can load it directly in the HTML

// Product slider functionality with JSON integration
class HomePageManager {
    constructor() {
        this.productManager = new ProductManager();
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.initSlider();
        this.initEventListeners();
    }

    async loadProducts() {
        const products = await this.productManager.loadProducts('data/products.json');
        this.renderProducts(products.slice(0, 4)); // Show first 4 products
    }

    renderProducts(products) {
        const slider = document.getElementById('productsSlider');
        
        if (!slider) {
            console.error('Products slider not found');
            return;
        }

        slider.innerHTML = ''; // Clear existing content

        products.forEach(product => {
            const productCard = this.createProductCard(product);
            slider.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.setAttribute('data-product-id', product.id);

        // Calculate discount
        const discount = product.getDiscountPercentage();

        article.innerHTML = `
            <a href="productDetails.html?id=${product.id}" style="display: block; text-decoration: none; color: inherit;">
                <img src="${product.images[0]}" alt="${product.brand} ${product.name}" class="product-image">
                <div class="product-info">
                    <p class="product-brand">${product.brand}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-pricing">
                        <span class="current-price">${product.formatPrice()}</span>
                        ${discount > 0 ? `<span class="original-price">${product.formatPrice(product.originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ''}
                    </div>
                </div>
            </a>
        `;

        return article;
    }

    initSlider() {
        const slider = document.getElementById('productsSlider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!slider || !prevBtn || !nextBtn) return;

        let scrollAmount = 0;
        const cardWidth = 326; // 310px + 16px gap

        nextBtn.addEventListener('click', () => {
            scrollAmount += cardWidth;
            if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
                scrollAmount = slider.scrollWidth - slider.clientWidth;
            }
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            scrollAmount -= cardWidth;
            if (scrollAmount < 0) {
                scrollAmount = 0;
            }
            slider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    initEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Hero button click
        const heroButton = document.querySelector('.hero-button');
        if (heroButton) {
            heroButton.addEventListener('click', () => {
                window.location.href = 'discover.html';
            });
        }

        // CTA button click
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomePageManager();
});