import { HiOutlineUsers } from 'react-icons/hi'
import { useState } from 'react'
import CreateUserModal from '@/components/CreateUserModal'

const UsersView = () => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
    return (
        <div className="p-8 max-w-screen-xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Admin · Users</p>
                    <h1 className="text-4xl font-bold italic text-gray-900">
                        Users
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateUserModalOpen(true)}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                >
                    Create User
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <HiOutlineUsers className="text-3xl text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                    Work in progress
                </p>
                <p className="text-sm text-gray-500">
                    This section is under construction.
                </p>
            </div>
            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                onClose={() => setIsCreateUserModalOpen(false)}
            />
        </div>
    )
}

export default UsersView
