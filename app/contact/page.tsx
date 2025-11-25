// src/app/contact/page.tsx
'use client'


export default function ContactPage() {
  return (
    <>
       <div className="dhabr i3xre sm:py-16 lg:py-24">
    <div className="wpaot owca9 j2be9 sm:px-6 lg:px-8">
      <div
        className="m4hp4 jfin8 absolute erng7 top-0 y4ea6 overflow-hidden epqyg lg:h-72"
      >
        <img
          src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/contact/contact-4.png"
          alt="Office interior with modern workspace"
          className="n85ea w-full c7ys3"
        />
      </div>

     
      <div className="relative dpzny k6gdi sm:gap-16 lg:grid-cols-2 lg:gap-24">
  
        <div className="tlnfm max-lg:mt-10">
          <div className="hqh7v">
            <h2 className="waiii t3mfo n7g25 md:text-3xl lg:text-4xl">Reach Out to Us</h2>
            <p className="bk5oo u7qxt">
              Need support, have a query, or looking for collaboration? Let’s talk!
            </p>
          </div>
          <div className="erk8w">
            <div className="vi1oq">
              <h2 className="text-base-content waiii t3mfo">Contact Information</h2>
              <p className="text-base-content/80">
                Explore new destinations, indulge in local cuisines, and immerse yourself in diverse cultures.
              </p>
            </div>
            <div className="hqh7v">
         
              <div className="flex items-center sly4q">
                <span className="icon-[tabler--phone] text-base-content size-5" aria-hidden="true"></span>
                <span className="text-base-content font-medium">+1-316-555-1258</span>
              </div>
           
              <div className="flex items-center sly4q">
                <span className="icon-[tabler--mail] text-base-content size-5" aria-hidden="true"></span>
                <a href="mailto:hadams@hotmail.com" className="text-base-content font-medium">
                  hadams@hotmail.com
                </a>
              </div>
            
              <div className="flex qojvm sly4q">
                <span className="icon-[tabler--map-pin] text-base-content size-5" aria-hidden="true"></span>
                <address className="text-base-content font-medium f9bat">
                  802 Pension Rd, Maine 96812, USA
                </address>
              </div>
            </div>
           
            <div className="flex njdg2" aria-label="Social media links">
              <a href="#">
                <div className="nfjpm rmjll">
                  <div className="dxw29 rgf08 ao3uo rounded-full">
                    <span className="icon-[tabler--brand-github] size-5"></span>
                  </div>
                </div>
              </a>
              <a href="#">
                <div className="nfjpm rmjll">
                  <div className="xrxte k8xvt ao3uo rounded-full">
                    <span className="icon-[tabler--brand-discord] size-5"></span>
                  </div>
                </div>
              </a>
              <a href="#">
                <div className="nfjpm rmjll">
                  <div className="e55a4 od3h2 ao3uo rounded-full">
                    <span className="icon-[tabler--brand-twitter] size-5"></span>
                  </div>
                </div>
              </a>
              <a href="#">
                <div className="nfjpm rmjll">
                  <div className="kn3q0 milpc ao3uo rounded-full">
                    <span className="icon-[tabler--brand-youtube] size-5"></span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

     
        <div className="zq390 ycfhr">
          <div className="nqxya">
            <form className="o63tj" >
              <div className="flex w-full mnhlk ip6vv">
                <div className="qzwp2 sxihv">
                  <label className="wqwbi">Your Name</label>
                  <input type="text" className="ljn0d fo8mv" placeholder="Enter your name" id="name" required />
                </div>
                <div className="qzwp2 sxihv">
                  <label className="wqwbi">Your Email</label>
                  <input type="email" className="ljn0d fo8mv" placeholder="Enter your email" id="email" required />
                </div>
              </div>

              <div>
                <label className="wqwbi">Subject</label>
                <input type="text" className="ljn0d fo8mv" placeholder="Enter subject" id="subject" required />
              </div>

              <div>
                <label className="wqwbi">Message</label>
                <textarea
                  className="ystrl mekyd"
                  placeholder="Type your message here..."
                  id="message"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary y1dss w-full">
                Send Message
                <span className="icon-[tabler--send] size-5" aria-hidden="true"></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</>
  )
}