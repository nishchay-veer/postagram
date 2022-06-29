import React, { useEffect, useState } from 'react'
import { Avatar, Button } from "@mui/material";
import { db } from './firebase';
import firebase from 'firebase/compat/app';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
// import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Post.css';
function Post({ postID, user, username, caption, location }) {
    const[likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    // const[id, setId] = useState('')
    const [comment, setComment] = useState('')
    const[pressedLike, setPressedLike] = useState(true)
    const [showComments, setShowComments] = useState(false)
    const postComment = (e) => {
        e.preventDefault()
        db.collection("posts").doc(postID).collection("comments").add({
            comment: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }
    const increaseLike = () => {
        setPressedLike(old => !old)
        // e.preventDefault()
        db.collection("posts").doc(postID).collection("likes").add({
            user : user.displayName,
            like: true
        });
        
    }
    const decreaseLike =() =>{
        setPressedLike(old => !old)
        // e.preventDefault()
        db.collection("posts").doc(postID).collection("likes").where('user','==', user.displayName).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc){
                doc.ref.delete()
            })
        });
        
    }
    useEffect(() => {
        let unsubscribe;
        if (postID) {
            unsubscribe = db.collection("posts").doc(postID).collection("comments").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(doc => doc.data()))
            })

        }
        return () => {
            unsubscribe();
        }

    }, [postID])
    useEffect(() => {
        let unsubscribe;
        if (postID) {
            unsubscribe = db.collection("posts").doc(postID).collection("likes").onSnapshot((snapshot) => {
                setLikes(snapshot.docs.map(doc => doc.data()))
                // setId(snapshot.docs[0].doc.id)
            })

        }
        return () => {
            unsubscribe();
        }

    }, [postID])

    function showComm() {
        setShowComments(old => !old)

    }
    // function increaseLike() {
        
        
    // }
    // function decreaseLike(){
    //     setPressedLike(old => !old)
        
    // }
    return (
        <div className="post">
            <div className='post__header'>
                <Avatar className="post__avatar" alt="NishchayVeer" src="" />
                <h4>{username}</h4>

            </div>
            <img className='post__image' src={location} alt="" />
            {user ? <div className='post__icons'>{pressedLike ? <FavoriteBorderOutlinedIcon onClick = {increaseLike}/> :<FavoriteIcon onClick = {decreaseLike}/>}</div> : null} 
            {/* <div className='post__likes'>{window.localStorage.map((item)=> (
                <p>{item.postID} likes</p>)
            )}</div> */}
            <p className='numberOfLikes'><strong>{likes.length}</strong> likes</p>
            
            <h4 className='post__text'>
                <strong>{username}</strong> {caption}
            </h4>
            {comments.length > 2 ? (showComments ? <button onClick={showComm}>Show less comments</button>: <button onClick={showComm}>Show all comments</button>) : null}
            <div className='post__comments'>{showComments ? <div>{
                comments.map((comm) => (<p>
                    <strong>{comm.username}</strong> {comm.comment}
                </p>)

                )
            }
            </div> : <div>
                <p><strong>{comments[0]?.username}</strong> {comments[0]?.comment}</p>
                <p><strong>{comments[1]?.username}</strong> {comments[1]?.comment}</p>
                </div>}
                </div>




            {user ? <form className='comment'>
                <input className='comment__box' type='text' placeholder='Add a comment' value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button className='add_comment' disabled={!comment} type='submit' onClick={postComment}>ADD</Button>
            </form> : null}
        </div>
    )
}

export default Post