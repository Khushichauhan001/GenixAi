
import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'           // don't import "Sidebar" icon here
import Sidebar from '../components/Sidebar'      // import your Sidebar component
import { useUser,SignIn } from '@clerk/clerk-react'

function Layout() {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser();


  return user ?  (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-[56px] flex items-center justify-between border-b border-gray-200">
       <img src={assets.logo} alt=" " onClick={()=>navigate('/')} className="h-8 cursor-pointer" />

        {/* Menu icon visible on small screens only */}
        {sidebar ? (
          <X onClick={() => setSidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer" />
        ) : (
          <Menu onClick={() => setSidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer" />
        )}
      </nav>

      <div className="flex-1 w-full flex" style={{ height: 'calc(100vh - 56px)' }}>
        {/* pass setter so Sidebar can close itself on mobile */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className="flex-1 bg-[#F4F7FB]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout









// import React, { useState } from 'react'
// import {assets} from '../assets/assets'
// import { Outlet, useNavigate } from 'react-router-dom'
// import { Menu, Sidebar, X } from 'lucide-react'
// function Layout() {

//   const navigate = useNavigate()
//   const [sidebar, setSidebar] = useState(false)
//   return (
//     <div className='flex flex-col items-start justify-start h-screen '>
 

//       <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200 '>
//         <img src={assets.logo} alt=" " onClick={()=>navigate('/')}/>
//         {
//           sidebar ? <X onClick={() => setSidebar(false)} className='w-6  h-6 text-gray-600 sm:hidden' /> : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden'/>
//         }
//       </nav>

//       <div className='flex-1 w-full flex-h[calc(100vh-64px)]'>
//         <Sidebar sidebar= {sidebar} setSidebar = {setSidebar}/>
//         <div className='flex-1 bg-[#F4F7FB]'>

//          <Outlet/>
//         </div>

//       </div>
         
//     </div>
//   );
// }

// export default Layout

