/* eslint-disable react-hooks/rules-of-hooks */
        // eslint-disable-next-line react/prop-types

  /* eslint-disable react/no-unescaped-entities */
  import {  useEffect, useState } from 'react';
  import styled from 'styled-components';
  import { Link } from 'react-router-dom';
  import { motion,useAnimation  } from 'framer-motion';
import Animation from '../components/Animation';
  import { useInView } from 'react-intersection-observer';
    import { Helmet } from 'react-helmet';
  import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
  import DuckImage from "../assets/duck4.gif";
  import unlock from "../assets/unlock.gif";
  import { toast } from 'react-toastify';
  import Rating from '../components/Rating';
  import '../styles/home.css';
import FAQs from '../components/FAQs';
  import 'react-toastify/dist/ReactToastify.css';
  import {
    FaArrowRight,
    FaUserGraduate,
    FaLaptopCode,
    FaBriefcase,
    FaFilePdf,
    FaCertificate,
  } from 'react-icons/fa';

  import Typed from 'react-typed';

  import profileImage1 from '../assets/Sanjay-Patidar-Profile.webp';
  import profileImage2 from '../assets/profilepic.jpg';


  const HomeContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    background-color: #050816; 
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
  const H1Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top : 0rem;  
    @media (max-width: 768px) {
      display: none;
      margin-top: 0rem;
    
    }
  `;
  const Next = styled.h1`
font-size: 1.1rem;
color: #f3f3f3;
margin-bottom: 1rem;
line-height: 1.4;
text-align: justify;
border-left: 4px solid #5d00ff;
border-right: 4px solid #5d00ff;

padding-left: 2px;
padding-right:2px;
border-radius: 8px;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

  const H1 = styled.h1`
    font-size: 1.5rem;
    font-weight: 900;
    color: #2ecc71;
    margin-right: 0.5rem;
    margin-left: 0.5rem;

    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px; /* Increase letter spacing for a stylish look */
    transform: skew(-5deg); /* Apply a slight skew for a dynamic effect */
  `;
  const Onlyformob = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column; /* Change to column */
    justify-content: center;
    align-items: center;
    margin-top: 0rem;
    margin-bottom: 1rem;
  }
`;
const Onlyforlap = styled.div`

  margin-top: 2rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    display: none;
    margin-top: 0rem;
  
  }
`;
const H2 = styled.h1`
 color: #2ecc71;
   font-size: 3rem;
  margin-bottom: 0rem;
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
const H3 = styled.h1`
 color: #2ecc71;
   font-size: 2rem;
  margin-bottom: 0rem;
  font-weight: 900;
  font-family: 'Playfair Display', serif;
  margin-top: 0rem;
 text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  transform: skew(-5deg); /* Apply a slight skew for a dynamic effect */
  
  @media (max-width: 768px) {
    margin-top: 0rem;
    font-size: 1rem;

  }
`;
  const StyledCreaTeaImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 0px 10px rgba(46, 204, 113, 0.5);
  `;

  const StyledUnlockImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.5rem; 
    margin-left : 0.5rem; 
    box-shadow: 0px 0px 10px rgba(46, 204, 113, 0.5);
  `;

  const StyledSpan = styled.span`
    color: #ffffff;
    font-size: 1.5rem; /* Increase font size for emphasis */
    font-weight: bold;
    letter-spacing: 3px; /* Add more letter spacing */
    text-transform: uppercase;
    text-decoration: underline; /* Add an underline for a decorative touch */
    /* Add any additional styles here */
  `;

  const ProfileTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80%;
    order: 3;
    margin-top: 1rem;
    margin-right: 1rem;
    
    @media (min-width: 768px) {
      order: 2;
      text-align: left;
      margin-top: 0;

    }

    
    @media (max-width: 768px) {
      
      max-width: 90%;

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
  
const ParentContainer = styled.div`
display: flex;
align-items: flex-start; /* Align items to the start of the cross axis */
justify-content: center; /* Center the items along the main axis */
`;


  const BackgroundOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(25, 47, 62, 0.8), rgba(11, 19, 43, 0.8));
    z-index: -1;
  `;


  const ProfileImage = styled(motion.img)`
    width: 300px;
    height:300px;
    margin-top: 1rem;
