import  { useEffect } from 'react';
import profileImage1 from '../assets/ssss.webp';
import { Helmet } from 'react-helmet';
import Review from './Review';
import Rating from '../components/Rating';

import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence,  } from "framer-motion";
import { FaLinkedin,FaTwitter, FaInstagram, FaGithub, FaUsers } from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';

const FooterContainer = styled(motion.footer)`
   position: relative;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 20px;
  overflow: hidden;
  background-color: #050816;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
  
  /* Create a complex and artistic background pattern */
  background: 
    radial-gradient(ellipse at center, rgba(5, 8, 22, 0.15) 0%, rgba(5, 8, 22, 0) 30%, rgba(5, 8, 22, 0.4) 50%, rgba(5, 8, 22, 0) 70%, rgba(5, 8, 22, 0.15) 100%),
    linear-gradient(90deg, #010102, #010204);
  
  /* Optional: Add animation or transition properties for a dynamic effect */
  transition: background 0.3s ease-in-out;
`;


const BorderLineTop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  height: 4px;
  background: linear-gradient(to right, #ffbb00, #e85d04);
  background-size: 200% 100%;
  box-shadow: 0 0 10px rgba(232, 93, 4, 0.8);
  animation: gradientAnimation 2s linear infinite;
  @keyframes gradientAnimation {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const BorderLineBottom = styled(BorderLineTop)`
  top: auto;
  bottom: 0;
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const Tooltip = styled.div`
position: absolute;
top: -40px;
border: 2px solid #ff6b6b;

left: 50%;
transform: translateX(-50%);
background-color: #333;
color: #fff;
padding: 8px 12px;
border-radius: 8px;
font-size: 14px;
font-weight: bold;
opacity: ${props => (props.visible ? 1 : 0)};
transition: opacity 0.3s ease;
z-index: 999;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SocialIconWrapper = ({ icon, label, link }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setIsTooltipVisible(true)} onMouseLeave={() => setIsTooltipVisible(false)}>
      <SocialIcon
        color={icon.props.color}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {icon}
      </SocialIcon>
      <Tooltip visible={isTooltipVisible}>{label}</Tooltip>
    </div>
  );
};
const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.8),
                0 0 30px rgba(255, 255, 255, 0.8);
  }
`;

const CatchyMessage = styled(motion.p)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  color: white;
  word-wrap: break-word;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }

  /* Add a little bounce animation */
  animation: ${bounceAnimation} 1s infinite;

 
  /* Combine animations */
  animation: ${bounceAnimation} 1s infinite, ${fadeIn} 1s ease-in-out;
`;
const SocialIconsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialIcon = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.color || '#ff6347'};
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    background 0.3s ease;

  &:hover {
    transform: scale(1.2) rotate(360deg);
    background: ${props => props.color || '#e74c3c'};
  }

  @media (max-width: 768px) {
    width: 3.5rem;
    height: 3.5rem;
  }

  &:not(:last-child) {
    margin-right: 1rem;
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0)
    );
    transform: translateY(100%);
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 50%;
  }

  &:hover:before {
    transform: translateY(0);
  }

  /* Add a heartbeat animation for extra flair */
  animation: heartbeat 1.5s infinite;

  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  overflow : hidden;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  width: 100%;
  max-width: 500px;

    border: 2px solid #ff6b6b; 

`;

const ContactInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 5px;
  width: 90%;
  font-size: 1rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s ease;

  &:hover, &:focus {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;



const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;
const ProfileImageContainer = styled.div`
  flex-shrink: 0;

  @media (min-width: 768px) {
    order: 1;
    margin-right: 2rem;

    align-self: flex-start; 
  }
  
