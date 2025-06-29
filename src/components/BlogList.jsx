import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RingLoader } from 'react-spinners'; // Import the RingLoader component

import '../styles/BlogList.css';
import courseImage1 from '../assets/vs_code_articles.jpg';
import courseImage2 from '../assets/gitarticles.jpg';
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent white background */
  z-index: 9999; /* Ensure it's above other elements */
`;
function BlogList() {
  const [journals, setJournals] = useState([]);
  const { vision } = useParams();
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    async function fetchJournals() {
      try {
        let response;
        if (!vision || vision === 'all') {
          response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/vision/all');
        } else {
          response = await axios.get(`https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/vision/${vision}`);
        }
        if (!response) {
          response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/vision');
        }
        setJournals(response.data);
        setLoading(false); // Set loading to false when data is fetched
        
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    }

    fetchJournals();
  }, [vision]);

  const uniqueCategories = Array.from(new Set(journals.map(journal => journal.vision)));

 


 
  return (
    <div className="course-list">
       {loading && ( // Display loading animation if loading is true
        <LoadingOverlay>
          <RingLoader color="#13584F" loading={loading} size={150} />
        </LoadingOverlay>
      )}
      <div className="course-cards">
        {uniqueCategories.map((vision, index) => {
          const journal = journals.find(journal => journal.vision === vision);
          const image = getImageForVision(vision);
          return (
            <div
              className="course-card"
              key={index} // Use index as key since vision itself is not unique
            
            >
              <Link to={`/${vision}`}>
                <div
                  className="course-image"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                ></div>
                <div className="course-info">
                  <h3>{vision}</h3>
                  <p>{journal.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
  
    </div>
  );
}

// Function to get the image URL for each category
function getImageForVision(vision) {
  switch (vision) {
    case 'vs_code_articles':
      return courseImage1;
    case 'git_articles':
      return courseImage2;
 
    default:
      return ''; 
  }
}

export default BlogList;
