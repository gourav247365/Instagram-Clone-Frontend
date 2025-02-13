import axios from "axios"
import { useEffect, useState } from "react"

export default function UsersList({useFor}) {
  
	const [users,setUsers]= useState([])

	const fetchUsers= ()=> {
    if(useFor === 'followers') {
      axios.get('/api/v1/users/followings')
			.then((res)=> setUsers((cur)=> [...cur,...res.data.data]))
		}
		else if(useFor === 'followings') {
      axios.get('/api/v1/users/followers')
			.then((res)=> setUsers((cur)=> [...cur,...res.data.data]))
		}
	}

	useEffect(()=> {
    fetchUsers()
	},[])

  return (
    <div className="w-full h-dvh bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-96 h-96 bg-white">
        {users.map((user)=> {
					<div className="flex">
						<div>
						<img src={user.displayPicture} alt="" className="w-10" />
						<div>
							<h1>{user.username}</h1>
							<h1>{user.fullname}</h1>
						</div>
						</div>

						<button className="" onClick={()=> {}}>{useFor ==='followers'? 'Remove' : 'following' }</button>

					</div>
				})}
			</div>
    </div>
  )
}