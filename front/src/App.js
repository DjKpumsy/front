import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file
import buttonImage from './assets/tap-coin.png'; 
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


function App() {
    const [user, setUser] = useState(null);
    const [points, setPoints] = useState(100000000);
    const [referralLink, setReferralLink] = useState('');
    const [vibrate, setVibrate] = useState(false); // State for vibration effect
    const [progress, setProgress] = useState(100); // State for progress bar value

   
    const now = 100;
 
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
            // Optimistically update points
            setPoints(prevPoints => prevPoints + 1);

              // Reduce progress bar value
              setProgress(prevProgress => (prevProgress > 0 ? prevProgress - 1 : 0));

            setVibrate(true); // Trigger vibration effect

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


    return (
        <div className="App">
            {/* <h1>Welcome {user ? user.username : 'User'}</h1> */}
           
            <h1>  <img 
                src={buttonImage} 
                alt="Earn Points" 
                style={{ cursor: 'pointer', width: '40px', height: '40px', marginBottom: '-3px', marginRight: '-12px' }} 
            /> {points} </h1>
            
            <div className={`image-container ${vibrate ? 'vibrate' : ''}`} onClick={addPoints}>
                
                <img 
                    src={buttonImage} 
                    alt="Earn Points" 
                    style={{ cursor: 'pointer', width: '300px', height: '320px' }} 
                />
            </div>
           
            {/* <p>Your referral link: {referralLink}</p> */}
            <div className='lab'>
            <ProgressBar now={progress} striped variant="warning" label={`${progress}%`} />
                
            </div>

            <Container style={{marginTop: '50px'}}>
      <Row>
        <Col className="custom-col">Task</Col> 
        <Col className="custom-col">Boost</Col> 
        <Col className="custom-col">Stats</Col> 
        <Col className="custom-col">Ref</Col> 
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
        <Button variant="primary">Withdraw</Button>{' '}
    </Container>
        </div>
    );
}

export default App;
