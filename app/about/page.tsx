export const dynamic = "force-dynamic"; // Ensures SSR

export default async function About() {
  // Simulate server-side data fetching
  const aboutData = {
    description: [
      "Nazsats is an AI-driven platform that empowers clients to build innovative solutions on top of artificial intelligence. We specialize in machine learning, data science, and advanced analytics to help businesses harness the full potential of their data.",
      "Our core expertise lies in the crypto and blockchain ecosystem. We design and develop cutting-edge software for crypto networks, create decentralized applications (dApps) across multiple blockchain platforms, and provide tailored AI solutions for the rapidly evolving digital economy.",
      "At Nazsats, we combine AI innovation with blockchain technology to deliver scalable, secure, and future-ready products for our clients.",
    ],
    comingSoon: ["AI-Powered Blockchain Analytics", "Custom dApp Templates", "Real-Time Data Science Tools", "Expanded Crypto Network Support"],
  };

  return (
    <div className="prose lg:prose-xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-purple-800">About Nazsats</h2>
      {aboutData.description.map((para, index) => (
        <p key={index} className="mb-6 leading-loose text-gray-900">{para}</p>
      ))}
      <div className="card-soon mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-purple-800">Coming Soon: Enhanced Features</h3>
        <ul className="list-disc pl-6">
          {aboutData.comingSoon.map((feature, index) => (
            <li key={index} className="text-gray-900">{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}