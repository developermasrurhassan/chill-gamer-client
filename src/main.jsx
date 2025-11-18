import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from './Home.jsx';
import MainLayout from './Component/MainLayout/MainLayout.jsx';
import { AuthProvider } from './Component/Auth/AuthContext.jsx';
import { ThemeProvider } from './Component/ThemeControl/ThemeContext.jsx';
import AuthLayout from './Component/Auth/AuthLayout.jsx';
import Login from './Component/Auth/Login.jsx';
import Register from './Component/Auth/Register.jsx';
import ReviewDetails from './Component/AllReviews/ReviewDetails.jsx';
import NotFound from './Component/CommonPage/NotFound.jsx';
import AddReview from './ReviewCard/AddReview.jsx';
import MyReviews from './ReviewCard/MyReviews.jsx';
import MyWatchlist from './Component/WatchList.jsx/MyWatchList.jsx';
import Trending from './Component/CommonPage/Trending.jsx';
import Community from './Component/CommonPage/Community.jsx';
import Search from './Component/Header/Search.jsx';
import AllReviews from './Component/AllReviews/AllReviews.jsx'
import AllGames from './Component/AllGames/Allgames.jsx';
import Buy from './Component/AllGames/Buy.jsx';
import GameDetails from './Component/AllGames/GameDeatils.jsx';
import { Toaster } from 'react-hot-toast';
import ReviewForm from './Component/AllReviews/ReviewForm.jsx';

// const notify = () => toast('Here is your toast.');

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <NotFound />,
    children: [
      { index: true, Component: Home },
      // { path: "about", Component: About },


      { path: 'buy/:id', element: <Buy /> },
      { path: '/reviews/new', element: <ReviewForm /> },
      { path: 'game/:id', element: <GameDetails /> },
      { path: 'reviews', element: <AllReviews /> },
      { path: 'games', element: <AllGames /> },
      { path: 'review/:id', element: <ReviewDetails /> },
      { path: 'add-review', element: <AddReview /> },
      { path: 'my-reviews', element: <MyReviews /> },
      { path: 'my-watchlist', element: <MyWatchlist /> },
      { path: 'trending', element: <Trending /> },
      { path: 'community', element: <Community /> },
      { path: 'search', element: <Search /> },

      { path: '*', element: <NotFound /> },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Toaster>

        </Toaster>
        <RouterProvider router={router} />
      </ThemeProvider>

    </AuthProvider>
  </StrictMode>,
)
