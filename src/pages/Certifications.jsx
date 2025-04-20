import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";
import "../styles/Certifications.css";
import { Helmet } from "react-helmet";
import styled from 'styled-components';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const response = await axios.get(
          "https://portfolio-api-5aug.onrender.com/api/certifications"
        );
        setCertifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certifications:", error);
        setLoading(false);
      }
    }

    fetchCertifications();
  }, []);
  
  const override = css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  `;
  const SkillsHeading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  margin-top: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);  

  text-align: center;
  justify-content: center;
  color: #24086C;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #ff5e62, #ff9966);
    position: absolute;
    bottom: -8px;
    left: 0;
    border-radius: 10px;
  }

  &:before {
    content: '🏅  ';
    font-size: 2rem;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;
const faqData = [
  {
    '@type': 'Question',
    name: 'What certifications has Sanjay Patidar earned?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Sanjay Patidar has earned the AWS Cloud Solutions Architect Specialization from Coursera, demonstrating expertise in cloud architecture and serverless solutions.',
    },
  },
  {
    '@type': 'Question',
    name: 'How do Sanjay Patidar’s certifications enhance his projects?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Sanjay’s AWS certification enables him to build scalable, serverless platforms like Zedemy, leveraging AWS Lambda, S3, and API Gateway for efficient solutions.',
    },
  },
  {
    '@type': 'Question',
    name: 'Where can I view Sanjay Patidar’s certification details?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'You can view Sanjay Patidar’s AWS Cloud Solutions Architect certification details on his portfolio at sanjay-patidar.vercel.app/certifications.',
    },
  },
];

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sanjay Patidar | Certifications',
    description: 'Certifications of Sanjay Patidar, Software Engineer and Founder of Zedemy, including AWS Cloud Solutions Architect Specialization.',
    url: 'https://sanjay-patidar.vercel.app/certifications',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://sanjay-patidar.vercel.app/certifications',
    },
    author: {
      '@type': 'Person',
      name: 'Sanjay Patidar',
    },
    publisher: {
      '@type': 'Person',
      name: 'Sanjay Patidar',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData,
  },
];

  return (
    <>
      <Helmet>
      <html lang="en" />
      <title>Sanjay Patidar | Software Engineer & Founder at Zedemy | Certifications</title>
      <meta
        name="description"
        content="Certifications of Sanjay Patidar, Software Engineer and Founder of Zedemy, including AWS Cloud Solutions Architect. Explore now."
      />
      <meta
        name="keywords"
        content="Sanjay Patidar, certifications, AWS Cloud Solutions Architect, software engineer, Zedemy, full-stack developer, cloud architecture, portfolio"
      />
      <meta name="author" content="Sanjay Patidar" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://sanjay-patidar.vercel.app/certifications" />
      <meta property="og:title" content="Sanjay Patidar | Software Engineer & Founder at Zedemy | Certifications" />
      <meta
        property="og:description"
        content="Certifications of Sanjay Patidar, Software Engineer and Founder of Zedemy, including AWS Cloud Solutions Architect. Explore now."
      />
      <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
      <meta property="og:image:alt" content="Sanjay Patidar Profile" />
      <meta property="og:url" content="https://sanjay-patidar.vercel.app/certifications" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Sanjay Patidar Portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Sanjay Patidar | Software Engineer & Founder at Zedemy | Certifications" />
      <meta
        name="twitter:description"
        content="Certifications of Sanjay Patidar, Software Engineer and Founder of Zedemy, including AWS Cloud Solutions Architect. Explore now."
      />
      <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
      <meta name="twitter:site" content="@sanjaypatidar" />
      <meta name="twitter:creator" content="@sanjaypatidar" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
      <SkillsHeading>Sanjay Patidar | Web Developer & UI/UX Designer | Certifications </SkillsHeading>

      <div className="certifications-container">
        {loading ? (
          <RingLoader color="#4b0082" loading={loading} css={override} size={150} />
        ) : (
          certifications.map((certification) => (
            <div key={certification.id} className="certification-card">
              <h3 className="certification-title">{certification.title}</h3>
              <div className="certification-images">
                {certification.imageUrl.map((url, index) => (
                  <img
                    key={index}
                    className="certification-image"
                    src={url}
                    alt={`Certification ${index + 1}`}
                  />
                ))}
              </div>
              <Link
                to={`/certifications/${encodeURIComponent(certification.title)}`}
                className="certification-link"
              >
                Explore More
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Certifications;
