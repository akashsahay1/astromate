import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;
import '../../models/chat.dart';
import '../../models/user.dart';
import '../../models/enums.dart';
import '../../config/config.dart';
import '../service_locator.dart';
import '../local/local_storage_service.dart';
import '../network/dio_client.dart';

class SocketService extends ChangeNotifier {
  static SocketService? _instance;
  static SocketService get instance => _instance ??= SocketService._();
  
  SocketService._();

  socket_io.Socket? _socket;
  final LocalStorageService _localStorage = getIt<LocalStorageService>();
  
  // Connection state
  bool _isConnected = false;
  bool _isConnecting = false;
  String? _currentChatSessionId;
  User? _currentUser;
  
  // Activity tracking
  Timer? _heartbeatTimer;
  DateTime _lastActivity = DateTime.now();
  static const int _heartbeatIntervalSeconds = 30; // Send heartbeat every 30 seconds
  
  // Stream controllers for real-time data
  final StreamController<ChatMessage> _messageStreamController =
      StreamController<ChatMessage>.broadcast();
  final StreamController<ChatSession> _sessionUpdateStreamController =
      StreamController<ChatSession>.broadcast();
  final StreamController<bool> _connectionStreamController =
      StreamController<bool>.broadcast();
  final StreamController<Map<String, dynamic>> _typingStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _incomingCallStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _incomingChatStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _chatAcceptedStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _chatRejectedStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _chatEndedStreamController =
      StreamController<Map<String, dynamic>>.broadcast();

  // Call-related stream controllers (matching chat pattern)
  final StreamController<Map<String, dynamic>> _callAnsweredStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _callRejectedStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _callEndedStreamController =
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _callErrorStreamController =
      StreamController<Map<String, dynamic>>.broadcast();

  // Getters
  bool get isConnected => _isConnected;
  bool get isConnecting => _isConnecting;
  String? get currentChatSessionId => _currentChatSessionId;

  /// Ensure socket is connected, with retry logic
  /// Throws exception if connection fails after retries
  Future<void> ensureConnected({int maxRetries = 3, Duration timeout = const Duration(seconds: 10)}) async {
    if (_isConnected) return;

    for (int attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        debugPrint('🔌 Connection attempt $attempt of $maxRetries');

        if (!_isConnecting) {
          await connect();
        }

        // Wait for connection with timeout
        await waitForConnection(timeout: timeout);

        if (_isConnected) {
          debugPrint('✅ Socket connected on attempt $attempt');
          return;
        }
      } catch (e) {
        debugPrint('❌ Connection attempt $attempt failed: $e');
        if (attempt == maxRetries) {
          throw Exception('Failed to connect to server after $maxRetries attempts');
        }
        // Wait before retry
        await Future.delayed(Duration(seconds: attempt));
      }
    }

