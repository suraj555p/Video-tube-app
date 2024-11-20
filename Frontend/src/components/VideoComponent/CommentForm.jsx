import React, { useState } from 'react'
import Button from '../Button'

function CommentForm({onAddComment, comments}) {
    const[commentContent, setCommentContent] = useState("")
    const[visibility, setVisibility] = useState(false)
    const onClickCommentBox = () => {
        setVisibility(true)
    }
    return (
        <div className='w-full'>
            <h1>Comments {comments?.length}</h1>
            <textarea onClick={onClickCommentBox} value={commentContent} onChange = {(e) => setCommentContent(e.target.value)} className='w-full mt-2 outline-none border-b-2 focus:border-b-black' type='text' placeholder='Add a comment'/>

            <div className='flex flex-wrap justify-end gap-3 text-center'>
                {
                    visibility && <Button disabled={!commentContent.trim()} onClick = {() => {
                    onAddComment(commentContent)
                    setCommentContent("")
                    }}>Add</Button>
                }
                {
                    visibility && <Button onClick={() => {setVisibility(false)}} bgColor='' textColor='black'>Cancel</Button>
                }
            </div>
        </div>
    )
}

export default CommentForm
