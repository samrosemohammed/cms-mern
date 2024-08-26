import { LucideComponent } from "lucide-react"; // Replace this with the actual import from Lucide

interface SocialLink {
  Icon: typeof LucideComponent;
  url: string;
}

interface FooterSocialLinkProps {
  socialLinks: SocialLink[];
}

export const FooterSocialLink = ({ socialLinks }: FooterSocialLinkProps) => {
  return (
    <ul className="social-links flex items-center gap-2">
      {socialLinks.map((socialLink, index) => (
        <li
          key={index}
          className="social-link-item  hover:bg-gray-800 p-2 rounded-full cursor-pointer"
        >
          <a
            target="_blank"
            href={socialLink.url}
            className="social-link-anchor "
          >
            <socialLink.Icon size={16} className="social-icon" />
          </a>
        </li>
      ))}
    </ul>
  );
};
