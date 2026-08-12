import api from './axios';

// 폼 데이터 타입 정의
export interface InvitationData {
  title: string;
  template_id: string;
  main_color: string;
  // 필요에 따라 백엔드 명세에 맞춰 추가 필드(groom_name 등) 기입
  [key: string]: any; 
}

export const invitationApi = {
  // 내 청첩장 조회
  getMyInvitation: () => 
    api.get('/api/invitations/me'),
    
  // 청첩장 임시 저장 및 생성
  saveDraft: (data: InvitationData) => 
    api.post('/api/invitations', data),
    
  // 청첩장 발행
  publish: () => 
    api.patch('/api/invitations/me/publish'),
};
