import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { RingLoader } from 'react-spinners';
import { useSprings, animated } from '@react-spring/web';

const ProjectsContainer = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a1d, #4a4e69);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
`;

const ProjectsNavigation = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
  margin-bottom: 0rem;
  padding: 0rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
`;

const ProjectsNavList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const ProjectsNavItem = styled.li`
  padding: 0.2rem 0.8rem;
  text-align: center;
  border-radius: 30px;
  transition: transform 0.3s, background-color 0.3s;
  color: #fff;
    border: 2px solid #ff6b6b;

  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.5);
  }
`;

const ProjectsNavLinkContainer = styled(NavLink)`
  text-decoration: none;
  color: inherit;

  &.active {
    color: yellow;
  }
`;

const ProjectsContent = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  border-radius: 20px;
  overflow-y: auto;
  height: calc(100vh - 150px);

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4a4e69, #22223b);
    border-radius: 5px;
  }
`;

const ProjectList = styled.ul`
  list-style: none;
  
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProjectItem = styled(animated.li)`
  padding: 1rem;
  border-radius: 15px;
    border: 2px solid #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  background-clip: padding-box;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
  transform-style: preserve-3d;

  &:hover {
    transform: rotateY(20deg);
  }
`;

const ProjectLogoContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: transform 0.3s;

`;

const ProjectLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 25px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
`;

const ProjectTitle = styled(animated.span)`
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 1rem;
  transition: color 0.3s, transform 0.3s;

  &:hover {
    color: #ff6b6b;
    transform: translateY(-5px);
  }
`;

const TechStackContainer = styled(animated.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  
`;

const TechStackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
  }
`;

const TechStackLogo = styled.img`
  width: 30px;
  height: 30px;
`;

const TechStackName = styled.span`
  color: #fff;
  font-size: 1rem;
`;

const ProjectWebsiteLink = styled.a`
  text-decoration: none;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%);
  transition: transform 0.3s, background 0.5s, box-shadow 0.3s;

  &:hover {
    background-position: 100% 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    filter: hue-rotate(45deg);
  }
`;

const generateSlug = (title) => {
  return title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const techStackLogos = {
  'React.js': 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/logo/react-logo.png',
  'Tailwind CSS': 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/logo/tailwindcss-logo.png',
  'Node.js': 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/logo/node-logo.png',
  'Express.js': 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/logo/express-logo.png',
  'MongoDB': 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/logo/mongoDB-logo.png',
  'AWS S3': 'https://sanjaybasket.s3.ap-south-1.amazonaws.com/logo/aws-logo.png'
};

const Projects = () => {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const projectRefs = useRef([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        let response;
        if (!category || category === 'all') {
          response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/projects/category/all');
        } else {
          response = await axios.get(`https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/projects/category/${category}`);
        }
        setProjects(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setLoading(false);
      }
    }

    fetchProjects();
  }, [category]);

  const [springs, api] = useSprings(projects.length * 4, (i) => ({
    opacity: 0,
    transform: 'translate3d(0,40px,0)',
  }));

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { target } = entry;
          const index = projectRefs.current.findIndex((ref) => ref === target);
          if (index !== -1) {
            api.start((i) => {
              if (i === index * 4 + 0) {
                return { opacity: 1, transform: 'translate3d(0,0px,0)' };
              }
              if (i === index * 4 + 1) {
                return { opacity: 1, transform: 'translate3d(0,0px,0)' };
              }
              if (i === index * 4 + 2) {
                return { opacity: 1, transform: 'translate3d(0,0px,0)' };
              }
              if (i === index * 4 + 3) {
                return { opacity: 1, transform: 'translate3d(0,0px,0)' };
              }
              return {};
            });
            observer.unobserve(target);
          }
        }
      });
    }, { threshold: 0.3 });

    projectRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [api, projects]);

  return (
    <ProjectsContainer>
    <Helmet>
      <title>Sanjay Patidar Projects Portfolio: Web Development, Mobile App Development, UI/UX Design</title>
  <meta name="description" content="Explore the diverse range of projects developed by Sanjay Patidar, showcasing expertise in web development, mobile app development, and various other categories. Discover innovative solutions, unique designs, and successful implementations." />
  <meta name="keywords" content="Sanjay Patidar, projects, web development, mobile app development, innovative projects, technology, programming, coding, software development" />
  <meta name="author" content="Sanjay Patidar" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Sanjay Patidar Projects Portfolio: Web Development, Mobile App Development, UI/UX Design" />
  <meta property="og:description" content="Explore the diverse range of projects developed by Sanjay Patidar, showcasing expertise in web development, mobile app development, and various other categories. Discover innovative solutions, unique designs, and successful implementations." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://sanjay-patidar.vercel.app/projects" />
  <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/skillsImage.png" />
  <meta property="og:image:alt" content="Sanjay Patidar Projects Portfolio: Web Development, Mobile App Development, UI/UX Design" />
  <meta property="og:site_name" content="Sanjay Patidar Projects Portfolio: Web Development, Mobile App Development, UI/UX Design" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Sanjay Patidar Projects Portfolio: Web Development, Mobile App Development, UI/UX Design" />
  <meta name="twitter:description" content="Explore the diverse range of projects developed by Sanjay Patidar, showcasing expertise in web development, mobile app development, and various other categories. Discover innovative solutions, unique designs, and successful implementations." />
  <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/skillsImage.png" />
  <script type="application/ld+json">
       {JSON.stringify({
         '@context': 'http://schema.org',
         '@type': 'ItemList',
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
           "https://eduxcel.vercel.app/",
                        "https://sanjay-patidar.vercel.app/projects",
                        "https://sanjay-patidar.vercel.app/api/projects/details/6505a550d1e96d17df4fe123",
                        "https://sanjay-patidar.vercel.app/api/projects/details/65a4bfcdc63d5aab2ed3cb71",
                        "https://sanjay-patidar.vercel.app/api/projects/details/65a4c4b0c63d5aab2ed3cb73",


         ]
   

       })}
     </script>

