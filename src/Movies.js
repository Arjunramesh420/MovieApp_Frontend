import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

const GenreCards = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/movies/');
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    const organizeMoviesByGenre = () => {
        const moviesByGenre = {};
        genres.forEach(genre => {
            genre.genres.forEach(genreName => {
                if (!moviesByGenre[genreName]) {
                    moviesByGenre[genreName] = [];
                }
                moviesByGenre[genreName].push(genre);
            });
        });
        return moviesByGenre;
    };

    const [expandedCard, setExpandedCard] = useState(null);

    const handleCardClick = (movieId) => {
        if (expandedCard === movieId) {
            setExpandedCard(null);
        } else {
            setExpandedCard(movieId);
        }
    };
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Function to advance to the next image
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % genres.length);
    };

    useEffect(() => {
        const intervalId = setInterval(nextImage, 1000); // Change image every 3 seconds (adjust as needed)
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []); // Runs only once on component mount
    return (
        <div>
            <Carousel
                autoPlay={false} // Turn off autoPlay since we're controlling it manually
                animation="slide"
                navButtonsAlwaysVisible={false}
                index={currentImageIndex} // Set the current index of the carousel
                onChangeIndex={(index) => setCurrentImageIndex(index)} // Update currentImageIndex when carousel index changes
            >
                {/* Render backdrop images here */}
                {genres.map((genre, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        <img
                            src={genre.backdrop}
                            alt="Backdrop"
                            style={{ maxWidth: '75%', height: 'auto', marginTop: '20px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ position: 'absolute', top: '500px', right: '200px' }}
                            onClick={() => {
                                // Handle button click action here
                            }}
                        >
                            WATCH
                        </Button>
                    </div>
                ))}
            </Carousel>
            <br></br>
            <br></br>
            <br></br>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(organizeMoviesByGenre()).map(([genre, movies]) => (
                    <div key={genre} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <Typography variant="h5" gutterBottom style={{ width: '100%', fontWeight: 'bold' }}>
                            {genre}
                        </Typography>
                        <div style={{ width: '100%', borderBottom: '2px solid #0087EB', marginBottom: '10px', fontWeight: 'bold' }}></div>
                        {movies.map(movie => (
                            <div key={movie._id} style={{ margin: '50px' }}>
                                <Card
                                    style={{ width: 300, height: expandedCard === movie._id ? 'auto' : 440 }}
                                    onClick={() => handleCardClick(movie._id)}
                                    onMouseEnter={() => setExpandedCard(movie._id)}
                                    onMouseLeave={() => setExpandedCard(null)}
                                >
                                    <CardContent>
                                        {/* Render movie image, title, and other details */}
                                        <img src={movie.poster} alt={movie.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '5px' }} />
                                        {expandedCard === movie._id && (
                                            <>
                                                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>{movie.title}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>IDMB Rating:</strong> {movie.imdb_rating}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Classification:</strong> {movie.classification}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Director:</strong> {movie.director}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Length:</strong> {movie.length}
                                                </Typography>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreCards;
