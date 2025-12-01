// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// const navLinks = [
//   { href: "/", label: "Home" },
//   { href: "/about", label: "About" },
//   { href: "/services", label: "Services" },
//   { href: "/contact", label: "Contact" },
// ];

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();

//   // close on route change
//   useEffect(() => setOpen(false), [pathname]);

//   // close on Esc
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   return (
//     <header className="w-full bg-white/90 backdrop-blur sticky top-0 z-40 ">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-xl font-semibold">
//               <span className="text-red-400">E</span>
//               <span className="text-orange-400">-</span>
//               <span className="text-yellow-400">L</span>
//               <span className="text-green-400">e</span>
//               <span className="text-teal-400">a</span>
//               <span className="text-blue-400">r</span>
//               <span className="text-indigo-400">n</span>
//               <span className="text-purple-400">i</span>
//               <span className="text-pink-400">n</span>
//               <span className="text-rose-400">g</span>
//             </Link>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex md:items-center md:gap-6">
//             {navLinks.map((link) => {
//               const active = pathname === link.href;
//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`px-3 py-2 text-sm font-medium transition-colors ${
//                     active
//                       ? "text-sky-600 border-b-2 border-sky-600"
//                       : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right actions (example) */}
//           <div className="hidden md:flex md:items-center md:gap-4">
//             <Link
//               href="/login"
//               className="px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100"
//             >
//               Log in
//             </Link>
//              <Link
//               href="/register"
//               className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-medium"
//             >
//               SingUp
//             </Link>
//           </div>

//           {/* Mobile Hamburger */}
//           <div className="flex md:hidden">
//             <button
//               onClick={() => setOpen((s) => !s)}
//               aria-controls="mobile-menu"
//               aria-expanded={open}
//               aria-label={open ? "Close menu" : "Open menu"}
//               className="p-2 inline-flex items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
//             >
//               {open ? (
//                 <XMarkIcon className="h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile panel */}
//       <div
//         id="mobile-menu"
//         className={`md:hidden transition-[max-height,opacity] duration-200 ease-in-out overflow-hidden ${
//           open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="px-4 pt-2 pb-6 space-y-1">
//           {navLinks.map((link) => {
//             const active = pathname === link.href;
//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setOpen(false)}
//                 className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
//                   active
//                     ? "text-sky-600 bg-sky-50"
//                     : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}

//           <div className="mt-2 border-t pt-3">
//             <Link
//               href="/login"
//               onClick={() => setOpen(false)}
//               className="block px-3 py-2 rounded-md text-base text-slate-700 hover:bg-slate-100"
//             >
//               Log in
//             </Link>
//             <Link
//               href="/signup"
//               onClick={() => setOpen(false)}
//               className="block mt-2 px-3 py-2 rounded-md text-base font-medium bg-sky-600 text-white text-center"
//             >
//               Sign up
//             </Link>
//           </div>
//         </div>
//       </div>

      
//     </header>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    // Replace this with your actual auth check
    // Examples:
    // - Check localStorage/sessionStorage for token
    // - Check authentication context
    // - Call an API endpoint
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setUserDropdownOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    // Optionally redirect to home or login page
    // window.location.href = "/";
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur sticky top-0 z-40 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold">
              <span className="text-red-400">E</span>
              <span className="text-orange-400">-</span>
              <span className="text-yellow-400">L</span>
              <span className="text-green-400">e</span>
              <span className="text-teal-400">a</span>
              <span className="text-blue-400">r</span>
              <span className="text-indigo-400">n</span>
              <span className="text-purple-400">i</span>
              <span className="text-pink-400">n</span>
              <span className="text-rose-400">g</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-sky-600 border-b-2 border-sky-600"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {!isLoggedIn ? (
              // Show login/signup when not logged in
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // Show user menu when logged in
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="font-medium">Account</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="p-2 inline-flex items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {open ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-[max-height,opacity] duration-200 ease-in-out overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  active
                    ? "text-sky-600 bg-sky-50"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-2 border-t pt-3">
            {!isLoggedIn ? (
              // Mobile: show login/signup
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base text-slate-700 hover:bg-slate-100"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block mt-2 px-3 py-2 rounded-md text-base font-medium bg-sky-600 text-white text-center"
                >
                  Sign up
                </Link>
              </>
            ) : (
              // Mobile: show user menu
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base text-slate-700 hover:bg-slate-100"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 mt-2 rounded-md text-base font-medium bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}