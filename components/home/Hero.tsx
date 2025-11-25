"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function HeroHeader() {
  useEffect(() => {
    // Theme + RTL from URL params (runs once)
    const themeParam = new URLSearchParams(window.location.search).get("theme");
    const dirRTL = new URLSearchParams(window.location.search).get("rtl");
    if (themeParam) document.documentElement.setAttribute("data-theme", themeParam);
    if (dirRTL === "true") document.documentElement.setAttribute("dir", "rtl");

    // Header scroll handler (adds/removes classes)
    const header = document.getElementById("header");
    function checkScroll() {
      if (!header) return;
      if (window.scrollY > 0) {
        header.classList.add("bg-base-100", "shadow-sm", "shadow-base-300/20");
      } else {
        header.classList.remove("bg-base-100", "shadow-sm", "shadow-base-300/20");
      }
    }
    // initial check + event listener
    checkScroll();
    window.addEventListener("scroll", checkScroll);

    // Clone marquees (duplicate content for seamless scroll)
    // run once on load
    const clones = document.querySelectorAll<HTMLElement>(".clone");
    clones.forEach((item) => {
      const content = item.innerHTML;
      // duplicate 4 times like original HTML
      item.innerHTML = content + content + content + content;
    });

    // cleanup
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <div className="bg-base-100">
   

      <main className="sxihv">
        <div className="wpaot owca9 j2be9 sm:px-6 lg:px-8">
          <div className="flex jz3o6 items-center njdg2 j0epe rdi5h">
            <h1 className="intersect-once text-base-content intersect:motion-preset-slide-down-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-300 relative cxzfk leading-[1.15] fl9z1 lfitq max-md:text-3xl">
              Everything You Need to Run & Grow Your Business
            </h1>

            <p className="intersect-once text-base-content/80 intersect:motion-preset-slide-down-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-400 lj0c4">
              An all-in-one SaaS platform to automate tasks, boost productivity, and unlock sustainable growth for teams of every size.
            </p>

            <div className="intersect-once intersect:motion-preset-slide-down-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-500 border-base-content/20 flex ycfhr w-full xt4vn justify-between dcvi3 rounded-full border qr9u1 b9hof k0kz4 e8igd">
              <label className="rui3g" htmlFor="email">Enter your prompt</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your business email"
                className="ljn0d o22n0 oo8gv sxihv pelb3 m233p i832r"
              />
              <button type="submit" className="btn btn-primary rounded-full">Start Free Trial</button>
            </div>
          </div>

          {/* hero graphics / cards */}
          <div className="usocq sm:mt-16 lg:mt-24">
            <div className="relative wpaot owca9 overflow-hidden">
              <div className="absolute obwa1 top-[76%]">
                <div className="relative">
                  <div className="intersect-once a58mj intersect:motion-preset-focus-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-1000 absolute top-1/2 l3cle e6fa4 rounded-full rtl:translate-x-1/2" />
                  <div className="intersect-once uyq3n intersect:motion-preset-focus-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-1200 absolute top-1/2 i4e0x e6fa4 rounded-full rtl:translate-x-1/2" />
                  <div className="intersect-once ppfk6 intersect:motion-preset-focus-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-1300 absolute top-1/2 hs8vy e6fa4 rounded-full rtl:translate-x-1/2" />
                </div>
              </div>

              <img
                src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/hero/hero-20.png"
                alt="girl Profile"
                className="intersect-once intersect:motion-preset-focus-md intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-1500 relative gp9pz w-full oeoy3 max-sm:-bottom-18"
              />

              <div className="intersect-once intersect:motion-preset-slide-up-lg intersect:motion-opacity-in-0 intersect:motion-delay-1650 absolute start-[15%] d0k14 max-lg:hidden">
                <span className="relative">
                  <span className="p0chm t0qpo milpc npgus fquxj p4lhc j2be9 py-2 shadow-lg">John</span>
                  <span className="icon-[tabler--location-filled] cqawe absolute v6srz size-6 rtl:rotate-y-180" />
                </span>
              </div>

              <div className="intersect-once intersect:motion-preset-slide-up-lg intersect:motion-opacity-in-0 intersect:motion-delay-1650 absolute end-[18%] hctff max-lg:hidden">
                <span className="relative">
                  <span className="mmlrz od3h2 rlxmn k45wh vrxn0 mdxuz j2be9 py-2 shadow-lg">Jake</span>
                  <span className="icon-[tabler--location-filled] coj8b qkaca absolute nm0o2 edc79 size-6 eut0v rtl:rotate-y-360" />
                </span>
              </div>

              <div className="intersect-once intersect:motion-preset-focus intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-1650 absolute end-[10%] uv49u mtepi max-lg:hidden">
                <div className="e6bd8 j7bl3 rounded-box bg-base-100 shadow-base-300/20 relative fuve8 px-3 py-2 zw50f">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-base-content/50 sxihv text-sm font-medium">Physical Product</p>
                    <div className="flex items-center eovr6">
                      <div className="nfjpm rmjll">
                        <div className="kzsz6 lpcq7 rounded-full">
                          <span className="icon-[tabler--arrow-up] size-4" />
                        </div>
                      </div>
                      <span className="text-success text-sm t3mfo">14.78%</span>
                    </div>
                  </div>

                  <h3 className="text-base-content w3dp6 waiii t3mfo">$78,263</h3>

                  <div className="flex items-center justify-between">
                    <div className="rp44n vaa4r">
                      <div className="nfjpm">
                        <div className="lpbrp">
                          <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="User 1" />
                        </div>
                      </div>
                      <div className="nfjpm">
                        <div className="lpbrp">
                          <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png" alt="User 2" />
                        </div>
                      </div>
                      <div className="nfjpm">
                        <div className="lpbrp">
                          <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png" alt="User 3" />
                        </div>
                      </div>
                      <div className="nfjpm">
                        <div className="lpbrp">
                          <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-4.png" alt="User 4" />
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-soft btn-sm btn-primary rounded-full">
                      View all
                      <span className="icon-[tabler--arrow-right] size-4" />
                    </button>
                  </div>

                  <div className="bg-base-100 border-base-content/20 xph4m absolute hgke1 q9xkq flex size-8 items-center justify-center border">
                    <span className="icon-[tabler--chart-bar] text-primary size-5" />
                  </div>
                </div>
              </div>

              <div className="intersect-once intersect:motion-preset-focus intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-1650 absolute start-[8%] bottom-[14%] mtepi max-md:hidden">
                <div className="e6bd8 j7bl3 rounded-box bg-base-100 shadow-base-300/20 relative r2qpi j2be9 mrpnf zw50f">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-base-content/50 text-sm">Average Daily Sales</p>
                    <span className="ijn5q bxh1m ctq8s rounded-full">
                      <span className="icon-[tabler--arrow-down] size-4" />
                      3.4%
                    </span>
                  </div>

                  <h3 className="text-base-content w3dp6 waiii t3mfo">$78,263</h3>

                  <div className="flex w-full items-center justify-between">
                    {/* progress columns - keep markup as-is, FlyonUI will style */}
                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="50% Vertical Progressbar"
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary ym8i9" />
                      </div>
                      <p className="text-base-content/50 text-sm">Jan</p>
                    </div>

                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="20% Vertical Progressbar"
                        aria-valuenow={20}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary r712v" />
                      </div>
                      <p className="text-base-content/50 text-sm">Feb</p>
                    </div>

                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="60% Vertical Progressbar"
                        aria-valuenow={60}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary eazdk" />
                      </div>
                      <p className="text-base-content/50 text-sm">Mar</p>
                    </div>

                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="30% Vertical Progressbar"
                        aria-valuenow={30}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary a0r3g" />
                      </div>
                      <p className="text-base-content/50 text-sm">Apr</p>
                    </div>

                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="65% Vertical Progressbar"
                        aria-valuenow={65}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary m75gd" />
                      </div>
                      <p className="text-base-content/50 text-sm">May</p>
                    </div>

                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="80% Vertical Progressbar"
                        aria-valuenow={80}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary eckwz" />
                      </div>
                      <p className="text-base-content/50 text-sm">Jun</p>
                    </div>

                    <div className="flex jz3o6 items-center bglhu">
                      <div
                        className="progress n5ibf afh3x g05ek"
                        role="progressbar"
                        aria-label="45% Vertical Progressbar"
                        aria-valuenow={45}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="progress-bar progress-primary xgh1a" />
                      </div>
                      <p className="text-base-content/50 text-sm">Jul</p>
                    </div>
                  </div>

                  <div className="bg-base-100 border-base-content/20 xph4m absolute hgke1 q9xkq flex size-8 items-center justify-center border">
                    <span className="icon-[tabler--layout-2] text-primary size-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className=" intersect-once sm:intersect:motion-preset-slide-up-lg sm:intersect:motion-duration-800 sm:intersect:motion-opacity-in-0 sm:intersect:motion-delay-700 flex w-full items-center k6gdi p-4 max-sm:flex-col">
              <h5 className="text-1xl md:text-2xl lg:text-3xl lg:text-left font-extrabold text-slate-900 leading-tight">Trusted</h5>
              <div className="relative bov3n w-full overflow-hidden">
                <div className="clone p4iql rtl:animate-marqueeleft absolute flex items-center justify-center k6gdi">
                  <img src="/client1.png" alt="University of Mississippi" className="nxpwg shrink-0" />
                  <img src="/client2.png" alt="Star Health" className="jlyho shrink-0" />
                  <img src="/client3.png" alt="DHL" className="vro82 shrink-0" />
                  <img src="/client1.png" alt="Sense Arena" className="kf4wy shrink-0" />
                  <img src="/client2.png" alt="Shemaroo" className="oe593 shrink-0" />
                  <img src="/client3.png" alt="Mercedes Benz" className="adeu5 shrink-0" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>





    </div>
  );
}
