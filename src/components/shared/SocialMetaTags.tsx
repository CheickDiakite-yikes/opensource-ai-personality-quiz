
import React from "react";
import { Helmet } from "react-helmet-async";

interface SocialMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

/**
 * Component to handle social media meta tags dynamically
 */
const SocialMetaTags: React.FC<SocialMetaTagsProps> = ({
  title = "Who Am I? - Advanced AI Personality Assessment",
  description = "Discover your true self with our AI-powered personality test that deeply understands you.",
  image = "https://www.sowei.io/lovable-uploads/f755f3a3-4905-4c19-8315-4a40cb646280.png",
  url = "https://www.sowei.io/",
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SocialMetaTags;
