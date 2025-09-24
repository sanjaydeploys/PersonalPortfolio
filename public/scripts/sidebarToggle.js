document.addEventListener('DOMContentLoaded', () => {
      const toggleButton = document.querySelector('.nav-menu-toggle');
      const menuList = document.querySelector('.nav-menu-list');
      const closeButton = document.querySelector('.nav-menu-close');
      const dsaToggle = document.querySelector('.dsa-tree-toggle');
      const dsaMenu = document.querySelector('.dsa-tree-menu');
      const links = document.querySelectorAll('.nav-menu-link:not(.dsa-tree-toggle)');

      toggleButton.addEventListener('click', () => {
        menuList.classList.toggle('active');
        toggleButton.classList.toggle('active');
        document.documentElement.classList.toggle('nav-open');
        toggleButton.setAttribute('aria-expanded', menuList.classList.contains('active'));

        if (menuList.classList.contains('active')) {
          links.forEach((link, index) => {
            setTimeout(() => {
              link.classList.add('anim-in');
            }, index * 100);
          });
        } else {
          links.forEach(link => link.classList.remove('anim-in'));
        }
      });

      closeButton.addEventListener('click', () => {
        menuList.classList.remove('active');
        toggleButton.classList.remove('active');
        document.documentElement.classList.remove('nav-open');
        toggleButton.setAttribute('aria-expanded', 'false');
        links.forEach(link => link.classList.remove('anim-in'));
        dsaMenu.classList.remove('active');
        dsaToggle.classList.remove('active');
      });

      dsaToggle.addEventListener('click', () => {
        dsaMenu.classList.toggle('active');
        dsaToggle.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuList.contains(e.target) && !toggleButton.contains(e.target) && menuList.classList.contains('active')) {
          menuList.classList.remove('active');
          toggleButton.classList.remove('active');
          document.documentElement.classList.remove('nav-open');
          toggleButton.setAttribute('aria-expanded', 'false');
          links.forEach(link => link.classList.remove('anim-in'));
          dsaMenu.classList.remove('active');
          dsaToggle.classList.remove('active');
        }
      });
    });
  </script>
