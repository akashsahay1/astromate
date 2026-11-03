import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../config/config.dart';

/// Callback type for auth failure events (user deleted, session expired, etc.)
typedef AuthFailureCallback = Future<void> Function(String reason);

class DioClient {
  static late Dio _dio;

  /// Callback to be invoked when authentication fails (user deleted, token invalid, etc.)
  static AuthFailureCallback? onAuthFailure;

  static Dio get instance => _dio;

  static Future<void> initialize() async {
    // Initialize IP detection for development
    await Config.baseUrl; // This triggers IP detection and caching
    
    _dio = Dio(
      BaseOptions(
        baseUrl: Config.baseUrlSync, // Use sync version after IP is cached
        connectTimeout: Config.connectTimeout,
        receiveTimeout: Config.receiveTimeout,
        sendTimeout: Config.sendTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add custom selective logging interceptor (only in debug mode)
    if (kDebugMode) {
      _dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (RequestOptions options, RequestInterceptorHandler handler) {
            // Only log essential request info - much cleaner
            final path = options.path.split('?')[0]; // Remove query params for cleaner logs
            debugPrint('🔄 ${options.method} $path');
            handler.next(options);
          },
          onResponse: (Response response, ResponseInterceptorHandler handler) {
            // Only log status for errors or important endpoints
            final path = response.requestOptions.path.split('?')[0];
            if (response.statusCode != 200 && response.statusCode != 201) {
              debugPrint('⚠️ ${response.statusCode} $path');
            }
            handler.next(response);
          },
        ),
      );
    }

    // Every request carries the CURRENT token, overriding any stale token a caller captured earlier.
    // This is what makes a refreshed token reach every service without each one re-reading storage.
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_token != null) options.headers['Authorization'] = 'Bearer $_token';
          handler.next(options);
        },
        onError: (DioException error, ErrorInterceptorHandler handler) async {
          final opts = error.requestOptions;
          final hadToken = opts.headers['Authorization'] != null;

          if (hadToken && _isUserNotFoundError(error)) {
            debugPrint('🚨 User not found in database - triggering auth failure');
            await _handleAuthFailure('User account not found');
            return handler.next(error);
          }

          final isAuthCall = opts.path.contains('/auth/');
          if (error.response?.statusCode != 401 || !hadToken || isAuthCall || opts.extra['retried'] == true) {
            return handler.next(error);
          }

          // All concurrent 401s wait on the same refresh, then retry once with the new token.
          final newToken = await refreshTokens();
          if (newToken == null) {
            await _handleAuthFailure('Session expired');
            return handler.next(error);
          }
          try {
            opts.headers['Authorization'] = 'Bearer $newToken';
            opts.extra['retried'] = true;
            if (opts.data is FormData) opts.data = (opts.data as FormData).clone(); // a sent FormData can't be re-sent
            handler.resolve(await _dio.fetch(opts));
          } on DioException catch (e) {
            handler.next(e);
          }
        },
      ),
    );
  }

  static String? _token;
  static Future<String?>? _refreshing;

  /// Called with the new access token after a refresh, so AuthService/secure storage stay in sync.
  static Future<void> Function(String token)? onTokenRefreshed;

  /// Single-flight token refresh. Returns the new access token, or null if the session is over.
  static Future<String?> refreshTokens() => _refreshing ??= _doRefresh().whenComplete(() => _refreshing = null);

  static Future<String?> _doRefresh() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString('refresh_token');
      if (refreshToken == null) return null;
      // bare Dio (no interceptors) so a failing refresh can't recurse; same base URL + transport as the app
      final response = await (Dio(BaseOptions(baseUrl: _dio.options.baseUrl))..httpClientAdapter = _dio.httpClientAdapter)
          .post('/auth/refresh', data: {'refresh_token': refreshToken});
      final data = response.data['data'];
      final newToken = data['access_token'] as String;
      await prefs.setString('auth_token', newToken);
      await prefs.setString('refresh_token', data['refresh_token'] as String);
      setAuthToken(newToken);
      await onTokenRefreshed?.call(newToken);
      debugPrint('✅ Token refreshed successfully');
      return newToken;
    } catch (e) {
      debugPrint('❌ Token refresh failed: $e');
      return null;
    }
  }

  /// The account itself is gone or disabled (exact server error codes only — a 404 "Order not found"
  /// must never log the user out).
  static bool _isUserNotFoundError(DioException error) {
    final status = error.response?.statusCode;
    final data = error.response?.data;
    if ((status != 401 && status != 404) || data is! Map) return false;
    return const {'USER_NOT_FOUND', 'ACCOUNT_NOT_FOUND', 'ACCOUNT_INACTIVE'}.contains(data['error']?.toString());
  }

  /// Handle authentication failure - clear data and notify callback
  static Future<void> _handleAuthFailure(String reason) async {
    debugPrint('🔐 Handling auth failure: $reason');

    // Clear auth token from Dio
    clearAuthToken();

    // Clear stored auth data
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('auth_token');
      await prefs.remove('refresh_token');
      await prefs.remove('user_data');
      debugPrint('🗑️ Cleared stored auth data');
    } catch (e) {
      debugPrint('⚠️ Failed to clear stored auth data: $e');
    }

    // Notify callback if set
    if (onAuthFailure != null) {
      try {
        await onAuthFailure!(reason);
      } catch (e) {
        debugPrint('⚠️ Auth failure callback error: $e');
      }
    }
  }

  // Method to update authorization header
  static void setAuthToken(String token) {
    _token = token;
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  // Method to clear authorization header
  static void clearAuthToken() {
    _token = null;
    _dio.options.headers.remove('Authorization');
  }
}