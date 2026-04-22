// Section templates
import heroCentered from "./sections/hero-centered.json";
import heroSplit from "./sections/hero-split.json";
import heroImageBg from "./sections/hero-image-bg.json";
import features3col from "./sections/features-3col.json";
import featuresAlternating from "./sections/features-alternating.json";
import testimonialsCards from "./sections/testimonials-cards.json";
import testimonialSpotlight from "./sections/testimonial-spotlight.json";
import ctaBanner from "./sections/cta-banner.json";
import ctaSplit from "./sections/cta-split.json";
import ctaMinimal from "./sections/cta-minimal.json";
import contentTextImage from "./sections/content-text-image.json";
import contentFullwidthText from "./sections/content-fullwidth-text.json";
import contentStats from "./sections/content-stats.json";
import brandStory from "./sections/brand-story.json";
import beforeAfter from "./sections/before-after.json";
import multiColumnText from "./sections/multi-column-text.json";

import announcementBar from "./sections/announcement-bar.json";
import countdownSale from "./sections/countdown-sale.json";
import logoBanner from "./sections/logo-banner.json";
import shippingGuaranteeBar from "./sections/shipping-guarantee-bar.json";
import productCardGrid from "./sections/product-card-grid.json";
import bestsellersRow from "./sections/bestsellers-row.json";
import imageGallery from "./sections/image-gallery.json";
import instagramFeed from "./sections/instagram-feed.json";

export const sectionTemplates = [
  // Promo
  announcementBar,
  countdownSale,
  // Hero
  heroCentered,
  heroSplit,
  heroImageBg,
  // Trust
  logoBanner,
  shippingGuaranteeBar,
  // Product
  productCardGrid,
  bestsellersRow,
  // Features
  features3col,
  featuresAlternating,
  // Content
  contentTextImage,
  contentFullwidthText,
  contentStats,
  brandStory,
  beforeAfter,
  multiColumnText,
  // Testimonials
  testimonialsCards,
  testimonialSpotlight,
  // Gallery
  imageGallery,
  instagramFeed,
  // CTA
  ctaBanner,
  ctaSplit,
  ctaMinimal,

];

export const subcategories = [
  { key: "promo", label: "Promo" },
  { key: "hero", label: "Hero" },
  { key: "trust", label: "Trust" },
  { key: "product", label: "Product" },
  { key: "features", label: "Features" },
  { key: "content", label: "Content" },
  { key: "testimonials", label: "Testimonials" },
  { key: "gallery", label: "Gallery" },
  { key: "cta", label: "CTA" },

];
