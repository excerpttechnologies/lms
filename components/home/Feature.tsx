"use client";

import { useEffect } from "react";

export default function Feature() {
  useEffect(() => {
    const themeParam = new URLSearchParams(window.location.search).get("theme");
    const dirRTL = new URLSearchParams(window.location.search).get("rtl");

    if (themeParam) document.documentElement.setAttribute("data-theme", themeParam);
    if (dirRTL === "true") document.documentElement.setAttribute("dir", "rtl");
  }, []);

  useEffect(() => {
    const clones = document.querySelectorAll(".clone");
    clones.forEach((item: any) => {
      const content = item.innerHTML;
      item.innerHTML = content + content + content;
    });
  }, []);

  return (
    <section >



      <div className="i3xre sm:py-16 lg:py-24">
        <div className="wpaot owca9 j2be9 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="fr5x1 hqh7v rdi5h sm:mb-16 lg:mb-24">
            <h2 className="text-base-content wpaot eihgh waiii t3mfo md:text-3xl lg:text-4xl">
              Developed from scratch for seamless online functionality
            </h2>

            <p className="text-base-content/80 bk5oo">
              Using technology to make finance simpler, smarter and more rewarding.
            </p>

            <div className="flex items-center justify-center njdg2">
              <a href="#" className="btn btn-primary y1dss kqeru">
                Get Started
                <span className="icon-[tabler--rocket] size-5 shrink-0"></span>
              </a>
              <a href="#" className="btn btn-primary btn-soft kqeru">Learn more</a>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="dpzny ip6vv md:grid-cols-2 lg:grid-cols-3">

            {/* Card 1 */}
            <div className="zq390 lynk2 intersect-once intersect:motion-preset-slide-left intersect:motion-ease-spring-bouncier intersect:motion-duration-800 intersect:motion-opacity-in-0 nwdq3">
              <div className="nqxya njdg2">
                <div className="dhabr rounded-box flex oqa1y jz3o6 items-center justify-center">
                  <div className="rdi5h">
                    <h5 className="text-primary text-[50px] t3mfo">12K</h5>
                    <p className="text-base-content/80 s7x45 c9rvi">happy users</p>

                    <div className="rp44n flex vaa4r">
                      <div className="nfjpm">
                        <div className="gk701">
                          <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar" />
                        </div>
                      </div>

                      <div className="nfjpm rmjll">
                        <div className="bg-primary gk701 lmn89">
                          <span className="icon-[tabler--star-filled] pbo9w shrink-0"></span>
                        </div>
                      </div>

                      <div className="nfjpm">
                        <div className="gk701">
                          <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-6.png" alt="avatar" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vi1oq">
                  <h5 className="iqv7o c9rvi t3mfo">Intelligent Task Organizer</h5>
                  <p className="text-base-content/80">
                    Gain insights and make informed decisions with powerful analytics features.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="zq390 lynk2 intersect-once intersect:motion-preset-slide-left intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-[400ms] nwdq3">
              <div className="nqxya njdg2">
                <div className="dhabr rounded-box flex oqa1y yxg8d w-full jz3o6 items-center justify-center">
                  <div className="o63tj">
                    <div className="rp44n vaa4r">
                      {[1,2,3,4].map((n) => (
                        <div key={n} className="nfjpm">
                          <div className="kxiyb">
                            <img src={`https://cdn.flyonui.com/fy-assets/avatar/avatar-${n}.png`} alt="avatar" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <h5 className="text-primary w3dp6 bk5oo t3mfo">A2 Designers</h5>
                    <p className="text-base-content text-xs font-medium">
                      Community of the best product <br /> designers.
                    </p>

                    <div className="flex items-center bglhu">
                      {["Product","Design","UX","UI"].map((tag) => (
                        <div key={tag} className="j8sol rounded-field bg-base-100 border px-3 py-2">
                          <p className="text-base-content text-xs t3mfo">{tag}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="vi1oq">
                  <h5 className="iqv7o c9rvi t3mfo">Smooth Teamwork</h5>
                  <p className="text-base-content/80">
                    Achieve seamless collaboration and enhance productivity
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="zq390 lynk2 intersect-once intersect:motion-preset-slide-left intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-[800ms] nwdq3 md:max-lg:col-span-2">

              <div className="nqxya njdg2">
                <div className="dhabr rounded-box flex oqa1y jz3o6 items-center justify-center overflow-hidden">

                  {/* Top marquee */}
                  <div className="relative ue53s w-full rotate-[-6deg] overflow-hidden">
                    <div className="xikcl rtl:animate-marqueeRight clone absolute flex qaqgz">
                      {[1,2,3,4,5,6].map((n)=>(
                        <div key={n} className="flex kf4wy items-center justify-center">
                          <img src={`https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/features/workflow-icon-${n}.png`} alt="icon" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom marquee */}
                  <div className="relative ue53s w-full rotate-[-6deg] overflow-hidden">
                    <div className="p4iql rtl:animate-marqueeLeft clone absolute flex qaqgz">
                      {[7,8,9,10,11,12].map((n)=>(
                        <div key={n} className="flex kf4wy items-center justify-center">
                          <img src={`https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/features/workflow-icon-${n}.png`} alt="icon" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="vi1oq">
                  <h5 className="iqv7o c9rvi t3mfo">Smart Workflow Automation</h5>
                  <p className="text-base-content/80">
                    Optimize efficiency and reduce manual tasks with Smart Workflow Automation.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="zq390 lynk2 intersect-once intersect:motion-preset-slide-left intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-[1000ms] nwdq3 lg:col-span-2">

              <div className="nqxya njdg2">
                <div className="dhabr rounded-box relative flex oqa1y jz3o6 items-center">
                  <img
                    src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/features/features-18.png"
                    alt="Real Estate Branding"
                    className="absolute afw8k ymv10"
                  />
                </div>

                <div className="vi1oq">
                  <h5 className="iqv7o c9rvi t3mfo">Advanced Reporting</h5>
                  <p className="text-base-content/80">
                    Unlock actionable insights with in-depth reports and analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="zq390 lynk2 intersect-once intersect:motion-preset-slide-left intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-[1200ms] nwdq3">

              <div className="nqxya njdg2">
                <div className="dhabr rounded-box flex oqa1y jz3o6 items-center justify-center overflow-hidden">
                  <div className="relative rdi5h">

                    <div className="uyq3n absolute top-1/2 rzn4a e6fa4 hd2p4 rounded-full"></div>
                    <div className="ppfk6 absolute top-1/2 qt469 e6fa4 hd2p4 rounded-full"></div>
                    <div className="xr3vv absolute top-1/2 ew5bq e6fa4 hd2p4 rounded-full"></div>

                    <div className="p77uj bg-primary absolute top-1/2 v45dd e6fa4 rounded-full daip9">
                      <div className="absolute i0uht">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
                          <path
                            d="M15.5288 20.5968C16.0513 19.935 17.0459 19.9092 17.602 20.5431L21.3891 24.8605C22.1537 25.7327 21.5345 27.0998 20.3745 27.0998H13.1792C12.0519 27.0998 11.4216 25.7991 12.1196 24.9142L15.5288 20.5968ZM15.5395 5.07732C16.0768 4.40671 17.0963 4.40241 17.6391 5.06853L30.6303 21.0099C31.3487 21.8914 30.7216 23.2121 29.5844 23.2121H26.5952C26.1886 23.2121 25.8035 23.0287 25.5473 22.7131L17.6587 12.9894C17.1097 12.3134 16.0739 12.3268 15.5424 13.0168L8.39596 22.2931C8.1406 22.6246 7.74604 22.8194 7.32761 22.8195H4.13425C3.00257 22.8192 2.37392 21.5094 3.08151 20.6261L15.5395 5.07732Z"
                            fill="url(#paint0_linear)"
                          />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="vi1oq">
                  <h5 className="iqv7o c9rvi t3mfo">Integration Ready Platform</h5>
                  <p className="text-base-content/80">
                    Streamline processes and collaborate efficiently with our seamless integrations.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

 <div className="sm:py-10 lg:py-10">
      <div className="bg-base-100 wpaot owca9 j2be9 sm:px-6 lg:px-8">
        <div className="ynglj m4hp4 jfin8 relative tnh37 rukzz xzozm de25j rdi5h lm7si max-sm:pt-10 max-sm:pb-15">
          <div className="flex jz3o6 items-center justify-center ip6vv">
            <div>
              <span className="ijn5q hjio6 vnwjt rounded-full chcsy u7qxt">Subscribe Now</span>
            </div>
            <h2 className="waiii t3mfo n7g25 md:text-3xl lg:text-4xl">Stay Updated with</h2>
            <p className="lfitq u7qxt lg:w-10/12">
              Want to be the first to know when we add new components, features, blocks, or releases? Sign up for our
              newsletter and stay in the loop.
            </p>
          </div>

          <div className="absolute q9i5b left-0 max-sm:top-32">
            <img
              src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/cta/left.svg"
              alt="Left block image"
              className="max-sm:h-25"
            />
          </div>

          <div className="absolute q9i5b q4lav max-sm:top-32">
            <img
              src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/cta/right.svg"
              alt="Right block image"
              className="max-sm:h-25"
            />
          </div>
        </div>

        <div className="relative tchtz">
          <form
           
            className="border-primary bg-base-100 wpaot flex ycfhr h8emw dcvi3 rpj8y vpx91 p-3"
          >
            <div className="ljn0d md:input-lg o22n0 ka2aa pelb3">
              <span className="icon-[tabler--mail] text-base-content/80 q7z0e me-2 girx5 shrink-0" />
              <label className="rui3g" htmlFor="leadingIconDefault">Email</label>
              <input
                id="leadingIconDefault"
                type="email"
                className="sxihv"
                placeholder="Your email address"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary max-sm:btn-square md:btn-lg">
              <span className="max-sm:hidden">Get started</span>
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.6783 11.0368L9.65442 5.82339C9.24779 5.29654 8.44959 5.30648 8.0562 5.84329L4.43062 10.7906C4.24226 11.0476 3.94268 11.1995 3.62402 11.1995H2.49548C1.66785 11.1995 1.19846 10.2515 1.70018 9.5933L8.05352 1.25805C8.45167 0.735703 9.2367 0.732477 9.63913 1.25154L16.2769 9.81309C16.7864 10.4702 16.3181 11.4258 15.4866 11.4258H14.4699C14.16 11.4258 13.8676 11.2821 13.6783 11.0368ZM9.62329 10.1549L11.1844 12.0256C11.7278 12.6768 11.2648 13.6663 10.4166 13.6663H7.45051C6.62615 13.6663 6.15586 12.7249 6.65092 12.0657L8.05591 10.195C8.4432 9.67938 9.2101 9.65972 9.62329 10.1549Z"
                  fill="var(--color-primary-content)"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
    </section>
  );
}
