import { AchievementsData } from '../../models/achievements'

interface AchievementProps {
  onClose: () => void
  achievement: AchievementsData
}

const AchievementsCard: React.FC<AchievementProps> = ({
  onClose,
  achievement,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="absolute">
          <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 py-8  font-mono text-green-300 shadow-xl shadow-gray-950">
            <h2 className="col-span-2 mb-4 border-b-2 border-green-700 pb-2 text-center text-2xl font-bold text-green-400">
              {achievement.title}
            </h2>
            <button
              onClick={onClose}
              className="absolute right-2 top-0 rounded-full p-2 text-2xl font-bold text-gray-400 transition duration-200 hover:text-green-400"
              aria-label="close modal"
            >
              &times;
            </button>
            <img
              src={`/achievements/achievement${achievement.id}.webp`}
              alt={achievement.title}
              className="mx-auto my-4 h-auto w-32 rounded-xl"
            />
            <p>{achievement.description}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AchievementsCard
