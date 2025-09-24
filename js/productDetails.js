// Product Details Page Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Size selection functionality
  const sizeOptions = document.querySelectorAll('.size-option');
  
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove selected class from all options
      sizeOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      this.classList.add('selected');
    });
  });

  // Add to cart functionality
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  addToCartBtn.addEventListener('click', function() {
    const selectedSize = document.querySelector('.size-option.selected');
    if (selectedSize) {
      alert(`Added Puma Palermo size ${selectedSize.dataset.size} to cart!`);
    } else {
      alert('Please select a size first.');
    }
  });

  // Wishlist functionality
  const wishlistBtn = document.querySelector('.wishlist-btn');
  let isWishlisted = false;
  
  wishlistBtn.addEventListener('click', function() {
    isWishlisted = !isWishlisted;
    
    if (isWishlisted) {
      this.style.backgroundColor = '#0066ff';
      this.querySelector('img').style.filter = 'brightness(0) invert(1)';
      alert('Added to wishlist!');
    } else {
      this.style.backgroundColor = '#f5f5f5';
      this.querySelector('img').style.filter = 'none';
      alert('Removed from wishlist!');
    }
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
    });
  }

  // Image loading states
  document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
      this.style.backgroundColor = '#e5e7eb';
      this.style.display = 'flex';
      this.style.alignItems = 'center';
      this.style.justifyContent = 'center';
      this.innerHTML = 'Image not found';
      this.style.color = '#6b7280';
      this.style.fontSize = '14px';
    });
  });
});