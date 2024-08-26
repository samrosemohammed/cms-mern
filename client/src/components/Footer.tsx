import { FooterLink } from "./FooterLink";
import { FooterSocialLink } from "./FooterSocialLink";
import { Facebook, Twitter, Instagram, Github, Dribbble } from "lucide-react"; // Replace these with actual icons from Lucide

export const Footer = () => {
  // Define the array of social links
  const socialLinks = [
    { Icon: Facebook, url: "https://www.facebook.com" },
    { Icon: Twitter, url: "https://www.twitter.com" },
    { Icon: Instagram, url: "https://www.instagram.com" },
    { Icon: Github, url: "https://www.github.com" },
    { Icon: Dribbble, url: "https://www.dribbble.com" },
  ];

  // Define the links for the footer
  const footerLinks = [
    {
      title: "Resource",
      links: [
        { text: "Flowbite", url: "https://flowbite.com" },
        { text: "Tailwind CSS", url: "https://tailwindcss.com" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        { text: "Github", url: "https://github.com" },
        { text: "Discord", url: "https://discord.com" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", url: "https://github.com" },
        { text: "Terms & Condition", url: "https://github.com" },
      ],
    },
  ];

  return (
    <>
      <section id="footer-section" className="footer pt-[126px]">
        <div className=" max-w-screen-xl mx-auto">
          <div className="flex justify-between">
            <a href="#">
              {" "}
              <img
                src="src/assets/brand-logo.png"
                className="w-24"
                alt="Brand Logo"
              />
            </a>
            <div className="footer-link flex gap-8 sm:gap-14">
              {footerLinks.map((footerLink, index) => (
                <FooterLink
                  key={index}
                  title={footerLink.title}
                  links={footerLink.links}
                />
              ))}
            </div>
          </div>
          <hr className=" mt-10 mb-6 border-gray-700" />
          <div className="social-box text-slate-400 flex justify-between mb-10">
            <p className="text-[14px] copyright">
              &copy; 2024 myClassroom. All Right Reserved
            </p>
            <div className="dyanmic-icon-footer">
              <FooterSocialLink socialLinks={socialLinks} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
