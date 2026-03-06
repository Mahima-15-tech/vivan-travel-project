import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { FaPlaneSlash } from 'react-icons/fa';
import NoFlightsSVG from '../../src/assets/images/plane.png';

const NoFlightsAvailable = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #f0f4f7, #d9e2ec)',
                padding: '50px 20px',
                textAlign: 'center',
            }}
        >
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <FaPlaneSlash size={70} color="#6c757d" />
            </Box>
            <img
                src={NoFlightsSVG}
                alt="No Flights"
                style={{
                    maxWidth: '300px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }}
            />
            <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', color: '#343a40', fontFamily: 'Roboto, sans-serif', marginBottom: '10px' }}
            >
                Oops! No Flights Available ✈️
            </Typography>
            <Typography
                variant="body1"
                color="textSecondary"
                sx={{ fontSize: '18px', color: '#6c757d', marginBottom: '30px' }}
            >
                It looks like there are no flights available at the moment. Please check again later.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{
                    backgroundColor: '#007bff',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    boxShadow: '0px 4px 12px rgba(0, 123, 255, 0.3)',
                    '&:hover': {
                        backgroundColor: '#0056b3',
                        boxShadow: '0px 4px 14px rgba(0, 123, 255, 0.4)',
                    },
                }}
                onClick={() => alert('Retrying...')}
            >
                Try Again
            </Button>
        </Container>
    );
};

export default NoFlightsAvailable;
