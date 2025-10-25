import { Helmet } from "@dr.pogodin/react-helmet";

/**
 * Reusable SEO component for dynamic titles, descriptions, and canonical tags.
 * Use it inside each page to override default SEO info.
 */
const SEO = ({ title, description, canonicalPath }) => {
    const baseUrl = "https://kantevo.com";
    const canonicalUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl;

    return (
        <Helmet>
            {/* Primary Meta */}
            <title>{title ? `${title} | Kantevo` : "Kantevo — College Canteen Ordering Made Easy"}</title>
            {description && <meta name="description" content={description} />}

            {/* Canonical Tag */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph (for social sharing) */}
            <meta property="og:title" content={title || "Kantevo — College Canteen Ordering Made Easy"} />
            <meta property="og:description" content={description || "Order, pay, and pick up food seamlessly at your college canteen with Kantevo."} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};

export default SEO;
