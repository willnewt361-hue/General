import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudentHub Uganda — Gaming · Blog · Leadership",
  description:
    "The all-in-one platform for Ugandan students. Game with mates, express your creativity, and lead your school — all in one place.",
  keywords: [
    "Uganda students",
    "UNEB",
    "Cambridge",
    "student gaming",
    "student blog",
    "school leaders",
    "Uganda education",
  ],
  openGraph: {
    title: "StudentHub Uganda",
    description: "Game. Create. Lead. The ultimate student platform for Uganda.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface font-[Inter,system-ui,sans-serif] text-slate-200 antialiased">
        {children}
        {/* Scroll-reveal observer — runs once on hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var observer = new IntersectionObserver(function(entries){
                  entries.forEach(function(e){
                    if(e.isIntersecting){
                      e.target.classList.add('visible');
                      var d = e.target.dataset.delay;
                      if(d) e.target.style.transitionDelay = d + 'ms';
                    }
                  });
                },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
                document.querySelectorAll('.reveal,.reveal-scale,.reveal-left,.reveal-right').forEach(function(el){
                  observer.observe(el);
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
