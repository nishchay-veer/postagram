import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

import { Avatar, Box, Button, IconButton, Input } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import Post from './Post';
// import Login from './Login'

import { db, auth, storage } from './firebase'
import firebase from 'firebase/compat/app';

// import { Carousel } from "react-bootstrap";
// import ImagePost from './ImagePost'
// import {makeStyles} from '@mui/material/styles';
import Modal from '@mui/material/Modal';
// import {Button} from '@mui/material';
import { InstagramEmbed } from 'react-social-media-embed';
import './App.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  let count = 0;

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [postUpload, setPostUpload] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [emailID, setEmailID] = useState('')
  const [user, setUser] = useState(null)
  const handleOpen = () => setOpen(true);
  const handleOpenIn = () => setOpenSignIn(true);
  const handleClose = () => setOpen(false);
  const handleCloseIn = () => setOpenSignIn(false);
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  // const openPostModal = () => {
  //   setPostUpload(old => !old)
  // }
  const signUp = (event) => {
    event.preventDefault()
    auth.createUserWithEmailAndPassword(emailID, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false);
  }
  const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(emailID, password).catch(err => alert(err.message))
    setOpenSignIn(false);
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in 
        console.log(authUser);
        setUser(authUser);
      }
      else {
        //user has logged out
        setUser(null);
      }
      return () => {
        unsubscribe();
      }
    })

  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));

    })
  }, [])
  const handleUpload = () => {
    //// some clever stuff...
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        console.log(error);
        alert(error.message)
      },
      () => {
        storage.ref("images").child(image.name).getDownloadURL().then((url) => {
          db.collection("posts").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            caption: caption,
            location: url,
            username: user.displayName
          });
          setProgress(0);
          setCaption('');
          setImage(null);


        });
      }


    );
    setPostUpload(false)


  };
  return (
    <div>{!user && count === 0 ? <div className="signin-container">
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>


          <form className='user__details'>
            <center>
              <img className="form__image" src="https://firebasestorage.googleapis.com/v0/b/postagram-4574a.appspot.com/o/images%2Fheader_logo.png?alt=media&token=5a5ad043-a4e9-4258-8937-3494ba0b61ec" alt="" />
            </center>
            <Input type='text' placeholder='username' value={username}
              onChange={(event) => setUsername(event.target.value)} />
            <Input type='password' placeholder='password' value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <Input type='email' placeholder='emailID' value={emailID}
              onChange={(event) => setEmailID(event.target.value)} />
            <Button type='submit' onClick={signUp}>SIGN UP</Button>
          </form>



        </Box>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={handleCloseIn}
      >
        <Box sx={style}>


          <form className='user__details'>
            <center>
              <img className="form__image" src="https://firebasestorage.googleapis.com/v0/b/postagram-4574a.appspot.com/o/images%2Fheader_logo.png?alt=media&token=5a5ad043-a4e9-4258-8937-3494ba0b61ec" alt="" />
            </center>
            <Input type='password' placeholder='password' value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <Input type='email' placeholder='emailID' value={emailID}
              onChange={(event) => setEmailID(event.target.value)} />
            <Button type='submit' onClick={signIn}>SIGN IN</Button>
          </form>



        </Box>
      </Modal>
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
        <button className="register__button" onClick={handleOpen}>REGISTER</button>
        <button className="login__button" onClick={handleOpenIn}>LOGIN</button>
      </div>
    </div> : <div className="app">


      <Modal
        open={postUpload}
        onClose={() => setPostUpload(false)}
      >
        <Box sx={style}>
          <div className='imagePost__upload'>
            <progress className="progress__part" value={progress} max="100" />
            <textarea wrap='soft' rows='5' className="upload__caption" type="text" placeholder='Enter a caption' value={caption} onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>POST</Button>
          </div>





        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>


          <form className='user__details'>
            <center>
              <img className="form__image" src="https://firebasestorage.googleapis.com/v0/b/postagram-4574a.appspot.com/o/images%2Fheader_logo.png?alt=media&token=5a5ad043-a4e9-4258-8937-3494ba0b61ec" alt="" />
            </center>
            <Input type='text' placeholder='username' value={username}
              onChange={(event) => setUsername(event.target.value)} />
            <Input type='password' placeholder='password' value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <Input type='email' placeholder='emailID' value={emailID}
              onChange={(event) => setEmailID(event.target.value)} />
            <Button type='submit' onClick={signUp}>SIGN UP</Button>
          </form>



        </Box>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={handleCloseIn}
      >
        <Box sx={style}>


          <form className='user__details'>
            <center>
              <img className="form__image" src="https://firebasestorage.googleapis.com/v0/b/postagram-4574a.appspot.com/o/images%2Fheader_logo.png?alt=media&token=5a5ad043-a4e9-4258-8937-3494ba0b61ec" alt="" />
            </center>
            <Input type='password' placeholder='password' value={password}
              onChange={(event) => setPassword(event.target.value)} />
            <Input type='email' placeholder='emailID' value={emailID}
              onChange={(event) => setEmailID(event.target.value)} />
            <Button type='submit' onClick={signIn}>SIGN IN</Button>
          </form>



        </Box>
      </Modal>
      <div className="app__header">
        <div className='images'>
          <img className="app__headerImage1" src="https://firebasestorage.googleapis.com/v0/b/postagram-4574a.appspot.com/o/images%2Fheader_logo.png?alt=media&token=5a5ad043-a4e9-4258-8937-3494ba0b61ecgoogle-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="" />
          <img className="app__headerImage2" src="https://firebasestorage.googleapis.com/v0/b/postagram-4574a.appspot.com/o/images%2FWhatsApp%20Image%202022-06-29%20at%208.00.30%20PM.jpeg?alt=media&token=8487e5be-5698-44f0-b6ca-0ab2efc9aea4" alt="" />

        </div>

        <div className="app__headerSearch">

          <input type="text" placeholder="Search" ></input>
          <SearchIcon className="search__icon" />
        </div>

        <div className="app__headerIcons">
          <IconButton className='icons'>
            <HomeIcon />
          </IconButton>
          <IconButton className='icons'>
            <MessageIcon />

          </IconButton>

          <IconButton className='postIcon'>
            <AddCircleOutlineIcon onClick={user ? () => setPostUpload(true) : () => setPostUpload(false)} />

          </IconButton>


          <IconButton className='icons'>
            <Avatar sx={{ height: '30px', width: '30px' }} />

          </IconButton>
          <div className='login__options'>{user ? <Button onClick={() => auth.signOut()}>LOG OUT</Button> : <div>
            <Button onClick={handleOpen}>SIGN UP</Button>
            <Button onClick={handleOpenIn}>SIGN IN</Button>
          </div>}</div>

        </div>

      </div>
      <div>{!user ? <h3>You need to login to your account to upload a picture...</h3> : null}</div>
      {/* <div className='postKaro'>{user?.displayName && postUpload ? <ImagePost username={user.displayName} /> : (null)}</div> */}

      <div className='app__posts'>
        <div className='app__postsLeft'>
          <div className='posts'>{posts.map(({ id, post }) => (
            <Post key={id} postID={id} user={user} username={post.username} caption={post.caption} location={post.location} />
          )
          )}</div>

        </div>
        <div className='app__postsRight'>
          <InstagramEmbed
            className="ig-embed"
            url='https://www.instagram.com/p/Cb61YFop7d9/'
            maxWidth={328}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
          <InstagramEmbed
            className="ig-embed"
            url='https://www.instagram.com/p/Cc7NeRKJUdD/'
            maxWidth={328}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>  </div>


      <div className='footer'>Copyright &copy; 2022 by Nishchay Veer and Mridul Dhiman</div>
      count++
    </div>}


    </div>

  );
}

export default App;
