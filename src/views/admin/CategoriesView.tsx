import { HiOutlineCollection } from 'react-icons/hi'

const CategoriesView = () => {
    return (
        <div className="p-8 max-w-screen-xl">
            <div className="mb-8">
                <p className="text-sm text-gray-500 mb-1">Admin · Categories</p>
                <h1 className="text-4xl font-bold italic text-gray-900">
                    Categories
                </h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <HiOutlineCollection className="text-3xl text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                    Work in progress
                </p>
                <p className="text-sm text-gray-500">
                    This section is under construction.
                </p>
            </div>
        </div>
    )
}

export default CategoriesView
