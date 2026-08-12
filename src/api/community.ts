import api from './axios';

export interface CommunityPostRequest {
  title: string;
  category: string;
  content: string;
}

export const communityApi = {
  // 게시글 목록 조회
  getPosts: (page = 0, size = 10) => 
    api.get(`/api/community/posts?page=${page}&size=${size}`),
    
  // 게시글 상세 조회
  getPostDetail: (postId: number) => 
    api.get(`/api/community/posts/${postId}`),
    
  // 게시글 작성
  createPost: (data: CommunityPostRequest) => 
    api.post('/api/community/posts', data),
    
  // 게시글 좋아요
  likePost: (postId: number) => 
    api.post(`/api/community/posts/${postId}/likes`),
    
  // 게시글 좋아요 취소
  unlikePost: (postId: number) => 
    api.delete(`/api/community/posts/${postId}/likes`),
};