`;
const ProfileImage = styled(motion.img)`
  width: 350px;
  height: 350px;
  margin-top: 2rem;
  margin-left: 2rem;

  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.8), 0 0 20px rgba(255, 165, 0, 0.6);
  transform-origin: center;
  animation: heartbeat 1.5s infinite, rotateAndGlow 8s infinite, bounce 2s alternate infinite;

  &.loading {
    border: 2px solid transparent;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      z-index: 1;
      border-radius: 50%;
      border: 2px solid #fff; // Change the color as needed
      animation: loadingAnimation 1.5s linear infinite;
    }

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 100%;
      border-left: 2px dashed #fff; // Change the color as needed
      animation: loadingLineAnimation 1.5s linear infinite;
    }
  }

  @keyframes loadingAnimation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loadingLineAnimation {
    0% {
      height: 0;
    }
    50% {
      height: 100%;
    }
    100% {
      height: 0;
    }
  }




  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  margin-top : 2rem;
    margin-left: 3rem;

}

  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes rotateAndGlow {
    0%, 100% {
      transform: rotate(0deg) scale(1);
      box-shadow: 0 0 10px rgba(255, 165, 0, 0.8), 0 0 20px rgba(255, 165, 0, 0.6);
    }
    25% {
      transform: rotate(90deg) scale(1.2);
      box-shadow: 0 0 15px rgba(255, 165, 0, 0.9), 0 0 30px rgba(255, 165, 0, 0.7);
    }
    50% {
      transform: rotate(180deg) scale(1);
      box-shadow: 0 0 10px rgba(255, 165, 0, 0.8), 0 0 20px rgba(255, 165, 0, 0.6);
    }
    75% {
      transform: rotate(270deg) scale(1.2);
      box-shadow: 0 0 15px rgba(255, 165, 0, 0.9), 0 0 30px rgba(255, 165, 0, 0.7);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-15px);
    }
  }
