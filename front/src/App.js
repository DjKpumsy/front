import React, { useState, useEffect } from 'react';
import axios from 'axios';
import buttonImage from './assets/tap-coin.png'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function App() {
    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(0);
    const [referralLink, setReferralLink] = useState('');
    const [vibrate, setVibrate] = useState(false); // State for vibration effect
    const [progress, setProgress] = useState(1000); // State for progress bar value
    const [maxProgress, setMaxProgress] = useState(1000); // State for max progress value
    const [refillInterval, setRefillInterval] = useState(null); // State for refill interval ID

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

    useEffect(() => {
        // Cleanup the interval when the component unmounts
        return () => {
            if (refillInterval) {
                clearInterval(refillInterval);
            }
        };
    }, [refillInterval]);

    const startRefill = () => {
        if (!refillInterval) {
            const intervalId = setInterval(() => {
                setProgress(prevProgress => {
                    if (prevProgress < maxProgress) {
                        return prevProgress + 1;
                    } else {
                        clearInterval(intervalId);
                        setRefillInterval(null);
                        return prevProgress;
                    }
                });
            }, 1000); // Adjust the refill speed as needed
            setRefillInterval(intervalId);
        }
    };

    const stopRefill = () => {
        if (refillInterval) {
            clearInterval(refillInterval);
            setRefillInterval(null);
        }
    };

    const addPoints = async () => {
        if (progress === 0) return; // Stop function if progress is 0

        if (user) {
            // Optimistically update points
            setPoints(prevPoints => prevPoints + 1);

            // Reduce progress bar value
            setProgress(prevProgress => (prevProgress > 0 ? prevProgress - 1 : 0));

            setVibrate(true); // Trigger vibration effect

            stopRefill(); // Stop the refill process

            try {
                const res = await axios.post('https://back-w4s1.onrender.com/addPoints', {
                    telegramId: user.telegramId
                });

                // Set the points to the actual value returned from the server
                setPoints(res.data.points);
            } catch (error) {
                console.error('Error adding points:', error);
                // Revert points if the API call fails
                setPoints(prevPoints => prevPoints - 1);
            }

            // Remove vibration effect after 300ms
            setTimeout(() => setVibrate(false), 300);
        }
    };

    const progressContainerStyle = {
        width: '100%',
        backgroundColor: 'black', // Default background color
        borderRadius: '25px',
        overflow: 'hidden',
        position: 'relative',
        height: '30px',
        marginTop: '20px'
    };

    const progressBarStyle = {
        height: '100%',
        backgroundColor: 'yellow', // Fill color
        borderRadius: '25px',
        transition: 'width 0.2s ease-in-out',
        position: 'relative',
        width: `${(progress / maxProgress) * 100}%`
    };

    const progressBarLabelStyle = {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
        lineHeight: '30px' // Match the height of the progress bar
    };

    return (
        <div className="App" style={{backgroundColor: '#3e1d38', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
            <h1 style={{marginTop: '300px'}}>  
                <img 
                    src={buttonImage} 
                    alt="Earn Points" 
                    style={{ cursor: 'pointer', width: '40px', height: '40px', marginBottom: '-2px', marginLeft: '15px' }} 
                /> 
                {points} 
            </h1>
            
            <div className={`image-container ${vibrate ? 'vibrate' : ''}`} 
                onMouseDown={addPoints} 
                onMouseUp={startRefill}
                style={{position: 'relative', display: 'inline-block'}}
            >
                <img 
                    src={buttonImage} 
                    alt="Earn Points" 
                    style={{ cursor: 'pointer', width: '200px', height: '220px', transition: 'transform 0.3s' }} 
                />
            </div>
           
            <div className='lab' style={{marginLeft: '5px', marginTop: '50px', width: '80%'}}>
                <div className="progress-container" style={progressContainerStyle}>
                    <div className="progress-bar" style={progressBarStyle}>
                        <span className="progress-bar-label" style={progressBarLabelStyle}>{`${progress}/${maxProgress}`}</span>
                    </div>
                </div>
                <h5>{progress}/{maxProgress}</h5>
            </div>

            <Container style={{marginTop: '50px'}}>
                <Row>
                    <Col className="custom-col" style={{backgroundColor: 'white', color: '#702963', borderRadius: '20px', margin: '10px', width: '50%', padding: '10px', textAlign: 'center', cursor: 'pointer', transition: 'background-color 0.3s'}}>Task</Col> 
                    <Col className="custom-col" style={{backgroundColor: 'white', color: '#702963', borderRadius: '20px', margin: '10px', width: '50%', padding: '10px', textAlign: 'center', cursor: 'pointer', transition: 'background-color 0.3s'}}>Boost</Col> 
                    <Col className="custom-col" style={{backgroundColor: 'white', color: '#702963', borderRadius: '20px', margin: '10px', width: '50%', padding: '10px', textAlign: 'center', cursor: 'pointer', transition: 'background-color 0.3s'}}>Stats</Col> 
                    <Col className="custom-col" style={{backgroundColor: 'white', color: '#702963', borderRadius: '20px', margin: '10px', width: '50%', padding: '10px', textAlign: 'center', cursor: 'pointer', transition: 'background-color 0.3s'}}>Ref</Col> 
                </Row>
            </Container>

            <Container>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                            Withdraw
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" placeholder="Enter amount of tokens" />
                        </Col>
                    </Form.Group>
                </Form>
                <Button variant="primary">Withdraw</Button>
            </Container>
        </div>
    );
}

export default App;
