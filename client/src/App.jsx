// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import Layout from "./pages/Layout";
// import Dashboard from "./pages/Dashboard";
// import WriteArticle from "./pages/WriteArticle";
// import BlogTitles from "./pages/BlogTitles";
// import GenerateImages from './pages/GenerateImages';
// import RemoveBg from "./pages/RemoveBg";
// import RemoveObject from "./pages/RemoveObject";
// import ReviewResume from "./pages/ReviewResume";
// import Community from "./pages/Community";
// import Home  from "./pages/Home";
// import { useEffect } from "react";
// import { useAuth } from "@clerk/clerk-react";

// const App = () =>{

// const {getToken} = useAuth()
// useEffect(() => {
//   getToken().then((token)=> console.log(token));

// }, [])



//   return (
//       // {/* <h1>hello</h1> */}
//       <Routes>
//         <Route path='/' element={<Home />}/>
//         <Route path='/ai' element={<Layout />}>
//              <Route index element={<Dashboard />}/>
//              <Route path='write-article' element={<WriteArticle />}/>
//              <Route path='blog-titles' element={<BlogTitles />}/>
//              <Route path='generate-images' element={<GenerateImages />}/>
//              <Route path='remove-background' element={<RemoveBg />}/>
//              <Route path='remove-object' element={<RemoveObject />}/>
//              <Route path='review-resume' element={<ReviewResume />}/>
//              <Route path='community' element={<Community />}/>
//         </Route>
//       </Routes>

//   );
// };  

// export default App 








import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from "./pages/GenerateImages";
import RemoveBg from "./pages/RemoveBg";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import Community from "./pages/Community";
import Home from "./pages/Home";

const App = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      console.log("❌ User not signed in");
      return;
    }

    const fetchToken = async () => {
      const token = await getToken();
      console.log("🔥 CLERK TOKEN:", token);
    };

    fetchToken();
  }, [isLoaded, isSignedIn]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ai" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="write-article" element={<WriteArticle />} />
        <Route path="blog-titles" element={<BlogTitles />} />
        <Route path="generate-images" element={<GenerateImages />} />
        <Route path="remove-background" element={<RemoveBg />} />
        <Route path="remove-object" element={<RemoveObject />} />
        <Route path="review-resume" element={<ReviewResume />} />
        <Route path="community" element={<Community />} />
      </Route>
    </Routes>
  );
};

export default App;