`;



const ContactTextArea = styled.textarea`
  padding: 1.5rem;
  border: none;
  border-radius: 10px;
  width: 100%;
  resize: vertical;
  font-size: 1rem;
  color: #fff;
  background-color: #1a1a1a;
  transition: box-shadow 0.3s ease;

  &::placeholder {
    color: #666;
  }

  &:hover, &:focus {
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    animation: pulse 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
`;
const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ffbb00;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e85d04;
  }
`;

const QueryInput = styled(ContactTextArea)`
  // Additional styling for query input
`;
const QueryButton = styled(SubmitButton)`
  // Base styles from SubmitButton
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 6px 10px;
  font-size: 1.3rem;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  transition: background 0.3s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  // Additional styling specific to QueryButton
  margin-top: 2rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  // Shining gradient border effect
  border: 2px solid transparent;
  background-clip: padding-box;
  background-image: linear-gradient(135deg, #e74c3c, #3498db);
  transition: border 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #2c3e50, #2c3e50);
    transform: translateY(-3px) scale(1.05);
    border: 2px solid #e74c3c;
  }

  // Add a subtle pulse animation on hover
  &:hover:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: pulse 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;
const Next = styled.h1`
font-size: 1.1rem;
color: #f3f3f3;
margin-bottom: 1.5rem;
line-height: 1.4;
text-align: justify;
border-left: 4px solid #5d00ff;
border-right: 4px solid #5d00ff;

padding-left: 1px;
padding-right:1px;
border-radius: 8px;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Onlyforlap = styled.div`

  margin-top: 2rem;
  margin-bottom: 1rem;
margin-right : 0.2rem;
margin-left: 0.2rem;

  @media (max-width: 768px) {
    margin-top: 0rem;
  
  }
`;



const Footer = () => {
  const catchyMessages = [
    "Let's Bring Your Vision to Life! Get in Touch with Sanjay Patidar  "



  ];
  const copyContactNumberforlap = () => {
    const contactNumberforlap = document.getElementById('contactNumberforlap');
    const range = document.createRange();
    range.selectNode(contactNumberforlap);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Contact number copied ! Please use this contact number responsibly for legitimate purposes only. Illegal activities or unauthorized promotion are strictly prohibited. ');
  };
  const copyInstaIDforlap = () => {
    const instaIDforlap = document.getElementById('instaIDforlap');
    const range = document.createRange();
    range.selectNode(instaIDforlap);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Instagram ID copied ! Note: By copying this Instagram ID, you agree to use it for legitimate purposes only. Unauthorized promotion or misuse of this ID is strictly prohibited. ');
  };


  
  

  const copyGithubIDforlap = () => {
    const githubID = document.getElementById('githubIDforlap');
    const range = document.createRange();
    range.selectNode(githubID);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Github Link copied ! Reminder: By copying this link to Github Profile, you can access valuable projects and insights. . ');
  };
  const copyLinkedinIDforlap = () => {
    const linkedinID = document.getElementById('linkedinIDforlap');
    const range = document.createRange();
    range.selectNode(linkedinID);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Linkedin Profile copied ! Reminder: By copying this link to Linkedin Profile, you can access valuable projects and insights. . ');
  };
  const copyEduIDforlap = () => {
    const eduIDforlap = document.getElementById('eduIDforlap');
    const range = document.createRange();
    range.selectNode(eduIDforlap);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('EduXcel website link copied ! Note: By copying this website link,you can access valuable Tech insights. . ');
  };

 

useEffect(() => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        toast.info(
          "Hey there! If you have feedback or a question for the admin, feel free to submit them separately. We appreciate your input!",
          {
            position: "top-right", 
            autoClose: 10000, 
            hideProgressBar: false, 
            closeOnClick: true, 
            pauseOnHover: true, 
            draggable: true, 
            progress: undefined,
            style: {
              background: "#487503", 
              color: "#fff", 
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)", 
              borderRadius: "10px", 
            },
          }
        );
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  const footerElement = document.getElementById("footer");

  if (footerElement) {
    observer.observe(footerElement);
  }

  return () => {
    if (footerElement) {
      observer.unobserve(footerElement);
    }
  };
}, []); // Make sure to i
  const getRandomCatchyMessage = () =>
    catchyMessages[Math.floor(Math.random() * catchyMessages.length)];

  const socialButtons = [
    { icon: <FaLinkedin />, label: "LinkedIn", link: "https://www.linkedin.com/in/sanjay-patidar-25b580292" },
    { icon: <FaGithub />, label: "GitHub", link: "https://github.com/hello-developer-sanjay" },
    { icon: <FaTwitter />, label: "Twitter", link: "#" },
    { icon: <FaInstagram />, label: "Instagram", link: "https://www.instagram.com/sanjay_patidar_mcmxcviii" },
  ];
  const [imageLoading, setImageLoading] = useState(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const feedback = formData.get("message");
    const query = formData.get("query");

    if (!name || !email) {
      toast.error("Please provide your name and email.");
      return;
    }

    if (!feedback && !query) {
      toast.error("Please provide either feedback or a query.");
      return;
    }

    try {
let endpoint = "submit-feedback";
      let successMessage = "Feedback submitted successfully! Thank you for your feedback.";

      if (query) {
        endpoint = "submit-query";
        successMessage = "Query sent! Await our swift reply, tailored just for you.";
      }

      const response = await fetch(`https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          feedback: feedback || query,
          query,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(successMessage);
      } else {
        console.error("Error submitting feedback/query");
        toast.error("Error submitting feedback/query. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting feedback/query:", error);
      toast.error("Error submitting feedback/query. Please try again later.");
    }
  };

  return (
    <FooterContainer id="footer">
  <Helmet>
      <title> Contact Sanjay Patidar | Web Developer & UI/UX Designer | Educated at Jawahar Navodaya Vidyalaya and Chandigarh University | Neemuch | Indore | Delhi | Bangalore | Mandsaur | India (458220) | Top Web Developer in India| Contact for Cutting-edge Digital Solutions and Collaborative Projects</title>
        <meta
          name="description"
          content="Contact Sanjay Patidar | Web Developer & UI/UX Designer | Educated at Jawahar Navodaya Vidyalaya and Chandigarh University | Neemuch | Indore | Delhi | Bangalore | Mandsaur | India (458220) | Top Web Developer in India| Contact for Cutting-edge Digital Solutions and Collaborative Projects.Discover the remarkable journey of Sanjay Patidar, a dedicated and passionate individual excelling in the realms of web development and UI/UX design. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design. Based in Indore, Madhya Pradesh, Sanjay serves clients across India, including	Chandigarh, Punjab, Mumbai,Maharashtra, Bangalore,Karnataka, Delhi, Kolkata, West Bengal, Chennai, Tamil Nadu, Hyderabad, Telangana, Pune, Ahmedabad, Gujarat, Jaipur, Rajasthan, Lucknow, Uttar Pradesh, Bhopal, Nagpur, Visakhapatnam, Andhra Pradesh, Kochi, Kerala, Guwahati, Assam, Bhubaneswar, Odisha, Dehradun, Uttarakhand, Raipur, Chhattisgarh,  and beyond."
        />
        <meta name="keywords" content="Sanjay Patidar, contact, collaboration, form submission, admin details, web developer , full stack web developer , cutting edge tech, Sanjay serves clients across India, including	Chandigarh, Punjab, Mumbai,Maharashtra, Bangalore,Karnataka, Delhi, Kolkata, West Bengal, Chennai, Tamil Nadu, Hyderabad, Telangana, Pune, Ahmedabad, Gujarat, Jaipur, Rajasthan, Lucknow, Uttar Pradesh, Bhopal, Nagpur, Visakhapatnam, Andhra Pradesh, Kochi, Kerala, Guwahati, Assam, Bhubaneswar, Odisha, Dehradun, Uttarakhand, Raipur, Chhattisgarh,  and beyond" />
        <meta property="og:title" content="Contact Sanjay Patidar | Web Developer & UI/UX Designer | Educated at Jawahar Navodaya Vidyalaya and Chandigarh University | Neemuch | Indore | Delhi | Bangalore | Mandsaur | India (458220) | Top Web Developer in India| Contact for Cutting-edge Digital Solutions and Collaborative Projects" />
        <meta property="og:description" content="Contact Sanjay Patidar | Web Developer & UI/UX Designer | Educated at Jawahar Navodaya Vidyalaya and Chandigarh University | Neemuch | Indore | Delhi | Bangalore | Mandsaur | India (458220) | Top Web Developer in India| Contact for Cutting-edge Digital Solutions and Collaborative Projects.Discover the remarkable journey of Sanjay Patidar, a dedicated and passionate individual excelling in the realms of web development and UI/UX design. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design. Based in Indore, Madhya Pradesh, Sanjay serves clients across India, including	Chandigarh, Punjab, Mumbai,Maharashtra, Bangalore,Karnataka, Delhi, Kolkata, West Bengal, Chennai, Tamil Nadu, Hyderabad, Telangana, Pune, Ahmedabad, Gujarat, Jaipur, Rajasthan, Lucknow, Uttar Pradesh, Bhopal, Nagpur, Visakhapatnam, Andhra Pradesh, Kochi, Kerala, Guwahati, Assam, Bhubaneswar, Odisha, Dehradun, Uttarakhand, Raipur, Chhattisgarh,  and beyond." />
        <meta property="og:url" content="https://sanjay-patidar.vercel.app/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/skillsImage.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Sanjay Patidar | Web Developer & UI/UX Designer | Educated at Jawahar Navodaya Vidyalaya and Chandigarh University | Neemuch | Indore | Delhi | Bangalore | Mandsaur | India (458220) | Top Web Developer in India| Contact for Cutting-edge Digital Solutions and Collaborative Projects" />
        <meta name="twitter:description" content="Contact Sanjay Patidar | Web Developer & UI/UX Designer | Educated at Jawahar Navodaya Vidyalaya and Chandigarh University | Neemuch | Indore | Delhi | Bangalore | Mandsaur | India (458220) | Top Web Developer in India| Contact for Cutting-edge Digital Solutions and Collaborative Projects. Discover the remarkable journey of Sanjay Patidar, a dedicated and passionate individual excelling in the realms of web development and UI/UX design. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design. Based in Indore, Madhya Pradesh, Sanjay serves clients across India, including	Chandigarh, Punjab, Mumbai,Maharashtra, Bangalore,Karnataka, Delhi, Kolkata, West Bengal, Chennai, Tamil Nadu, Hyderabad, Telangana, Pune, Ahmedabad, Gujarat, Jaipur, Rajasthan, Lucknow, Uttar Pradesh, Bhopal, Nagpur, Visakhapatnam, Andhra Pradesh, Kochi, Kerala, Guwahati, Assam, Bhubaneswar, Odisha, Dehradun, Uttarakhand, Raipur, Chhattisgarh,  and beyond." />
        <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/skillsImage.png" />
        <script type="application/ld+json">
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
           "https://sanjay-patidar.vercel.app/projects",
                        "https://eduxcel.vercel.app/signup",
                        "https://sanjay-patidar.vercel.app/projects/all",
                                   "https://sanjay-patidar.vercel.app/skills",
                                   "https://sanjay-patidar.vercel.app/education",
                                   "https://sanjay-patidar.vercel.app/certifications",
                                              "https://sanjay-patidar.vercel.app/resume",
                                              "https://sanjay-patidar.vercel.app/contact"



         ]
   

       })}
     </script>
      </Helmet>
      <BorderLineTop
        initial={{ width: 0 }}
        animate={{ width: "80%" }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <CatchyMessage>
        {getRandomCatchyMessage()}
      </CatchyMessage>

      <AnimatePresence>
      <SocialIconsContainer>
      {socialButtons.map((button, index) => (
        <SocialIconWrapper key={index} icon={button.icon} label={button.label} link={button.link} />
      ))}
    </SocialIconsContainer>
      </AnimatePresence>

      <FlexContainer>
      <ProfileImageContainer>
        
        <ProfileImage
  
    src={profileImage1}
    alt="jitendra patidar"
    initial={{ y: -100, opacity: 0, filter: 'blur(10px)' }}
    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
    className={`profile-image ${imageLoading ? 'loading' : ''}`}
    onLoad={() => {
      setImageLoading(false);
    }}
    onError={() => {
      setImageLoading(true); 
    }}
  />
  

          </ProfileImageContainer>
          <Onlyforlap>
<Next>
  📞 Contact  Dr. Sanjay Patidar | Web Developer | Ujjain | Indore<span className="light">📞</span> {' '}
  <button onClick={() => window.location.href = 'tel:+919131743250'} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer', boxShadow: '0px 0px 10px #ffd700' }}>Call Sanjay Patidar</button>
</Next>
<Next>
  Write an Email ✉️ to Sanjay Patidar | Web Developer | India

<button
  onClick={() => window.location.href = 'mailto:sanjay.patidar.eduxcel@gmail.com'}
  style={{
    marginLeft: '4px',
    color: '#000501',
    padding: '2px 4px',
    border: '2px solid #ff6b6b',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0px 0px 10px #ffd700'
  }}
>
  <span role="img" aria-label="Mail" className="slide-in-bounce">✉️</span>
  <span className="mail-text">Email Sanjay Patidar</span>
</button>


</Next>

    <Next>
    📞 Sanjay Patidar <span className="light">Contact | Mobile Number : </span>{' '}
      <a href="tel:+919131743250" id="contactNumberforlap" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>+91 9131743250</a> 📞 | OR |
      
      <button onClick={copyContactNumberforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy Number</button>
    </Next>

    <Next>
  🔗 <span className="light">Sanjay Patidar Instagram ID : </span>{' '}
  <a href="https://www.instagram.com/sanjay_patidar_mcmxcviii"style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }} id="instaIDforlap" target="_blank">sanjay_patidar_mcmxcviii</a>
  {' '} | OR | {' '}
  <button onClick={copyInstaIDforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy Insta ID</button>
</Next>



<Next>
  🔗 <span className="light">Sanjay Patidar Github Profile : </span>{' '}
  <a href="https://github.com/hello-developer-sanjay"style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }} id="githubIDforlap" target="_blank">hello-developer-sanjay</a>
  {' '} | OR | {' '}
  <button onClick={copyGithubIDforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy Github ID</button>
</Next>


<Next>
  🔗 <span className="light">Sanjay Patidar Linkedin Profile : </span>{' '}
  <a href="https://www.linkedin.com/in/sanjay-patidar-25b580292"style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }} id="linkedinIDforlap" target="_blank">sanjay-patidar-25b580292</a>
  {' '} | OR | {' '}
  <button onClick={copyLinkedinIDforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy Linkedin ID</button>
</Next>
<Next>
  🔗 <span className="light">EduXcel :Empowering Careers in Tech </span>{' '}
  <a href="https://eduxcel.vercel.app/"style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }} id="eduIDforlap" target="_blank">https://eduxcel.vercel.app</a>
  {' '} | OR | {' '}
  <button onClick={copyEduIDforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy WebLink</button>
</Next>
<Next>Based in Indore, Madhya Pradesh | Founder | Developer | Creator | Visionary | Creator </Next>
  </Onlyforlap>

  <Rating/>

</FlexContainer>


  

      <ContactForm
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleFormSubmit}
      >
        <ContactInput type="text" name="name" placeholder="Your Name" />
        <ContactInput type="email" name="email" placeholder="Your Email" />
        <ContactTextArea
          name="message"
          rows="5"
          placeholder="Write your feedback here..."
        />
        <QueryInput
          name="query"
          rows="5"
          placeholder="Have a question? Write your query here..."
        />
       <QueryButton type="submit" aria-label="Submit feedback or query form">
        Submit
      </QueryButton>
      </ContactForm>




      <ToastContainer
  className="custom-toast-container"
  position="top-right"
  style={{ marginTop: '100px' }}
/>

<Review/> 

    </FooterContainer>
  );
};

export default Footer;
