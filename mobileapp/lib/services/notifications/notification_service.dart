import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_callkit_incoming/flutter_callkit_incoming.dart';
import 'package:flutter_callkit_incoming/entities/entities.dart';
import 'package:uuid/uuid.dart';
import '../api/user_api_service.dart';
import '../local/local_storage_service.dart';
import '../service_locator.dart';

/// Service for handling both Firebase push notifications and local notifications
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  // getter, not a field: FirebaseMessaging.instance throws when Firebase isn't configured
  FirebaseMessaging get _firebaseMessaging => FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  final Uuid _uuid = const Uuid();

  String? _fcmToken;
  String? _currentCallKitUuid;
  Function(Map<String, dynamic>)? _onCallNotification;
  Function(Map<String, dynamic>)? _onCallAnswered;
  Function(Map<String, dynamic>)? _onCallDeclined;
  Function(Map<String, dynamic>)? _onMessageNotification;
  Function(Map<String, dynamic>)? _onNotificationTapped;
  Function(Map<String, dynamic>)? _onIncomingChatNotification;

  /// Initialize the notification service
  Future<void> initialize({
    Function(Map<String, dynamic>)? onCallNotification,
    Function(Map<String, dynamic>)? onCallAnswered,
    Function(Map<String, dynamic>)? onCallDeclined,
    Function(Map<String, dynamic>)? onMessageNotification,
    Function(Map<String, dynamic>)? onNotificationTapped,
    Function(Map<String, dynamic>)? onIncomingChatNotification,
  }) async {
    _onCallNotification = onCallNotification;
    _onCallAnswered = onCallAnswered;
    _onCallDeclined = onCallDeclined;
    _onMessageNotification = onMessageNotification;
    _onNotificationTapped = onNotificationTapped;
    _onIncomingChatNotification = onIncomingChatNotification;

    await _initializeLocalNotifications();
    await _initializeCallKit();
    // Push needs Firebase; skip it (local notifications + CallKit still work) until it's configured
    if (Firebase.apps.isEmpty) {
      debugPrint('⚠️ Firebase not configured — push notifications disabled');
      return;
    }
    await _initializeFirebaseMessaging();
    await _requestPermissions();
    await _getFCMToken();
    _setupMessageHandlers();
  }

  /// Initialize CallKit for native incoming call UI
  Future<void> _initializeCallKit() async {
    try {
      // Listen for CallKit events
      FlutterCallkitIncoming.onEvent.listen((CallEvent? event) {
        if (event == null) return;

        debugPrint('📞 CallKit event: ${event.eventName}');

        switch (event) {
          case CallEventActionCallAccept(:final callKitParams):
            _handleCallKitAccept(callKitParams.toJson());
          case CallEventActionCallDecline(:final callKitParams):
            _handleCallKitDecline(callKitParams.toJson());
          case CallEventActionCallEnded():
          case CallEventActionCallTimeout():
            _currentCallKitUuid = null;
          default:
            break;
        }
      });

      debugPrint('📞 CallKit initialized successfully');
    } catch (e) {
      debugPrint('❌ Failed to initialize CallKit: $e');
    }
  }

  /// Handle CallKit accept action
  void _handleCallKitAccept(Map<String, dynamic>? body) {
    if (body == null) {
      debugPrint('📞 CallKit accept - body is null');
      return;
    }

    debugPrint('📞 CallKit accept - full body: $body');

    // Try to get extra data from different possible locations
    Map<String, dynamic>? callData;

    // First try body['extra']
    if (body['extra'] != null) {
      if (body['extra'] is Map<String, dynamic>) {
        callData = body['extra'] as Map<String, dynamic>;
      } else if (body['extra'] is Map) {
        callData = Map<String, dynamic>.from(body['extra'] as Map);
      }
    }

    // If no extra, check if data is directly in body
    if (callData == null || callData.isEmpty) {
      // Look for session_id directly in body
      if (body['session_id'] != null || body['sessionId'] != null) {
        callData = Map<String, dynamic>.from(body);
      }
    }

    if (callData != null && callData.isNotEmpty) {
      debugPrint('📞 Call accepted - call data: $callData');
      _onCallAnswered?.call(callData);
    } else {
      debugPrint('⚠️ CallKit accept - no valid call data found in body');
    }
  }

  /// Handle CallKit decline action
  void _handleCallKitDecline(Map<String, dynamic>? body) {
    if (body == null) {
      debugPrint('📞 CallKit decline - body is null');
      return;
    }

    debugPrint('📞 CallKit decline - full body: $body');

    // Try to get extra data from different possible locations
    Map<String, dynamic>? callData;

    if (body['extra'] != null) {
      if (body['extra'] is Map<String, dynamic>) {
        callData = body['extra'] as Map<String, dynamic>;
      } else if (body['extra'] is Map) {
        callData = Map<String, dynamic>.from(body['extra'] as Map);
      }
    }

    if (callData == null || callData.isEmpty) {
      if (body['session_id'] != null || body['sessionId'] != null) {
        callData = Map<String, dynamic>.from(body);
      }
    }

    if (callData != null && callData.isNotEmpty) {
      debugPrint('📞 Call declined - call data: $callData');
      _onCallDeclined?.call(callData);
    } else {
      debugPrint('⚠️ CallKit decline - no valid call data found');
    }
    _currentCallKitUuid = null;
  }

  /// Initialize local notifications
  Future<void> _initializeLocalNotifications() async {
    const AndroidInitializationSettings androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    
    const DarwinInitializationSettings iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
      macOS: iosSettings,
    );

    await _localNotifications.initialize(
      settings: initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) async {
        if (response.payload != null && response.payload!.isNotEmpty) {
          final data = jsonDecode(response.payload!);
          _onNotificationTapped?.call(data);
        }
      },
    );
  }

  /// Initialize Firebase Messaging
  Future<void> _initializeFirebaseMessaging() async {
    // Configure Firebase Messaging settings
    await _firebaseMessaging.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  /// Request notification permissions
  Future<void> _requestPermissions() async {
    // Request notification permission
    final status = await Permission.notification.request();
    debugPrint('📱 Notification permission: ${status.name}');

    // Request Firebase messaging permissions
    final settings = await _firebaseMessaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    debugPrint('📱 Firebase messaging permission: ${settings.authorizationStatus.name}');
  }

  /// Get FCM token for push notifications
  Future<void> _getFCMToken() async {
    try {
      // For iOS, we need to wait for APNS token first
      if (Platform.isIOS) {
        String? apnsToken = await _firebaseMessaging.getAPNSToken();
        if (apnsToken == null) {
          debugPrint('📱 Waiting for APNS token...');
          // Wait a bit and retry - APNS token can take time to be available
          await Future.delayed(const Duration(seconds: 2));
          apnsToken = await _firebaseMessaging.getAPNSToken();
        }

        if (apnsToken == null) {
          debugPrint('⚠️ APNS token not available - push notifications may not work on iOS');
          debugPrint('⚠️ Please ensure notifications are enabled in iOS Settings');
        } else {
          debugPrint('📱 APNS Token obtained: ${apnsToken.substring(0, 20)}...');
        }
      }

      _fcmToken = await _firebaseMessaging.getToken();
      debugPrint('📱 FCM Token: $_fcmToken');

      // Send initial token to server
      if (_fcmToken != null) {
        await _updateTokenOnServer(_fcmToken!);
      }

      // Listen for token refresh
      _firebaseMessaging.onTokenRefresh.listen((token) {
        _fcmToken = token;
        debugPrint('📱 FCM Token refreshed: $token');
        _updateTokenOnServer(token);
      });
    } catch (e) {
      debugPrint('❌ Failed to get FCM token: $e');
    }
  }

  /// Setup message handlers for different app states
  void _setupMessageHandlers() {
    // Handle messages when app is in foreground
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('📱 Received message in foreground: ${message.data}');
      handleMessage(message, isBackground: false);
    });

    // Handle messages when app is in background but not terminated
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint('📱 Message opened app from background: ${message.data}');
      handleMessage(message, isBackground: true);
    });

    // Handle messages when app is terminated
    // This needs to be called in main.dart after Firebase initialization
    FirebaseMessaging.instance.getInitialMessage().then((RemoteMessage? message) {
      if (message != null) {
        debugPrint('📱 Message opened app from terminated state: ${message.data}');
        handleMessage(message, isBackground: true);
      }
    });
  }

  /// Handle incoming Firebase messages
  void handleMessage(RemoteMessage message, {required bool isBackground}) {
    final data = message.data;
    final notificationType = data['type'] ?? '';

    switch (notificationType) {
      case 'incoming_call':
        _handleIncomingCallNotification(data, message.notification, isBackground);
        break;
      case 'incoming_chat':
        _handleIncomingChatNotification(data, message.notification, isBackground);
        break;
      case 'new_message':
        _handleNewMessageNotification(data, message.notification, isBackground);
        break;
      case 'call_ended':
        _handleCallEndedNotification(data, message.notification, isBackground);
        break;
      case 'call_missed':
        _handleMissedCallNotification(data, message.notification, isBackground);
        break;
      default:
        _handleGeneralNotification(data, message.notification, isBackground);
    }
  }

  /// Handle incoming call notifications
  void _handleIncomingCallNotification(
    Map<String, dynamic> data,
    RemoteNotification? notification,
    bool isBackground,
  ) async {
    // Always show CallKit for incoming calls (works on locked screen too)
    // CallKit provides native phone-like ring even when app is in background/killed
    await showCallNotification(
      callerId: data['caller_id'] ?? '',
      callerName: data['caller_name'] ?? 'Incoming Call',
      callType: data['call_type'] ?? 'voice',
      sessionId: data['session_id'] ?? '',
      extraData: data, // Pass all data including astrologer info
    );

    // Always notify the call notification handler to track the session
    // This is needed to prevent CallKit decline from rejecting handled calls
    _onCallNotification?.call(data);
  }

  /// Handle incoming chat request notifications (for astrologers)
  void _handleIncomingChatNotification(
    Map<String, dynamic> data,
    RemoteNotification? notification,
    bool isBackground,
  ) async {
    debugPrint('💬 Handling incoming chat notification: $data');

    // Show local notification for incoming chat request
    await showIncomingChatNotification(
      userId: data['user_id'] ?? '',
      userName: data['user_name'] ?? 'Customer',
      sessionId: data['session_id'] ?? '',
      chatRate: data['chat_rate'] ?? '0',
    );

    // Notify the incoming chat handler (e.g., to show in-app UI)
    _onIncomingChatNotification?.call(data);
  }

  /// Handle new message notifications
  void _handleNewMessageNotification(
    Map<String, dynamic> data, 
    RemoteNotification? notification,
    bool isBackground,
  ) async {
    if (isBackground) {
      await showMessageNotification(
        senderId: data['sender_id'] ?? '',
        senderName: data['sender_name'] ?? 'Unknown',
        message: data['message'] ?? '',
        sessionId: data['session_id'] ?? '',
      );
    } else {
      _onMessageNotification?.call(data);
    }
  }

  /// Handle call ended notifications
  void _handleCallEndedNotification(
    Map<String, dynamic> data, 
    RemoteNotification? notification,
    bool isBackground,
  ) async {
    // Cancel any ongoing call notifications
    await _localNotifications.cancel(id: 1);
    
    if (isBackground) {
      await showGeneralNotification(
        title: 'Call Ended',
        body: 'Your call has ended. Duration: ${data['duration'] ?? 'Unknown'}',
        payload: data,
      );
    }
  }

  /// Handle missed call notifications
  void _handleMissedCallNotification(
    Map<String, dynamic> data, 
    RemoteNotification? notification,
    bool isBackground,
  ) async {
    await showGeneralNotification(
      title: 'Missed Call',
      body: 'You missed a call from ${data['caller_name'] ?? 'Unknown'}',
      payload: data,
    );
  }

  /// Handle general notifications
  void _handleGeneralNotification(
    Map<String, dynamic> data, 
    RemoteNotification? notification,
    bool isBackground,
  ) async {
    if (isBackground && notification != null) {
      await showGeneralNotification(
        title: notification.title ?? 'Astromate',
        body: notification.body ?? 'You have a new notification',
        payload: data,
      );
    }
  }

  /// Show incoming call notification with native CallKit UI
  /// This will ring like a real phone call even when screen is locked
  Future<void> showCallNotification({
    required String callerId,
    required String callerName,
    required String callType,
    required String sessionId,
    Map<String, dynamic>? extraData,
  }) async {
    // Generate unique ID for this call
    final callKitId = _uuid.v4();
    _currentCallKitUuid = callKitId;

    // Prepare extra data to pass through CallKit
    final Map<String, dynamic> extra = {
      'type': 'incoming_call',
      'caller_id': callerId,
      'caller_name': callerName,
      'call_type': callType,
      'session_id': sessionId,
      ...?extraData,
    };

    // Configure CallKit parameters
    final params = CallKitParams(
      id: callKitId,
      nameCaller: callerName,
      appName: 'Astromate',
      avatar: null, // Can set avatar URL here
      handle: callerId,
      type: callType.toLowerCase() == 'video' ? 1 : 0, // 0 = audio, 1 = video
      missedCallNotification: const NotificationParams(
        showNotification: true,
        isShowCallback: false,
        subtitle: 'Missed call',
        callbackText: 'Call back',
      ),
      duration: 45000, // Ring for 45 seconds
      extra: extra,
      headers: <String, dynamic>{},
      android: const AndroidParams(
        textAccept: 'Accept',
        textDecline: 'Decline',
        isCustomNotification: false,
        isShowLogo: true,
        ringtonePath: 'system_ringtone_default',
        backgroundColor: '#FF6A1B',
        backgroundUrl: null,
        actionColor: '#4CAF50',
        textColor: '#ffffff',
        incomingCallNotificationChannelName: 'Incoming Calls',
        missedCallNotificationChannelName: 'Missed Calls',
        isShowCallID: false,
        isShowFullLockedScreen: true,
      ),
      ios: const IOSParams(
        iconName: 'CallKitLogo',
        handleType: 'generic',
        supportsVideo: true,
        maximumCallGroups: 1,
        maximumCallsPerCallGroup: 1,
        audioSessionMode: 'default',
        audioSessionActive: true,
        audioSessionPreferredSampleRate: 44100.0,
        audioSessionPreferredIOBufferDuration: 0.005,
        supportsDTMF: false,
        supportsHolding: false,
        supportsGrouping: false,
        supportsUngrouping: false,
        ringtonePath: 'system_ringtone_default',
      ),
    );

    // Show native incoming call UI
    await FlutterCallkitIncoming.showCallkitIncoming(params);
    debugPrint('📞 CallKit incoming call shown: $_currentCallKitUuid');
  }

  /// End the current CallKit call (call this when call ends or is rejected)
  Future<void> endCallKit() async {
    if (_currentCallKitUuid != null) {
      await FlutterCallkitIncoming.endCall(_currentCallKitUuid!);
      debugPrint('📞 CallKit call ended: $_currentCallKitUuid');
      _currentCallKitUuid = null;
    }
  }

  /// End all active CallKit calls
  Future<void> endAllCallKitCalls() async {
    await FlutterCallkitIncoming.endAllCalls();
    _currentCallKitUuid = null;
    debugPrint('📞 All CallKit calls ended');
  }

  /// Get the current CallKit UUID
  String? get currentCallKitUuid => _currentCallKitUuid;

  /// Check if there's an active CallKit call
  Future<List<dynamic>?> getActiveCalls() async {
    return await FlutterCallkitIncoming.activeCalls();
  }

  /// Legacy local notification for incoming calls (fallback)
  Future<void> showCallNotificationLegacy({
    required String callerId,
    required String callerName,
    required String callType,
    required String sessionId,
  }) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'incoming_calls',
      'Incoming Calls',
      channelDescription: 'Notifications for incoming voice and video calls',
      importance: Importance.max,
      priority: Priority.high,
      category: AndroidNotificationCategory.call,
      fullScreenIntent: true,
      ongoing: true,
      autoCancel: false,
      actions: [
        AndroidNotificationAction(
          'answer_call',
          'Answer',
          icon: DrawableResourceAndroidBitmap('ic_call'),
        ),
        AndroidNotificationAction(
          'decline_call',
          'Decline',
          icon: DrawableResourceAndroidBitmap('ic_call_end'),
        ),
      ],
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      categoryIdentifier: 'incoming_call_category',
      interruptionLevel: InterruptionLevel.critical,
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    final payload = jsonEncode({
      'type': 'incoming_call',
      'caller_id': callerId,
      'caller_name': callerName,
      'call_type': callType,
      'session_id': sessionId,
    });

    await _localNotifications.show(
      id: 1, // Unique ID for call notifications
      title: '$callType Call',
      body: 'Incoming ${callType.toLowerCase()} call from $callerName',
      notificationDetails: notificationDetails,
      payload: payload,
    );
  }

  /// Show incoming chat request notification (for astrologers)
  Future<void> showIncomingChatNotification({
    required String userId,
    required String userName,
    required String sessionId,
    required String chatRate,
  }) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'chat_requests',
      'Chat Requests',
      channelDescription: 'Notifications for incoming chat requests',
      importance: Importance.max,
      priority: Priority.high,
      category: AndroidNotificationCategory.message,
      fullScreenIntent: true,
      ongoing: true,
      autoCancel: false,
      actions: [
        AndroidNotificationAction(
          'accept_chat',
          'Accept',
          icon: DrawableResourceAndroidBitmap('ic_chat'),
        ),
        AndroidNotificationAction(
          'decline_chat',
          'Decline',
          icon: DrawableResourceAndroidBitmap('ic_close'),
        ),
      ],
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      categoryIdentifier: 'incoming_chat_category',
      interruptionLevel: InterruptionLevel.timeSensitive,
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    final payload = jsonEncode({
      'type': 'incoming_chat',
      'user_id': userId,
      'user_name': userName,
      'session_id': sessionId,
      'chat_rate': chatRate,
    });

    await _localNotifications.show(
      id: 4, // Unique ID for incoming chat notifications
      title: 'New Chat Request',
      body: '$userName wants to chat with you',
      notificationDetails: notificationDetails,
      payload: payload,
    );

    debugPrint('💬 Incoming chat notification shown for session: $sessionId');
  }

  /// Show new message notification
  Future<void> showMessageNotification({
    required String senderId,
    required String senderName,
    required String message,
    required String sessionId,
  }) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'chat_messages',
      'Chat Messages',
      channelDescription: 'Notifications for new chat messages',
      importance: Importance.high,
      priority: Priority.high,
      actions: [
        AndroidNotificationAction(
          'reply_message',
          'Reply',
          icon: DrawableResourceAndroidBitmap('ic_reply'),
        ),
        AndroidNotificationAction(
          'mark_read',
          'Mark as Read',
          icon: DrawableResourceAndroidBitmap('ic_done'),
        ),
      ],
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      categoryIdentifier: 'message_category',
    );

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    final payload = jsonEncode({
      'type': 'new_message',
      'sender_id': senderId,
      'sender_name': senderName,
      'message': message,
      'session_id': sessionId,
    });

    await _localNotifications.show(
      id: 2, // Unique ID for message notifications
      title: 'New Message',
      body: '$senderName: $message',
      notificationDetails: notificationDetails,
      payload: payload,
    );
  }

  /// Show general notification
  Future<void> showGeneralNotification({
    required String title,
    required String body,
    Map<String, dynamic>? payload,
  }) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'general',
      'General Notifications',
      channelDescription: 'General app notifications',
      importance: Importance.defaultImportance,
      priority: Priority.defaultPriority,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails();

    const NotificationDetails notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    final payloadString = payload != null ? jsonEncode(payload) : null;

    await _localNotifications.show(
      id: 3, // Unique ID for general notifications
      title: title,
      body: body,
      notificationDetails: notificationDetails,
      payload: payloadString,
    );
  }

  /// Cancel a specific notification
  Future<void> cancelNotification(int id) async {
    await _localNotifications.cancel(id: id);
  }

  /// Cancel all notifications
  Future<void> cancelAllNotifications() async {
    await _localNotifications.cancelAll();
  }

  /// Get the current FCM token
  String? get fcmToken => _fcmToken;

  /// Check if notifications are enabled
  Future<bool> areNotificationsEnabled() async {
    if (Platform.isAndroid) {
      return await Permission.notification.isGranted;
    } else if (Platform.isIOS) {
      final settings = await _firebaseMessaging.getNotificationSettings();
      return settings.authorizationStatus == AuthorizationStatus.authorized;
    }
    return false;
  }

  /// Open notification settings
  Future<void> openNotificationSettings() async {
    try {
      await openAppSettings();
    } catch (e) {
      debugPrint('❌ Failed to open app settings: $e');
    }
  }

  /// Update FCM token on server
  Future<void> _updateTokenOnServer(String token) async {
    try {
      final userApiService = getIt<UserApiService>();
      final localStorage = getIt<LocalStorageService>();
      
      final authToken = await localStorage.getAuthToken();
      if (authToken == null) {
        debugPrint('📱 No auth token available, skipping FCM token update');
        return;
      }
      
      await userApiService.updateFcmToken(authToken, fcmToken: token);
      debugPrint('📱 Successfully updated FCM token on server');
    } catch (e) {
      debugPrint('❌ Failed to update FCM token on server: $e');
      // Don't throw error - FCM token update is not critical
    }
  }
}

// Note: Background message handler is defined in main.dart to avoid duplicate definitions