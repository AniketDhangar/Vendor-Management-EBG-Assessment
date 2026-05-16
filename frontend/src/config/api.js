const getApiUrl = () => {
  // For development
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
  }

  // For production - detect based on hostname
  const hostname = window.location.hostname;

  // If running on netlify production domain
  if (hostname === 'vendorsmanagement-ebg.netlify.app') {
    return 'https://vendor-management-ebg-assessment.onrender.com/api/v1';
  }

  // If running on custom domain (adjust as needed)
  if (hostname.includes('netlify.app')) {
    return 'https://vendor-management-ebg-assessment.onrender.com/api/v1';
  }

  // Fallback for localhost production build testing
  return import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
};

export const API_BASE_URL = getApiUrl();
