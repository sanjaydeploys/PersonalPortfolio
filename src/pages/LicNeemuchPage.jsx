import { memo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RingLoader } from 'react-spinners';

// Styled Components (matching PostPage.jsx)
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

const LicNeemuchPage = memo(() => {
  const dispatch = useDispatch();
  const [ssrHtml, setSsrHtml] = useState('');
  const [loading, setLoading] = useState(!window.__lic_neemuch_DATA__);

  useEffect(() => {
    // Load scripts dynamically (matching PostPage.jsx)
    const scripts = [
      { src: '/scripts/sidebarToggle.js', defer: true },
      { src: '/scripts/scrollToTop.js', defer: true },
      { src: '/scripts/calculatePremium.js', defer: true },
      { src: '/scripts/faqToggle.js', defer: true },
      { src: '/scripts/carousel.js', defer: true },
    ];

    scripts.forEach(({ src, defer }) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = defer;
      document.head.appendChild(script);
    });

    // Handle SSR data
    if (window.__lic_neemuch_DATA__) {
      setSsrHtml(document.documentElement.outerHTML);
      setLoading(false);
      dispatch({ type: 'FETCH_LIC_NEEMUCH_SUCCESS', payload: window.__lic_neemuch_DATA__ });
    } else {
      fetch('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/lic-neemuch')
        .then((res) => res.text())
        .then((html) => {
          setSsrHtml(html);
          setLoading(false);
          document.dispatchEvent(new Event('DOMContentLoaded'));
        })
        .catch((error) => {
          console.error('[LicNeemuchPage.jsx] Error fetching SSR HTML:', error);
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
  }, [dispatch]);

  if (loading) {
    return (
      <LoadingContainer>
        <RingLoader color="#22c55e" size={50} />
        <LoadingText>Loading LIC Neemuch page...</LoadingText>
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

export default LicNeemuchPage;
