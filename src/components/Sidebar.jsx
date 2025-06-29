import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  FaHome } from "react-icons/fa";
import axios from "axios";
import styled from "styled-components";
import certificateIcon from "../assets/cs.png";
import closeIcon from "../assets/close.png";

const SidebarContainer = styled.nav`
  background-color: #050816;
  padding: 20px;
  width: 200px;
  height: 100vh;
  color: white;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-150%)")};
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 100vh;

  /* Add custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #050816;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ffcc29;
    border-radius: 10px;
    border: 2px solid #050816;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #ffcc29;
  }
  
  /* Add creative animations and styles */
  &:hover {
    transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-90%)")};
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  a {
    text-decoration: none;
    color: #61dafb;
    font-size: 1.2rem;
    margin: 10px 0;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: #fff;
    }
  }

  button {
    background-color: #ffcc29;
    color: #20232a;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #61dafb;
    }
  }
`;

const StyledCsImage = styled.img`
width: 30px;
height: 30px;
`;

const SidebarLink = styled(Link)`
  text-decoration: none;
  color: #050816;
  margin-bottom: 10px;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;

  &:hover {
    background-color: #050816 ;
    opacity: 0.9;
  }
`;

const SidebarTitle = styled.div`
  font-family: 'Lobster', cursive; /* Creative font */
  font-weight: bold;
  font-size: 1.0rem;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #ffcc29; /* Vibrant color */
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;

  /* Add a creative underline effect */
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: #ffcc29; /* Underline color */
    bottom: -8px;
    left: 0;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
  }

  &:hover:after {
    transform: scaleX(1); /* Reveal the underline on hover */
    transform-origin: left;
  }
`;


const SidebarCertifications = styled.ul`
  list-style: none;
  padding: 0;
`;

const SidebarCertificationItem = styled.li`
  margin-bottom: 5px;
`;

const SidebarToggle = styled.div`
  position: sticky;
  top:0rem;
  left: 2rem;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px;
  z-index: 1001;
  border-radius: 50%; /* Circular shape */
  transition: all 0.3s ease-in-out;

  &:hover {
  }
`;

const Sidebar = () => {
  const [certifications, setCertifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const response = await axios.get(
          "https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/certifications"
        );
        setCertifications(response.data);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      }
    }

    fetchCertifications();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
    
    <SidebarToggle onClick={toggleSidebar}>
    {sidebarOpen ? <StyledCsImage src= {closeIcon} /> : <StyledCsImage src={certificateIcon} alt="Certificate Icon" />}
  </SidebarToggle>
  
      <SidebarContainer open={sidebarOpen}>
        <SidebarLink to="/">
          <FaHome /> Home
        </SidebarLink>
        
        <SidebarTitle>Certifications</SidebarTitle>
        <SidebarCertifications>
          {certifications.map((certification) => (
            <SidebarCertificationItem key={certification.title}>
              <SidebarLink
                to={`/certifications/${encodeURIComponent(certification.title)}`}
              >
                {certification.title}
              </SidebarLink>
            </SidebarCertificationItem>
          ))}
        </SidebarCertifications>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
