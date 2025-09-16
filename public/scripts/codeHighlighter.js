(function () {
  const initializeHighlighters = () => {
    const renderSnippets = () => {
      const wrappers = document.querySelectorAll('.code-snippet-wrapper');
      wrappers.forEach(wrapper => {
        const snippetId = wrapper.id;
        const language = wrapper.getAttribute('data-language') || 'javascript';
        let snippet = wrapper.getAttribute('data-formatted-snippet') || wrapper.getAttribute('data-snippet') || '';
        const codeBlock = wrapper.querySelector('.code-block code');
        if (snippet && codeBlock) {
          try {
            // Format snippet if not pre-formatted
            if (!wrapper.getAttribute('data-formatted-snippet') && typeof prettier !== 'undefined') {
              try {
                snippet = prettier.format(snippet, {
                  parser: language === 'javascript' ? 'babel' : language,
                  plugins: [prettierPlugins.babel],
                  tabWidth: 2,
                  useTabs: false,
                  semi: true,
                  singleQuote: true,
                  trailingComma: 'es5',
                });
                wrapper.setAttribute('data-formatted-snippet', snippet);
              } catch (formatError) {
                console.warn(`[codeHighlighter.js] Prettier formatting failed for snippet ${snippetId}:`, formatError);
              }
            }

            // Update code block content
            codeBlock.textContent = snippet;

            // Apply Prism.js highlighting
            codeBlock.className = `language-${language}`;
            if (typeof Prism !== 'undefined') {
              Prism.highlightElement(codeBlock);
            }
          } catch (error) {
            console.error(`[codeHighlighter.js] Error highlighting snippet ${snippetId}:`, error);
          }
        }
      });
    };

    // Run immediately and listen for DOM changes
    renderSnippets();
    document.addEventListener('DOMContentLoaded', renderSnippets);

    // Observe DOM changes for dynamic snippets (CSR)
    const observer = new MutationObserver(renderSnippets);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Start initialization
  initializeHighlighters();
})();
