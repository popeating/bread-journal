import LatestActiveProfiles from './components/LatestActiveProfiles';

export default function Home() {
  return (
    <div className="p-6 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-base-content mb-8">
          Welcome to Recipe App
        </h1>

        <div className="card bg-base-100 shadow border border-base-300 mb-8">
          <div className="card-body">
            <h2 className="card-title text-base-content mb-4">
              Active Members
            </h2>
            <LatestActiveProfiles />
          </div>
        </div>

        {/* Add other homepage content below */}
      </div>
    </div>
  );
}
