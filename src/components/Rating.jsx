import { useState, useEffect } from 'react';
import axios from 'axios';

const Starstar = () => {
  const [star, setStar] = useState(() => {
    const storedStar = localStorage.getItem('star');
    return storedStar ? parseFloat(storedStar) : 0;
  });
  const [hoverStar, setHoverStar] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [averageStar, setAverageStar] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/stars');
        const { data } = response;
        setUsersCount(data.length);
        const totalStars = data.reduce((sum, star) => sum + star.star, 0);
        setAverageStar(data.length > 0 ? totalStars / data.length : 0);
      } catch (error) {
        console.error('Error fetching stars:', error);
      }
    };

    fetchData();
  }, []);

  const handleStarClick = async (starIndex) => {
    const newStar = starIndex === star ? 0 : starIndex;
    setStar(newStar);
    localStorage.setItem('star', newStar);
  
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        const randomUserId = Math.random().toString(36).substring(7);
        localStorage.setItem('currentUser', randomUserId);
      }
  
      await axios.post('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/stars', {
        userId: localStorage.getItem('currentUser'),
        star: newStar,
      });
  
      const response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/stars');
      const { data } = response;
      setUsersCount(data.length);
      const totalStars = data.reduce((sum, star) => sum + star.star, 0);
      setAverageStar(data.length > 0 ? totalStars / data.length : 0);
  
      // Update current star display
      setStar(newStar); // Update the current star to the new star
    } catch (error) {
      console.error('Error updating stars:', error);
    }
  };

  const renderStars = (starValue) => {
    const starCount = Math.round(starValue); // Round the star value to the nearest whole number
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < starCount) {
        stars.push(<span key={i} style={{ color: '#ffd700' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#808080' }}>☆</span>);
      }
    }

    return stars;
  };

  const handleStarHover = (starIndex) => {
    setHoverStar(starIndex);
  };

  const handleStarLeave = () => {
    setHoverStar(0);
  };

  return (
    <div
      onMouseLeave={handleStarLeave}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            style={{
              cursor: 'pointer',
              fontSize: '24px', // Adjust size as needed
              color: starValue <= (hoverStar || star) ? '#ffd700' : '#808080', 
            }}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
          >
            {starValue <= (hoverStar || star) ? '★' : '☆'}
          </span>
        );
      })}
      <div style={{ marginTop: '10px' , color: "white"}}>
        {renderStars(averageStar)}
        <span style={{ marginLeft: '10px' }}>{isNaN(averageStar) ? '0.0' : averageStar.toFixed(1)}/5</span>
      </div>
      <p>My Rating: {hoverStar || star}/5</p>
      <p>Overall Rating: {isNaN(averageStar) ? '0.0' : averageStar.toFixed(1)}/5</p>
    </div>
  );
};

export default Starstar;
