import React, { useRef } from 'react';
import Header from '@/components/shared/dashboard/Header';
import { AllOrders } from '@/components/shared/dashboard/orders/AllOrders';
import Layout from '@/components/shared/layouts/Layout';
import { Button } from '@/components/ui/button';

const AllOrdersPage = () => {
  const ordersRef = useRef();

  const handleDownloadCSV = () => {
    if (ordersRef.current) {
      ordersRef.current.downloadCSV();
    }
  };

  return (
    <Layout>
      <Header title="Orders" subtitle="Here u can see all orders in one place.">
        <Button  onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Header>
      <AllOrders ref={ordersRef} />
    </Layout>
  );
};

export default AllOrdersPage;