</Helmet>


      {loading && (
        <LoadingOverlay>
          <RingLoader color="#13584F" loading={loading} size={150} />
        </LoadingOverlay>
      )}

      <ProjectsNavigation>
        <ProjectsNavList>
          <ProjectsNavItem>
            <ProjectsNavLinkContainer to="/projects/all">
              All Projects
            </ProjectsNavLinkContainer>
          </ProjectsNavItem>
          <ProjectsNavItem>
            <ProjectsNavLinkContainer to="/projects/web">
              Web Projects
            </ProjectsNavLinkContainer>
          </ProjectsNavItem>
          <ProjectsNavItem>
            <ProjectsNavLinkContainer to="/projects/mobile">
              Mobile Projects
            </ProjectsNavLinkContainer>
          </ProjectsNavItem>
          <ProjectsNavItem>
            <ProjectsNavLinkContainer to="/projects/other">
              Other Projects
            </ProjectsNavLinkContainer>
          </ProjectsNavItem>
        </ProjectsNavList>
      </ProjectsNavigation>

      <ProjectsContent>
        {loading ? (
          <p>Loading...</p>
        ) : projects.length > 0 ? (
          <ProjectList>
            {projects.map((project, i) => (
              <ProjectItem
                key={project._id}
                ref={(ref) => (projectRefs.current[i] = ref)}
                style={{ ...springs[i * 4 + 0] }}
              >
                <ProjectLogoContainer>
                  <ProjectLogo src={project.logo} alt={project.title} />
                </ProjectLogoContainer>
                <NavLink to={`/project/${generateSlug(project.title)}`} style={{ textDecoration: 'none' }}>
                  <ProjectTitle style={{ ...springs[i * 4 + 2] }}>{project.title}</ProjectTitle>
                </NavLink>
                <TechStackContainer style={{ ...springs[i * 4 + 3] }}>
                  {Array.isArray(project.techStack) &&
                    project.techStack.map((tech) => (
                      <TechStackItem key={tech}>
                        <TechStackLogo src={techStackLogos[tech]} alt={tech} />
                        <TechStackName>{tech}</TechStackName>
                      </TechStackItem>
                    ))}
                </TechStackContainer>
                {project.websiteLink && (
                  <ProjectWebsiteLink
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </ProjectWebsiteLink>
                )}
              </ProjectItem>
            ))}
          </ProjectList>
        ) : (
          <p>No projects found.</p>
        )}
      </ProjectsContent>
    </ProjectsContainer>
  );
};

export default Projects;
