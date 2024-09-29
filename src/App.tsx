import { Modal, notification } from 'antd'
import './App.css';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllUsers, updateUserInfo } from './services/user.service';
import mailIcon from "./assets/mail-icon.svg";
import userIcon from "./assets/user-icon.svg";
import mapIcon from "./assets/map-icon.svg";
import phoneIcon from "./assets/phone-icon.svg";
import userCard from "./assets/address-card.svg"
import CustomTable, { UserType } from './utils/CustomTable';
import EditInput from './components/EditInput';
import { debounce } from "lodash";
function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: value,
      });
    }
  };
  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, 500)
  const openSuccessNotification = (message: string) => {
    notification.success({
      message: <div className='font-semibold text-[#389E0D] flex items-center justify-center'>{message}</div>,
      type: 'success',
      style: { backgroundColor: "#F6FFED" }
    });
  };
  const openFailedNotification = (message: string) => {
    notification.error({
      message: <div className='font-semibold text-[#842029] flex items-center justify-center'>{message}</div>,
      type: 'error',
      style: { backgroundColor: "#F8D7DA" }
    });
  }
  const fetchUsers = async () => {
    const { data, total } = await getAllUsers(pageSize, page, search.length > 0 ? search : undefined)
    return { data, total };
  };
  const { data, error, isLoading } = useQuery(['userData', page, pageSize, isUpdateSuccess, search], fetchUsers);

  const handleOk = () => {
    updateUserInfo(selectedUser!).then(() => {
      openSuccessNotification("User Updated Successfully")
      setIsModalOpen(false);
      setIsUpdateSuccess(!isUpdateSuccess)
    }).catch(() => {
      openFailedNotification("An Error Was Encountered While Updating The User")
    })

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = (selectedUserId: number) => {
    setSelectedUser(data?.data.filter((user: UserType) => user.id === selectedUserId)[0])
    setIsModalOpen(true);
  };

  return (
    <>
      <div className='flex flex-col justify-center mt-10 items-center'>
        <div className='flex w-full mb-5 items-end justify-center'>
          <div></div>
          <div className='flex w-1/4'>
            <input
              onChange={(e) => handleSearch(e)}
              placeholder='Search'
              type="text"
              className='border p-2 px-5 w-full rounded-full focus:outline-none focus:border-sky-500 focus:ring-sky-500'
            />
          </div>
        </div>
        {(!error && !isLoading && data?.data) &&
          <CustomTable
            data={data.data}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            total={data.total}
            showModal={showModal}
          />
        }
      </div>
      <Modal
        width={"20%"}
        title={(selectedUser) && selectedUser.name + " " + selectedUser.surname}
        open={isModalOpen}
        okText="Save"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className='flex flex-col gap-3 items-center my-8 mx-4'>
          {selectedUser &&
            <>
              <EditInput icon={mailIcon} value={selectedUser.email} name="email" handleChange={(e) => handleUserInfoChange(e)} />
              <EditInput icon={userIcon} value={selectedUser.name} name="name" handleChange={(e) => handleUserInfoChange(e)} />
              <EditInput icon={userCard} value={selectedUser.surname} name="surname" handleChange={(e) => handleUserInfoChange(e)} />
              <EditInput icon={mapIcon} value={selectedUser.district} name="district" handleChange={(e) => handleUserInfoChange(e)} />
              <EditInput icon={phoneIcon} value={selectedUser.phone} name="phone" handleChange={(e) => handleUserInfoChange(e)} />
              <form className="w-full mx-auto">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select a Role</label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </form>
            </>
          }
        </div>
      </Modal>
    </>
  )
}

export default App
