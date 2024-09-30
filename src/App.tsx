import { Modal, notification } from 'antd'
import './App.css';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { createNewUser, deleteUser, getAllUsers, updateUserInfo } from './services/user.service';
import mailIcon from "./assets/mail-icon.svg";
import userIcon from "./assets/user-icon.svg";
import mapIcon from "./assets/map-icon.svg";
import phoneIcon from "./assets/phone-icon.svg";
import userCard from "./assets/address-card.svg";
import eyeIcon from "./assets/eye-icon.svg";
import addUser from "./assets/add-user-icon.svg"
import lockIcon from "./assets/lock-icon.svg";
import CustomTable, { UserType } from './utils/CustomTable';
import EditInput from './components/EditInput';
import { debounce } from "lodash";
function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNewUserModalOpen,setIsNewUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [newUser, setNewUser] = useState<UserType>();
  const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [password,setPassword] = useState<string>("");
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: value,
      });
    }
  };

  const handleNewUser = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState!,
      [name]: value, 
    }));
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
  const handleOkDeleteModal = () => {
    deleteUser(selectedUser!.id,password).then(() => {
      openSuccessNotification("User Deleted Successfully")
      setIsDeleteModalOpen(false);
      setIsUpdateSuccess(!isUpdateSuccess)
    }).catch(() => {
      openFailedNotification("An Error Was Encountered While Deleting The User")
    })
  };
  const handleOkNewUserModal = () => {
    createNewUser(newUser!).then(() => {
      openSuccessNotification("User Created Successfully")
      setIsNewUserModalOpen(false)
      setIsUpdateSuccess(!isUpdateSuccess)
    }).catch(() => {
      openFailedNotification("An Error Was Encountered While Creating A User")
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsNewUserModalOpen(false)
  };
  const handleModal = (selectedUserId: number, setModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const user = data?.data.find((user: UserType) => user.id === selectedUserId);
    setSelectedUser(user);
    setModalOpen(true);
  };
  
  const showModal = (selectedUserId: number) => {
    handleModal(selectedUserId, setIsModalOpen);
  };
  
  const showDeleteModal = (selectedUserId: number) => {
    handleModal(selectedUserId, setIsDeleteModalOpen);
  };

  return (
    <>
      <div className='flex flex-col justify-center mt-10 items-center'>
        <div className='flex w-full mb-5 items-end justify-center gap-5'>
          <div className='flex w-1/4'>
            <input
              onChange={(e) => handleSearch(e)}
              placeholder='Search'
              type="text"
              className='border p-2 px-5 w-full rounded-full focus:outline-none focus:border-sky-500 focus:ring-sky-500'
            />
          </div>
          <button onClick={() => setIsNewUserModalOpen(true)} className='p-2 gap-2 border border-[#28a745] mx-4 rounded-full flex items-center justify-center bg-[#F6FFED]'>
            <span className='text-[#28a745]'>Add User</span>
            <img src={addUser} width={20} alt="" />
          </button>
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
            showDeleteModal={showDeleteModal}
          />
        }
      </div>
      {/* New User Modal */}
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
              <EditInput icon={mailIcon} value={selectedUser.email} name="email" handleChange={(e) => handleUserInfoChange(e)} type='email'/>
              <EditInput icon={userIcon} value={selectedUser.name} name="name" handleChange={(e) => handleUserInfoChange(e)} type='text'/>
              <EditInput icon={userCard} value={selectedUser.surname} name="surname" handleChange={(e) => handleUserInfoChange(e)} type='text'/>
              <EditInput icon={mapIcon} value={selectedUser.district} name="district" handleChange={(e) => handleUserInfoChange(e)} type='text'/>
              <EditInput icon={phoneIcon} value={selectedUser.phone} name="phone" handleChange={(e) => handleUserInfoChange(e)} type='phone'/>
              <form className="w-full mx-auto">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select a Role</label>
                <select name='role' onChange={(e) => handleUserInfoChange(e)} defaultValue={selectedUser.role} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </form>
            </>
          }
        </div>
      </Modal>
      {/* Delete User Modal */}
      <Modal
        width={"20%"}
        title={(selectedUser) && selectedUser.name + " " + selectedUser.surname}
        open={isDeleteModalOpen}
        okText="Save"
        onOk={handleOkDeleteModal}
        onCancel={handleCancel}
      >
        <div className='mx-3 mt-6'><span className='font-semibold'>Enter User Password</span></div>
        <div className='flex flex-col gap-3 items-center my-5 mx-4'>
          {selectedUser &&
            <>
              <div className='relative w-full'>
                  <img src={eyeIcon} className='absolute right-3 top-3 w-4 h-4' alt="" />
                  <input onChange={(e) => setPassword(e.target.value)} className='p-2 px-4 w-full rounded-2xl border focus:outline-none focus:border-sky-500 focus:ring-sky-500' type="password"/>
              </div>
            </>
          }
        </div>
      </Modal>
      {/* New User Modal */}
      <Modal
        width={"20%"}
        title={(selectedUser) && selectedUser.name + " " + selectedUser.surname}
        open={isNewUserModalOpen}
        okText="Save"
        onOk={handleOkNewUserModal}
        onCancel={handleCancel}
      >
        <div className='flex flex-col gap-3 items-center my-8 mx-4'>
          {
            <>
              <EditInput icon={mailIcon} value='' name="email" handleChange={(e) => handleNewUser(e)} type='email'/>
              <EditInput icon={userIcon} value='' name="name" handleChange={(e) => handleNewUser(e)} type='text'/>
              <EditInput icon={userCard} value='' name="surname" handleChange={(e) => handleNewUser(e)} type='text'/>
              <EditInput icon={mapIcon} value='' name="district" handleChange={(e) => handleNewUser(e)} type='text'/>
              <EditInput icon={phoneIcon} value='' name="phone" handleChange={(e) => handleNewUser(e)} type='text'/>
              <EditInput icon={lockIcon} value='' name="password" handleChange={(e) => handleNewUser(e)} type='password'/>
              <form className="w-full mx-auto">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select a Role</label>
                <select name='role' onChange={(e) => handleNewUser(e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
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
