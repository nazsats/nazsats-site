export const dynamic = "force-dynamic"; // Ensures SSR

import SubscribeForm from "../components/SubscribeForm";

export default async function Home() {
  // Simulate server-side data fetching
  const heroData = {
    title: "Welcome to Nazsats",
    description: "Nazsats is an AI-driven platform that empowers clients to build innovative solutions on top of artificial intelligence. We specialize in machine learning, data science, and advanced analytics to help businesses harness the full potential of their data.",
  };

  return (
    <div>
      <section className="relative py-20 bg-gradient-to-br from-purple-500 to-purple-300 text-white text-center rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute top-4 right-4 bg-lavender-200 text-purple-800 px-4 py-2 rounded-full font-bold pulse">
          Coming Soon!
        </div>
        <h2 className="text-5xl font-extrabold mb-6 tracking-wide">{heroData.title}</h2>
        <p className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed">{heroData.description}</p>
        <a href="/services" className="btn-primary">Explore Services</a>
      </section>

      <section className="py-20">
        <h3 className="text-4xl font-bold mb-10 text-center text-purple-800">Why Nazsats?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card">
            <h4 className="text-2xl font-semibold mb-4 text-purple-500">AI Innovation</h4>
            <p className="text-gray-900">Leading-edge machine learning and analytics solutions.</p>
          </div>
          <div className="card">
            <h4 className="text-2xl font-semibold mb-4 text-purple-500">Blockchain Expertise</h4>
            <p className="text-gray-900">Secure crypto software and dApps for all networks.</p>
          </div>
          <div className="card">
            <h4 className="text-2xl font-semibold mb-4 text-purple-500">Scalable Products</h4>
            <p className="text-gray-900">AI and blockchain fusion for future-ready solutions.</p>
          </div>
          <div className="card-soon">
            <h4 className="text-2xl font-semibold mb-4 text-purple-800">Coming Soon</h4>
            <p className="text-gray-900">AI-powered crypto analytics and NFT platforms.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-purple-50 to-white rounded-xl text-center">
        <h3 className="text-3xl font-bold mb-6 text-purple-800">Join Our Launch</h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-900">Subscribe for updates on our full launch and exclusive AI-blockchain insights.</p>
        <SubscribeForm />
      </section>
    </div>
  );
}