margin-right: 2rem;
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
      width: 160px;
      height: 160px;
    margin-top : 1rem;
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


  const images = [profileImage1, profileImage2];
  let currentImageIndex = 0;

  const Introduction = styled(motion.p)`
    font-size: 1.5rem;
    line-height: 1.5;
    max-width: 800px;
    text-align: center;
    margin-top : 0rem;
    color: #ffffff; /* White on hover */

    
    .highlight {
      position: relative;
      display: inline-block;
      font-size: 4rem;
      font-weight: bold;
      color: transparent;
      background: linear-gradient(45deg, #ff4081, #00bcd4); /* Gradient highlight */
      background-clip: text;
      -webkit-background-clip: text;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Shadow for depth */
      padding-bottom: 5px;
      margin-bottom: 1px;
      line-height: 4rem;
      /* Animation for the highlight class */
      animation: highlightAnimation 3s ease-in-out infinite;
      @media (max-width: 768px) {
    font-size: 1.5rem;
    line-height: 2rem;

    }
    }


    @keyframes highlightAnimation {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    
    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background: linear-gradient(45deg, #ff4081, #00bcd4); /* Gradient border */
      margin-top: 8px;
      position: relative;
      animation: shimmerAnimation 3s ease-in-out infinite;
    }

    
    @keyframes shimmerAnimation {
      0% {
        background-position: -200% 50%;
      }
      100% {
        background-position: 200% 50%;
      }
    }
    @media (max-width: 768px) {
    margin-top:1rem;
    font-size: 1.5rem;
    margin-bottom: 0rem;

    }
  `;


  const TypedText = styled.span`
    display: block;
    margin-top: 1rem;
    margin-bottom: 1rem;
    text-transform:uppercase;
    font-style: italic;
    font-weight: bold;
    font-size: 3rem;
    background: linear-gradient(45deg, #00bcd4, #2196f3); /* Gradient from turquoise to blue */
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;

    /* Animation for a subtle glow effect */
    animation: glowAnimation 2s ease-in-out infinite, shakeAnimation 3s ease-in-out infinite;

    /* Keyframes for the glow animation */
    @keyframes glowAnimation {
      0% {
        box-shadow: 0 0 5px rgba(0, 188, 212, 0.5), 0 0 10px rgba(0, 188, 212, 0.5); /* Turquoise glow */
      }
      50% {
        box-shadow: 0 0 10px rgba(0, 188, 212, 0.8), 0 0 20px rgba(0, 188, 212, 0.8); /* Stronger glow */
      }
      100% {
        box-shadow: 0 0 5px rgba(0, 188, 212, 0.5), 0 0 10px rgba(0, 188, 212, 0.5); /* Turquoise glow */
      }
    }

    /* Keyframes for a subtle shake animation */
    @keyframes shakeAnimation {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(5px);
      }
    }

    @media (max-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 1rem;

    }

    @media (max-width: 900px) {
      font-size: 1.2rem;
      margin-bottom: 1rem;

    }

    /* Change the color of the typing text */
    @media (prefers-color-scheme: dark) {
      color: #51D5FF; /* Bright yellow in dark mode */
    }

    @media (prefers-color-scheme: light) {
      color: #ffffff; /* Deep orange in light mode */
    }
  `;

  const ActionsContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    
    gap: 1rem;
    margin-top: 1rem;
    @media (max-width: 768px) {
    
    box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
    }
  `;

  const ActionLink = styled(Link)`
    position: relative;
    overflow: hidden;
    background: linear-gradient(45deg, #ff6f00, #ffcc80);
    color: #1a1a1a;
    padding: 0.6rem 0.8rem;
    border: 2px solid #ff6f00;
    border-radius: 30px;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    transition: background 0.3s, transform 0.3s, box-shadow 0.3s, color 0.3s;
    cursor: pointer;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: linear-gradient(to bottom right, #8a2be2, #4a90e2);
      color: #fff;
      transform: translateY(-7px);
      box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.5);
    }

    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(45deg, #ff6f00, #ffcc80);
      border-radius: 30px;
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s;
    }

    &:hover:before {
      transform: scaleX(1);
      transform-origin: bottom left;
    }

    &:after {
      content: 'Explore'; /* Display better text here */
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 1rem;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
    }

    &:hover:after {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
  `;
  const Subtitle = styled.p`
    font-size: 1.4rem;
    color: #ccc;
    margin-top: 2rem;
    margin-bottom:1rem;
    padding: 0.5rem 1rem;
    border: 2px solid #ccc;
    border-radius: 20px;
    
    @media (max-width: 768px) {
      font-size: 1rem;

    }
  `;

  const SubtitleLink = styled.a`
    color: #ffcc80;
    text-decoration: none;
    position: relative;
    transition: color 0.3s;

    &:hover {
      color: #ff6f00;

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: linear-gradient(45deg, #ff6f00, #ffcc80);
        bottom: 0;
        left: 0;
        transform: scaleX(0);
        transform-origin: bottom center;
        transition: transform 0.3s;
      }
    }
  `;



  const Tooltip = styled.div`
  position: absolute;
    top: -12px;
  border: 2px solid #ff6b6b;

  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

  const SocialIconsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
  @media (max-width: 768px) {
  display: none;
  }
`;
const RatingStyle =styled.div `
margin-top : 5rem;
margin-left: 1rem;
@media (max-width: 768px) {
margin : 0rem; 
margin-left: 0rem;
margin-top : 0rem;

 }
`;

const socialButtons = [
  { icon: <FaLinkedin />, label: "LinkedIn", link: "https://www.linkedin.com/in/sanjay-patidar-25b580292" },
  { icon: <FaGithub />, label: "GitHub", link: "https://github.com/hello-developer-sanjay" },
  { icon: <FaTwitter />, label: "Twitter", link: "#" },
  { icon: <FaInstagram />, label: "Instagram", link: "https://www.instagram.com/patidarsanju.io" },
];

const SocialIcon = styled(motion.a)`
  display: flex;
  align-items: center;
  margin-top:1rem;
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
    margin-bottom: 1rem; /* Change margin-right to margin-bottom */
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




  const Home = () => {
   
    const [animationEnabled, setAnimationEnabled] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);


    const [imageAnimated] = useState(false);
    const [contentAnimated, setContentAnimated] = useState(false);
    const controlsImage = useAnimation();
    const controlsContent = useAnimation();
    const controlsContents = useAnimation();
  
    const [inViewImage] = useInView();
    const [whyImageAnimated, setWhyImageAnimated] = useState(false);
    const [learnImageAnimated, setLearnImageAnimated] = useState(false);
    const controlsWhyImage = useAnimation();
    const controlsLearnImage = useAnimation();
    const [  inViewWhyImage] = useInView();
    const [ inViewLearnImage] = useInView();
  
    const [ inViewContent] = useInView();
    useEffect(() => {
   

      if (inViewWhyImage && !whyImageAnimated) {
        controlsWhyImage.start({
          scale: [0.8, 1.2, 1],
          rotateY: [0, 360],
          opacity: [0, 1],
          transition: {
            duration: 2,
            ease: 'easeInOut',
            bounce: 0.5,
          },
        });
        setWhyImageAnimated(true);
      }
  
      if (inViewLearnImage && !learnImageAnimated) {
        controlsLearnImage.start({
          scale: [0.8, 1.2, 1],
          rotateY: [0, 360],
          opacity: [0, 1],
          transition: {
            duration: 2,
            ease: 'easeInOut',
            bounce: 0.5,
          },
        });
        setLearnImageAnimated(true);
      }
  
      if (inViewContent && !contentAnimated) {
        controlsContent.start((index) => ({
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 1.5,
            delay: index * 0.2,
            type: 'spring',
            stiffness: 100,
            bounce: 0.5, 
          },
        }));
        setContentAnimated(true);
      }
      
      if (inViewContent && !contentAnimated) {
        controlsContents.start((index) => ({
          y: 0,
          opacity: 1,
          rotate: [0, (index % 2 === 0 ? 360 : -360)],
          transition: {
            duration: 1.5,
            delay: index * 0.2,
            type: 'spring',
            stiffness: 100,
          },
        }));
        setContentAnimated(true);
      }
    }, [controlsImage, controlsWhyImage,controlsContents, inViewWhyImage, controlsLearnImage, inViewLearnImage, whyImageAnimated, learnImageAnimated, inViewImage, controlsContent, inViewContent, imageAnimated, contentAnimated]);
  
  

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
  


  
  
  useEffect(() => {
      // Display an info toast message
      toast.info("Sit tight! Enjoy smooth transitions as you explore my portfolio. Each page is carefully crafted for a seamless experience.", {
        position: "bottom-right", // Set toast position
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
      });
    }, []);
    const controlsArray = Array.from({ length: 7 }, () => useAnimation());

    const animateInView = async (index) => {
      await controlsArray[index].start({
        y: 0,
        opacity: 1,
        rotate: [0, (index % 2 === 0 ? 360 : -360)],
        transition: {
          duration: 1.5,
          type: 'spring',
          stiffness: 100,
        },
      });
    };

    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
    useEffect(() => {
      if (inView && animationEnabled) {
        controlsArray.forEach(async (_, index) => {
          await animateInView(index);
        });
        // Disable animation after the first trigger
        setAnimationEnabled(false);
      }
    }, [controlsArray, inView, animationEnabled]);


    
    useEffect(() => {
      // Create a slideshow effect
      const interval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        // Update the profile image
        document.querySelector('.profile-image').src = images[currentImageIndex];
      }, 5000);

      return () => clearInterval(interval);
    }, []);


    const faqData = [
      {
        '@type': 'Question',
        name: 'Who is Sanjay Patidar and what are his notable achievements?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sanjay Patidar is a Software Development Engineer and founder of Zedemy, a serverless learning platform. He developed SmartServe DO, an AI chatbot for LIC Development Officers, and led EduXcel to a top Google ranking through optimized site architecture and MongoDB indexing.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies does Sanjay Patidar specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sanjay specializes in full-stack development with expertise in React.js, Node.js, AWS Lambda, MongoDB, and WebRTC. He builds scalable web applications, leveraging tools like Tailwind CSS, Redux, and Socket.io for efficient and modern solutions.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are some of Sanjay Patidar’s key projects?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sanjay’s key projects include Zedemy, a serverless learning platform with AWS Lambda; SmartServe DO, an AI chatbot with Gemini API integration; ConnectNow, a WebRTC-based video chat app; and EventPoa, an event management system using the MERN stack.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I contact Sanjay Patidar for collaboration or inquiries?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can contact Sanjay Patidar via email at sanjaypatidar.engineer@gmail.com, visit his portfolio at sanjay-patidar.vercel.app, or explore his GitHub at github.com/hello-developer-sanjay for collaboration or inquiries.',
        },
      },
    ];
  
    const structuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Sanjay Patidar | Software Engineer & Web Developer',
        description: 'Portfolio of Sanjay Patidar, a Software Development Engineer specializing in full-stack web development with expertise in React.js, Node.js, AWS, and MongoDB.',
        url: 'https://sanjay-patidar.vercel.app',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://sanjay-patidar.vercel.app',
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
      <HomeContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
  
  <Helmet>
      <html lang="en" />
      <title>Sanjay Patidar | Software Engineer & Founder at Zedemy</title>
      <meta
        name="description"
        content="Portfolio of Sanjay Patidar, Software Engineer and Founder of Zedemy, specializing in full-stack development with React.js, Node.js, and AWS. Explore now."
      />
      <meta
        name="keywords"
        content="Sanjay Patidar, software engineer, web developer, full-stack developer, React.js, Node.js, AWS, MongoDB, Zedemy, SmartServe DO, ConnectNow, EventPoa, portfolio, technology, coding"
      />
      <meta name="author" content="Sanjay Patidar" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://sanjay-patidar.vercel.app" />
      <meta property="og:title" content="Sanjay Patidar | Software Engineer & Founder at Zedemy" />
      <meta
        property="og:description"
        content="Portfolio of Sanjay Patidar, Software Engineer and Founder of Zedemy, specializing in full-stack development with React.js, Node.js, and AWS. Explore now."
      />
      <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/HogwartsEdX/profileImag.jpeg" />
      <meta property="og:image:alt" content="Sanjay Patidar Profile" />
      <meta property="og:url" content="https://sanjay-patidar.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Sanjay Patidar Portfolio" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Sanjay Patidar | Software Engineer & Founder at Zedemy" />
      <meta
        name="twitter:description"
        content="Portfolio of Sanjay Patidar, Software Engineer and Founder of Zedemy, specializing in full-stack development with React.js, Node.js, and AWS. Explore now."
      />
      <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/HogwartsEdX/profileImag.jpeg" />
      <meta name="twitter:site" content="@sanjaypatidar" />
      <meta name="twitter:creator" content="@sanjaypatidar" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
    
    
          <BackgroundOverlay />
        <FlexContainer>

        <ProfileImageContainer>

        <ParentContainer>

    <ProfileImage
      src={profileImage1}
      alt="Sanjay Patidar"
      initial={{ y: -100, opacity: 0, filter: 'blur(10px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
      className={`profile-image ${imageLoading ? 'loading' : ''}`}
      onLoad={() => {
        console.log("Image loaded successfully!");
        setImageLoading(false);
      }}
      onError={() => {
        console.error("Error loading image!");
        setImageLoading(true);
      }}
    />

   
<SocialIconsContainer>
      {socialButtons.map((button, index) => (
        <SocialIconWrapper key={index} icon={button.icon} label={button.label} link={button.link} />
      ))}
    </SocialIconsContainer>
      <RatingStyle> <Rating/></RatingStyle>    

      </ParentContainer>

      <Onlyforlap>
  

<Next>
  Write an Email to Sanjay Patidar | Web Developer | India

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
    🔗 <span className="light">Sanjay Patidar Github Profile : </span>{' '}
    <a href="https://github.com/hello-developer-sanjay"style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }} id="githubIDforlap" target="_blank">github.com/hello-developer-sanjay</a>
    {' '} | OR | {' '}
    <button onClick={copyGithubIDforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy Github ID</button>
  </Next>
  
  
  <Next>
    🔗 <span className="light">Sanjay Patidar Linkedin Profile : </span>{' '}
    <a href="https://www.linkedin.com/in/sanjay-patidar"style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }} id="linkedinIDforlap" target="_blank">www.linkedin.com/in/sanjay-patidar</a>
    {' '} | OR | {' '}
    <button onClick={copyLinkedinIDforlap} style={{ marginLeft: '4px', color: '#000501', padding: '2px 4px', border: '2px solid #ff6b6b', borderRadius: '30px', cursor: 'pointer' }}>Copy Linkedin ID</button>
  </Next>
    </Onlyforlap>
          </ProfileImageContainer>

          
        <ProfileTextContainer>


        
        <Introduction
   
  >

       <H2> Hi there! I'm{' '}
          <TypedText>
            <Typed
              strings={['Sanjay Patidar', 'a Web Developer', 'a UI/UX Designer']}
              typeSpeed={80}
              backSpeed={60}
              loop
            />
          </TypedText>
          </H2>  
        <H3>  I create <br/> <span className="highlight">stunning web experiences</span><br/>that captivate users and drive engagement.</H3>
        

             <Animation/>

