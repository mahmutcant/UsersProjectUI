import axios from "axios"
import { UserType } from "../utils/CustomTable";

const baseURL = "http://localhost:3000"
export const getAllUsers = async(pageSize?:number,page?:number,search?:string) => {
    const response = await axios.get(
        `${baseURL}/users?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${pageSize ? `pageSize=${pageSize}` : ''}`
      );
      
    return response.data;
}

export const updateUserInfo = async(userInfo:UserType) => {
  const response = await axios.put(
      `${baseURL}/users/${userInfo.id}`,
      {
        "name": userInfo.name,
        "surname": userInfo.surname,
        "email": userInfo.email,
        "phone": userInfo.phone,
        "district": userInfo.district,
        "role": userInfo.role
      }
    );
    
  return response.data;
}

export const deleteUser = async(id:number,password:string) => {
  const response = await axios.delete(`${baseURL}/users/${id}`, { data: {
    "password": password
  }});
  return response.data;
}

export const createNewUser = async(userInfo:UserType) => {
  const response = await axios.post(
      `${baseURL}/users/save`,
      { 
        name: userInfo.name,
        surname: userInfo.surname,
        email: userInfo.email,
        password: userInfo.password,
        phone: userInfo.phone,
        district: userInfo.district,
        role: userInfo.role
      }
    );
    
  return response.data;
}