import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
const Layout = ({children, showSidebar = false}) => {
  return (
    <div className='min-h-screen flex'>
      <div className='flex'>
        {showSidebar && <Sidebar/>}
      </div>
      <div className='flex-1 flex flex-col'>
        <Navbar/>
        <main className='flex-1 overflow-y-auto'>
            {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
