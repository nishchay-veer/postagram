import { Button } from '@mui/material'
import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import './Login.css'
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import images from './images'
// import ImageSlider from './ImageSlider'
function Login() {
    return (
        <div className="signin-container">
            <Carousel fade className="img-carousel">
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="https://www.instagram.com/static/images/homepage/screenshots/screenshot3.png/94edb770accf.png"
                        alt="First slide"
                    />
                    {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
                </Carousel.Item>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62acb667fb.png"
                        alt="Second slide"
                    />

                    {/* <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption> */}
                </Carousel.Item>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="https://www.instagram.com/static/images/homepage/screenshots/screenshot4.png/a4fd825e3d49.png"
                        alt="Third slide"
                    />

                    {/* <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption> */}
                </Carousel.Item>
            </Carousel>

            <div className="signin">
                <div className="home__logo">
                    <h1 className="display-3">Postagram</h1>
                    <i className="fa-brands fa-instagram fa-6x" id="insta"></i>
                </div>

                <p className="lead">
                    Share videos, photos, and fun moments with the friends you love
                </p>
                <hr />
                <Button className="btn btn-light btn-lg">Register</Button>
                <Button className="btn btn-dark btn-lg">Login</Button>
            </div>
        </div>
    )
}

export default Login