import { useState , useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import  { keyframes } from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 50vh;
  text-align: center;
  border-radius: 10px;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    text-align: center;
    padding-bottom: 10px;
  }
  
  h1::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 2px;
    background: linear-gradient(to right, #3498db, #1abc9c);
  }
  
 
  
  h1 span {
    display: block;
    font-size: 0.8em;
    color: #777;
    margin-top: 5px;
  }
  

  input {
    padding: 12px;
    font-size: 14px;
    margin-right: 5px;
    width: 60%;
    max-width: 300px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .password-container {
    display: flex;
    align-items: center;
    justify-content:center;       
    margin-bottom: 20px;

    input {
      flex: 1;
    }

    .toggle-button {
      padding: 12px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 16px;
      color: #555;
    }
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
  }
  li.resolved {
    background-color: #d3ffd3; /* You can customize the background color for resolved queries */
  }

  span.resolve-button {
    cursor: pointer;
    color: #3498db;
    margin-left: 10px;
  }

   li {
    flex: 1 0 400px;  // Set a minimum width and allow flexibility to fit the screen
    border: 1px solid #ddd;
    margin: 10px;
    padding: 15px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;  // Hide any content that overflows

    p {
      word-wrap: break-word;  // Allow words to break and wrap onto the next line
    }
  }

`;

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;
const StyledButton = styled.button`
  position: relative;
  overflow: hidden;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #2f2f2f, #464646);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2f2f2f, #464646);
    opacity: 0.5;
    z-index: -1;
    animation: ${gradientAnimation} 4s ease infinite;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
    z-index: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(47, 47, 47, 0.3);
  }
`;
const DashboardHeading = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const UserWantToCollaborate = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1rem;
`;

const UserDetailsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserProfileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeedbacksHeading = styled.h1`
  font-size: 2rem;
  color: #ff6b6b;
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

const FeedbacksList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const QueriesHeading = styled.h1`
  font-size: 2rem;
  color: #6b7fff;
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

const QueriesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserVisitedLocationsHeading = styled.h1`
  font-size: 2rem;
  color: #66cccc;
  margin-top: 3rem;
  margin-bottom: 2rem;
`;

const UserVisitedLocationsList = styled.ul`
  list-style-type: none;
  padding: 0;
  
`;

export {
  DashboardHeading,
  UserWantToCollaborate,
  UserDetailsList,
  UserProfileList,
  FeedbacksHeading,
  FeedbacksList,
  QueriesHeading,
  QueriesList,
  UserVisitedLocationsHeading,
  UserVisitedLocationsList,
};

