// Enhanced Product Details Page with Step-by-Step Flow
class ProductDetailsPage {
    constructor() {
        this.productManager = new ProductManager();
        this.currentProduct = null;
        this.selectedSize = null;
        this.selectedVendor = null;
        this.currentStep = 'size'; // size → vendor → cart
        this.init();
    }

    async init() {
        await this.loadProductData();
        this.initializeUI();
        this.initEventListeners();
        this.updateUIState();
    }

    async loadProductData() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 1;

        await this.productManager.loadProducts('data/products.json');
        this.currentProduct = this.productManager.getProductById(parseInt(productId));
        
        if (!this.currentProduct) {
            console.error('Product not found');
            return;
        }

        this.productManager.setCurrentProduct(this.currentProduct);
        this.renderProductDetails();
    }

    initializeUI() {
        // Initially disable everything except size selection
        this.disableVendorSelection();
        this.disableWishlist();
        this.disableAddToCart();
    }

    renderProductDetails() {
        if (!this.currentProduct) return;

        this.renderProductHeader();
        this.renderSizeSelector();
        this.renderVendorCards();
    }

    renderProductHeader() {
        document.querySelector('.brand-name').textContent = this.currentProduct.brand;
        document.querySelector('.product-title').textContent = this.currentProduct.name;
        document.querySelector('.product-subtitle').textContent = this.currentProduct.subtitle;
        
        const lowestPrice = this.currentProduct.getLowestVendorPrice();
        document.querySelector('.price').textContent = this.currentProduct.formatPrice(lowestPrice);
    }

    renderSizeSelector() {
        const sizeSelector = document.querySelector('.size-selector');
        if (!sizeSelector) return;

        sizeSelector.innerHTML = '';

        this.currentProduct.sizes.forEach(size => {
            const sizeBtn = document.createElement('button');
            sizeBtn.className = 'size-option';
            sizeBtn.textContent = size;
            sizeBtn.setAttribute('data-size', size);
            sizeBtn.addEventListener('click', () => this.handleSizeSelection(size));
            sizeSelector.appendChild(sizeBtn);
        });
    }

    renderVendorCards() {
        const retailerCards = document.querySelector('.retailer-cards');
        if (!retailerCards) return;

        retailerCards.innerHTML = '';

        // Find the best price
        const vendors = this.currentProduct.vendors;
        const bestPrice = Math.min(...vendors.map(v => v.price));

        vendors.forEach(vendor => {
            const vendorCard = this.createVendorCard(vendor, vendor.price === bestPrice);
            retailerCards.appendChild(vendorCard);
        });
    }

    createVendorCard(vendor, isBestPrice = false) {
        const card = document.createElement('div');
        card.className = `retailer-card ${isBestPrice ? 'best-price' : ''}`;
        card.setAttribute('data-vendor', vendor.name);
        
        if (isBestPrice) {
            card.innerHTML = `<div class="best-price-badge">Best Price</div>`;
        }

        card.innerHTML += `
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

        card.addEventListener('click', () => this.handleVendorSelection(vendor));
        return card;
    }

    handleSizeSelection(size) {
        // Remove selection from all sizes
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked size
        event.target.classList.add('selected');
        
        this.selectedSize = size;
        this.currentStep = 'vendor';
        
        // Enable vendor selection and wishlist
        this.enableVendorSelection();
        this.enableWishlist();
        
        this.updateUIState();
        
        // Show confirmation message
        this.showMessage(`Size ${size} selected! Now choose a vendor.`, 'success');
    }

    handleVendorSelection(vendor) {
        // Remove selection from all vendors
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked vendor
        event.currentTarget.classList.add('selected');
        
        this.selectedVendor = vendor;
        this.currentStep = 'cart';
        
        // Enable add to cart
        this.enableAddToCart();
        
        this.updateUIState();
        
        // Show confirmation message
        this.showMessage(`${vendor.name} selected! Ready to add to cart.`, 'success');
    }

    disableVendorSelection() {
        const stepVendor = document.getElementById('stepVendor');
        stepVendor.classList.add('disabled');
        stepVendor.classList.remove('active', 'completed');
        
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }

    enableVendorSelection() {
        const stepVendor = document.getElementById('stepVendor');
        stepVendor.classList.remove('disabled');
        stepVendor.classList.add('active');
        
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.style.pointerEvents = 'auto';
        });
    }

    disableWishlist() {
        const wishlistBtn = document.getElementById('wishlistBtn');
        wishlistBtn.classList.add('disabled');
        wishlistBtn.disabled = true;
    }

    enableWishlist() {
        const wishlistBtn = document.getElementById('wishlistBtn');
        wishlistBtn.classList.remove('disabled');
        wishlistBtn.disabled = false;
        wishlistBtn.classList.add('enabled');
    }

    disableAddToCart() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        addToCartBtn.classList.add('disabled');
        addToCartBtn.disabled = true;
    }

    enableAddToCart() {
        const addToCartBtn = document.getElementById('addToCartBtn');
        addToCartBtn.classList.remove('disabled');
        addToCartBtn.disabled = false;
        addToCartBtn.classList.add('enabled');
    }

    updateUIState() {
        // Update step indicators
        const stepSize = document.getElementById('stepSize');
        const stepVendor = document.getElementById('stepVendor');
        
        // Reset all steps
        stepSize.classList.remove('completed');
        stepVendor.classList.remove('completed');
        
        // Update based on current step
        switch (this.currentStep) {
            case 'vendor':
                stepSize.classList.add('completed');
                stepVendor.classList.add('active');
                break;
            case 'cart':
                stepSize.classList.add('completed');
                stepVendor.classList.add('completed');
                break;
            default:
                stepSize.classList.add('active');
        }
    }

    initEventListeners() {
        // Add to cart functionality
        const addToCartBtn = document.getElementById('addToCartBtn');
        addToCartBtn.addEventListener('click', () => this.addToCart());

        // Wishlist functionality
        const wishlistBtn = document.getElementById('wishlistBtn');
        wishlistBtn.addEventListener('click', () => this.toggleWishlist());

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
        if (!this.selectedSize || !this.selectedVendor) {
            this.showMessage('Please complete all selection steps.', 'error');
            return;
        }

        const cartItem = {
            product: this.currentProduct,
            size: this.selectedSize,
            vendor: this.selectedVendor,
            price: this.selectedVendor.price
        };

        this.saveToCart(cartItem);
        
        this.showMessage(
            `Added ${this.currentProduct.brand} ${this.currentProduct.name} (Size: ${this.selectedSize}) from ${this.selectedVendor.name} to cart!`, 
            'success'
        );
    }

    toggleWishlist() {
        if (!this.selectedSize) {
            this.showMessage('Please select a size first.', 'error');
            return;
        }

        const wishlistBtn = document.getElementById('wishlistBtn');
        let isWishlisted = wishlistBtn.classList.contains('wishlisted');
        
        isWishlisted = !isWishlisted;
        
        if (isWishlisted) {
            wishlistBtn.classList.add('wishlisted');
            this.addToWishlist();
        } else {
            wishlistBtn.classList.remove('wishlisted');
            this.removeFromWishlist();
        }
    }

    addToWishlist() {
        let wishlist = JSON.parse(localStorage.getItem('soleconnect_wishlist') || '[]');
        const wishlistItem = { 
            product: this.currentProduct, 
            size: this.selectedSize 
        };
        
        if (!wishlist.find(item => 
            item.product.id === this.currentProduct.id && 
            item.size === this.selectedSize
        )) {
            wishlist.push(wishlistItem);
            localStorage.setItem('soleconnect_wishlist', JSON.stringify(wishlist));
        }
        this.showMessage('Added to wishlist!', 'success');
    }

    removeFromWishlist() {
        let wishlist = JSON.parse(localStorage.getItem('soleconnect_wishlist') || '[]');
        wishlist = wishlist.filter(item => 
            !(item.product.id === this.currentProduct.id && item.size === this.selectedSize)
        );
        localStorage.setItem('soleconnect_wishlist', JSON.stringify(wishlist));
        this.showMessage('Removed from wishlist!', 'success');
    }

    saveToCart(item) {
        let cart = JSON.parse(localStorage.getItem('soleconnect_cart') || '[]');
        cart.push(item);
        localStorage.setItem('soleconnect_cart', JSON.stringify(cart));
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.user-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `user-message ${type}`;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#FEF2F2' : type === 'success' ? '#F0FDF4' : '#EFF6FF'};
            color: ${type === 'error' ? '#DC2626' : type === 'success' ? '#16A34A' : '#1E40AF'};
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid ${type === 'error' ? '#FECACA' : type === 'success' ? '#BBF7D0' : '#BFDBFE'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
        `;
        messageElement.textContent = message;

        document.body.appendChild(messageElement);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailsPage();
});