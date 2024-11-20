import React, { useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoaderPage from './LoadingPage';

function Upload() {
    const navigate = useNavigate()
    const[uploading, setUploading] = useState(false)
    const [upload, setUpload] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null
    })

    const handleInput = (e) => {
        const { name, value, files } = e.target;
        setUpload((prevState) => ({
          ...prevState,
          [name]: files ? files[0] : value,
        }));
      };

    const token = useSelector(state => state.accessTokenSlice.token)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true)
        // Prepare form data to send to the backend
        const formData = new FormData();
        Object.entries(upload).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await fetch('https://videotube-server-kmvo.onrender.com/api/v1/videos/upload-video', {
                method: 'POST',
                headers: {
                'Authorization': `Bearer ${token}`
                },
                mode: 'cors',
                credentials: 'include',
                body: formData
            });
            if (!response.ok) {
                console.log('Something went wrong while uploading video');
                throw new Error("Video not uploaded!!")
            }
            navigate('/profile')
        } catch (error) {
            setUploading(false)
            console.log(error);
            throw new Error(error)
        } finally {
            setUploading(false)
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <Header />
            {uploading && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}
            <div className="w-full max-w-md p-6 mt-6 border border-gray-200 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
                        <form  onSubmit={handleSubmit}>

                            <input className='px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500' placeholder='Title' type='text' value={upload.title} onChange={handleInput} name='title' />

                            <textarea className='px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500' placeholder='Description' value={upload.description} onChange={handleInput} name='description'></textarea>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="videoFile" className="text-gray-600">Upload Video:</label>
                                <input name='videoFile' id="videoFile" type='file' className='border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500' onChange={handleInput} />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="thumbnail" className="text-gray-600">Upload Thumbnail:</label>
                                <input name='thumbnail' id="thumbnail" type='file' className='border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500' onChange={handleInput} />
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 transition duration-300">Upload</button>
                        </form>
            </div>
            
        </div>

    
    );
}

export default Upload;
