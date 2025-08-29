/**
 * Testimonial Carousel Component
 * Features: Auto-scroll every 2 seconds, arrow navigation, dot navigation, 
 * touch/swipe support, drag support, and responsive design
 */
class TestimonialCarousel {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error('Testimonial carousel container not found:', containerSelector);
      return;
    }

    this.options = {
      autoScrollInterval: 2000,
      transitionDuration: 500,
      enableAutoScroll: true,
      enableTouch: true,
      enableDrag: true,
      enableArrows: true,
      enableDots: true,
      enableProgressBar: true,
      ...options
    };

    this.currentIndex = 0;
    this.slides = [];
    this.autoScrollTimer = null;
    this.progressTimer = null;
    this.isTransitioning = false;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.threshold = 100; // minimum distance for swipe

    this.init();
  }

  init() {
    this.buildCarousel();
    this.bindEvents();
    if (this.options.enableAutoScroll) {
      this.startAutoScroll();
    }
  }

  buildCarousel() {
    // Get all existing picture elements first, then standalone img elements that aren't inside pictures
    const pictureElements = this.container.querySelectorAll('picture');
    const standaloneImages = this.container.querySelectorAll('img:not(picture img)');
    
    // Combine them but prioritize picture elements
    const existingElements = [...pictureElements, ...standaloneImages];
    
    if (existingElements.length === 0) {
      console.warn('No testimonial images found');
      return;
    }

    // Create carousel structure
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'testimonial-carousel-container';

    const carousel = document.createElement('div');
    carousel.className = 'testimonial-carousel';

    // Convert existing elements to slides
    existingElements.forEach((element, index) => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide';
      slide.dataset.slideIndex = index;
      
      // Move the element into the slide
      slide.appendChild(element.cloneNode(true));
      carousel.appendChild(slide);
      
      // Remove original element
      element.remove();
    });

    this.slides = carousel.querySelectorAll('.testimonial-slide');
    carouselContainer.appendChild(carousel);

    // Add progress bar if enabled
    if (this.options.enableProgressBar) {
      const progressBar = document.createElement('div');
      progressBar.className = 'carousel-progress';
      progressBar.innerHTML = '<div class="carousel-progress-bar"></div>';
      carouselContainer.appendChild(progressBar);
      this.progressBar = progressBar.querySelector('.carousel-progress-bar');
    }

    // Add controls
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';

    if (this.options.enableArrows) {
      controls.appendChild(this.createArrowButton('prev'));
    }

    if (this.options.enableDots) {
      controls.appendChild(this.createDots());
    }

    if (this.options.enableArrows) {
      controls.appendChild(this.createArrowButton('next'));
    }

    carouselContainer.appendChild(controls);
    this.container.appendChild(carouselContainer);

    // Store references
    this.carousel = carousel;
    this.controls = controls;
  }

  createArrowButton(direction) {
    const button = document.createElement('button');
    button.className = `carousel-arrow carousel-arrow-${direction}`;
    button.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} testimonial`);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (direction === 'prev') {
      path.setAttribute('d', 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z');
    } else {
      path.setAttribute('d', 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z');
    }
    
    svg.appendChild(path);
    button.appendChild(svg);
    
    button.addEventListener('click', () => {
      if (direction === 'prev') {
        this.goToPrevious();
      } else {
        this.goToNext();
      }
    });

    return button;
  }

  createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    for (let i = 0; i < this.slides.length; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.dataset.slideIndex = i;
      
      dot.addEventListener('click', () => {
        this.goToSlide(i);
      });

      dotsContainer.appendChild(dot);
    }

    this.dots = dotsContainer.querySelectorAll('.carousel-dot');
    return dotsContainer;
  }

  bindEvents() {
    if (this.options.enableTouch || this.options.enableDrag) {
      this.bindTouchEvents();
      this.bindMouseEvents();
    }

    // Pause auto-scroll on hover
    this.container.addEventListener('mouseenter', () => {
      this.pauseAutoScroll();
    });

    this.container.addEventListener('mouseleave', () => {
      if (this.options.enableAutoScroll && !this.isDragging) {
        this.startAutoScroll();
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.goToPrevious();
      } else if (e.key === 'ArrowRight') {
        this.goToNext();
      }
    });

    // Make container focusable for keyboard navigation
    this.container.setAttribute('tabindex', '0');
  }

  bindTouchEvents() {
    this.carousel.addEventListener('touchstart', (e) => {
      this.handleStart(e.touches[0]);
    }, { passive: false });

    this.carousel.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.handleMove(e.touches[0]);
    }, { passive: false });

    this.carousel.addEventListener('touchend', (e) => {
      this.handleEnd();
    });
  }

  bindMouseEvents() {
    this.carousel.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.handleStart(e);
    });

    this.carousel.addEventListener('mousemove', (e) => {
      e.preventDefault();
      this.handleMove(e);
    });

    this.carousel.addEventListener('mouseup', () => {
      this.handleEnd();
    });

    this.carousel.addEventListener('mouseleave', () => {
      this.handleEnd();
    });

    // Prevent image dragging
    this.carousel.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  }

  handleStart(e) {
    this.isDragging = true;
    this.startX = e.clientX || e.pageX;
    this.currentX = this.startX;
    this.carousel.classList.add('dragging');
    this.pauseAutoScroll();
  }

  handleMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.clientX || e.pageX;
    const diff = this.currentX - this.startX;
    
    // Add some resistance for visual feedback
    const resistance = 0.3;
    const transform = `translateX(calc(-${this.currentIndex * 100}% + ${diff * resistance}px))`;
    this.carousel.style.transform = transform;
  }

  handleEnd() {
    if (!this.isDragging) return;

    const diff = this.currentX - this.startX;
    this.isDragging = false;
    this.carousel.classList.remove('dragging');

    // Reset transform
    this.updateCarouselPosition();

    // Check if swipe threshold was met
    if (Math.abs(diff) > this.threshold) {
      if (diff > 0) {
        this.goToPrevious();
      } else {
        this.goToNext();
      }
    }

    // Restart auto-scroll after a delay
    setTimeout(() => {
      if (this.options.enableAutoScroll) {
        this.startAutoScroll();
      }
    }, 1000);
  }

  goToNext() {
    if (this.isTransitioning) return;
    
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  goToPrevious() {
    if (this.isTransitioning) return;
    
    const prevIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(prevIndex);
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;

    this.currentIndex = index;
    this.updateCarouselPosition();
    this.updateDots();
    this.restartAutoScroll();
  }

  updateCarouselPosition() {
    this.isTransitioning = true;
    this.carousel.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.options.transitionDuration);
  }

  updateDots() {
    if (!this.dots) return;
    
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  startAutoScroll() {
    this.pauseAutoScroll();
    
    if (!this.options.enableAutoScroll) return;

    let progress = 0;
    const progressIncrement = 100 / (this.options.autoScrollInterval / 100);

    this.progressTimer = setInterval(() => {
      progress += progressIncrement;
      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }
    }, 100);

    this.autoScrollTimer = setTimeout(() => {
      this.goToNext();
    }, this.options.autoScrollInterval);
  }

  pauseAutoScroll() {
    if (this.autoScrollTimer) {
      clearTimeout(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
    
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  restartAutoScroll() {
    this.pauseAutoScroll();
    if (this.options.enableAutoScroll) {
      setTimeout(() => {
        this.startAutoScroll();
      }, 500);
    }
  }

  // Public API methods
  play() {
    this.options.enableAutoScroll = true;
    this.startAutoScroll();
  }

  pause() {
    this.options.enableAutoScroll = false;
    this.pauseAutoScroll();
  }

  next() {
    this.goToNext();
  }

  previous() {
    this.goToPrevious();
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getTotalSlides() {
    return this.slides.length;
  }

  destroy() {
    this.pauseAutoScroll();
    
    // Remove event listeners
    this.container.removeAttribute('tabindex');
    
    // Restore original content if needed
    const originalElements = this.container.querySelectorAll('.testimonial-slide picture, .testimonial-slide img');
    const carouselContainer = this.container.querySelector('.testimonial-carousel-container');
    
    originalElements.forEach(element => {
      this.container.appendChild(element);
    });
    
    if (carouselContainer) {
      carouselContainer.remove();
    }
  }
}

// Auto-initialize when DOM is ready
function initTestimonialCarousel() {
  const testimonialContainer = document.querySelector('.Splash.Testimonial');
  if (testimonialContainer) {
    // Check if there are testimonial images
    const testimonialImages = testimonialContainer.querySelectorAll('picture, img');
    if (testimonialImages.length > 1) {
      window.testimonialCarousel = new TestimonialCarousel('.Splash.Testimonial', {
        autoScrollInterval: 2000,
        enableAutoScroll: true,
        enableTouch: true,
        enableDrag: true,
        enableArrows: true,
        enableDots: true,
        enableProgressBar: true
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTestimonialCarousel);
} else {
  initTestimonialCarousel();
}

// Make TestimonialCarousel available globally for manual initialization or testing
window.TestimonialCarousel = TestimonialCarousel;