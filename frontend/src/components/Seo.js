import { Helmet } from "react-helmet-async";

export const Seo = ({ title, description, image }) => {
  const fullTitle = title
    ? `${title} | Human & Natural Environment Society`
    : "Human & Natural Environment Society | Environmental Conservation & Community Welfare, Delhi";
  const desc =
    description ||
    "Human & Natural Environment Society is a registered society working on tree plantation, water conservation, waste management and community welfare in Delhi since 2016.";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
};
