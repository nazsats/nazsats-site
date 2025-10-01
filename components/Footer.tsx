export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800 to-purple-500 text-white py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-lg">&copy; 2025 Nazsats. All rights reserved.</p>
        <p className="mt-2 text-lavender-100">Full Launch Coming Soon!</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="https://twitter.com/nazsats" className="hover:text-lavender-100 transition duration-300" aria-label="Twitter">
            Twitter
          </a>
          <a href="https://linkedin.com/company/nazsats" className="hover:text-lavender-100 transition duration-300" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a href="mailto:contact@nazsats.com" className="hover:text-lavender-100 transition duration-300" aria-label="Email">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}