import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(0);
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        // Ensure that the Telegram Web App SDK is available
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();

            const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
            if (telegramUser) {
                const fetchUser = async () => {
                    const res = await axios.post('https://back-w4s1.onrender.com/auth', {
                        telegramId: telegramUser.id,
                        username: telegramUser.username
                    });

                    setUser(res.data);
                    setPoints(res.data.points);
                    setReferralLink(`https://t.me/Twint111bot?start=${telegramUser.id}`);
                };

                fetchUser();
            } else {
                // Handle the case where the user information is not available
                console.error('Unable to fetch Telegram user information');
            }
        } else {
            // Handle the case where the Telegram Web App SDK is not available
            console.error('Telegram Web App SDK not found');
        }
    }, []);

    const addPoints = async () => {
        if (user) {
            const res = await axios.post('https://back-w4s1.onrender.com/addPoints', {
                telegramId: user.telegramId
            });

            setPoints(res.data.points);
        }
    };

    return (
        <div className="App">
            <h1>Welcome {user ? user.username : 'User'}</h1>
            <p>Points: {points}</p>
            <button onClick={addPoints}>Earn Points</button>
            <p>Your referral link: {referralLink}</p>
        </div>
    );
}

export default App;