const UnlockButton = styled.button`
  margin-left: 10px;
  padding: 12px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 20px;
  color: #555;
  transition: color 0.3s ease;

  &:hover {
    color: #ff7e5f;
  }
`;
const ResolvedSpan = styled.span`
  cursor: pointer;
  color: #3498db;
  margin-left: 10px;

  &:hover {
    color: #1abc9c;
  }
`;
const ProtectedPage = () => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [queries, setQueries] = useState([]);
  const [userDetails, setUserDetails] = useState([]);


    useEffect(() => {
      // Fetch user details after successful authentication
      const fetchUserDetails = async () => {
        try {
          const userDetailsResponse = await axios.get('https://eduxcel-api-5aug.onrender.com/api/userdetails');
          setUserDetails(userDetailsResponse.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
  
      if (authenticated) {
        fetchUserDetails();
      }
    }, [authenticated]);
    const [userVisitedLocations, setUserVisitedLocations] = useState([]);

  useEffect(() => {
    // Fetch user visited locations after successful authentication
    const fetchUserVisitedLocations = async () => {
      try {
        const userVisitedLocationsResponse = await axios.get('https://eduxcel-api-5aug.onrender.com/api/uservisiteds');
        setUserVisitedLocations(userVisitedLocationsResponse.data);
      } catch (error) {
        console.error('Error fetching user visited locations:', error);
      }
    };

    if (authenticated) {
      fetchUserVisitedLocations();
    }
  }, [authenticated]);


    useEffect(() => {
      // Display a warning toast message
      toast.warning("Caution: This page is restricted to admin only, involving the management of sensitive information. Unauthorized access is strictly forbidden.", {


              position: "top-left", 
        autoClose: 10000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
        style: {
          background: "#EB4B13", 
          color: "#fff",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)", 
          borderRadius: "10px", 
        },
      });
    }, []); 
  
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch queries after successful authentication
          const queriesResponse = await axios.get('https://eduxcel-api-5aug.onrender.com/api/queries');
          setQueries(queriesResponse.data.map(query => ({ ...query, resolved: false })));
  
          // Fetch user profiles after successful authentication
          const userProfilesResponse = await axios.get('https://eduxcel-api-5aug.onrender.com/api/userprofiles');
          if (Array.isArray(userProfilesResponse.data)) {
            setUserProfiles(userProfilesResponse.data);
          } else {
            console.error('Invalid data structure received for user profiles');
          }
        } catch (error) {
          console.error('Error during data fetching:', error);
        }
      };
  
      if (authenticated) {
        fetchData();
      }
    }, [authenticated]);
  
    const handlePasswordSubmit = async () => {
      try {
        const response = await axios.post('https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/authenticate', { password });
        if (response.data.authenticated) {
          setAuthenticated(true);
  
          // Fetch feedbacks after successful authentication
          const feedbacksResponse = await axios.get('https://eduxcel-api-5aug.onrender.com/api/feedbacks');
          setFeedbacks(feedbacksResponse.data);
        } else {
          console.log('Authentication failed');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    };
  
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
  
    const markAsResolved = (queryId) => {
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === queryId ? { ...query, resolved: true } : query
        )
      );
    };
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handlePasswordSubmit();
      }
    };
  
    return (
      <>
         <Helmet>
    
    <title>Sanjay Patidar - Admin Panel</title>
<meta name="description" content="This page is restricted to admin only, involving the management of sensitive information. Unauthorized access is strictly forbidden. Sanjay Patidar's admin panel provides access to crucial data and tools necessary for the effective management and operation of the website. As the administrator, Sanjay Patidar oversees the handling of sensitive information, user permissions, and various administrative tasks essential for maintaining the integrity and security of the website. Access to this page is limited to authorized personnel only. Any unauthorized attempt to access or tamper with this page will be strictly monitored and subject to legal action. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design."/>

 

 <meta property="og:title" content=" Sanjay Patidar - Admin Panel" />
 <meta property="og:description" content="This page is restricted to admin only, involving the management of sensitive information. Unauthorized access is strictly forbidden. Sanjay Patidar's admin panel provides access to crucial data and tools necessary for the effective management and operation of the website. As the administrator, Sanjay Patidar oversees the handling of sensitive information, user permissions, and various administrative tasks essential for maintaining the integrity and security of the website. Access to this page is limited to authorized personnel only. Any unauthorized attempt to access or tamper with this page will be strictly monitored and subject to legal action. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design." />
 <meta property="og:type" content="website" />
 <meta property="og:url" content="https://sanjay-patidar.vercel.app/protected" />
 <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
 <meta property="og:image:alt" content="Sanjay Patidar" />
 <meta property="og:site_name" content="Sanjay Patidar - Admin Panel" />
  <link rel="canonical" href="https://sanjay-patidar.vercel.app/protected" />

 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:title" content="Sanjay Patidar - Admin Panel" />
 <meta name="twitter:description" content="This page is restricted to admin only, involving the management of sensitive information. Unauthorized access is strictly forbidden. Sanjay Patidar's admin panel provides access to crucial data and tools necessary for the effective management and operation of the website. As the administrator, Sanjay Patidar oversees the handling of sensitive information, user permissions, and various administrative tasks essential for maintaining the integrity and security of the website. Access to this page is limited to authorized personnel only. Any unauthorized attempt to access or tamper with this page will be strictly monitored and subject to legal action. As a Computer Science and Engineering student, Sanjay embodies a profound commitment to mastering the intricacies of programming, with a specialized focus on crafting immersive digital experiences. Currently pursuing a Bachelor of Engineering degree at Chandigarh University, Sanjay brings forth a proactive approach and an unwavering dedication to excellence in all endeavors. His educational odyssey began at Jawahar Navodaya Vidyalaya School, where he laid the foundation for his academic and extracurricular prowess from 2009 to 2016. This esteemed residential institution, administered under the Ministry of Education, fostered holistic development and instilled a fervent pursuit of excellence. Throughout his tenure, Sanjay actively engaged in a plethora of inter-school competitions, showcasing his versatility and achieving distinction in both academic and non-academic domains. Building upon this robust foundation, Sanjay embarked on his tertiary education journey at Chandigarh University, where he embarked on a quest for knowledge and innovation. Embracing the cutting-edge infrastructure and progressive pedagogical approaches of the university, he delved deep into the intricacies of Computer Science Engineering. His academic trajectory is marked by a stellar GPA of 7.5, a testament to his unwavering dedication and intellectual acumen. Beyond the confines of academia, Sanjay's passion for technology extends to the realms of practical application. Actively participating in coding competitions, hackathons, and collaborative projects, he honed his problem-solving prowess and cultivated invaluable teamwork skills. His journey is characterized by a relentless pursuit of excellence, driven by a profound sense of creativity, innovation, and a commitment to delivering exceptional digital solutions. Explore the professional portfolio of Sanjay Patidar, where innovation meets expertise, and witness firsthand the culmination of passion, creativity, and a relentless pursuit of excellence in web development and UI/UX design." />
 <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sanjay_patidar_profile.png" />
 <meta name="twitter:site" content="@sanjaypatidar" />
 <meta name="twitter:creator" content="@sanjaypatidar" />

 <meta name="keywords" content="portfolio, signup , secure, eduxcel ,founder: Sanjay patidar , tech, education, careers, opportunity, personal-portfolio,developer_sanju,sanjay, Sanjay, SANJAY, Sanjay Patidar, SANJAY PATIDAR, SANJAY WEB DEVELOPER, SANJAY DEVELOPER, Full Stack Web Developer, Mern Stack Web Developer, sanjay patidar, sanjay-patidar, professional, web developer portfolio, coder, web development, UI/UX design, Chandigarh University, EduXcel, Indore,contact, developer, programmer, engineer, AI, Artificial Intelligence ,tech enthusiastic, creativity ,creator, work , technology, coding, projects, experiences, resume, cv" />
 <meta name="author" content="EduXcel" />        <script type="application/ld+json">
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


                        "https://sanjay-patidar.vercel.app/protected"

         ]
   

       })}
     </script>


    </Helmet>
     
      <StyledWrapper>
      
        {!authenticated ? (
          <>
            <h1>Unlock the Secrets!</h1>
            <div className="password-container">
            <input
  type={passwordVisible ? 'text' : 'password'}
  placeholder="Enter the secret password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyPress={handleKeyPress} // Add this line
/>

 <UnlockButton className="toggle-button" onClick={togglePasswordVisibility}>
                {passwordVisible ? '🙈' : '👁️'}
              </UnlockButton>
            </div>
            <StyledButton onClick={handlePasswordSubmit}>Access Dashboard
 </StyledButton>
 <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}}>
  <img
    src="https://sanjaybasket.s3.ap-south-1.amazonaws.com/admin.gif" 
    alt="Admin Only GIF"
    style={{
      width: '100%', 
      marginTop: '20px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',  
      border: '2px solid #fff'
    }}
  />