    throw Exception('Failed to establish socket connection');
  }

  /// Wait for socket connection with timeout
  Future<void> waitForConnection({Duration timeout = const Duration(seconds: 10)}) async {
    if (_isConnected) return;

    final completer = Completer<void>();
    Timer? timeoutTimer;
    StreamSubscription<bool>? subscription;

    timeoutTimer = Timer(timeout, () {
      if (!completer.isCompleted) {
        subscription?.cancel();
        completer.completeError(TimeoutException('Socket connection timed out'));
      }
    });

    subscription = connectionStream.listen((connected) {
      if (connected && !completer.isCompleted) {
        timeoutTimer?.cancel();
        subscription?.cancel();
        completer.complete();
      }
    });

    // Check if already connected
    if (_isConnected && !completer.isCompleted) {
      timeoutTimer.cancel();
      subscription.cancel();
      return;
    }

    return completer.future;
  }
  
  // Streams
  Stream<ChatMessage> get messageStream => _messageStreamController.stream;
  Stream<ChatSession> get sessionUpdateStream => _sessionUpdateStreamController.stream;
  Stream<bool> get connectionStream => _connectionStreamController.stream;
  Stream<Map<String, dynamic>> get typingStream => _typingStreamController.stream;
  Stream<Map<String, dynamic>> get incomingCallStream => _incomingCallStreamController.stream;
  Stream<Map<String, dynamic>> get incomingChatStream => _incomingChatStreamController.stream;
  Stream<Map<String, dynamic>> get chatAcceptedStream => _chatAcceptedStreamController.stream;
  Stream<Map<String, dynamic>> get chatRejectedStream => _chatRejectedStreamController.stream;
  Stream<Map<String, dynamic>> get chatEndedStream => _chatEndedStreamController.stream;

  // Call streams (matching chat pattern)
  Stream<Map<String, dynamic>> get callAnsweredStream => _callAnsweredStreamController.stream;
  Stream<Map<String, dynamic>> get callRejectedStream => _callRejectedStreamController.stream;
  Stream<Map<String, dynamic>> get callEndedStream => _callEndedStreamController.stream;
  Stream<Map<String, dynamic>> get callErrorStream => _callErrorStreamController.stream;

  /// Initialize socket connection
  Future<void> connect({String? serverUrl}) async {
    if (_isConnected || _isConnecting) return;
    
    _isConnecting = true;
    notifyListeners();
    
    try {
      // Get auth token and user info
      final authToken = await _localStorage.getAuthToken();
      final userMap = _localStorage.getUserMap();
      if (userMap != null) {
        _currentUser = User.fromJson(userMap);
      }
      
      if (authToken == null || _currentUser == null) {
        throw Exception('User not authenticated');
      }
      
      // Socket.IO server URL (use provided or from config)
      final socketUrl = serverUrl ?? await Config.socketUrl;
      
      debugPrint('🔌 Connecting to Socket.IO server: $socketUrl');
      
      // Determine user type based on role - use standardized types: 'customer' or 'astrologer'
      final userType = _currentUser!.role.value == 'astrologer' ? 'astrologer' : 'customer';
      debugPrint('🔌 Socket connecting as: $userType (role: ${_currentUser!.role.value})');

      // Fresh socket every time: the io() cache would otherwise hand back the old Manager and we'd stack
      // a second set of handlers on it (duplicate messages, duplicate incoming-call screens).
      _socket?.dispose();
      _socket = socket_io.io(socketUrl,
        socket_io.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .enableForceNew()
          .enableAutoConnect()
          // read the token on every (re)connect so a refreshed token is used, not the one from first connect
          .setAuthFn((cb) async => cb({'token': await _localStorage.getAuthToken() ?? authToken}))
          .build()
      );
      
      // Setup event listeners
      _setupEventListeners();
      
    } catch (e) {
      _isConnecting = false;
      debugPrint('❌ Socket connection failed: $e');
      notifyListeners();
      rethrow;
    }
  }

  /// Setup socket event listeners
  void _setupEventListeners() {
    if (_socket == null) return;
    
    // Connection events
    _socket!.onConnect((_) {
      debugPrint('✅ Socket connected successfully');
      _isConnected = true;
      _isConnecting = false;
      _connectionStreamController.add(true);
      _startHeartbeat();

      // After a network drop the server forgets our rooms — rejoin the open chat
      if (_currentChatSessionId != null) {
        _socket!.emit('join_chat_session', {'sessionId': _currentChatSessionId});
      }

      // CRITICAL: Emit authenticate event so backend joins user to their room
      // Without this, user won't receive incoming_call or other targeted events
      if (_currentUser != null) {
        final userType = _currentUser!.role.value == 'astrologer' ? 'astrologer' : 'customer';
        debugPrint('🔐 Emitting authenticate event: userId=${_currentUser!.id}, userType=$userType');
        _socket!.emit('authenticate', {
          'userId': _currentUser!.id,
          'userType': userType,
        });
      }

      notifyListeners();
    });
    
    _socket!.onDisconnect((_) {
      debugPrint('🔌 Socket disconnected');
      _isConnected = false;
      _isConnecting = false;
      _stopHeartbeat();
      _connectionStreamController.add(false);
      notifyListeners();
    });
    
    _socket!.onConnectError((error) {
      debugPrint('❌ Socket connection error: $error');
      _isConnected = false;
      _isConnecting = false;
      _connectionStreamController.add(false);
      notifyListeners();
    });
    
    // Authentication events
    _socket!.on('authenticated', (data) {
      debugPrint('✅ Socket authenticated: $data');
    });
    
    _socket!.on('authentication_error', (data) {
      debugPrint('❌ Socket authentication error: $data');
      // Check if error indicates user not found / deleted
      final errorMsg = data?.toString().toLowerCase() ?? '';
      if (errorMsg.contains('not found') ||
          errorMsg.contains('invalid') ||
          errorMsg.contains('expired') ||
          errorMsg.contains('deleted')) {
        debugPrint('🚨 Socket auth error indicates user issue - triggering forced logout');
        if (DioClient.onAuthFailure != null) {
          DioClient.onAuthFailure!('Socket authentication failed');
        }
      }
    });

    // Force logout event - triggered when admin deletes the user
    _socket!.on('force_logout', (data) {
      debugPrint('🚨 [SOCKET] Force logout received: $data');
      final reason = data?['reason']?.toString() ?? 'Account deleted';
      if (DioClient.onAuthFailure != null) {
        DioClient.onAuthFailure!(reason);
      }
    });

    // Chat events
    _socket!.on('new_message', (data) {
      debugPrint('📨 Received new message: $data');
      try {
        final message = ChatMessage.fromJson(data);
        _messageStreamController.add(message);
      } catch (e) {
        debugPrint('❌ Failed to parse message: $e');
      }
    });
    
    _socket!.on('chat_history', (data) {
      debugPrint('📚 Received chat history: ${data['messages']?.length ?? 0} messages');
    });
    
    _socket!.on('typing_start', (data) {
      debugPrint('✍️ User typing: $data');
      _typingStreamController.add({...data, 'isTyping': true});
    });
    
    _socket!.on('typing_stop', (data) {
      debugPrint('✋ User stopped typing: $data');
      _typingStreamController.add({...data, 'isTyping': false});
    });
    
    _socket!.on('messages_read', (data) {
      debugPrint('👁️ Messages marked as read: $data');
    });
    
    // WebRTC Call events
    _socket!.on('incoming_call', (data) {
      debugPrint('📞 [SOCKET] Incoming call received: $data');
      try {
        final callData = Map<String, dynamic>.from(data);
        _incomingCallStreamController.add(callData);
        debugPrint('📞 [SOCKET] Incoming call pushed to stream');
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling incoming call: $e');
      }
    });

    // Chat session events (similar to call flow)
    _socket!.on('incoming_chat', (data) {
      debugPrint('💬 [SOCKET] Incoming chat received: $data');
      try {
        final chatData = Map<String, dynamic>.from(data);
        _incomingChatStreamController.add(chatData);
        debugPrint('💬 [SOCKET] Incoming chat pushed to stream');
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling incoming chat: $e');
      }
    });

    _socket!.on('chat_initiated', (data) {
      debugPrint('💬 [SOCKET] Chat initiated response: $data');
    });

    _socket!.on('chat_accepted', (data) {
      debugPrint('✅ [SOCKET] Chat accepted: $data');
      try {
        final chatData = Map<String, dynamic>.from(data);
        _chatAcceptedStreamController.add(chatData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling chat accepted: $e');
      }
    });

    _socket!.on('chat_rejected', (data) {
      debugPrint('❌ [SOCKET] Chat rejected: $data');
      try {
        final chatData = Map<String, dynamic>.from(data);
        _chatRejectedStreamController.add(chatData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling chat rejected: $e');
      }
    });

    _socket!.on('chat_error', (data) {
      debugPrint('❌ [SOCKET] Chat error: $data');
    });

    // Listen for message sent confirmation (for sender to add message to UI)
    _socket!.on('message_sent', (data) {
      debugPrint('✅ [SOCKET] Message sent confirmation: $data');
      try {
        // The server sends the full message in the 'message' field
        if (data['message'] != null) {
          final message = ChatMessage.fromJson(data['message']);
          _messageStreamController.add(message);
        }
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling message_sent: $e');
      }
    });

    _socket!.on('chat_ended', (data) {
      debugPrint('🔚 [SOCKET] Chat ended: $data');
      try {
        final chatData = Map<String, dynamic>.from(data);
        _chatEndedStreamController.add(chatData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling chat ended: $e');
      }
    });
    
    _socket!.on('call_initiated', (data) {
      debugPrint('📞 [SOCKET] Call initiated: $data');
    });

    _socket!.on('call_answered', (data) {
      debugPrint('✅ [SOCKET] Call answered: $data');
      try {
        final callData = Map<String, dynamic>.from(data);
        _callAnsweredStreamController.add(callData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling call_answered: $e');
      }
    });

    _socket!.on('call_rejected', (data) {
      debugPrint('❌ [SOCKET] Call rejected: $data');
      try {
        final callData = Map<String, dynamic>.from(data);
        _callRejectedStreamController.add(callData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling call_rejected: $e');
      }
    });

    _socket!.on('call_ended', (data) {
      debugPrint('📴 [SOCKET] Call ended: $data');
      try {
        final callData = Map<String, dynamic>.from(data);
        _callEndedStreamController.add(callData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling call_ended: $e');
      }
    });

    _socket!.on('call_error', (data) {
      debugPrint('❌ [SOCKET] Call error: $data');
      try {
        final callData = Map<String, dynamic>.from(data);
        _callErrorStreamController.add(callData);
      } catch (e) {
        debugPrint('❌ [SOCKET] Error handling call_error: $e');
      }
    });
    
    // Re-attach listeners other services registered via on(), so they survive logout/login and new sockets
    _externalListeners.forEach((event, callbacks) {
      for (final cb in callbacks) {
        _socket!.on(event, cb);
      }
    });

    // WebRTC Signaling events
    _socket!.on('webrtc_offer', (data) {
      debugPrint('📨 WebRTC offer received: $data');
    });
    
    _socket!.on('webrtc_answer', (data) {
      debugPrint('📨 WebRTC answer received: $data');
    });
    
    _socket!.on('webrtc_ice_candidate', (data) {
      debugPrint('🧊 ICE candidate received: $data');
    });
    
    // Presence events
    _socket!.on('user_online', (data) {
      debugPrint('🟢 User online: $data');
    });
    
    _socket!.on('user_offline', (data) {
      debugPrint('🔴 User offline: $data');
    });
    
    // Error events
    _socket!.on('error', (error) {
      debugPrint('❌ Socket error: $error');
    });
  }

  /// Join a chat session room
  Future<void> joinChatSession(String chatSessionId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }
    
    debugPrint('🏠 Joining chat session: $chatSessionId');
    _currentChatSessionId = chatSessionId;
    
    _socket!.emit('join_chat_session', {
      'sessionId': chatSessionId,
    });
  }

  /// Leave current chat session room
  Future<void> leaveChatSession() async {
    if (!_isConnected || _socket == null || _currentChatSessionId == null) {
      return;
    }
    
    debugPrint('🚪 Leaving chat session: $_currentChatSessionId');
    
    _socket!.emit('leave_chat_session', {
      'sessionId': _currentChatSessionId,
    });
    
    _currentChatSessionId = null;
  }

  /// Send a text message
  Future<void> sendMessage(String chatSessionId, String content, {String messageType = 'text', String? imageUrl, String? voiceUrl}) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('💬 Sending message: $content');

    final messageData = {
      'sessionId': chatSessionId,
      'content': content,
      'messageType': messageType,
      if (imageUrl != null) 'imageUrl': imageUrl,
      if (voiceUrl != null) 'voiceUrl': voiceUrl,
    };

    _socket!.emit('send_message', messageData);
  }

  /// Send an image message
  Future<void> sendImageMessage(String chatSessionId, String imageUrl) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('📷 Sending image message: $imageUrl');

    final messageData = {
      'sessionId': chatSessionId,
      'content': '',
      'messageType': 'image',
      'imageUrl': imageUrl,
    };

    _socket!.emit('send_message', messageData);
  }

  /// Send typing indicator
  Future<void> sendTyping(String chatSessionId, bool isTyping) async {
    if (!_isConnected || _socket == null) return;
    
    final typingData = {
      'sessionId': chatSessionId,
    };
    
    _socket!.emit(isTyping ? 'typing_start' : 'typing_stop', typingData);
  }

  /// Start a new chat session
  Future<void> startChatSession(String astrologerId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }
    
    debugPrint('🎯 Starting new chat session with astrologer: $astrologerId');
    
    _socket!.emit('start_chat_session', {
      'userId': _currentUser!.id,
      'astrologerId': astrologerId,
      'sessionType': 'chat',
    });
  }

  /// End current chat session
  Future<void> endChatSession(String chatSessionId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('🔚 Ending chat session: $chatSessionId');

    _socket!.emit('end_chat_session', {
      'chatSessionId': chatSessionId,
      'userId': _currentUser!.id,
    });
  }

  /// Initiate a chat session with an astrologer (emits socket event)
  Future<void> initiateChatSession(String astrologerId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('💬 Initiating chat session with astrologer: $astrologerId');

    _socket!.emit('initiate_chat', {
      'astrologerId': astrologerId,
    });
  }

  /// Accept an incoming chat session (for astrologers)
  Future<void> acceptChatSession(String sessionId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('✅ Accepting chat session: $sessionId');

    _socket!.emit('accept_chat', {
      'sessionId': sessionId,
    });
  }

  /// Reject an incoming chat session (for astrologers)
  Future<void> rejectChatSession(String sessionId, {String reason = 'busy'}) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('❌ Rejecting chat session: $sessionId');

    _socket!.emit('reject_chat', {
      'sessionId': sessionId,
      'reason': reason,
    });
  }

  // ============ CALL SESSION METHODS (matching chat pattern) ============

  /// Initiate a call session with an astrologer
  Future<void> initiateCallSession({
    required String sessionId,
    required String astrologerId,
    required String callType,
  }) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('📞 [SOCKET] Initiating call: session_id=$sessionId, astrologer_id=$astrologerId, call_type=$callType');

    _socket!.emit('initiate_call', {
      'session_id': sessionId,
      'astrologer_id': astrologerId,
      'caller_id': _currentUser!.id,
      'caller_name': _currentUser!.name,
      'caller_type': 'customer',
      'call_type': callType,
    });
  }

  /// Answer an incoming call (for astrologers)
  Future<void> answerCallSession(String sessionId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('✅ [SOCKET] Answering call: session_id=$sessionId');

    _socket!.emit('answer_call', {
      'session_id': sessionId,
    });
  }

  /// Reject an incoming call (for astrologers)
  Future<void> rejectCallSession(String sessionId, {String reason = 'busy'}) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('❌ [SOCKET] Rejecting call: session_id=$sessionId, reason=$reason');

    _socket!.emit('reject_call', {
      'session_id': sessionId,
      'reason': reason,
    });
  }

  /// End an active call
  Future<void> endCallSession(String sessionId) async {
    if (!_isConnected || _socket == null) {
      throw Exception('Socket not connected');
    }

    debugPrint('📴 [SOCKET] Ending call: session_id=$sessionId');

    _socket!.emit('end_call', {
      'session_id': sessionId,
    });
  }

  /// Mark messages as read
  Future<void> markMessagesAsRead(String chatSessionId, List<String> messageIds) async {
    if (!_isConnected || _socket == null) return;
    
    _socket!.emit('mark_messages_read', {
      'sessionId': chatSessionId,
      'messageIds': messageIds,
    });
  }

  /// Disconnect socket
  Future<void> disconnect() async {
    debugPrint('🔌 Disconnecting socket');
    
    _stopHeartbeat();
    await leaveChatSession();
    
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    
    _isConnected = false;
    _isConnecting = false;
    _currentChatSessionId = null;
    _currentUser = null;
    
    notifyListeners();
  }

  /// Start heartbeat to maintain connection and track activity
  void _startHeartbeat() {
    _stopHeartbeat(); // Stop any existing timer
    
    _heartbeatTimer = Timer.periodic(Duration(seconds: _heartbeatIntervalSeconds), (timer) {
      if (_isConnected && _socket != null) {
        _lastActivity = DateTime.now();
        _socket!.emit('heartbeat', {
          'timestamp': _lastActivity.millisecondsSinceEpoch,
          'userId': _currentUser?.id,
        });
        debugPrint('💓 Heartbeat sent');
      } else {
        _stopHeartbeat();
      }
    });
  }

  /// Stop heartbeat timer
  void _stopHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = null;
  }

  /// Update activity timestamp (call this when user performs any action)
  void updateActivity() {
    _lastActivity = DateTime.now();
  }

  /// Cleanup resources
  @override
  void dispose() {
    _stopHeartbeat();
    disconnect();
    _messageStreamController.close();
    _sessionUpdateStreamController.close();
    _connectionStreamController.close();
    _typingStreamController.close();
    _incomingCallStreamController.close();
    _incomingChatStreamController.close();
    _chatAcceptedStreamController.close();
    _chatRejectedStreamController.close();
    _chatEndedStreamController.close();
    // Call stream controllers
    _callAnsweredStreamController.close();
    _callRejectedStreamController.close();
    _callEndedStreamController.close();
    _callErrorStreamController.close();
    super.dispose();
  }

  /// Reconnect socket
  Future<void> reconnect() async {
    await disconnect();
    await Future.delayed(const Duration(seconds: 2));
    await connect();
  }

  /// Get connection status message
  String get connectionStatusMessage {
    if (_isConnecting) return 'Connecting...';
    if (_isConnected) return 'Connected';
    return 'Disconnected';
  }

  /// Emit socket event (for use by other services)
  void emit(String event, dynamic data) {
    if (_socket != null && _isConnected) {
      _socket!.emit(event, data);
    }
  }

  final Map<String, List<Function(dynamic)>> _externalListeners = {};

  /// Listen to socket event (for use by other services). Survives reconnects and new sockets.
  void on(String event, Function(dynamic) callback) {
    _externalListeners.putIfAbsent(event, () => []).add(callback);
    _socket?.on(event, callback);
  }

  /// Remove a listener registered via on() (all of them for [event] if no callback given).
  void off(String event, [Function(dynamic)? callback]) {
    if (callback == null) {
      _externalListeners.remove(event);
      _socket?.off(event);
    } else {
      _externalListeners[event]?.remove(callback);
      _socket?.off(event, callback);
    }
  }
}