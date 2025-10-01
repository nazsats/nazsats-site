export const dynamic = "force-dynamic"; // Ensures SSR

export default async function Blog() {
  // Simulate server-side data fetching
  const blogData = {
    message: "Our blog is coming soon! Stay tuned for insights on AI, blockchain, and the future of tech.",
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-8 text-purple-800">Nazsats Blog</h2>
      <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-900">{blogData.message}</p>
      <div className="card-soon inline-block">
        <h3 className="text-2xl font-semibold mb-4 text-purple-800">Coming Soon</h3>
        <p className="text-gray-900">Expect articles on AI trends, blockchain innovations, and crypto solutions.</p>
      </div>
    </div>
  );
}