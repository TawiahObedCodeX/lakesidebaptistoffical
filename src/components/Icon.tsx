"use client";

import {
  FaUser,
  FaTag,
  FaCalendarDays,
  FaCalendar,
  FaLocationDot,
  FaClock,
  FaMicrophone,
  FaArrowLeft,
  FaArrowRight,
  FaChurch,
  FaPeopleGroup,
  FaMusic,
  FaHeart,
  FaDove,
  FaSeedling,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa6";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";

const iconMap = {
  user: FaUser,
  tag: FaTag,
  "calendar-days": FaCalendarDays,
  "calendar-alt": FaCalendar,
  location: FaLocationDot,
  clock: FaClock,
  microphone: FaMicrophone,
  "arrow-left": FaArrowLeft,
  "arrow-right": FaArrowRight,
  church: FaChurch,
  "people-group": FaPeopleGroup,
  music: FaMusic,
  heart: FaHeart,
  dove: FaDove,
  seedling: FaSeedling,
  "quote-left": FaQuoteLeft,
  star: FaStar,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
} as const;

type IconName = keyof typeof iconMap;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = iconMap[name];
  if (!Component) return null;
  return (
    <Component
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      aria-hidden
    />
  );
}
