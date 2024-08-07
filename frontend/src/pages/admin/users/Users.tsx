import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from '../../../api-client';
import { useEffect, useState } from "react";
import Pagination from "../../../components/search/filters/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";

const Users = () => {
    const [searchData, setSearchData] = useState("");
    const [page, setPage] = useState<number>(1);
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState("");
    const [blockStatus, setBlockStatus] = useState(false);

    const searchParams = {
        destination: searchData,
        page: page.toString(),
    }

    const { data: userData, refetch } = useQuery(["loadUsers", searchParams],
        () => apiClient.loadUsers(searchParams), {
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        enabled: !!searchData
    });

    const blockUser = useMutation<void, Error, string>(apiClient.blockUser, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadUsers");
        }
    });

    const unblockUser = useMutation<void, Error, string>(apiClient.unblockUser, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadUsers");
        }
    });

    const handleBlock = async (userId: string) => {
        setUserId(userId);
        setBlockStatus(false);
        setShowModal(true);
    };

    const handleUnblock = async (userId: string) => {
        setUserId(userId);
        setBlockStatus(true);
        setShowModal(true);
    };

    const handleClear = () => {
        setSearchData("");
    }

    useEffect(() => {
        refetch();
    }, [handleBlock, handleUnblock])

    return (
        <div className="bg-gray-300 p-5 border border-slate-300 rounded space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">Users</h1>
            </span>
            <ConfirmModal isOpen={showModal} message={`Do you really wish to ${blockStatus ? "Unblock" : "Block"} ${userId}`}
                onClose={function (): void {
                    setShowModal(false);
                }} onConfirm={async function (): Promise<void> {
                    setShowModal(false);
                    if (blockStatus) { await unblockUser.mutateAsync(userId); }
                    else { await blockUser.mutateAsync(userId); }
                }} />
            <div className="overflow-x-auto">
                <div className="flex flex-row items-center flex-1 bg-white p-2 border rounded mb-2">
                    <input placeholder="Search users by name, email or mobile..." value={searchData}
                        className="text-md w-full focus:outline-none"
                        onChange={(event) => { setSearchData(event.target.value) }} />
                    <button className="w-100 font-semibold text-lg hover:shadow px-2"
                        onClick={handleClear}>
                        Clear
                    </button>
                </div>
                <table className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-800 px-4 py-2">User Name</th>
                            <th className="border border-gray-800 px-4 py-2">Email</th>
                            <th className="border border-gray-800 px-4 py-2">Mobile</th>
                            <th className="border border-gray-800 px-4 py-2">Status</th>
                            <th className="border border-gray-800 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(userData && userData.data.length > 0) ? userData.data.map((user) => (
                            <tr key={user._id} className="bg-white">
                                <td className="border border-gray-800 px-4 py-2">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="border border-gray-800 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-800 px-4 py-2">{user.mobile}</td>
                                <td className="border border-gray-800 px-4 py-2">
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </td>
                                <td className="border border-gray-800 px-4 py-2">
                                    <div className="flex justify-center">
                                        {!user.role.includes("admin") && <span>
                                            {user.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblock(user._id)}
                                                    className="w-100 text-blue-600 h-full p-2 font-semibold text-lg hover:text-red-600 hover:shadow-lg px-2 py-1"
                                                >
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlock(user._id)}
                                                    className="w-100 text-red-600 h-full p-2 font-semibold text-lg hover:text-blue-600 hover:shadow-lg px-2 py-1"
                                                >
                                                    Block
                                                </button>
                                            )}
                                        </span>}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <>
                                <span className="ml-2">Users list empty</span>
                            </>
                        )}
                    </tbody>
                </table>
                <Pagination
                    page={userData?.pagination.page || 1}
                    pages={userData?.pagination.pages || 1}
                    onPageChange={(page) => setPage(page)} />
            </div>
        </div>
    )
}

export default Users;
