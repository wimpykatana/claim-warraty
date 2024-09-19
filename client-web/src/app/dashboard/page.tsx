"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Claim {
  _id: string;
  productId: string;
  userId: string;
  status: string;
  claimDetails: string;
}

const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<Claim[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const token = Cookies.get('Authentication');
      if (!token) {
        console.error('No token found');
        return;
      }

      await fetch('http://localhost:3000/claims', {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const logout = () => {
    Cookies.remove('Authentication');
    router.push('/');
  };

  useEffect(() => {
    const token = Cookies.get('Authentication');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      router.push('/');
    }
  }, [router]);

  const approveClaim = async (claimId: string) => {
    await fetch(`http://localhost:3000/claims/${claimId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Approved' }),
    });
    fetchData();
  };

  const rejectClaim = async(claimId: string) => {
    await fetch(`http://localhost:3000/claims/${claimId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Rejected' }),
    });
    fetchData();
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-950 text-center">Welcome to the Dashboard</h1>
        <div className="flex justify-end">  
          <button onClick={()=>logout()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            LogOut
          </button>
        </div>
        {data && data.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-900">List of Claims</h2>
            <ul className="bg-gray-200 p-4 rounded text-gray-600">
              {data.map((item) => (
                <li key={item._id} className="mb-4 p-4 bg-white rounded shadow">
                  <p><strong>Claim ID:</strong> {item._id}</p>
                  <p><strong>Product ID:</strong> {item.productId}</p>
                  <p><strong>User ID:</strong> {item.userId}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Claim Details:</strong> {item.claimDetails}</p>
                  {item.status === 'Pending' && (
                    <div className='flex justify-around mt-4'>
                    <button onClick={() => approveClaim(item._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Approve
                    </button>
                    <button onClick={() => rejectClaim(item._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Reject
                    </button>
                  </div>
                  )}
                  
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;