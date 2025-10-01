export const dynamic = "force-dynamic"; // Ensures SSR

export default async function Services() {
  // Simulate server-side data fetching
  const servicesData = [
    { title: "Machine Learning & AI Development", description: "Custom AI models, predictive analytics, and automation solutions.", status: "Available Now" },
    { title: "Data Science Services", description: "Advanced data analysis, visualization, and insights for business decisions.", status: "Available Now" },
    { title: "Crypto & Bitcoin Software", description: "Secure software for crypto networks, including wallets and trading tools.", status: "Available Now" },
    { title: "dApp Development", description: "Decentralized apps for Ethereum, Solana, and other blockchain networks.", status: "Available Now" },
    { title: "AI-Blockchain Fusion", description: "Integrated platforms for AI-enhanced smart contracts and predictive crypto trading.", status: "Coming Soon" },
  ];

  return (
    <div>
      <h2 className="text-4xl font-bold mb-10 text-center text-purple-800">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <div
            key={index}
            className={service.status === "Coming Soon" ? "card-soon" : "card"}
            aria-label={`Service: ${service.title}`}
          >
            <h3 className={`text-2xl font-semibold mb-4 ${service.status === "Coming Soon" ? "text-purple-800" : "text-purple-500"}`}>
              {service.title}
            </h3>
            <p className="mb-4 text-gray-900">{service.description}</p>
            <span className={`text-sm font-bold ${service.status === "Coming Soon" ? "text-purple-500" : "text-white bg-purple-500 px-3 py-1 rounded-full"}`}>
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}