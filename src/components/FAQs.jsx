import { useState } from 'react';
import '../styles/Faq.css';

const Faq = () => {
  const faqs = [
    {
      question: 'Who is Sanjay Patidar and what are his notable achievements?',
      answer: 'Sanjay Patidar is a Software Development Engineer and founder of Zedemy, a serverless learning platform. He developed SmartServe DO, an AI chatbot for LIC Development Officers, and led EduXcel to a top Google ranking through optimized site architecture and MongoDB indexing.',
    },
    {
      question: 'What technologies does Sanjay Patidar specialize in?',
      answer: 'Sanjay specializes in full-stack development with expertise in React.js, Node.js, AWS Lambda, MongoDB, and WebRTC. He builds scalable web applications, leveraging tools like Tailwind CSS, Redux, and Socket.io for efficient and modern solutions.',
    },
    {
      question: 'What are some of Sanjay Patidar’s key projects?',
      answer: 'Sanjay’s key projects include Zedemy, a serverless learning platform with AWS Lambda; SmartServe DO, an AI chatbot with Gemini API integration; ConnectNow, a WebRTC-based video chat app; and EventPoa, an event management system using the MERN stack.',
    },
    {
      question: 'How can I contact Sanjay Patidar for collaboration or inquiries?',
      answer: 'You can contact Sanjay Patidar via email at sanjaypatidar.engineer@gmail.com, visit his portfolio at sanjay-patidar.vercel.app, or explore his GitHub at github.com/hello-developer-sanjay for collaboration or inquiries.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="flex justify-center items-center mt-4"></div>
      {faqs.map((faq, index) => (
        <div className="faq-item" key={index}>
          <div className={`question ${activeIndex === index ? 'active' : ''}`} onClick={() => handleToggle(index)}>
            {faq.question}
            <span className={`arrow ${activeIndex === index ? 'up' : 'down'}`}></span>
          </div>
          {activeIndex === index && <div className="answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
};

export default Faq;
