import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from './pages/GenerateImages';
import RemoveBg from "./pages/RemoveBg";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import Home  from "./pages/Home";
const App = () =>{
  return (
      // {/* <h1>hello</h1> */}
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/ai' element={<Layout />}>
             <Route index element={<Dashboard />}/>
             <Route path='write-article' element={<WriteArticle />}/>
             <Route path='blog-titles' element={<BlogTitles />}/>
             <Route path='generate-images' element={<GenerateImages />}/>
             <Route path='remove-background' element={<RemoveBg />}/>
             <Route path='remove-object' element={<RemoveObject />}/>
             <Route path='review-resume' element={<ReviewResume />}/>
             <Route path='community' element={<Community />}/>
        </Route>
      </Routes>

  );
};  

export default App 
