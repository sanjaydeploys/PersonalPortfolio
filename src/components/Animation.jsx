import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

const Next = styled.h1`
  font-size: 1.1rem;
  color: #f3f3f3;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  text-align: justify;
  border-left: 4px solid #5d00ff;
  border-right: 4px solid #5d00ff;
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Animation = () => {
  const [refContent, inViewContent] = useInView({ triggerOnce: true });
  const controlsContent = useAnimation();

  useEffect(() => {
    if (inViewContent) {
      controlsContent.start((index) => ({
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
          duration: 2,
          delay: index * 0.2,
          type: 'spring',
          stiffness: 100,
        },
      }));
    }
  }, [inViewContent, controlsContent]);

  const contentBlocks = [
    {
      title: 'Who is Sanjay Patidar and what are his notable achievements?',
      description: 'Sanjay Patidar is a Software Development Engineer, founder, and lead developer of Zedemy, a serverless learning platform. He developed SmartServe DO, an AI chatbot for LIC Development Officers, and secured EduXcel’s top Google ranking.',
    },
  ];

  return (
    <section className="relative w-full min-h-screen mx-auto">
      <div>
        <div className="flex-container">
          <div className="lg:w-1/2 lg:pl-12 why-content">
            {contentBlocks.map((block, index) => (
              <motion.div
                key={index}
                ref={refContent}
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={controlsContent}
                custom={index}
              >
                <Next>{block.title}</Next>
                <Next>{block.description}</Next>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Animation;
