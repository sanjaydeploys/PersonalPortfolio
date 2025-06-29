import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled form components
const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-top : 2rem;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
`;
const ReviewsHeading = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  /* Add any additional styling you prefer */
`;  
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;
const Button = styled.button`
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #ff6b6b, #6078ea);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;



// Styled review list components
const ReviewsWrapper = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
`;

const ReviewItem = styled.li`
  margin-bottom: 10px;
  font-size: 16px;
`;

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false); // State to track submission status

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/comments');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !comment || submitting) return; // Prevent submission while already submitting
    try {
      setSubmitting(true); // Set submitting to true when starting the submission
      const response = await axios.post('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/comments', {
        username,
        comment,
      });
      setReviews([...reviews, response.data]);
      setUsername('');
      setComment('');
    } catch (error) {
      console.error('Error posting review:', error);
    } finally {
      setSubmitting(false); // Set submitting back to false when submission is complete
    }
  };

  return (
    <div>
      <FormWrapper>
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <Label>
            Username:
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Label>
          <Label>
            Comment:
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Label>
          <Button type="submit">{submitting ? 'Submitting Review...' : 'Submit Review'}</Button>
        </form>
      </FormWrapper>
      
      <ReviewsWrapper>
       <ReviewsHeading>Reviews</ReviewsHeading>
        <ul>
          {reviews.map((review) => (
            <ReviewItem key={review._id}>
              <strong>{review.username}:</strong> {review.comment}
            </ReviewItem>
          ))}
        </ul>
      </ReviewsWrapper>
    </div>
  );
};

export default Review;
