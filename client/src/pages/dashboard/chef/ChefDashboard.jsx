import React from 'react'
import Header from '@/components/shared/dashboard/Header'
import Layout from '@/components/shared/layouts/Layout'
import ChefDashashboardd from '@/components/shared/dashboard/chief/ChefDashboardd'


function ChefDashboard() {
  return (
    <div>
      <Layout>
        <Header title="Chef Dashboard" subtitle="here u can see and manage orders stsuts in the kitchen">

        </Header>
        <ChefDashashboardd/>
      </Layout>
    </div>
  )
}

export default ChefDashboard