</div>

          </>
        ) : (
          <>
          <DashboardHeading>Dashboard</DashboardHeading>
          <UserWantToCollaborate>User wantToCollaborate:</UserWantToCollaborate>
          <UserDetailsList>
            {userDetails.map((user) => (
              <li key={user._id.$oid}>
                <strong>Full Name: {user.fullName}</strong>
                <li>Want to Collaborate: {user.wantToCollaborate ? 'Yes' : 'No'}</li>
                <li>Contact Number: {user.contactNumber}</li>
              </li>
            ))}
          </UserDetailsList>
          <UserProfileList>
            {userProfiles.map((profile) => (
              <li key={profile._id.$oid}>
                <strong>Email: {profile.email}</strong>
                <li>Username: {profile.username}</li>
                <li>Last Sign In: {profile.lastSignInAt}</li>
                {/* Display map with location coordinates */}
                <MapContainer
                  center={[profile.location.coordinates[1], profile.location.coordinates[0]]}
                  zoom={13}
                  style={{ height: '200px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[profile.location.coordinates[1], profile.location.coordinates[0]]}
                  >
                    <Popup>
                      User Location<br />
                      Latitude: {profile.location.coordinates[1]}<br />
                      Longitude: {profile.location.coordinates[0]}
                    </Popup>
                  </Marker>
                </MapContainer>
              </li>
            ))}
          </UserProfileList>
          <FeedbacksHeading>Feedbacks</FeedbacksHeading>
          <FeedbacksList>
            {feedbacks.map((feedback) => (
              <li key={feedback._id}>
                <strong>UserName: {feedback.name} || Email id :{' '}
                  <a href={`mailto:${feedback.email}`}>{feedback.email}</a>
                </strong>{' '}
                {feedback.feedback}
              </li>
            ))}
          </FeedbacksList>
          <QueriesHeading>Queries</QueriesHeading>
          <QueriesList>
            {queries.map((query) => (
              <li key={query._id} className={query.resolved ? 'resolved' : ''}>
                <strong>UserName: {query.name} || Email id :{' '}
                  <a href={`mailto:${query.email}`}>{query.email}</a>
                </strong>{' '}
                {query.query}
                {!query.resolved && (
                  <ResolvedSpan onClick={() => markAsResolved(query._id)}>
                    &#10003; Resolve
                  </ResolvedSpan>
                )}
              </li>
            ))}
          </QueriesList>
          <UserVisitedLocationsHeading>User Visited Locations</UserVisitedLocationsHeading>
          <UserVisitedLocationsList>
            {userVisitedLocations.map((location) => (
              <li key={location._id}>
                <strong>User ID: {location.userId}</strong>
                <li>IP Address: {location.ip}</li>
                <li>Fingerprint: {location.fingerprint}</li>
                <li>Browser: {location.userAgentDetails.browser}</li>
                <li>Version: {location.userAgentDetails.version}</li>
                <li>OS: {location.userAgentDetails.os}</li>
                <li>Platform: {location.userAgentDetails.platform}</li>
                <li>Source: {location.userAgentDetails.source}</li>
                <li>visitedAt : {location.visitedAt}</li>
                <MapContainer
                  center={[location.location.coordinates[1], location.location.coordinates[0]]}
                  zoom={13}
                  style={{ height: '200px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[location.location.coordinates[1], location.location.coordinates[0]]}
                  >
                    <Popup>
                      User Visited Location<br />
                      Latitude: {location.location.coordinates[1]}<br />
                      Longitude: {location.location.coordinates[0]}
                    </Popup>
                  </Marker>
                </MapContainer>
              </li>
            ))}
          </UserVisitedLocationsList>
        </>
      )}
    </StyledWrapper>
    </>
  );
};

export default ProtectedPage;
