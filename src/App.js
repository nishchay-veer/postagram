import React, { useEffect, useState } from 'react';
import './App.css';
import { Avatar, Box, Button, IconButton, Input } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import Post from './Post';
import { db, auth, storage } from './firebase'
import firebase from 'firebase/compat/app';
// import ImagePost from './ImagePost'
// import {makeStyles} from '@mui/material/styles';
import Modal from '@mui/material/Modal';
// import {Button} from '@mui/material';
import { InstagramEmbed } from 'react-social-media-embed';

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
    <div className="app">

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
              <img className="form__image" src="https://www.pngkey.com/png/detail/285-2850733_instagram-logo-instagram-icon-small-png.png" alt="" />
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
              <img className="form__image" src="https://www.pngkey.com/png/detail/285-2850733_instagram-logo-instagram-icon-small-png.png" alt="" />
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
        <img className="app__headerImage" src="https://thumbs.dreamstime.com/b/instagram-141049465.jpg" alt="" />
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
            className="insta"
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
            className="insta"
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
    </div>

  );
}

export default App;
