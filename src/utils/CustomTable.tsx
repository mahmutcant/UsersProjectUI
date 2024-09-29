import { Space, Table, TableProps, Tag } from 'antd';
import React from 'react'
import trashCan from "../assets/trash-icon.svg";
import penIcon from "../assets/edit-icon.svg";
interface CustomTableProps {
    data: UserType[];
    page: number;
    total:number;
    showModal: (id:number) => void;
    pageSize:number;
    setPage: (page:number) => void;
    setPageSize: (pageSize:number) => void;
}
export interface UserType {
    id: number;
    key: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    district: string;
    role: string;
  }


const CustomTable = ({data,total,page,pageSize,showModal,setPage,setPageSize}: CustomTableProps) => {
    const footer = () => {
        return (
            <div className='flex justify-end'>{data && total} Users found</div>
        )
    }
    const columns: TableProps<UserType>['columns'] = [
        
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: "10%",
          align: "center",
        },
        {
          title: 'Surname',
          dataIndex: 'surname',
          key: 'surname',
          width: "10%",
          align: "center"
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: "30%",
          align: "center"
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
          width: "10%",
          align: "center",
        },
        {
          title: 'District',
          dataIndex: 'district',
          key: 'district',
          align: "center",
          width: "10%"
        },
        {
          title: 'Role',
          key: 'role',
          dataIndex: 'role',
          align: "center",
          render: (_, data) => {
            return (
              <>
                <Tag color={data.role === "admin" ? 'geekblue' : 'green'} key={data.role}>
                  {data.role.toUpperCase()}
                </Tag>
              </>
            )
          },
          width: "10%"
        },
        {
          title: '',
          key: 'action',
          render: () => (
            <Space size="middle">
              <a><img src={trashCan} width={20} height={20} alt="" /></a>
            </Space>
          ),
          width: "20%",
          align: "center",
        },
        {
            title: 'Edit',
            dataIndex: 'id',
            key: 'id',
            width: "10%",
            align: "center",
            render: (_, data) => <button className='text-blue-400 font-bold' onClick={() => showModal(data.id)}><img src={penIcon} width={18} alt="" /></button>,
          },
      ];
  return (
    <>
    <Table<UserType>
          key={page}
          footer={footer}
          bordered
          rowHoverable
          pagination={{
            current: page,
            total: total,
            defaultPageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 15, 20],
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          columns={columns}
          dataSource={data}
        />
        </>
  )
}

export default CustomTable