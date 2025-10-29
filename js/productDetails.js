// Product Details Page with Step-by-Step Flow (Original Design)
class ProductDetailsPage {
    constructor() {
        this.productManager = new ProductManager();
        this.currentProduct = null;
        this.selectedSize = null;
        this.selectedVendor = null;
        this.isBestPriceSelected = false;
        this.init();
    }

    async init() {
        await this.loadProductData();
        this.initializeUI();
        this.initEventListeners();
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
        // Initially disable vendors and buttons
        this.disableVendors();
        this.disableWishlist();
        this.disableAddToCart();
        
        // Update hints
        this.updateSizeHint('Please select your size first');
        this.updateVendorHint('Select size to see vendors');
    }

    renderProductDetails() {
        if (!this.currentProduct) return;

        this.renderProductHeader();
        this.highlightBestPrice();
    }

    renderProductHeader() {
        document.querySelector('.brand-name').textContent = this.currentProduct.brand;
        document.querySelector('.product-title').textContent = this.currentProduct.name;
        document.querySelector('.product-subtitle').textContent = this.currentProduct.subtitle;
        
        const lowestPrice = this.currentProduct.getLowestVendorPrice();
        document.querySelector('.price').textContent = this.currentProduct.formatPrice(lowestPrice);
    }

    highlightBestPrice() {
        const vendors = this.currentProduct.vendors;
        const bestPrice = Math.min(...vendors.map(v => v.price));
        
        // Find and highlight the vendor with best price
        vendors.forEach(vendor => {
            if (vendor.price === bestPrice) {
                const vendorCard = document.querySelector(`[data-vendor="${vendor.name}"]`);
                if (vendorCard) {
                    vendorCard.classList.add('best-price');
                }
            }
        });
    }

    initEventListeners() {
        // Size selection
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleSizeSelection(e.target.dataset.size);
            });
        });

        // Vendor selection
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleVendorSelection(e.currentTarget.dataset.vendor);
            });
        });

        // Add to cart
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addToCart();
        });

        // Wishlist
        document.getElementById('wishlistBtn').addEventListener('click', () => {
            this.toggleWishlist();
        });

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

    handleSizeSelection(size) {
        // Remove selection from all sizes
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked size
        event.target.classList.add('selected');
        
        this.selectedSize = size;
        
        // Enable vendors and wishlist
        this.enableVendors();
        this.enableWishlist();
        
        // Update hints
        this.updateSizeHint(`Size ${size} selected - Now choose a vendor`);
        this.updateVendorHint('Click on a vendor to select');
        
        this.showMessage(`Size ${size} selected! Now choose your preferred vendor.`, 'success');
    }

    handleVendorSelection(vendorName) {
        // Remove selection from all vendors
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked vendor
        event.currentTarget.classList.add('selected');
        
        this.selectedVendor = this.currentProduct.getVendorByName(vendorName);
        this.isBestPriceSelected = event.currentTarget.classList.contains('best-price');
        
        // Enable add to cart
        this.enableAddToCart();
        
        // Update hints
        this.updateVendorHint(`${vendorName} selected - Ready to add to cart`);
        
        const message = this.isBestPriceSelected ? 
            `Great choice! ${vendorName} has the best price!` : 
            `${vendorName} selected!`;
        
        this.showMessage(message, 'success');
    }

    disableVendors() {
        document.querySelector('.vendors-section').classList.add('disabled');
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }

    enableVendors() {
        document.querySelector('.vendors-section').classList.remove('disabled');
        document.querySelectorAll('.retailer-card').forEach(card => {
            card.style.pointerEvents = 'auto';
        });
    }

    disableWishlist() {
        document.getElementById('wishlistBtn').disabled = true;
    }

    enableWishlist() {
        document.getElementById('wishlistBtn').disabled = false;
    }

    disableAddToCart() {
        document.getElementById('addToCartBtn').disabled = true;
    }

    enableAddToCart() {
        document.getElementById('addToCartBtn').disabled = false;
    }

    updateSizeHint(message) {
        document.getElementById('sizeHint').textContent = message;
    }

    updateVendorHint(message) {
        document.getElementById('vendorHint').textContent = message;
    }

    addToCart() {
        if (!this.selectedSize || !this.selectedVendor) {
            this.showMessage('Please select both size and vendor before adding to cart.', 'error');
            return;
        }

        const cartItem = {
            product: this.currentProduct,
            size: this.selectedSize,
            vendor: this.selectedVendor,
            price: this.selectedVendor.price,
            isBestPrice: this.isBestPriceSelected
        };

        this.saveToCart(cartItem);
        
        const savingsMessage = this.isBestPriceSelected ? 
            ` You got the best price! Saved ₹${this.currentProduct.originalPrice - this.selectedVendor.price}!` : '';
            
        this.showMessage(
            `Added ${this.currentProduct.brand} ${this.currentProduct.name} (Size: ${this.selectedSize}) to cart!${savingsMessage}`, 
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