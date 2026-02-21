import React, { useState, useEffect } from 'react';
import { IoTimeOutline } from 'react-icons/io5';
import { useOrder } from '../../../shared/store/order-context';

const ExpirationTimer = ({ createdAt, expiresInMinutes = 10 }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const { triggerRefresh } = useOrder();

  useEffect(() => {
    if (!createdAt) return;

    const createdTime = new Date(createdAt).getTime();
    const expirationTime = createdTime + expiresInMinutes * 60 * 1000;
    
    let intervalId; 

    const updateTimer = () => {
      const now = Date.now();
      const difference = expirationTime - now;

      if (difference <= 0) {
        if (intervalId) clearInterval(intervalId);
        
        setTimeLeft(0);
        setIsExpired(true);
        triggerRefresh(); 
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    
    const initialDifference = expirationTime - Date.now();
    
    if (initialDifference > 0) {
      updateTimer(); 
      intervalId = setInterval(updateTimer, 1000); // Start countdown
    } else {
      updateTimer(); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [createdAt, expiresInMinutes]); 

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div 
      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border transition-colors ${
        isExpired 
          ? 'bg-red-50 border-red-100 text-red-700' 
          : 'bg-orange-50 border-orange-100 text-orange-700'
      }`}
    >
      <IoTimeOutline className={`${!isExpired && 'animate-pulse'} text-lg`} />
      <span className="text-sm font-bold tabular-nums">
        {isExpired ? 'Expired' : `Expires in ${minutes}:${seconds}`}
      </span>
    </div>
  );
};

export default ExpirationTimer;