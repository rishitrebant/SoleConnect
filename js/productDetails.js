// Product Details Page with OOPS and JSON Integration
class ProductDetailsPage {
    constructor() {
        this.productManager = new ProductManager();
        this.currentProduct = null;
        this.selectedSize = null;
        this.init();
    }

    async init() {
        await this.loadProductData();
        this.renderProductDetails();
        this.initEventListeners();
    }

    async loadProductData() {
        // Get product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 1; // Default to product ID 1

        await this.productManager.loadProducts('data/products.json');
        this.currentProduct = this.productManager.getProductById(parseInt(productId));
        
        if (!this.currentProduct) {
            console.error('Product not found');
            // Redirect to 404 or homepage
            return;
        }

        this.productManager.setCurrentProduct(this.currentProduct);
    }

    renderProductDetails() {
        if (!this.currentProduct) return;

        this.renderProductHeader();
        this.renderImageGallery();
        this.renderSizeSelector();
        this.renderVendorCards();
        this.renderProductSpecifications();
    }

    renderProductHeader() {
        const discount = this.currentProduct.getDiscountPercentage();
        
        document.querySelector('.brand-name').textContent = this.currentProduct.brand;
        document.querySelector('.product-title').textContent = this.currentProduct.name;
        document.querySelector('.product-subtitle').textContent = this.currentProduct.subtitle;
        
        const priceSection = document.querySelector('.price-section');
        priceSection.innerHTML = `
            <div class="price-label">From</div>
            <div class="price">${this.currentProduct.formatPrice(this.currentProduct.getLowestVendorPrice())}</div>
            ${discount > 0 ? `<div class="discount">${discount}% OFF</div>` : ''}
        `;
    }

    renderImageGallery() {
        const imageGallery = document.querySelector('.image-gallery');
        if (!imageGallery) return;

        // Clear existing images
        imageGallery.innerHTML = '';

        this.currentProduct.images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `${this.currentProduct.brand} ${this.currentProduct.name} - View ${index + 1}`;
            img.className = 'product-image';
            img.loading = 'lazy';
            
            img.addEventListener('click', () => this.openImageModal(imageSrc));
            
            imageGallery.appendChild(img);
        });
    }

    renderSizeSelector() {
        const sizeSelector = document.querySelector('.size-selector');
        if (!sizeSelector) return;

        sizeSelector.innerHTML = ''; // Clear existing sizes

        this.currentProduct.sizes.forEach(size => {
            const sizeBtn = document.createElement('button');
            sizeBtn.className = 'size-option';
            sizeBtn.textContent = size;
            sizeBtn.setAttribute('data-size', size);
            
            sizeBtn.addEventListener('click', () => this.selectSize(size));
            
            sizeSelector.appendChild(sizeBtn);
        });
    }

    renderVendorCards() {
        const retailerCards = document.querySelector('.retailer-cards');
        if (!retailerCards) return;

        retailerCards.innerHTML = ''; // Clear existing cards

        this.currentProduct.vendors.forEach(vendor => {
            const vendorCard = this.createVendorCard(vendor);
            retailerCards.appendChild(vendorCard);
        });
    }

    createVendorCard(vendor) {
        const card = document.createElement('div');
        card.className = 'retailer-card';
        
        card.innerHTML = `
            <div class="retailer-info">
                <div class="retailer-header">
                    <div class="retailer-name">${vendor.name}</div>
                    <div class="rating-section">
                        <img src="assets/images/img_vector_teal_400.svg" alt="Star rating" class="rating-icon">
                        <span class="rating-text">${vendor.rating}</span>
                    </div>
                </div>
                <div class="retailer-price">${this.currentProduct.formatPrice(vendor.price)}</div>
                ${vendor.verified ? `
                <div class="verified-badge">
                    <img src="assets/images/img_vector_teal_400_12x12.svg" alt="Verified" class="verified-icon">
                    <span class="verified-text">Verified</span>
                </div>
                ` : ''}
            </div>
        `;

        card.addEventListener('click', () => this.selectVendor(vendor));
        return card;
    }

    renderProductSpecifications() {
        const detailsElement = document.querySelector('.details-text');
        if (!detailsElement) return;

        detailsElement.innerHTML = `
            ${this.currentProduct.description}<br><br>
            ${this.currentProduct.getSpecificationsHTML()}
        `;
    }

    selectSize(size) {
        this.selectedSize = size;
        
        // Update UI
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        event.target.classList.add('selected');
        
        console.log(`Size ${size} selected for ${this.currentProduct.name}`);
    }

    selectVendor(vendor) {
        console.log(`Vendor selected: ${vendor.name} - ${this.currentProduct.formatPrice(vendor.price)}`);
        // You can implement vendor selection logic here
    }

    openImageModal(imageSrc) {
        // Implement image modal functionality
        console.log('Open image modal for:', imageSrc);
    }

    initEventListeners() {
        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // Wishlist functionality
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.toggleWishlist());
        }

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isVisible = navMenu.style.display === 'flex';
                navMenu.style.display = isVisible ? 'none' : 'flex';
            });
        }
    }

    addToCart() {
        if (!this.selectedSize) {
            alert('Please select a size first.');
            return;
        }

        const cartItem = {
            product: this.currentProduct,
            size: this.selectedSize,
            vendor: this.currentProduct.vendors[0] // Default to first vendor
        };

        // Save to localStorage or send to backend
        this.saveToCart(cartItem);
        
        alert(`Added ${this.currentProduct.brand} ${this.currentProduct.name} (Size: ${this.selectedSize}) to cart!`);
    }

    saveToCart(item) {
        let cart = JSON.parse(localStorage.getItem('soleconnect_cart') || '[]');
        cart.push(item);
        localStorage.setItem('soleconnect_cart', JSON.stringify(cart));
    }

    toggleWishlist() {
        const wishlistBtn = document.querySelector('.wishlist-btn');
        let isWishlisted = wishlistBtn.classList.contains('wishlisted');
        
        isWishlisted = !isWishlisted;
        
        if (isWishlisted) {
            wishlistBtn.classList.add('wishlisted');
            wishlistBtn.style.backgroundColor = '#0066ff';
            wishlistBtn.querySelector('img').style.filter = 'brightness(0) invert(1)';
            this.addToWishlist();
        } else {
            wishlistBtn.classList.remove('wishlisted');
            wishlistBtn.style.backgroundColor = '#f5f5f5';
            wishlistBtn.querySelector('img').style.filter = 'none';
            this.removeFromWishlist();
        }
    }

    addToWishlist() {
        let wishlist = JSON.parse(localStorage.getItem('soleconnect_wishlist') || '[]');
        if (!wishlist.find(item => item.product.id === this.currentProduct.id)) {
            wishlist.push({ product: this.currentProduct });
            localStorage.setItem('soleconnect_wishlist', JSON.stringify(wishlist));
        }
        alert('Added to wishlist!');
    }

    removeFromWishlist() {
        let wishlist = JSON.parse(localStorage.getItem('soleconnect_wishlist') || '[]');
        wishlist = wishlist.filter(item => item.product.id !== this.currentProduct.id);
        localStorage.setItem('soleconnect_wishlist', JSON.stringify(wishlist));
        alert('Removed from wishlist!');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailsPage();
});