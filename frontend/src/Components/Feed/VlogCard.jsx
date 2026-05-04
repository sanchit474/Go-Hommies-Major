import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { LikeVlog, UnlikeVlog, CommentOnVlog } from '../../../ApiCall';

const VlogCard = ({ vlogId, title, description, videoUrl, user, likeCount: initialLikeCount, time, likes: initialLikes }) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [isLiked, setIsLiked] = useState(initialLikes?.includes(user?._id) || false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommentingLoading, setIsCommentingLoading] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const convertVideoUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtube.com/embed')) {
      return url;
    }
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return url;
  };

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const response = await UnlikeVlog(vlogId);
        if (response?.status === 200) {
          setIsLiked(false);
          setLikeCount(Math.max(0, likeCount - 1));
        }
      } else {
        const response = await LikeVlog(vlogId);
        if (response?.status === 200) {
          setIsLiked(true);
          setLikeCount(likeCount + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsCommentingLoading(true);
    try {
      const response = await CommentOnVlog(vlogId, commentText);
      if (response?.status === 200) {
        setCommentText('');
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommentingLoading(false);
    }
  };

  const handleShare = () => {
    const shareText = `Check out this amazing vlog: ${title}`;
    if (navigator.share) {
      navigator.share({
        title,
        text: shareText,
        url: window.location.href,
      }).catch((err) => console.log('Share error:', err));
    } else {
      alert('Sharing not supported on this device');
    }
  };

  return (
    <div className="modern-card overflow-hidden">
      {/* Video Section */}
      <div className="w-full aspect-video bg-black flex items-center justify-center relative group/video">
        <iframe
          width="100%"
          height="100%"
          src={convertVideoUrl(videoUrl)}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full relative z-10"
        />
        <div className="absolute inset-0 bg-primary/5 animate-pulse z-0" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 hover:text-primary transition-colors cursor-pointer">{title}</h3>
        <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed">{description}</p>

        {/* User Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary/20">
              {getUserInitials(user?.name)}
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-slate-900 text-sm">{user?.name || 'Anonymous'}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{formatDate(time)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
             <Heart size={14} className={isLiked ? "fill-red-500 text-red-500" : "text-slate-400"} />
             <span className="text-xs font-bold text-slate-700">{likeCount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <button 
            onClick={handleLikeToggle}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs ${isLiked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-300 font-bold text-xs"
          >
            <MessageCircle size={16} />
            Comment
          </button>
          <button 
            onClick={handleShare}
            className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-300"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Comment Form */}
        {showCommentForm && (
          <div className="pt-4 mt-4 border-t border-slate-100 flex gap-2 animate-in slide-in-from-top-2 duration-300">
            <input
              type="text"
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary transition-all"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isCommentingLoading}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all disabled:bg-slate-300 shadow-md shadow-primary/20"
            >
              {isCommentingLoading ? '...' : 'Post'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VlogCard;
