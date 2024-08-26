interface Link {
  text: string;
  url: string;
}

interface FooterLinkProps {
  title: string;
  links: Link[];
}

export const FooterLink = ({ title, links }: FooterLinkProps) => {
  return (
    <div className="each-footer-item">
      <h2 className="text-[14px] mb-4 uppercase font-semibold text-slate-250">
        {title}
      </h2>
      <ul className="footer-ul space-y-2">
        {links.map((link, index) => (
          <li className="text-[14px] footer-li text-slate-400" key={index}>
            <a
              target="_blank"
              className="hover:underline underline-offset-4 footer-anchor"
              href={link.url}
              rel="noopener noreferrer"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
