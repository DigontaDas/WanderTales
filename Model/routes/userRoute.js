import express from 'express'
import { 
    loginUser,
  registerUser,
  getUserBookmarks,
  getUserProfile,
  updateUserProfile,
  getUserStories,
  getUserReviews,
  followUser,
  getFollowStatus,
  followModel,
  getAllUsers,
  deleteUser
} from '../Controller/userController.js'
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

// Authentication routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
//userRouter.post('/admin', adminLogin)

// Profile management routes
userRouter.post('/profile', getUserProfile)
userRouter.post('/update-profile', updateUserProfile)
userRouter.post('/stories', getUserStories)
userRouter.post('/reviews', getUserReviews)
userRouter.post('/follow', followUser)
userRouter.post('/follow-status', getFollowStatus)
userRouter.get('/profile/:userId', getUserProfile)
userRouter.post('/bookmarks', getUserBookmarks)
//admin
userRouter.get('/admin/users', adminAuth, getAllUsers);
userRouter.delete('/admin/user', adminAuth, deleteUser);
export default userRouter
