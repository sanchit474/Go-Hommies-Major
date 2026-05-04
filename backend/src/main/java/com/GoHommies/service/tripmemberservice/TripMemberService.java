package com.GoHommies.service.tripmemberservice;

import com.GoHommies.dto.CreateJoinRequestDto;
import com.GoHommies.dto.JoinRequestDto;
import com.GoHommies.dto.TripMemberDto;
import java.util.List;

public interface TripMemberService {
    // Join request management
    JoinRequestDto requestToJoin(Long tripId, String email, CreateJoinRequestDto dto);
    JoinRequestDto approveJoinRequest(Long tripId, Long requestId, String email);
    JoinRequestDto rejectJoinRequest(Long tripId, Long requestId, String email);
    
    // Get join requests (for trip owner)
    List<JoinRequestDto> getPendingRequests(Long tripId, String email);
    List<JoinRequestDto> getAllRequests(Long tripId, String email);
    
    // Get trip members
    List<TripMemberDto> getTripMembers(Long tripId);
    
    // Get joined trips
    List<JoinRequestDto> getMyApprovedJoins(String email);
    
    // Leave trip
    void leaveTrip(Long tripId, String email);
    
    // Check if already member
    boolean isTripMember(Long tripId, String email);
}
