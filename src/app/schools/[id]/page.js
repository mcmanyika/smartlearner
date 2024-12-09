"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue, update, push, serverTimestamp, get, remove, ref as dbRef } from 'firebase/database';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import Layout from '../../../pages/admin/adminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../contexts/AuthContext';

const SchoolDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const COMMENTS_PER_PAGE = 5;
  const MAX_VISIBLE_PAGES = 5;
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const schoolRef = ref(database, `schools/${params.id}`);
    
    const unsubscribe = onValue(schoolRef, (snapshot) => {
      if (snapshot.exists()) {
        setSchool({ id: params.id, ...snapshot.val() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  useEffect(() => {
    if (user) {
      const adminRef = ref(database, `admins/${user.uid}`);
      onValue(adminRef, (snapshot) => {
        setIsAdmin(snapshot.exists());
      });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleRating = async (rating) => {
    const schoolRef = ref(database, `schools/${params.id}`);
    const newTotalRatings = (school.totalRatings || 0) + 1;
    const currentTotal = (school.averageRating || 0) * (school.totalRatings || 0);
    const newAverageRating = (currentTotal + rating) / newTotalRatings;

    const currentDistribution = school.ratingDistribution || {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    const newDistribution = {
      ...currentDistribution,
      [rating]: (currentDistribution[rating] || 0) + 1
    };

    try {
      await update(schoolRef, {
        averageRating: newAverageRating,
        totalRatings: newTotalRatings,
        ratingDistribution: newDistribution
      });
      setUserRating(rating);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    const commentsRef = ref(database, `schools/${params.id}/comments`);

    try {
      await push(commentsRef, {
        text: newComment.trim(),
        timestamp: serverTimestamp(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    try {
      // Check for existing claims
      const claimsRef = ref(database, `schools/${params.id}/claims`);
      const claimsSnapshot = await get(claimsRef);
      const claims = claimsSnapshot.val() || {};
      
      // Check if email already exists in claims
      const existingClaim = Object.values(claims).find(
        claim => claim.email.toLowerCase() === email.toLowerCase()
      );

      if (existingClaim) {
        toast.error('You have already submitted a claim for this school');
        setIsSubmitting(false);
        return;
      }

      // If no existing claim, proceed with submission
      await push(claimsRef, {
        fullName: formData.get('fullName'),
        email: email.toLowerCase(),
        phone: formData.get('phone'),
        position: formData.get('position'),
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      setIsClaimModalOpen(false);
      toast.success('Your claim has been submitted and is pending review');
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Error submitting claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const commentRef = dbRef(database, `schools/${params.id}/comments/${commentId}`);
        await remove(commentRef);
        toast.success('Comment deleted successfully');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      }
    }
  };

  const paginatedComments = () => {
    if (!school?.comments) return [];
    
    const sortedComments = Object.entries(school.comments)
      .sort(([, a], [, b]) => (b.timestamp || 0) - (a.timestamp || 0));
    
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    
    return sortedComments.slice(startIndex, endIndex);
  };

  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGES / 2), 1);
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - MAX_VISIBLE_PAGES + 1, 1);
    }

    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (start > 1) {
      pages.unshift('...');
      pages.unshift(1);
    }
    if (end < totalPages) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading || !school) return null;

  const totalComments = school?.comments ? Object.keys(school.comments).length : 0;
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto">
         
          {/* School Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">{school.schoolName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                <p className="text-gray-600">{school.location}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Curriculum</h3>
                <p className="text-gray-600">{school.curriculum || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Ownership</h3>
                <p className="text-gray-600">{school.ownership || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Fee Range</h3>
                <p className="text-gray-600">{school.feeRange || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Contact Email</h3>
                <p className="text-gray-600">{school.email || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Phone Number</h3>
                <p className="text-gray-600">{school.phone || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Website</h3>
                <p className="text-gray-600">
                  {school.website ? (
                    <a 
                      href={school.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  ) : 'Not specified'}
                </p>
              </div>
              <div>
                  <button 
                    onClick={() => setIsClaimModalOpen(true)}
                    className='bg-yellow-500 text-white rounded-full px-4 py-1 hover:bg-slate-600 transition-colors'
                  >
                    Claim School
                  </button>
              </div>

              <div className="flex justify-between items-center mb-6">
                  <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-4 py-2 bg-slate-600 text-white rounded-full hover:bg-blue-700"
                  >
                      Edit School
                  </button>
              </div>
            </div>

            {school.description && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{school.description}</p>
              </div>
            )}

            {school.facilities && school.facilities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {school.facilities.map((facility, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="bg-white shadow mt-6 rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">School Rating</h2>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Average Rating Card */}
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {school.averageRating ? school.averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-2xl ${
                          star <= (school.averageRating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {school.totalRatings || 0} {school.totalRatings === 1 ? 'rating' : 'ratings'}
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 max-w-sm">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <div className="text-sm text-gray-600 w-8">{star} ★</div>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ 
                              width: `${
                                school.ratingDistribution?.[star] 
                                  ? (school.ratingDistribution[star] / (school.totalRatings || 1)) * 100 
                                  : 0
                              }%` 
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-600 w-10">
                          {school.ratingDistribution?.[star] || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Rating Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Rate this school</p>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl transition-colors ${
                            star <= (hoveredRating || userRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } hover:text-yellow-400`}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => handleRating(star)}
                        />
                      ))}
                    </div>
                    {userRating > 0 ? (
                      <span className="text-sm text-gray-600">
                        Your rating: {userRating}/5
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Click to rate
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white shadow mt-6 rounded-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Comments</h2>
                <span className="text-sm text-gray-600">
                  {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
                </span>
              </div>
              
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="space-y-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this school..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {totalComments > 0 ? (
                  <>
                    {paginatedComments().map(([commentId, comment]) => (
                      <div key={commentId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-700">{comment.text}</p>
                          {/* <button
                            onClick={() => handleDeleteComment(commentId)}
                            className="text-red-500 hover:text-red-700 text-sm ml-4"
                          >
                            Delete
                          </button> */}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {comment.timestamp 
                            ? new Date(comment.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Just now'
                          }
                        </div>
                      </div>
                    ))}

                    {/* Enhanced Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-6">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              First
                            </button>
                            
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>

                            <div className="flex space-x-1">
                              {getPageNumbers(currentPage, totalPages).map((pageNum, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (typeof pageNum === 'number') {
                                      setCurrentPage(pageNum);
                                    }
                                  }}
                                  disabled={pageNum === '...'}
                                  className={`px-3 py-1 rounded-md ${
                                    pageNum === currentPage
                                      ? 'bg-blue-600 text-white'
                                      : pageNum === '...'
                                      ? 'bg-gray-50 text-gray-500 cursor-default'
                                      : 'bg-gray-100 hover:bg-gray-200'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>

                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Last
                            </button>
                          </div>

                          <div className="text-sm text-gray-500">
                            Showing {Math.min((currentPage - 1) * COMMENTS_PER_PAGE + 1, totalComments)} - {Math.min(currentPage * COMMENTS_PER_PAGE, totalComments)} of {totalComments} comments
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-600">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit School Details</h2>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const updatedSchool = {
                      schoolName: formData.get('schoolName'),
                      location: formData.get('location'),
                      curriculum: formData.get('curriculum'),
                      ownership: formData.get('ownership'),
                      feeRange: formData.get('feeRange'),
                      email: formData.get('email'),
                      phone: formData.get('phone'),
                      website: formData.get('website'),
                      description: formData.get('description'),
                      facilities: formData.get('facilities')
                        ? formData.get('facilities').split(',').map(f => f.trim()).filter(Boolean)
                        : [],
                    };

                    try {
                      const schoolRef = ref(database, `schools/${params.id}`);
                      await update(schoolRef, updatedSchool);
                      setIsEditModalOpen(false);
                    } catch (error) {
                      console.error('Error updating school:', error);
                    }
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Name
                        </label>
                        <input
                          type="text"
                          name="schoolName"
                          defaultValue={school.schoolName}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          defaultValue={school.location}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Curriculum
                        </label>
                        <input
                          type="text"
                          name="curriculum"
                          defaultValue={school.curriculum}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ownership
                        </label>
                        <input
                          type="text"
                          name="ownership"
                          defaultValue={school.ownership}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fee Range
                        </label>
                        <input
                          type="text"
                          name="feeRange"
                          defaultValue={school.feeRange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={school.email}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          defaultValue={school.phone}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          defaultValue={school.website}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        defaultValue={school.description}
                        rows="4"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facilities (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="facilities"
                        defaultValue={school.facilities?.join(', ')}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Library, Swimming Pool, Sports Ground"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Updated Claim School Modal */}
          {isClaimModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Claim School</h2>
                    <button
                      onClick={() => setIsClaimModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleClaimSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position at School
                      </label>
                      <select
                        name="position"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Select your position</option>
                        <option value="Principal">Principal</option>
                        <option value="Head Teacher">Head Teacher</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsClaimModalOpen(false)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
    />

    </Layout>
  );
};

export default SchoolDetailPage; 