<Onlyformob>
 


    <Next>
      <span className="light">Based in Indore, Madhya Pradesh | Founder | Developer | Creator | Visionary | Innovator | Leader | <br /> | Entrepreneur | Technologist |</span><br />
    </Next>
    
            </Onlyformob>
        </Introduction>

        </ProfileTextContainer>

        </FlexContainer>
        
          <H1Container>
            <H1>Discover the Key to Enhanced 
  </H1>
            <h1 className="text-4xl font-semibold text-blue-600 flex items-center creativity">
              <StyledSpan className="text-white-600">Pro</StyledSpan>
              <StyledCreaTeaImage src={DuckImage} alt="CreaTea" className="mx-2" />
              <StyledSpan className="text-green-600">tivity</StyledSpan>
            </h1>
              <H1> Partner with Me to 
                
            <StyledUnlockImage src={unlock} alt="Unlock" className="mx-2" />
              
              
              Your Full Potential !
  </H1>
          </H1Container>
          
      
    
        <ActionsContainer>
        {[
          { to: "/skills", text: "Explore My Skills", icon: <FaUserGraduate /> },
          { to: "/education", text: "My Education", icon: <FaUserGraduate /> },
          { to: "/projects", text: "Discover My Projects", icon: <FaLaptopCode /> },
          { to: "/certifications", text: "Explore Certifications", icon: <FaCertificate /> },
          { to: "/experiences", text: "View My Experiences", icon: <FaBriefcase /> },
          { to: "/resume", text: "Download Resume", icon: <FaFilePdf /> },
          { to: "/contact", text: "Contact Me", icon: <FaArrowRight /> },
        ].map((link, index) => (
          <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={controlsArray[index]}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <ActionLink to={link.to} ref={ref} onClick={() => animateInView(index)}>

              {link.icon}
              {link.text}
            </ActionLink>
          </motion.div>
        ))}
      </ActionsContainer>
  
        <Subtitle>
          Want to know more? Check out my <SubtitleLink href="https://zedemy.vercel.app/explore">Blogs on Zedemy</SubtitleLink> for tech insights and tutorials.
        </Subtitle>
        

<FAQs/>
      </HomeContainer>
    );
  };

  export default Home;
