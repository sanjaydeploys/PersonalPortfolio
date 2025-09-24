(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded - Awe Level Edition v22');

  // Shared utility functions
  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) callback(element);
      else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, interval);
      } else {
        console.warn(`[AdvancedNavbar/Sidebar] Element ${selector} not found after ${maxAttempts} attempts`);
        callback(null);
      }
    };
    check();
  }

  function trapFocus(element) {
    if (!element) return;
    const focusableEls = Array.from(element.querySelectorAll('a[href], button:not([disabled]), [role="button"], input, .nav-search-result-item[role="option"]'));
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];
    const handleKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    element.addEventListener('keydown', handleKey);
    element._focusTrap = handleKey;
    if (first) first.focus();
  }

  function removeFocusTrap(element) {
    if (!element || !element._focusTrap) return;
    element.removeEventListener('keydown', element._focusTrap);
    delete element._focusTrap;
  }

  // Throttle function for scroll handling
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  function initializeNav() {
    const navMenu = document.getElementById('nav-menu-list');
    const navToggle = document.querySelector('.nav-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const links = navMenu?.querySelectorAll('.nav-menu-link');
    const searchBar = navMenu?.querySelector('.nav-search-input');
    const searchClear = navMenu?.querySelector('.nav-search-clear');
    const searchResults = navMenu?.querySelector('.nav-search-results');
    const searchResultCount = navMenu?.querySelector('.nav-search-result-count');
    let linkIndex = [];
    let lastSearchQuery = '';

    // LinkedIn-style scroll behavior
    let lastScrollTop = 0;
    const handleScroll = throttle(() => {
      if (!mainNav || navMenu?.classList.contains('active')) return;
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop && currentScrollTop > 80) {
        mainNav.classList.add('nav-hidden');
      } else {
        mainNav.classList.remove('nav-hidden');
      }
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, 100);
    window.addEventListener('scroll', handleScroll);

    // Simple fuzzy search function
    function fuzzyMatch(str, query) {
      str = str.toLowerCase();
      query = query.toLowerCase();
      let i = 0, j = 0;
      while (i < str.length && j < query.length) {
        if (str[i] === query[j]) j++;
        i++;
      }
      return j === query.length;
    }

    // Debounce function for search
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Build search index
    function buildSearchIndex() {
      linkIndex = [];
      const allLinks = navMenu.querySelectorAll('a.nav-menu-link');
      allLinks.forEach(link => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href');
        let path = [];
        let current = link.parentElement;
        while (current && current !== navMenu) {
          const toggleLink = current.querySelector('.nav-toggle-link');
          if (toggleLink) {
            path.unshift(toggleLink.childNodes[0].textContent.trim());
          }
          current = current.parentElement.closest('.nav-menu-item, .nav-menu-list');
        }
        linkIndex.push({ text, href, path: path.join(' > ') });
      });
    }

    // Perform search with highlighting
    const performSearch = debounce((query) => {
      if (!searchResults || !searchResultCount) return;
      searchResults.innerHTML = '';
      searchResultCount.textContent = '';
      if (searchClear) searchClear.classList.toggle('active', !!query.trim());

      if (!query.trim()) {
        searchResults.classList.remove('active');
        return;
      }

      const spinner = document.createElement('div');
      spinner.className = 'nav-search-spinner active';
      searchResults.parentElement.appendChild(spinner);

      setTimeout(() => {
        const results = linkIndex.filter(item =>
          fuzzyMatch(item.text, query) || item.text.toLowerCase().includes(query.toLowerCase())
        );
        searchResultCount.textContent = results.length ? `${results.length} result${results.length > 1 ? 's' : ''} found` : 'No results found';
        
        if (results.length === 0) {
          const li = document.createElement('li');
          li.className = 'nav-search-result-item';
          li.textContent = 'No results found';
          searchResults.appendChild(li);
        } else {
          results.forEach((result, index) => {
            const li = document.createElement('li');
            li.className = 'nav-search-result-item';
            li.setAttribute('role', 'option');
            li.setAttribute('tabindex', '0');
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const highlightedText = result.text.replace(regex, '<span class="highlight">$1</span>');
            li.innerHTML = `
              <span class="result-title">${highlightedText}</span>
              ${result.path ? `<span class="result-path">${result.path}</span>` : ''}
            `;
            li.addEventListener('click', () => {
              if (result.href && result.href !== '#') {
                window.location.href = result.href;
              }
              closeMenu();
            });
            li.addEventListener('keydown', e => {
              if (e.key === 'Enter') {
                if (result.href && result.href !== '#') {
                  window.location.href = result.href;
                }
                closeMenu();
              }
            });
            searchResults.appendChild(li);
          });
        }
        searchResults.classList.add('active');
        if (spinner.parentElement) spinner.parentElement.removeChild(spinner);
      }, 100);
    }, 200);

    // Reset all submenus on load
    function resetSubmenus(parent = navMenu) {
      const toggles = parent.querySelectorAll('.nav-toggle');
      toggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        const submenu = toggle.querySelector('.subtree');
        if (submenu) {
          submenu.classList.remove('active');
          submenu.style.display = 'none';
          submenu.style.maxHeight = '0px';
          resetSubmenus(submenu);
        }
      });
    }

    // Smooth expand/collapse with dynamic height
    function toggleHeight(element, expand) {
      if (!element) {
        console.warn('[AdvancedNavbar] toggleHeight called with null element');
        return;
      }
      if (expand) {
        element.style.display = 'block';
        element.classList.add('active');
        let totalHeight = element.scrollHeight;
        const nestedSubtrees = element.querySelectorAll('.subtree');
        nestedSubtrees.forEach(subtree => {
          if (subtree.classList.contains('active')) {
            totalHeight += subtree.scrollHeight;
          }
        });
        element.style.maxHeight = `${totalHeight}px`;
        if (window.innerWidth <= 1024 && navMenu) {
          setTimeout(() => {
            navMenu.querySelector('.nav-menu-items').scrollTop = navMenu.scrollHeight;
          }, 500);
        }
      } else {
        element.style.maxHeight = '0px';
        setTimeout(() => {
          element.classList.remove('active');
          element.style.display = 'none';
        }, 500);
      }
    }

    // Open main menu
    function openMenu() {
      if (!navMenu) return;
      navMenu.classList.add('active');
      document.documentElement.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.classList.add('active');
      links.forEach((lnk, i) => {
        setTimeout(() => lnk.classList.add('anim-in'), i * 80 + 100);
      });
      trapFocus(navMenu);
      if (searchBar && lastSearchQuery) {
        searchBar.value = lastSearchQuery;
        performSearch(lastSearchQuery);
      }
    }

    // Close main menu
    function closeMenu() {
      if (!navMenu) return;
      navMenu.classList.remove('active');
      document.documentElement.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
      links.forEach(lnk => lnk.classList.remove('anim-in'));
      resetSubmenus();
      if (searchBar && searchResults) {
        lastSearchQuery = searchBar.value;
        searchBar.value = '';
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        if (searchClear) searchClear.classList.remove('active');
        if (searchResultCount) searchResultCount.textContent = '';
      }
      removeFocusTrap(navMenu);
    }

    // Toggle submenu (generic for any depth)
    function toggleSubmenu(toggleItem, submenu) {
      if (!toggleItem || !submenu) return;
      const isExpanded = toggleItem.getAttribute('aria-expanded') === 'true';
      toggleItem.setAttribute('aria-expanded', !isExpanded);
      toggleHeight(submenu, !isExpanded);
      if (!isExpanded) {
        const subLinks = submenu.querySelectorAll('.nav-sub-link');
        subLinks.forEach((slnk, j) => {
          setTimeout(() => slnk.classList.add('anim-in'), j * 50 + 50);
        });
        if (window.innerWidth <= 1024) {
          const backBtn = submenu.querySelector('.nav-back-btn');
          if (backBtn) backBtn.style.display = 'block';
        }
      } else {
        submenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
        resetSubmenus(submenu);
        if (window.innerWidth <= 1024) {
          const backBtn = submenu.querySelector('.nav-back-btn');
          if (backBtn) backBtn.style.display = 'none';
        }
      }
    }

    // Main menu toggle
    navToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Generic toggle handler for all submenus
    navMenu?.addEventListener('click', (e) => {
      const toggleLink = e.target.closest('.nav-toggle-link');
      const backBtn = e.target.closest('.nav-back-btn button');
      if (toggleLink) {
        e.preventDefault();
        e.stopPropagation();
        const toggleItem = toggleLink.closest('.nav-toggle');
        const submenu = toggleItem?.querySelector(':scope > .subtree');
        if (!submenu) return;

        // Close sibling submenus at the same level
        const parentSubmenu = toggleItem.closest('.subtree') || navMenu;
        const siblingToggles = parentSubmenu.querySelectorAll(':scope > .nav-menu-item.nav-toggle');
        siblingToggles.forEach(sibling => {
          if (sibling !== toggleItem && sibling.getAttribute('aria-expanded') === 'true') {
            sibling.setAttribute('aria-expanded', 'false');
            const siblingSubmenu = sibling.querySelector(':scope > .subtree');
            if (siblingSubmenu) {
              toggleHeight(siblingSubmenu, false);
              siblingSubmenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
              resetSubmenus(siblingSubmenu);
              if (window.innerWidth <= 1024) {
                const siblingBackBtn = siblingSubmenu.querySelector('.nav-back-btn');
                if (siblingBackBtn) siblingBackBtn.style.display = 'none';
              }
            }
          }
        });

        toggleSubmenu(toggleItem, submenu);
      } else if (backBtn) {
        e.preventDefault();
        e.stopPropagation();
        const subtree = backBtn.closest('.subtree');
        const parentToggle = subtree?.closest('.nav-toggle');
        if (parentToggle) {
          toggleSubmenu(parentToggle, subtree);
          parentToggle.querySelector('.nav-toggle-link')?.focus();
        }
      }
    });

    // Sub-link navigation
    const subLinks = navMenu?.querySelectorAll('.nav-sub-link');
    subLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      });
      link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      }, { passive: false });
    });

    // Social link navigation
    const socialLinks = navMenu?.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      });
      link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      }, { passive: false });
    });

    // Search handling
    if (searchBar && searchResults && searchClear && searchResultCount) {
      searchBar.addEventListener('input', () => {
        performSearch(searchBar.value);
      });
      searchBar.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          searchBar.value = '';
          searchResults.classList.remove('active');
          searchResults.innerHTML = '';
          searchClear.classList.remove('active');
          searchResultCount.textContent = '';
        } else if (e.key === 'Enter') {
          const firstResult = searchResults.querySelector('.nav-search-result-item[role="option"]');
          if (firstResult) {
            firstResult.click();
          }
        }
      });
      searchClear.addEventListener('click', () => {
        searchBar.value = '';
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        searchClear.classList.remove('active');
        searchResultCount.textContent = '';
        searchBar.focus();
      });
      // Keyboard navigation for results
      searchResults.addEventListener('keydown', e => {
        const items = searchResults.querySelectorAll('.nav-search-result-item[role="option"]');
        if (!items.length) return;
        const current = document.activeElement;
        let index = Array.from(items).indexOf(current);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          index = (index + 1) % items.length;
          items[index].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          index = (index - 1 + items.length) % items.length;
          items[index].focus();
        }
      });
    }

    // Close dropdowns on outside click (desktop)
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && window.innerWidth >= 1025) {
        resetSubmenus();
        if (searchResults) {
          searchResults.classList.remove('active');
          searchResults.innerHTML = '';
          if (searchClear) searchClear.classList.remove('active');
          if (searchResultCount) searchResultCount.textContent = '';
        }
      }
    });

    // Swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;
    navMenu?.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    navMenu?.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 75) closeMenu();
      if (touchEndX - touchStartX > 75 && !navMenu.classList.contains('active')) openMenu();
    }, { passive: true });

    // Link click handling
    links?.forEach(link => {
      if (link.classList.contains('nav-toggle-link')) return;
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      });
      link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      }, { passive: false });
    });

    // ESC key close
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    // Initialize by building search index and resetting submenus
    buildSearchIndex();
    resetSubmenus();
  }

  // Sidebar Script
  (function(){
    console.log('[sidebarToggle.js] Script loaded');

    function initSidebar(sidebarWrapper) {
      const toggleBtn = document.querySelector('.sidebar-toggle-btn');
      if (!toggleBtn || !sidebarWrapper) return;

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebarWrapper.classList.toggle('open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
          trapFocus(sidebarWrapper);
        } else {
          removeFocusTrap(sidebarWrapper);
        }
      });

      sidebarWrapper.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation();
          if (sidebarWrapper.classList.contains('open')) {
            sidebarWrapper.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', false);
            removeFocusTrap(sidebarWrapper);
          }
        });
      });
    }

    function initializeAll() {
      waitForElement('#sidebar-wrapper', initSidebar);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
      initializeAll();
    }
  })();

  // Initialize nav after DOM is ready
  waitForElement('#nav-menu-list', initializeNav);
})();
