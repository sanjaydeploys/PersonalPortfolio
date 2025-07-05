import { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { RingLoader } from 'react-spinners';

// Styled Components (matching LicNeemuchPage.jsx)
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: normal;
  animation: pulse 500ms ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

const homePage = memo(() => {
  const [ssrHtml, setSsrHtml] = useState('');
  const [loading, setLoading] = useState(!window.__lic_homepage_DATA__);

  useEffect(() => {
    // Load existing and new scripts dynamically
    const scripts = [
      { src: '/scripts/sidebarToggle.js', defer: true },
      { src: '/scripts/scrollToTop.js', defer: true },
      { src: '/scripts/faqToggle.js', defer: true },
      { src: '/scripts/search.js', defer: true },
      { src: '/scripts/langToggleCaseStudy.js', defer: true },
      { src: '/scripts/audio.js', defer: true },
    ];

    scripts.forEach(({ src, defer }) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = defer;
      document.head.appendChild(script);
    });

    // Handle SSR data
    if (window.__lic_homepage_DATA__) {
      setSsrHtml(document.documentElement.outerHTML);
      setLoading(false);
    } else {
      fetch('https://js2h38fca8.execute-api.ap-south-1.amazonaws.com/prod')
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.text();
        })
        .then((html) => {
          setSsrHtml(html);
          setLoading(false);
          document.dispatchEvent(new Event('DOMContentLoaded'));
        })
        .catch((error) => {
          console.error('[licCaseStudy.jsx] Error fetching SSR HTML:', error);
          setLoading(false);
        });
    }

    // Cleanup
    return () => {
      scripts.forEach(({ src }) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) script.remove();
      });
    };
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <RingLoader color="#22c55e" size={50} />
        <LoadingText>Loading Case  Study...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Layout>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: ssrHtml }} />
      </Content>
    </Layout>
  );
});

export default homePage;
