import { Edit, Hash, ImageOff, Import, Sparkle } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const BlogTitles = () => {

    const blogCategories = [ 'General' , 'Technology' , 'Business' , 'Health' , 'LifeStyle' , 'Education' , 'Travel' , 'Food']
    
       const[selectedCategory , setSelectedCategory] = useState('General')
       const [input, setInput] = useState('')
       const [loading, setLoading] = useState(false)
      const [content , setContent] = useState("");

      const {getToken} = useAuth() 
    
        const onSubmitHandler = async(e) =>{
            e.preventDefault();
            try {
              setLoading(true);
              const prompt = `
               Generate 5 catchy blog titles for the keyword "${input}"
               in the category "${selectedCategory}".
               
               Return the result as a Markdown bullet list.
               `;

              const {data} = await axios.post('/api/ai/generate-blog-titles', {prompt}, {
                headers: {Authorization: `Bearer ${await getToken()}`}
              })

              if(data.success ){
                setContent(data.content);
              }
              else{
                toast.error(data.message || 'Could not generate titles. Please try again later.')
              }
            }
             // eslint-disable-next-line no-unused-vars
             catch (error) {
              toast.error('An error occurred. Please try again later.')
            }
            setLoading(false);
        }
     
  return (
        <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      
       {/* left col  */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkle className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Ai Title Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Keyword </p>

        <input onChange={(e) => setInput(e.target.value)} value = {input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Enter article topic' required />

        <p className='mt-4 text-sm font-medium'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item)=>  (
            <span onClick={()=> setSelectedCategory(item)} className={`text-xs px-4 py-1  border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-purple-100 text-purple-700' : 'text-gray-500 border-gray-300 '}`} key={item}>{item}</span>
          ))}
        </div>

        <br />
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'> 
            {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'> </span> : <Hash className='w-5'/> }
          
          Generate Title
        </button>

      </form>

       {/* right col  */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 '>
        <div className='flex items-center gap-3'>
          <Hash className='w-5 h-5 text-[#48E37EB]'/>
          <h1 className='text-xl font-semibold'> Generated Titles</h1>
        </div> 
         {
           !content ? (  <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'> 
            <Hash className='w-9 h-9'/>
            <p> Enter a topic and click "Generate Title" to get started</p>
          </div>


        </div>) : (
           <div className='mt-3 h-fulll overflow-y-scroll text-sm text-slate-700'>
                  <div className='reset-tw'>
                    {/* <Markdown> {content}</Markdown> */}
                    {typeof content === "string" && content.trim().length > 0 ? (
                    <Markdown>{String(content)}</Markdown>
                     ) : (
                       <p className="text-gray-400 text-sm">
                         No Blog Title generated yet.
                       </p>
                     )}
          
                    </div>
          
                </div>
        )
         }

      
       
      </div>
    </div>
  )
}

export default BlogTitles
