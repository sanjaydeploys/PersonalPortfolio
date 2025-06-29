import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Confetti from "react-confetti";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import "../styles/CertificationDetails.css";
import certificateIcon from "../assets/icon (2).png";
import { Helmet } from "react-helmet";

const CertificationDetails = () => {
  const { title } = useParams();
  const [certification, setCertification] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function fetchCertification() {
      try {
        const response = await axios.get(
          `https://gj48940cgb.execute-api.ap-south-1.amazonaws.com/prod/api/certifications/${encodeURIComponent(
            title
          )}`
        );
        setCertification(response.data);
      } catch (error) {
        console.error("Error fetching certification details:", error);
      }
    }

    fetchCertification();
  }, [title]);

  const handleDownloadClick = () => {
    setShowConfetti(true);
    // No need to add any other actions here; the browser will handle the download
  };

  return (
    <div
      className="certification-details-container"
      style={{
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {certification && (
        <>
         <Helmet>
  <title>{certification.title} - Certification by Sanjay Patidar</title>
</Helmet>

          <h1 className="certification-details-title">{certification.title}</h1>
          <div className="creative-description-container">
            <div className="certificate-icon-container">
              <img
                className="certificate-icon"
                src={certificateIcon}
                alt="Certificate Icon"
              />
            </div>
            <div className="certification-details-description">
              {certification.description.map((field, index) => (
                <p key={index}>{field}</p>
              ))}
            </div>
          </div>
          <div className="certification-images-grid">
            {certification.imageUrls.map((imageUrl, index) => (
              <Zoom key={index}>
                <img
                  className="certification-details-image-grid"
                  src={imageUrl}
                  alt={`${certification.title} - Image ${index + 1}`}
                />
              </Zoom>
            ))}
          </div>
          <a
            className="certification-details-download"
            href={certification.imageUrls[0]}
            download={`${certification.title}.pdf`}
            onClick={handleDownloadClick}
          >
            Download
          </a>
          {showConfetti && <Confetti />}
        </>
      )}
    </div>
  );
};

export default CertificationDetails;
