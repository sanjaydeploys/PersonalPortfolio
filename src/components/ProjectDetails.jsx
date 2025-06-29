import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import ModalImage from 'react-modal-image';
import { Helmet } from 'react-helmet';

const ProjectDetailsContainer = styled.div`
 padding: 2rem;
background-color: #050816;
min-height: 100vh;
overflow: hidden; 
align-items: center;
`;


const ProjectsContent = styled.div`
background-color: #050816;
padding: 1.5rem;
border-radius: 10px;

box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
overflow-y: auto; 
max-height: calc(100vh - 4rem);
margin-top: 0rem; 

/* Custom scrollbar styles */
&::-webkit-scrollbar {
  width: 10px !important; 
}
&::-webkit-scrollbar-track {
  background: linear-gradient(to right, #050816, #111); 
}
&::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #0070f3, #00ff95); 
  border-radius: 5px !important; 
  border: 3px solid #050816; 
}
&::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, #ff6b6b, #ffdd59); 
  border-color: #111; 
}
`;

const ProjectWebsiteLink = styled.a`
  text-decoration: none;
  color: #ffffff; /* White text */
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  margin-top: 1rem;
  padding: 1rem 1.5rem; 
  border-radius: 50px; 
  background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%); 
  background-size: 200% 200%;
  animation: pulse 2s infinite; 
  transition: transform 0.3s, color 0.3s;

 

  svg {
    margin-right: 1rem;
    fill: #ffffff; /* White color for the icon */
    transition: fill 0.3s;
  }

  &:hover svg {
    fill: #fd1d1d; /* Red color for the icon on hover */
  }

  @keyframes pulse {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;
const ProjectDetailsTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  
  color: #ff6b6b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Pacifico', cursive;
  background-image: linear-gradient(45deg, #ff6b6b, #ffc6c6); /* Gradient background */
  background-clip: text; /* Clip text to background */
  -webkit-background-clip: text; /* For Safari */
  color: transparent; /* Hide the original text color */
  animation: rainbow 3s linear infinite; /* Rainbow animation */

  @keyframes rainbow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }


  @media (max-width: 768px) {
    font-size: 1.3rem;

  }

`;


const ProjectDetailsDescription = styled.p`
  font-size: 1rem; /* Small font size */
  line-height: 1.6;
  margin-top: 1rem;
  margin-left: 10rem;  
  
  position: relative;
  color: #fff; /* Default text color */

  span.highlight {
    color: #0070f3; /* Highlighted text color */
    font-weight: bold; /* Highlighted text bold */
  }


  &:before {
    content: '✨ Project Description ✨'; /* Use decorative stars as labels */
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #0070f3; /* Change the label color */
    font-size: 1.2rem; /* Adjust label font size */
    letter-spacing: 2px; /* Add letter spacing for emphasis */
    text-align: center;
    text-transform: uppercase; /* Uppercase text for emphasis */
  }

  &:after {
    content: '';
    display: block;
    margin-top: 0.5rem;
    height: 2px;
    background: linear-gradient(
      to right,
      #0070f3,
      #ff6b6b,
      #33d9b2,
      #ffad5a
    ); 
    background-size: 300% 100%; /* Control the gradient width */
    animation: gradient-shift 5s linear infinite; /* Animation for gradient shift */
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 0%;
    }
  }
  

  @media (max-width: 768px) {
    margin-left: 0rem;  

  }
`;

const ProjectDetailsImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  justify-content: center;
`;

const ProjectDetailsImage = styled(ModalImage)`
  max-width: 100%;
  max-height: 300px;
  margin-bottom: 1rem;
  border-radius: 10px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProjectDetailsVideoContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
`;

const ProjectDetailsLinkContainer = styled.div`
  margin-top: 0rem;
  text-align: center;
  width:100%;
 
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #f38181, #fce38a); /* Reverse gradient */
    clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 100%);
    z-index: -1;
  }
`;


const ProjectDetailsLinkList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 3rem;
`;

