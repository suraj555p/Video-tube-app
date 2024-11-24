import React, { useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Upload() {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [upload, setUpload] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null
    });

    const handleInput = (e) => {
        const { name, value, files } = e.target;
        setUpload((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    };

    const token = useSelector(state => state.accessTokenSlice.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
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
                throw new Error("Video not uploaded!!");
            }
            navigate('/profile');
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center bg-softBlue min-h-screen">
            <Header />
            {uploading && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}
            <div className="w-full max-w-3xl p-8 mt-6 border border-gray-300 rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter video title"
                            type="text"
                            value={upload.title}
                            onChange={handleInput}
                            name="title"
                            id="title"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter video description"
                            value={upload.description}
                            onChange={handleInput}
                            name="description"
                            id="description"
                            rows="4"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="videoFile" className="block text-lg font-medium text-gray-700">Upload Video</label>
                        <input
                            name="videoFile"
                            id="videoFile"
                            type="file"
                            className="w-full border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <label htmlFor="thumbnail" className="block text-lg font-medium text-gray-700">Upload Thumbnail</label>
                        <input
                            name="thumbnail"
                            id="thumbnail"
                            type="file"
                            className="w-full border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleInput}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black  text-white font-semibold py-3 rounded-md transition duration-300"
                    >
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Upload;
