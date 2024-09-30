import React from 'react'
interface EditInputProps {
    icon: string;
    value: string;
    name: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
}
const EditInput = ({icon,value,handleChange,name,type}: EditInputProps) => {
  return (
    <div className='relative w-full'>
        <img src={icon} className='absolute left-2 top-3 w-4 h-4' alt="" />
        <input placeholder={name.charAt(0).toUpperCase() + name.slice(1)} name={name} onChange={(e) => handleChange(e)} className='py-2 px-7 w-full rounded-2xl border focus:outline-none focus:border-sky-500 focus:ring-sky-500' type={type} defaultValue={value}/>
    </div>
  )
}

export default EditInput