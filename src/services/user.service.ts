import axios from "axios"

const baseURL = "http://localhost:3000"
export const getAllUsers = async(pageSize?:number,page?:number,search?:string) => {
    const response = await axios.get(
        `${baseURL}/users?${search ? `search=${search}&` : ''}${page ? `page=${page}&` : ''}${pageSize ? `pageSize=${pageSize}` : ''}`
      );
      
    return response.data;
}