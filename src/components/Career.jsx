    /* eslint-disable react/prop-types */
    /* eslint-disable react/display-name */
    import React, { useState, useEffect, useRef, useCallback } from "react";
   
    import { Helmet } from "react-helmet";  
    import { Collapse } from 'react-collapse'; 
    import useDisclosure from './useDisclosure'; 
    import {
    
      RingLoader,
      SyncLoader,
      ClipLoader,
    
    } from "react-spinners";

    import { motion } from "framer-motion";
    import ModalImage from "react-modal-image"; 

    import { FaArrowCircleUp } from "react-icons/fa";

    import { useNavigate, useLocation } from "react-router-dom";
    import ReactPlayer from "react-player";
    import "../styles/Blogs.css";


    import { Link } from "react-router-dom";
    const slugify = (text) => {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word characters
        .replace(/--+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
    };
    
    const BlogTitle = React.forwardRef(({ title, collection, onClick, location }, ref) => {
      const slug = slugify(title); // Generate slug from title
    
      return (
        <motion.div
          whileHover={{
            textDecoration: "underline",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => onClick(title, collection)}
          ref={ref}
          style={{ cursor: "pointer", marginLeft: location === "main" ? "50px" : "0", position: "relative" }} // Add position relative
        >
          <div
            style={{
              fontWeight: "bold",
              textDecoration: "none",
              fontFamily: "Roboto, sans-serif",
              textAlign: "left",
              padding: "8px",
              fontSize: location === "main" ? "25px" : "18px",
              color: location === "main" ? "white" : "Turquoise ",
              marginTop: location === "main" ? "50px" : "5px",
            }}
          >
            <Link
              to={`/careers/${collection}/${slug}`} 
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {title}
            </Link>
          </div>
          {location === "main" && (
            <div
              style={{
                position: "absolute",
                bottom: "-5px",
                left: 0,
                width: "100%",
                height: "2px",
                background: "linear-gradient(to right, rgba(255, 215, 0, 1), rgba(255, 255, 255, 0.7), rgba(255, 215, 0, 1))", // Use linear gradient for a more dynamic shine effect
                borderRadius: "10px",
                animation: "shine 2s infinite linear",
              }}
            />
          )}
        </motion.div>
      );
    });
    
    
    const Career = () => {
      const [blogsData, setBlogsData] = useState({
        careers: [],
        
      });
      const [loading, setLoading] = useState(true);

      const [currentPage, setCurrentPage] = useState(1);
      const [postsPerPage] = useState(1); 
      const navigate = useNavigate();
      const titleRefs = useRef({});
      const { isOpen, onToggle } = useDisclosure();
      const sidebarRef = useRef();

      const [ setLastVisitedBlog] = useState(null);

      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      };
      
      
      const observer = useRef();

      const [searchQuery, setSearchQuery] = useState("");
      const [scrollProgress, setScrollProgress] = useState(0);
      const [remainingProgress, setRemainingProgress] = useState(100);

      const location = useLocation();
      const [clickedTitle, setClickedTitle] = useState(null);
   

      const handleSearchChange = (event) => {
        const newQuery = event.target.value;
        setSearchQuery(newQuery);
        navigate(`/careers/search/${encodeURIComponent(newQuery)}`);
      };
      const fetchData = async (collection) => {
        try {
          const response = await fetch(
            `https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/${collection}`
          );
          const responseData = await response.json();
          setBlogsData((prevData) => ({
            ...prevData,
            [collection]: responseData,
          }));
        } catch (error) {
          console.error(`Error fetching ${collection} data:`, error);
        }
      };

      const fetchDataForAllCollections = async () => {
        const collections = ["careers"];
        const promises = collections.map((collection) => fetchData(collection));
        await Promise.all(promises);
      };
      const filteredBlogs = (collection) => {
        const blogsCollection = blogsData[collection] || [];
        return blogsCollection.filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }; 
    useEffect(() => {
  fetchDataForAllCollections().then(() => setLoading(false));
}, []);

      const debouncedSearchChange = useCallback(debounce(handleSearchChange, 500), []);
    
      useEffect(() => {
        debouncedSearchChange(searchQuery);
      }, [debouncedSearchChange, searchQuery]);
    
     
    
      const observeLastBlog = useCallback(
        (collection, node) => {
          if (observer.current) {
            observer.current.disconnect();
          }
    
          observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              // Implement your logic here if needed
            }
          });
    
          if (node) {
            observer.current.observe(node);
          }
        },
        [observer]
      );
    
      const handleScroll = (e) => {
        const container = e.target;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        const contentHeight = scrollHeight - clientHeight;
        const progress = (scrollTop / contentHeight) * 100;

        setScrollProgress(progress);

        const remaining = 100 - progress;
        setRemainingProgress(remaining);
      };

      const scrollToTop = () => {
        const container = document.getElementById("blogs-section");
        if (container) {
          container.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      };
       
      
        const generateSlug = (text) => {
          return text.toString().toLowerCase()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w-]+/g, '')     // Remove all non-word characters
            .replace(/--+/g, '-')        // Replace multiple - with single -
            .replace(/^-+/, '')          // Trim - from start of text
            .replace(/-+$/, '');         // Trim - from end of text
        };
      
        const handleTitleClick = useCallback((title, collection) => {
          const matchingBlog = blogsData[collection].find((blog) => blog.title === title);
      
          if (matchingBlog) {
            const pageIndex =
              Math.ceil(blogsData[collection].indexOf(matchingBlog) / postsPerPage) + 1;
      
            const slug = generateSlug(title); // Generate slug from title
      
            navigate(`/careers/${collection}/${slug}`, {
              replace: true,
            });
      
            setCurrentPage(pageIndex);
      
            // Set the title dynamically when a title is clicked
            document.title = `${matchingBlog.title} | Sanjay Patidar`; 
          }
          setLastVisitedBlog({ title, collection });
        }, [blogsData, navigate, postsPerPage, setCurrentPage, setLastVisitedBlog]);
      







        useEffect(() => {
          const query = location.pathname.split("/careers/search/")[1] || "";
          setSearchQuery(decodeURIComponent(query));
          fetchDataForAllCollections();
      
          if (clickedTitle) {
            // Reset the clicked title state
            setClickedTitle(null);
          }
      
          // Check for title in URL and display the content directly
          const urlTitleMatch = location.pathname.match(/\/careers\/(.+?)\/(.+)/);
          if (urlTitleMatch) {
            const [, collection, encodedTitle] = urlTitleMatch;
            const urlTitle = decodeURIComponent(encodedTitle);
            const matchingBlog = blogsData[collection]?.find(
              (blog) =>
                slugify(blog.title) === urlTitle ||
                (blog.parentTitle && blog.parentTitle.title === urlTitle) ||
                (blog.features && blog.features.title === urlTitle) ||
                (blog.entry_level && blog.entry_level.title === urlTitle) ||
                (blog.common_questions && blog.common_questions.title === urlTitle) ||
                // Add more checks for other extensions as needed
                // ...
                false
            );
            
            if (matchingBlog) {
              // Set the current page to the matched blog's page
              const pageIndex =
                Math.ceil(blogsData[collection].indexOf(matchingBlog) / postsPerPage) + 1;
              setCurrentPage(pageIndex);
      
              // Set the title and description dynamically for SEO
              const blogTitle = decodeURIComponent(matchingBlog.title);
              document.title = `${blogTitle} | Sanjay Patidar`;
            }
          }
        }, [blogsData, fetchDataForAllCollections, location, postsPerPage, setCurrentPage]);
      
        
        
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      const currentPosts = filteredBlogs("careers").slice(indexOfFirstPost, indexOfLastPost);

    

    const headerStyle = {
      position: "sticky",
      top:0,
      zIndex: 1,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      padding: "1rem",
      backdropFilter: "blur(10px)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "0 0 20px 20px", // Adds rounded corners at the bottom
      color: "#fff", // Text color
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "Poppins, sans-serif", // Modern sans-serif font
    };

   
      const progressBarStyle = {
        width: `${scrollProgress}%`,
        height: "4px",
        backgroundColor: "yellow",
        borderRadius: "2px",
        marginTop:"5px",
        transition: "width 0.3s",
      };

      const remainingBarStyle = {
        width: `${remainingProgress}%`,
        height: "4px",
        backgroundColor: "black",
        borderRadius: "2px",
      };

      const scrollToTopButtonStyle = {
        position: "sticky",
        bottom: "30px",
        right: "1px",
        zIndex: 2,
        background: "green",
        color: "white",
        borderRadius: "50%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
cursor: "pointer",
        transition: "background-color 0.3s",
        fontSize: "24px",
      };

      const contentSectionStyle = {
        borderRadius: "12px",
        marginLeft: "50px",
marginTop:"50px",        color: "white",
        fontSize:"20px ",
        justifyContent: "start",
        alignItems: "start",
      };
      
      
      const sidebarStyle = {
        position: "fixed",
        top: "60px",
        left: 0,
        height: "100%",
        width: "190px",
        backgroundColor: "black",
        borderRight: "1px solid lightgray",
        padding: "20px",
        zIndex: 2,
        transition: "left 0.3s",
        overflowX: "hidden",
        overflowY: "auto", 
  maxHeight: "calc(100% - 100px)", 
  display: isOpen ? 'block' : 'none' // Adding display property here

      };

      const toggleButtonStyle = {
        position: "fixed",
        top: "180px",
        transform: "translateY(-50%)",
        left: isOpen ? "240px" : "20px",
        zIndex: 2,
        background: isOpen ? "#e74c3c" : "#2ecc71", // Red when open, green when closed
        color: "white",
        borderRadius: "50%",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.3)",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "left 0.3s, background 0.3s",
        border: "2px solid #fff", // White border
        fontSize: "12px",
      };

      // Rotating animation on toggle
      toggleButtonStyle.rotate = {
        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
        transition: "transform 0.3s",
      };

      // Hover effect
      toggleButtonStyle["&:hover"] = {
        background: isOpen ? "#c0392b" : "#27ae60", // Darker red when open, darker green when closed
      };

      // Pulse animation on hover
      toggleButtonStyle["&:hover"].pulse = {
        animation: "pulse 0.5s infinite",
      };

      // Keyframe animation for pulse
      toggleButtonStyle["@keyframes pulse"] = {
        "0%": {
          transform: "scale(1)",
        },
        "50%": {
          transform: "scale(1.2)",
        },
        "100%": {
          transform: "scale(1)",
        },
      };

      const renderMediaContent = (content, title, location) => {
        if (!content) {
          return null;
        }
      
        if (!Array.isArray(content)) {
          // If content is not an array, wrap it in an array to handle it uniformly
          content = [content];
        }
      
        return content.map((item, index) => {
          if (Array.isArray(item)) {
            return (
              <React.Fragment key={index}>
{renderMediaContent(item.content, title, location)}
              </React.Fragment>
            );
          }
      
          let element;
      
          if (typeof item === "object" && item.title) {
            // Display object field titles on the same page as the parent title
            element = (
              <React.Fragment key={index}>
                <BlogTitle
                  title={item.title}
                  collection="careers"
                  onClick={() => handleTitleClick(item.title, "careers")}
                />
                {renderMediaContent(item.description, title)}
                {renderMediaContent(item.installation, title)}
                {renderMediaContent(item.content, title)}
                {renderMediaContent(item.steps, title)}
                {renderMediaContent(item.career_path, title)}
                {renderMediaContent(item.entry_level, title)}
                {renderMediaContent(item.overview, title)}
                {renderMediaContent(item.common_questions, title)}
                
              </React.Fragment>
            );
          }
      
          if (typeof item === "string") {
            // Handle special characters
            const specialCharsRegex = /[*$~]([^*$~]+)[*$~]/;
            const matchSpecialChars = item.match(specialCharsRegex);
      
            if (matchSpecialChars) {
              const specialText = matchSpecialChars[1];
              const textBeforeSpecial = item.split(matchSpecialChars[0])[0];
              const textAfterSpecial = item.split(matchSpecialChars[0])[1];
      
              element = (
                <React.Fragment key={index}>
                  {textBeforeSpecial}
                  <span
                    style={{
                      fontWeight: matchSpecialChars[0] === '*' ? 'bold' : 'normal',
                      color: matchSpecialChars[0] === '$' ? 'green' : matchSpecialChars[0] === '~' ? 'lime' : 'gold',
                      fontStyle: matchSpecialChars[0] === '*' ? 'italic' : 'normal',
                      textDecoration: 'none',
                      fontSize: matchSpecialChars[0] === '$' ? '1.2em' : matchSpecialChars[0] === '~' ? '1.1em' : '1em',
                    }}
                  >
                    {specialText}
                  </span>
                  {textAfterSpecial}
                </React.Fragment>
              );
            } else {              
              const linkRegex = /@([^@]+)@/;
              const match = item.match(linkRegex);
      
              if (match) {
                // Handle links
                const link = match[1];
                const textBeforeLink = item.split(match[0])[0];
                const textAfterLink = item.split(match[0])[1];
      
                element = (
                  <React.Fragment key={index}>
                    {textBeforeLink}
                    <span
                      style={{ color: "yellow", textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => window.open(link, "_blank")}
                    >
                      {link}
                    </span>
                    {textAfterLink}
                  </React.Fragment>
                );
              } else if (item.startsWith("http")) {
                // Handle images and videos
                if (item.match(/\.(jpeg|jpg|gif|png)$/)) {
                  element = (
                    <React.Fragment key={index}>
                      <ModalImage
                        small={item}
                        large={item}
                       
                        alt={`Image ${index}`}
                        className="custom-modal-image"
                      />
                    </React.Fragment>
                  );
                } else if (item.match(/\.(mp4|webm|mkv)$/)) {
                  element = (
                    <React.Fragment key={index}>
                      <ReactPlayer
                        url={item}
                        controls
                        width="100%"
                        height="100%"
                        style={{ position: "absolute", top: 0, left: 0 }}
                      />
                    </React.Fragment>
                  );
                } else {
                  element = <React.Fragment key={index}>{item}</React.Fragment>;
                }
              } else {
                // Handle regular text
                element = <React.Fragment key={index}>{item}</React.Fragment>;
              }
            }
          }
      
          return <div key={index}>{element}</div>;
        });
      };
      
      


      const navbarHeight = document.querySelector(".navbar")?.clientHeight || 0;
      return (

        <>

<Helmet>
    
    <title>Sanjay Patidar | Mastering Tech Careers: Web Development Insights and Education with Sanjay Patidar - Expert Guidance for Aspiring Developers | Founder-Eduxcel </title>
 <meta
   name="description"
   content="Unlock the gateway to success in web development with Sanjay Patidar, your expert guide to mastering tech careers. Delve into a world of unparalleled insights and cutting-edge education, tailored specifically for aspiring developers. From honing your coding skills to crafting immersive digital experiences, Sanjay's journey from Computer Science and Engineering student to accomplished web developer showcases a relentless pursuit of excellence. Explore his professional portfolio and witness firsthand the fusion of passion, creativity, and expertise in web development and UI/UX design. With a proactive approach and unwavering dedication to excellence, Sanjay empowers individuals to excel in the dynamic landscape of technology. Join the ranks of successful developers under his expert guidance and embark on a journey towards realizing your full potential in the tech world.
   "
 />
 

 <meta property="og:title" content="Sanjay Patidar | Mastering Tech Careers: Web Development Insights and Education with Sanjay Patidar - Expert Guidance for Aspiring Developers | Founder-Eduxcel " />
 <meta property="og:description" content="Unlock the gateway to success in web development with Sanjay Patidar, your expert guide to mastering tech careers. Delve into a world of unparalleled insights and cutting-edge education, tailored specifically for aspiring developers. From honing your coding skills to crafting immersive digital experiences, Sanjay's journey from Computer Science and Engineering student to accomplished web developer showcases a relentless pursuit of excellence. Explore his professional portfolio and witness firsthand the fusion of passion, creativity, and expertise in web development and UI/UX design. With a proactive approach and unwavering dedication to excellence, Sanjay empowers individuals to excel in the dynamic landscape of technology. Join the ranks of successful developers under his expert guidance and embark on a journey towards realizing your full potential in the tech world." />
 <meta property="og:type" content="website" />
 <meta property="og:url" content="https://sanjay-patidar.vercel.app/careers" />
 <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sixpack.jpeg" />
 <meta property="og:image:alt" content="Sanjay Patidar" />
 <meta property="og:site_name" content="Sanjay Patidar | Mastering Tech Careers: Web Development Insights and Education with Sanjay Patidar - Expert Guidance for Aspiring Developers | Founder-Eduxcel " />

 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:title" content=" Sanjay Patidar | Mastering Tech Careers: Web Development Insights and Education with Sanjay Patidar - Expert Guidance for Aspiring Developers | Founder-Eduxcel " />
 <meta name="twitter:description" content="Unlock the gateway to success in web development with Sanjay Patidar, your expert guide to mastering tech careers. Delve into a world of unparalleled insights and cutting-edge education, tailored specifically for aspiring developers. From honing your coding skills to crafting immersive digital experiences, Sanjay's journey from Computer Science and Engineering student to accomplished web developer showcases a relentless pursuit of excellence. Explore his professional portfolio and witness firsthand the fusion of passion, creativity, and expertise in web development and UI/UX design. With a proactive approach and unwavering dedication to excellence, Sanjay empowers individuals to excel in the dynamic landscape of technology. Join the ranks of successful developers under his expert guidance and embark on a journey towards realizing your full potential in the tech world." />
 <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/sixpack.jpeg" />
 <meta name="twitter:site" content="@sanjaypatidar" />
 <meta name="twitter:creator" content="@sanjaypatidar" />

 <meta name="keywords" content="portfolio, signup ,careers,  eduxcel , tech, education, careers, opportunity, personal-portfolio,developer_sanju,sanjay, Sanjay, SANJAY, Sanjay Patidar, SANJAY PATIDAR, SANJAY WEB DEVELOPER, SANJAY DEVELOPER, Full Stack Web Developer, Mern Stack Web Developer, sanjay patidar, sanjay-patidar, professional, web developer portfolio, coder, web development, UI/UX design, Chandigarh University, EduXcel, Indore,contact, developer, programmer, engineer, AI, Artificial Intelligence ,tech enthusiastic, creativity ,creator, work , technology, coding, projects, experiences, resume, cv" />
 <meta name="author" content="Sanjay Patidar" />        <script type="application/ld+json">
       {JSON.stringify({
         '@context': 'http://schema.org',
         '@type': 'ItemList',
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
           "https://eduxcel.vercel.app/",
                        "https://eduxcel.vercel.app/signup"

         ]
   

       })}
     </script>


    </Helmet>
        <div
          style={{
            width: "full",
            minHeight: "100vh",
            margin: "auto",
            display: "flex",
            padding: `calc(${navbarHeight}px + 2rem) 2rem 2rem 2rem`,
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "flex-start",
            overflowY: "scroll",
            textAlign: "left",
            maxHeight: "calc(100vh - 100px)",
            height: "auto",
            overflowX: "hidden",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "-32px"
          }}
          id="blogs-section"
          onScroll={handleScroll}
        >


          
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
              }}
            >
              {loading && (
                <>
                  <div style={{ marginRight: "20px" }}>
                    <ClipLoader color={"#FF6347"} loading={loading} size={20} />
                    <span style={{ color: "#FF6347", fontSize: "12px" }}>Fetching data...</span>
                  </div>
    
                  <div style={{ marginRight: "20px" }}>
                    <RingLoader color={"#36D7B7"} loading={loading} size={30} />
                    <span style={{ color: "#36D7B7", fontSize: "14px" }}>Preparing content...</span>
                  </div>
    
                  <div>
                    <SyncLoader color={"#5E35B1"} loading={loading} size={40} />
                    <span style={{ color: "#5E35B1", fontSize: "16px" }}>Almost there...</span>
                  </div>
                  {/* Add more loaders or customize the existing ones */}
                </>
              )}
            </div>
          ) : (
            <>
              {/* Toggle Button */}
              <button
                style={toggleButtonStyle}
                onClick={onToggle}
              >
                {isOpen ? "Close" : "Open"}
              </button>
              <Collapse isOpened={isOpen}>

              {/* Sidebar */}
              <div style={{...sidebarStyle}} ref={sidebarRef}>
                  <div>
                  {Object.keys(blogsData).map((collection) => (
                    <div key={collection}>
                      <div style={{ fontSize: "md", fontWeight: "semibold", marginBottom: "2px" }}>
                        {`${collection.charAt(0).toUpperCase()}${collection.slice(1)}`}
                      </div>
                      {filteredBlogs(collection).map((blog) => (
                        <BlogTitle
                          key={blog.title}
                          title={blog.title}
                          collection={collection}
                          onClick={(title, collection) => handleTitleClick(title, collection)}
                          ref={(el) => (titleRefs.current[`${collection}-${blog.title}`] = el)}

                          location="sidebar" // Pass location prop indicating main content area
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              </Collapse>

              {/* Main Content */}
              <div style={{ marginTop: "0", padding: "0", marginLeft: isOpen ? "200px" : "0" }}>
                <div style={headerStyle}>
                  <div style={{ display: "flex", flexDirection: "column", width: "100%", marginTop: "0" }}>
                    <input
                      type="text"
                      placeholder="Enter your desired job title or keywords"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{
                        padding: "0.5rem",
                        marginTop: "0",
                        borderWidth: "0.5rem",
                        borderRadius: "1.5rem",
                        backgroundColor: "#F0F8FF", 
                        color: "#2E8B57", 
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease-in-out", 
                        fontFamily: "Arial, sans-serif",
                        textAlign: "center",
                        fontSize: "1rem",
                      }}
                                          />
                    <div style={progressBarStyle} />
                    <div style={remainingBarStyle} />
                  </div>
                  <button
                    aria-label="Scroll to Top"
                    onClick={scrollToTop}
                    style={scrollToTopButtonStyle}
                  >
                    <FaArrowCircleUp />
                  </button>
                </div>
    
                {currentPosts.map((blog, index) => (
                  <motion.div
                    key={blog.title}
                    ref={
                      index === currentPosts.length - 1
                        ? (node) => observeLastBlog("careers", node)
                        : null
                    }
                  >
                   <div id={`title-${blog.title}`} ref={(el) => (titleRefs.current[blog.title] = el)}>
  <BlogTitle
    key={blog.title}
    title={blog.title}
    collection="careers"
    onClick={() => handleTitleClick(blog.title, "careers")}
    location="main" // Pass location prop indicating sidebar
  />
<div style={{ marginTop: "30px", padding: "10px", border: "1px solid #ccc", color: "White", borderRadius: "8px" }}>
<div style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "1.2rem" }}>Published By:</div>
<div style={{ display: "flex", alignItems: "center" }}>
  <a href="https://sanjay-patidar.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#007bff", marginRight: "20px", padding: "10px", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
    <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Sanjay Patidar</span>
    <br />
    <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>Click to visit Sanjay Patidar website</span>
  </a>
  <span style={{ color: "#6c757d" }}>|</span>
  <a href="https://eduxcel.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#007bff", marginLeft: "20px", padding: "10px", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
    <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Founder: EduXcel | Empowering Careers in Tech: Expert Insights, Cutting-Edge Education, and Skill Mastery</span>
    <br />
    <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>Click to visit EduXcel website</span>
  </a>
</div>


  <div style={{ marginTop: "20px", fontWeight: "bold", marginBottom: "10px" , fontSize: "1.2rem"}}>Keywords:</div>
  <div>{renderMediaContent(blog.keywords, blog.title)}</div>

  <div style={{ marginTop: "20px", fontWeight: "bold", marginBottom: "10px" , fontSize: "1.2rem"}}>Last Modified:</div>
  <div>{renderMediaContent(blog.Last_Modified, blog.title)}</div>
</div>

</div>

                    <div id={`content-${blog.title}-overview`} style={contentSectionStyle}>
                      {renderMediaContent(blog.overview, blog.title)}
                    </div>

                    <div id={`content-${blog.title}-development`} style={contentSectionStyle}>
                      {renderMediaContent(blog.responsibilities?.development, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-maintenance`} style={contentSectionStyle}>
                      {renderMediaContent(blog.responsibilities?.maintenance, blog.title)}
                    </div>

                    <div id={`content-${blog.title}-communication`} style={contentSectionStyle}>
                      {renderMediaContent(blog.responsibilities?.communication, blog.title)}
                    </div>

                    <div id={`content-${blog.title}-continous_learning`} style={contentSectionStyle}>
                      {renderMediaContent(blog.responsibilities?.continous_learning, blog.title)}
                    </div>

                    
                    <div id={`content-${blog.title}-description`} style={contentSectionStyle}>
                      {renderMediaContent(blog.description, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-responsibilities`} style={contentSectionStyle}>
                      {renderMediaContent(blog.responsibilities, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-skill`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skill, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-career_path`} style={contentSectionStyle}>
                      {renderMediaContent(blog.career_path, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-entry_level`} style={contentSectionStyle}>
                      {renderMediaContent(blog.entry_level, blog.title)}
                    </div>
                    {/* new  */}
                    <div id={`content-${blog.title}-career_outlook`} style={contentSectionStyle}>
                      {renderMediaContent(blog.career_outlook, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-common_questions`} style={contentSectionStyle}>
                      {renderMediaContent(blog.common_questions, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-entry_level`} style={contentSectionStyle}>
                      {renderMediaContent(blog.career_path?.entry_level, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-mid_level`} style={contentSectionStyle}>
                      {renderMediaContent(blog.career_path?.mid_level, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-senior_level`} style={contentSectionStyle}>
                      {renderMediaContent(blog.career_path?.senior_level, blog.title)}
                    </div>
                                  {/* new */}
                     <div id={`content-${blog.title}-ProgrammingLanguages`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.ProgrammingLanguages, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-BackendDevelopment`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.BackendDevelopment, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-VersionControlSystems`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.VersionControlSystems, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-WebDevelopmentToolsAndTechnologies`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.WebDevelopmentToolsAndTechnologies, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-ProblemSolvingAndDebugging`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.ProblemSolvingAndDebugging, blog.title)}
                    </div>
                    <div id={`content-${blog.title}-SoftSkills`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.SoftSkills, blog.title)}
                    </div>  
                    <div id={`content-${blog.title}-ContinuousLearningAndAdaptability`} style={contentSectionStyle}>
                      {renderMediaContent(blog.skills?.ContinuousLearningAndAdaptability, blog.title)}
                    </div>  

                    <div id={`content-${blog.title}-design`} style={contentSectionStyle}>
                      {renderMediaContent(blog.responsibilities?.design, blog.title)}
                    </div>

                  </motion.div>
                ))}
      
              </div>
            </>
          )}
        </div>
        </>
      );
      };
      
      export default Career;
      
      
