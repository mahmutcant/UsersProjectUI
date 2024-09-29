import { Modal } from 'antd'
import './App.css';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllUsers } from './services/user.service';
import mailIcon from "./assets/mail-icon.svg";
import userIcon from "./assets/user-icon.svg";
import mapIcon from "./assets/map-icon.svg";
import phoneIcon from "./assets/phone-icon.svg";
import userCard from "./assets/address-card.svg"
import CustomTable, { UserType } from './utils/CustomTable';
import EditInput from './components/EditInput';

function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>();
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [name]: value,
      });
    }
  };
  const fetchUsers = async () => {
    const { data, total } = await getAllUsers(pageSize, page)
    return { data, total };
  };
  const { data, error, isLoading } = useQuery(['userData', page, pageSize], fetchUsers);

  const handleOk = () => {
    setIsModalOpen(false);
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
      {(!error && !isLoading && data?.data) && <div className='flex justify-center mt-12'>
        <CustomTable data={data.data} page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} total={data.total} showModal={showModal} />
      </div>}
      <Modal width={"20%"} title={(selectedUser) && selectedUser.name + " " + selectedUser.surname} open={isModalOpen} okText="Save" onOk={handleOk} onCancel={handleCancel}>
        <div className='flex flex-col gap-3 items-center my-8 mx-4'>
          {selectedUser &&
            <>
              <EditInput icon={mailIcon} value={selectedUser.email} name="email" handleChange={(e) => handleUserInfoChange(e)}/>
              <EditInput icon={userIcon} value={selectedUser.name} name="name" handleChange={(e) => handleUserInfoChange(e)}/>
              <EditInput icon={userCard} value={selectedUser.surname} name="surname" handleChange={(e) => handleUserInfoChange(e)}/>
              <EditInput icon={mapIcon} value={selectedUser.district} name="district" handleChange={(e) => handleUserInfoChange(e)}/>
              <EditInput icon={phoneIcon} value={selectedUser.phone} name="phone" handleChange={(e) => handleUserInfoChange(e)}/>
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
