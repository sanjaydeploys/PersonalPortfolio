import  { useEffect, useState } from 'react';
import styled from 'styled-components';
import BlogList from './BlogList.jsx';
import axios from 'axios';
import { Helmet } from "react-helmet";

// Styled Components
const SectionContainer = styled.section`
    position: relative;
    width: 100%;
    min-height: 100vh;
    margin: 0 auto;
    padding: ${props => props.theme.padding};
`;

const SectionTitle = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    margin-top: 2rem;

    font-size:3rem;
    font-weight: bold;
    color: black;
    text-transform: uppercase;
    letter-spacing: 2px;
    line-height: 1.5;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out;


    @media screen and (max-width: 768px) {
        font-size: calc(${props => props.theme.sectionHeadTextSize} * 0.8);
        margin-bottom: 1rem;
        font-size:1.8rem;
    }

    @media screen and (max-width: 480px) {
        font-size: calc(${props => props.theme.sectionHeadTextSize} * 0.6);
        margin-bottom: 0.5rem;
        font-size:1.8rem;

    }
`;

const SectionSubtitle = styled.p`
color: #2ecc71;
   font-size: 2rem;
  margin: 2rem;
  font-weight: 900;
  font-family: 'Playfair Display', serif;
  margin-top: 0rem;
 text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  transform: skew(-5deg); /* Apply a slight skew for a dynamic effect */
  
  @media (max-width: 768px) {
    margin-top: 0rem;
    font-size: 1.5rem;

  }

`;

// Component
const BlogPage = () => {
    const [careerData, setCareerData] = useState([]);

    useEffect(() => {
        async function fetchCareers() {
            try {
                const response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/journals');
                setCareerData(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        }

        fetchCareers();
    }, []); 

    return (
        <SectionContainer>



               <Helmet>
    

    <title>EduXcel | Explore Tech Insights: Featured Blogs | Sanjay Patidar </title>
    <meta name="description" content="Explore a vast array of insightful tech blogs covering topics such as VS Code, Git, programming languages, software development methodologies, cloud computing, cybersecurity, data science, artificial intelligence, machine learning, and more. Dive into in-depth articles written by industry experts, providing valuable insights, tutorials, best practices, and latest updates in the ever-evolving world of technology. Stay ahead in your tech journey with EduXcel's curated selection of featured tech blogs. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design."/>
    
    
    
     <meta property="og:title" content=" EduXcel | Explore Tech Insights: Featured Blogs | Sanjay Patidar" />
     <meta property="og:description" content="Explore a vast array of insightful tech blogs covering topics such as VS Code, Git, programming languages, software development methodologies, cloud computing, cybersecurity, data science, artificial intelligence, machine learning, and more. Dive into in-depth articles written by industry experts, providing valuable insights, tutorials, best practices, and latest updates in the ever-evolving world of technology. Stay ahead in your tech journey with EduXcel's curated selection of featured tech blogs. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design." />
     <meta property="og:type" content="website" />
     <meta property="og:url" content="https://sanjay-patidar.vercel.app/blogs" />
     <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
     <meta property="og:image:alt" content="Sanjay Patidar" />
     <meta property="og:site_name" content="EduXcel | Explore Tech Insights: Featured Blogs | Sanjay Patidar" />
      <link rel="canonical" href="https://sanjay-patidar.vercel.app/blogs" />
    
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="EduXcel | Explore Tech Insights: Featured Blogs | Sanjay Patidar" />
     <meta name="twitter:description" content="Explore a vast array of insightful tech blogs covering topics such as VS Code, Git, programming languages, software development methodologies, cloud computing, cybersecurity, data science, artificial intelligence, machine learning, and more. Dive into in-depth articles written by industry experts, providing valuable insights, tutorials, best practices, and latest updates in the ever-evolving world of technology. Stay ahead in your tech journey with EduXcel's curated selection of featured tech blogs. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design." />
    
     <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
     <meta name="twitter:site" content="@sanjaypatidar" />
     <meta name="twitter:creator" content="@sanjaypatidar" />
    
     <meta name="keywords" content="portfolio, signup , secure, eduxcel ,founder: Sanjay patidar , tech, education, careers, opportunity, personal-portfolio,developer_sanju,sanjay, blogs ,Sanjay, SANJAY, Sanjay Patidar, SANJAY PATIDAR, SANJAY WEB DEVELOPER, SANJAY DEVELOPER, Full Stack Web Developer, Mern Stack Web Developer, sanjay patidar, sanjay-patidar, professional, web developer portfolio, coder, web development, UI/UX design, Chandigarh University, EduXcel, Indore,contact, developer, programmer, engineer, AI, Artificial Intelligence ,tech enthusiastic, creativity ,creator, work , technology, coding, projects, experiences, resume, cv" />
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
    "https://sanjay-patidar.vercel.app/blogs"
             ]
       
    
           })}
         </script>
    
    
        </Helmet>
         
            <SectionTitle>Discover In-Depth Tech Insights: Explore Featured Tech Blogs</SectionTitle>
            <SectionSubtitle>Discover a Rich Repository of Insightful Tech Blogs Covering Topics from VS Code to Git and Beyond</SectionSubtitle>
            <BlogList careerData={careerData} />
        </SectionContainer>
    );
}

export default BlogPage;
