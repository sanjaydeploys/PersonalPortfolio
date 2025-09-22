// tree.js - Collapsible & Hover Notes
document.addEventListener('DOMContentLoaded', function () {
  const nodes = document.querySelectorAll('.leetcode-tree .node');

  nodes.forEach(node => {
    node.addEventListener('click', function (e) {
      e.stopPropagation();
      const parentLi = node.parentElement;
      parentLi.classList.toggle('active');
    });
  });
});
