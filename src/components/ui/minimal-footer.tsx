import {
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import { type Language } from "../../types";

interface MinimalFooterProps {
  lang: Language;
}

export function MinimalFooter({ lang }: MinimalFooterProps) {
  const year = new Date().getFullYear();

  const company = [
    {
      title: lang === "id" ? "Tentang Kami" : "About Us",
      href: "#",
    },
    {
      title: lang === "id" ? "Karir" : "Careers",
      href: "#",
    },
    {
      title: lang === "id" ? "Aset Merek" : "Brand assets",
      href: "#",
    },
    {
      title: lang === "id" ? "Kebijakan Privasi" : "Privacy Policy",
      href: "#",
    },
    {
      title: lang === "id" ? "Syarat Layanan" : "Terms of Service",
      href: "#",
    },
  ];

  const resources = [
    {
      title: "Blog",
      href: "#",
    },
    {
      title: lang === "id" ? "Pusat Bantuan" : "Help Center",
      href: "#",
    },
    {
      title: lang === "id" ? "Hubungi Dukungan" : "Contact Support",
      href: "#",
    },
    {
      title: lang === "id" ? "Komunitas" : "Community",
      href: "#",
    },
    {
      title: lang === "id" ? "Keamanan" : "Security",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <InstagramIcon className="w-4 h-4" />,
      link: "#",
    },
    {
      icon: <TwitterIcon className="w-4 h-4" />,
      link: "#",
    },
    {
      icon: <YoutubeIcon className="w-4 h-4" />,
      link: "#",
    },
  ];

  return (
    <footer className="relative bg-white pt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 border-t border-slate-200">
        <div className="grid max-w-7xl grid-cols-6 gap-6 py-12">
          <div className="col-span-6 flex flex-col gap-5 md:col-span-4 max-w-sm">
            <div className="text-xl font-black tracking-tighter uppercase text-emerald-700 flex items-center gap-1">
              FITOLOGY.<span className="text-orange-500"></span>
            </div>
            <p className="text-slate-500 font-sans text-sm text-balance">
              {lang === "id"
                ? "Kalkulator cerdas yang memetakan proporsi dimensimu secara akurat untuk menemukan bentuk tubuh aslimu."
                : "A smart calculator that accurately maps your dimensions to uncover your true body shape."}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  className="hover:bg-slate-100 text-slate-500 hover:text-emerald-700 duration-200 rounded-md border border-slate-200 p-2"
                  target="_blank"
                  href={item.link}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-slate-900 font-semibold mb-3 block text-sm">
              {lang === "id" ? "Sumber Daya" : "Resources"}
            </span>
            <div className="flex flex-col gap-2">
              {resources.map(({ href, title }, i) => (
                <a
                  key={i}
                  className="w-max text-sm text-slate-500 duration-200 hover:text-emerald-600 hover:underline"
                  href={href}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-3 w-full md:col-span-1">
            <span className="text-slate-900 font-semibold mb-3 block text-sm">
              {lang === "id" ? "Perusahaan" : "Company"}
            </span>
            <div className="flex flex-col gap-2">
              {company.map(({ href, title }, i) => (
                <a
                  key={i}
                  className="w-max text-sm text-slate-500 duration-200 hover:text-emerald-600 hover:underline"
                  href={href}
                >
                  {title}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-6 pb-8">
          <p className="text-slate-400 text-sm font-light">
            © {year} Fitology. {lang === "id" ? "Seluruh hak cipta dilindungi." : "All rights reserved."}
          </p>
          <div className="text-[10px] text-emerald-700/60 font-bold tracking-widest uppercase">
            {lang === "id" ? "Matriks Gaya Sistematis." : "Systematic Style Matrix."}
          </div>
        </div>
      </div>
    </footer>
  );
}
