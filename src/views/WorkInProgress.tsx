import { useNavigate } from 'react-router'

const WorkInProgress = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
            <div className="text-6xl mb-2">🚧</div>
            <h1 className="text-4xl font-bold heading-text">Work in Progress</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                We're building something great. Check back soon.
            </p>
            <button
                className="mt-2 px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                onClick={() => navigate('/sign-in')}
            >
                Sign In
            </button>
        </div>
    )
}

export default WorkInProgress
