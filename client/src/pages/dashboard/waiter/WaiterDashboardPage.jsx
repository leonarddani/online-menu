
import Layout from '@/components/shared/layouts/Layout'
import React from 'react'

import Tables from '@/components/shared/dashboard/Tables'
import ChefDashboard from '@/components/shared/dashboard/chief/ChefDashboard'
import { AllOrders } from "@/components/shared/dashboard/AllOrders";


const WaiterDashboard = () => {
  return (
  <Layout>
         <Tables/>
          {/* <TableOrderPage/> */}

          <ChefDashboard />
          <AllOrders/>
  </Layout>
  )
}

export default WaiterDashboard