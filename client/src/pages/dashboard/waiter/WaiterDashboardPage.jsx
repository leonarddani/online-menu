
import Layout from '@/components/shared/layouts/Layout'
import React from 'react'

import Tables from '@/components/shared/dashboard/waiter/Tables'
import ChefDashboard from '@/components/shared/dashboard/chief/ChefDashboard'

const WaiterDashboard = () => {
  return (
  <Layout>
         <Tables/>
          {/* <TableOrderPage/> */}

          <ChefDashboard />
  </Layout>
  )
}

export default WaiterDashboard