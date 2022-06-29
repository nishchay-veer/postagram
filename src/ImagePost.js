import { Button } from '@mui/material'
import React, { useState } from 'react'
import './ImagePost.css'
import {storage, db} from './firebase'
import firebase from 'firebase/compat/app';
function ImagePost({ username}) {

    const[caption, setCaption] = useState('')
    const[image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = () => {
        //// some clever stuff...
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes) * 100
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
                        username: username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                    

                });
            }
            

        );


    };
  return (
    <div className='imagePost__upload'>
        <progress className= "progress__part" value={progress} max = "100"/>
        <textarea wrap='soft' className = "upload__caption" type = "text" placeholder='Enter a caption' value={caption} onChange={(e)=> setCaption(e.target.value)}/>
        <input type="file" onChange={handleChange}/>
        <Button onClick={handleUpload}>POST</Button>
    </div>
  )
}

export default ImagePost