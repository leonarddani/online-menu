


import {

  SidebarProvider,

} from "@/components/ui/sidebar"
import Sidebar from "../dashboard/Sidebar/SideBar"

export default function Layout({children}) {
  return (
    <SidebarProvider>
      <Sidebar /> 
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
      
            
            
              
                
                
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-green-900">
         {children}
        </div>
     

    </SidebarProvider>
  )
}