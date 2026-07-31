/**
 * Kujto Tiranën — allscript.js
 * Shared UI helpers used by the main page.
 * Do not remove without checking index.html script order.
 */
let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.add('active');
    document.body.classList.add('nav-open');
}

document.querySelector('#nav-close').onclick = () =>{
    navbar.classList.remove('active');
    document.body.classList.remove('nav-open');
    document.body.classList.remove('nav-open');
}



window.onscroll = () =>{
    navbar.classList.remove('active');
    document.body.classList.remove('nav-open');

    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};

window.onload = () =>{
    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};






// -------------------------------------------to top scroller------------------------------------

const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
})






// --------------------------------------------product main page js----------------------------------

let tabs = document.querySelectorAll('.tabs__toggle'),
    contents = document.querySelectorAll('.tabs__content');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        contents.forEach((content) => {
            content.classList.remove('is-active');
        });
        tabs.forEach((tab) => {
            tab.classList.remove('is-active');
        });
        contents[index].classList.add('is-active');
        tabs[index].classList.add('is-active');
    });
});

  $(document).ready(function() {
      // Sample image data - replace with your own images and titles
      const images = [
          { src: 'images/parku.webp', alt: 'Parku i Madh', title: 'Grand Park (Parku i Madh)', locationKey: 'parku'},
          { src: 'images/maxresdefault.webp', alt: 'Sheshi Skenderbeg', title: 'Skanderbeg Square (Sheshi Skënderbeg)', locationKey: 'sheshi' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Et%27hem_Bey_Mosque%2C_Tirana.jpg/1280px-Et%27hem_Bey_Mosque%2C_Tirana.jpg', alt: 'Xhamia Ethem Bey', title: 'Ethem Mosque (Xhamia Ethem Bey)', locationKey: 'xhamia' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/National_History_Museum%2C_Tirana.jpg/1280px-National_History_Museum%2C_Tirana.jpg', alt: 'Muzeu Historik', title: 'National History Museum (Muzeu Historik Kombetar)', locationKey: 'muzeu' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Resurrection_Cathedral%2C_Tirana.jpg/1280px-Resurrection_Cathedral%2C_Tirana.jpg', alt: 'Kisha Orthodhokse', title: 'Orthodox Cathedral (Kisha Orthodhokse)', locationKey: 'kisha' },
          { src: 'images/pazari0.webp', alt: 'Pazari i Ri', title: 'New Bazaar (Pazari i Ri)', locationKey: 'pazari' },
          { src: 'images/pyramid.webp', alt: 'Piramida', title: 'Pyramid of Tirana (Piramida e Tiranës)', locationKey: 'piramida' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tanners%27_Bridge%2C_Tirana.jpg/1280px-Tanners%27_Bridge%2C_Tirana.jpg', alt: 'Ura e Tanerve', title: 'Tanners Bridge (Ura e Tanerëve)', locationKey: 'ura' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Clock_Tower_of_Tirana.jpg/800px-Clock_Tower_of_Tirana.jpg', alt: 'Kulla e Sahatit', title: 'Clock Tower (Kulla e Sahatit)', locationKey: 'kulla' },
          { src: 'images/liqeni0.webp', alt: 'Lumi Lana', title: 'Lana River (Lumi Lana)', locationKey: 'lana' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bank_of_Albania.jpg/1280px-Bank_of_Albania.jpg', alt: 'Banka', title: 'Bank of Albania (Banka e Shqipërisë)', locationKey: 'banka' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Petrela_Castle.jpg/1280px-Petrela_Castle.jpg', alt: 'Petrela', title: 'Petrela Castle (Kalaja e Petrelës)', locationKey: 'petrela' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Tirana_Castle.jpg/1280px-Tirana_Castle.jpg', alt: 'Kalaja', title: 'Tirana Castle (Kalaja e Tiranës)', locationKey: 'kalaja' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Bashkia_e_Tiranes.JPG/1280px-Bashkia_e_Tiranes.JPG', alt: 'Bashkia', title: 'Tirana City Hall (Bashkia e Tiranës)', locationKey: 'bashkia' },
          { src: 'images/zoo.webp', alt: 'Zoo', title: 'Tirana Zoo (Kopshti Zoologjik)', locationKey: 'zoo' },
          { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Bulevardi_Zog_I_in_Tirana.jpg/1280px-Bulevardi_Zog_I_in_Tirana.jpg', alt: 'Bulevardi', title: 'Zogu i Parë Boulevard', locationKey: 'zogip'},
          { src: 'images/dajti0.webp', alt: 'Dajti', title: 'Mount Dajti (Mali i Dajtit)', locationKey: 'dajti' },
          { src: 'fotot/parku_tirane/2025.webp', alt: 'Park 2025', title: 'Grand Park today', locationKey: 'parku' },
          { src: 'fotot/sheshi/2019.webp', alt: 'Sheshi', title: 'Skanderbeg Square historical', locationKey: 'sheshi' },
          { src: 'fotot/piramida/2025.webp', alt: 'Piramida 2025', title: 'Pyramid of Tirana today', locationKey: 'piramida' },
          { src: 'fotot/xhamia/2025.webp', alt: 'Xhamia', title: 'Et\'hem Bey Mosque', locationKey: 'xhamia' },
          { src: 'fotot/sahati/2025.webp', alt: 'Sahati', title: 'Clock Tower today', locationKey: 'kulla' },
          { src: 'fotot/pazari_i_vjeter/2025.webp', alt: 'Pazar', title: 'Old Bazaar area', locationKey: 'pazari' },
          { src: 'fotot/kalaja_e_tiranes/2025.webp', alt: 'Kalaja', title: 'Tirana Castle today', locationKey: 'kalaja' }
      ];
      
      // Configuration
      const itemsPerPage = 8;
      let currentPage = 1;
      
      // Initialize the gallery
      function initGallery() {
          displayGalleryItems(currentPage);
          setupPagination();
      }
      
      // Display gallery items for the current page
      function displayGalleryItems(page) {
          const gallery = $('#gallery');
          gallery.empty();
          
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, images.length);
          
          for (let i = startIndex; i < endIndex; i++) {
              const image = images[i];
          // In your displayGalleryItems function, modify the gallery.append code:
            gallery.append(`
                <div class="gallery-item" onclick="openGalleryTimeline('${image.locationKey}')">
                    <div class="gallery-image-container">
                        <img src="${image.src}" alt="${image.alt || image.title}" class="gallery-image" loading="lazy" onerror="this.onerror=null;this.src='images/hi.webp';">
                    </div>
                    <div class="image-title">${image.title}</div>
                </div>
            `);
          }
      }
      

      
      // Setup pagination buttons
      function setupPagination() {
          const pagination = $('#pagination');
          pagination.empty();
          
          const totalPages = Math.ceil(images.length / itemsPerPage);
          
          // Previous button
          pagination.append(`
              <button class="pagination-button prev ${currentPage === 1 ? 'disabled' : ''}">
                  <i class="fas fa-chevron-left"></i>
              </button>
          `);
          
          // Page numbers
          const maxVisiblePages = 5;
          let startPage, endPage;
          
          if (totalPages <= maxVisiblePages) {
              startPage = 1;
              endPage = totalPages;
          } else {
              const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
              const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
              
              if (currentPage <= maxPagesBeforeCurrent) {
                  startPage = 1;
                  endPage = maxVisiblePages;
              } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                  startPage = totalPages - maxVisiblePages + 1;
                  endPage = totalPages;
              } else {
                  startPage = currentPage - maxPagesBeforeCurrent;
                  endPage = currentPage + maxPagesAfterCurrent;
              }
          }
          
          // First page and ellipsis if needed
          if (startPage > 1) {
              pagination.append(`
                  <button class="pagination-button" data-page="1">1</button>
              `);
              if (startPage > 2) {
                  pagination.append('<span class="ellipsis">...</span>');
              }
          }
          
          // Page numbers
          for (let i = startPage; i <= endPage; i++) {
              pagination.append(`
                  <button class="pagination-button ${i === currentPage ? 'active' : ''}" data-page="${i}">
                      ${i}
                  </button>
              `);
          }
          
          // Last page and ellipsis if needed
          if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                  pagination.append('<span class="ellipsis">...</span>');
              }
              pagination.append(`
                  <button class="pagination-button" data-page="${totalPages}">
                      ${totalPages}
                  </button>
              `);
          }
          
          // Next button
          pagination.append(`
              <button class="pagination-button next ${currentPage === totalPages ? 'disabled' : ''}">
                  <i class="fas fa-chevron-right"></i>
              </button>
          `);
          
          // Add event listeners
          $('.pagination-button').not('.disabled').on('click', function() {
              const btn = $(this);
              
              if (btn.hasClass('prev')) {
                  currentPage--;
              } else if (btn.hasClass('next')) {
                  currentPage++;
              } else {
                  currentPage = parseInt(btn.data('page'));
              }
              
              displayGalleryItems(currentPage);
              setupPagination();
              
              // Smooth scroll to top of gallery
              $('html, body').animate({
                  scrollTop: $('.gallery-container').offset().top - 20
              }, 300);
          });
      }
      
      // Initialize the gallery
      initGallery();
      // Add this function to your script

  });
  function openGalleryTimeline(locationKey) {
    if (typeof window.goToLocationByKey === 'function') {
        window.goToLocationByKey(locationKey);
        setTimeout(function() {
            if (typeof showTimeline === 'function') showTimeline();
        }, 500);
        return;
    }
    const location = (typeof locations !== 'undefined') ? locations.find(loc => loc.key === locationKey) : null;
    if (location) {
        if (typeof showDestinationInfo === 'function') showDestinationInfo(location);
        if (typeof showTimeline === 'function') showTimeline();
    }
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.add('active');
}

document.querySelector('#close-search').onclick = () =>{
    searchForm.classList.remove('active');
}
