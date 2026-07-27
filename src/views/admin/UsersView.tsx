import { useState, useEffect } from 'react'
import CreateUserModal from '@/components/CreateUserModal'
import { getUsers, type User } from '@/services/UsersServices'
import { useTranslation } from 'react-i18next'

const UsersView = () => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const { t } = useTranslation()
    const fetchUsers = async () => {
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <div className="p-8 max-w-screen-xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">
                        {' '}
                        {t('usersView.admin')}
                    </p>
                    <h1 className="text-4xl font-bold italic text-gray-900">
                        {t('usersView.title')}
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateUserModalOpen(true)}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                >
                    {t('usersView.createUser')}
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                {t('usersView.table.name')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                {t('usersView.table.email')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                {t('usersView.table.role')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                {t('usersView.table.status')}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                {t('usersView.table.createdDate')}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4">
                                    {user.first_name} {user.last_name}
                                </td>

                                <td className="px-6 py-4">{user.email}</td>

                                <td className="px-6 py-4">{user.role}</td>

                                <td className="px-6 py-4">{user.status}</td>

                                <td className="px-6 py-4">{user.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                onClose={() => setIsCreateUserModalOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    )
}

export default UsersView