const ProjectDetailsLinkItem = styled.li`
  display: inline-block;
`;
const ProjectDetailsLink = styled.a`
  color: #3498db; /* Dodger Blue color */
  text-decoration: none;
  font-size: 1.3rem;
  position: relative;
  font-weight: 500; /* Medium font weight for balance */
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #2980b9; /* Darker Dodger Blue on hover */
    &:before {
      transform-origin: bottom center;
      transform: scaleX(1);
    }
  }

  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #3498db, #2980b9); /* Gradient underline */
    position: absolute;
    bottom: 0;
    left: 0;
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
`;





const AdditionalDetailsContainer = styled.div`
  width: 100%;
  max-width: 1000px; 
  margin: 0 auto;
  margin-top : 2rem;
`;

const AdditionalDetailsItem = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.4;
  color: #0070f3; 
  font-weight: bold; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Change font-family */
`;

const ProjectDetails = () => {
  const { title } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await axios.get(`https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/project/${title}`);
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    }

    fetchProjectDetails();
  }, [title]);

  const isURL = (str) => {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(str);
  };

  return (
    <ProjectDetailsContainer>
        {project ? (
          <>
           <Helmet>
            <title>Sanjay Patidar Project | {project.title}| EduXcel</title>
            {project.overview && <meta name="description" content={project.overview} />}
          
 <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
 <meta name="twitter:site" content="@sanjaypatidar" />
 <meta name="twitter:creator" content="@sanjaypatidar" />

 <meta name="keywords" content="portfolio, signup , secure, eduxcel ,founder: Sanjay patidar , tech, education, careers, opportunity, personal-portfolio,developer_sanju,sanjay, Sanjay, SANJAY, Sanjay Patidar, SANJAY PATIDAR, SANJAY WEB DEVELOPER, SANJAY DEVELOPER, Full Stack Web Developer, Mern Stack Web Developer, sanjay patidar, sanjay-patidar, professional, web developer portfolio, coder, web development, UI/UX design, Chandigarh University, EduXcel, Indore,contact, developer, programmer, engineer, AI, Artificial Intelligence ,tech enthusiastic, creativity ,creator, work , technology, coding, projects, experiences, resume, cv" />
 <meta name="author" content="Sanjay Patidar" />        <script type="application/ld+json">
       {JSON.stringify({
         '@context': 'http://schema.org',
         '@type': 'Person',
         "name": "Sanjay Patidar",
         "birthDate": "1998-07-01",
         "birthPlace": {
           "@type": "Place",
           "address": {
             "@type": "PostalAddress",
             "addressLocality": "Indore"
           }
         },
         "alumniOf": {
           "@type": "CollegeOrUniversity",
           "name": "Chandigarh University",
           "location": {
             "@type": "Place",
             "address": {
               "@type": "PostalAddress",
               "addressLocality": "Chandigarh",
               "addressRegion": "Punjab",
               "addressCountry": "India"
             }
           }
         },
         "address": [
           {
             "@type": "PostalAddress",
             "addressLocality": "Indore",
             "addressRegion": "Madhya Pradesh",
             "postalCode": "452001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Chandigarh",
             "addressRegion": "Punjab",
             "postalCode": "160001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Mumbai",
             "addressRegion": "Maharashtra",
             "postalCode": "400001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Bangalore",
             "addressRegion": "Karnataka",
             "postalCode": "560001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Delhi",
             "addressRegion": "Delhi",
             "postalCode": "110001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Kolkata",
             "addressRegion": "West Bengal",
             "postalCode": "700001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Chennai",
             "addressRegion": "Tamil Nadu",
             "postalCode": "600001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Hyderabad",
             "addressRegion": "Telangana",
             "postalCode": "500001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Pune",
             "addressRegion": "Maharashtra",
             "postalCode": "411001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Ahmedabad",
             "addressRegion": "Gujarat",
             "postalCode": "380001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Jaipur",
             "addressRegion": "Rajasthan",
             "postalCode": "302001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Lucknow",
             "addressRegion": "Uttar Pradesh",
             "postalCode": "226001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Bhopal",
             "addressRegion": "Madhya Pradesh",
             "postalCode": "462001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Nagpur",
             "addressRegion": "Maharashtra",
             "postalCode": "440001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Visakhapatnam",
             "addressRegion": "Andhra Pradesh",
             "postalCode": "530001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Kochi",
             "addressRegion": "Kerala",
             "postalCode": "682001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Guwahati",
             "addressRegion": "Assam",
             "postalCode": "781001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Bhubaneswar",
             "addressRegion": "Odisha",
             "postalCode": "751001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Dehradun",
             "addressRegion": "Uttarakhand",
             "postalCode": "248001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Raipur",
             "addressRegion": "Chhattisgarh",
             "postalCode": "492001",
             "addressCountry": "India"
           }
         ],
         "worksFor": {
           "@type": "Organization",
           "name": "Eduxcel" 
         },
         "url": "https://sanjay-patidar.vercel.app/",
         "sameAs": [
           "https://www.linkedin.com/in/sanjay-patidar-25b580292/",
           "https://github.com/hello-developer-sanjay",
           "https://www.instagram.com/sanjay_patidar_mcmxcviii/",


                        "https://sanjay-patidar.vercel.app/",
"https://sanjay-patidar.vercel.app/projects",
          "https://sanjay-patidar.vercel.app/project/eduxcel-empowering-careers-in-tech-expert-insights-cutting-edge-education-and-skill-mastery",

          "https://sanjay-patidar.vercel.app/project/property-rent-website-checkhere",

          "https://sanjay-patidar.vercel.app/project/rentride-your-car-rental-platform"

         ]
   

       })}
     </script>
          </Helmet>
            <ProjectDetailsTitle>{project.title}</ProjectDetailsTitle>
            <ProjectsContent>

            {project.links && (
              <ProjectDetailsLinkContainer>
               
                <ProjectDetailsLinkList>
                  {project.links.map((link, index) => (
                    <ProjectDetailsLinkItem key={index}>
                      <ProjectDetailsLink href={link.url} target="_blank">
                        {link.label}
                      </ProjectDetailsLink>
                    </ProjectDetailsLinkItem>
                  ))}
                </ProjectDetailsLinkList>
                {project.websiteLink && (
                  <ProjectWebsiteLink href={project.websiteLink} target="_blank" rel="noopener noreferrer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="18"
                      height="18"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 19a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h2a2 2 0 012 2v8z"
                      />
                    </svg>
                    Visit Website
                  </ProjectWebsiteLink>
                )}
              </ProjectDetailsLinkContainer>
            )}
            {project.description && (
              <ProjectDetailsDescription>
                {project.description.map((desc, index) => {
                  const highlightedText = desc.split(/\^([^]+?)\^/).map((part, i) => {
                    if (i % 2 === 1) {
                      return <span key={i} className="highlight">{part}</span>;
                    }
                    return part;
                  });
                  return (
                    <React.Fragment key={index}>
                      {highlightedText}
                      <br />
                    </React.Fragment>
                  );
                })}
              </ProjectDetailsDescription>
            )}
            {project.additionalDetails && (
              <AdditionalDetailsContainer>
                <h3>Additional Details:</h3>
                {project.additionalDetails.map((detail, index) => (
                  <AdditionalDetailsItem key={index}>
                    {isURL(detail) ? (
                      detail.endsWith('.mp4') ? (
                        <ProjectDetailsVideoContainer>
                          <ReactPlayer
                            url={detail}
                            width="100%"
                            height="100%"
                            controls
                          />
                        </ProjectDetailsVideoContainer>
                      ) : (
                        <ProjectDetailsImageGrid>
                          <ProjectDetailsImage
                            small={detail}
                            large={detail}
                            alt={`Additional Image ${index}`}
                          />
                        </ProjectDetailsImageGrid>
                      )
                    ) : (
                      detail
                    )}
                  </AdditionalDetailsItem>
                ))}
              </AdditionalDetailsContainer>
            )}
            {project.codeSnippets && (
              <div>
                <h3>Code Snippets:</h3>
                {project.codeSnippets.map((snippet, index) => (
                  <pre key={index}>
                    <code>{snippet}</code>
                  </pre>
                ))}
              </div>
            )}
                  </ProjectsContent>

          </>
        ) : (
          <p>Loading project details...</p>
        )}
    </ProjectDetailsContainer>
  );
  
  
};

export default ProjectDetails;
