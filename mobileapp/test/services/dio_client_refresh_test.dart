import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:astromate/services/network/dio_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Fake server: /auth/refresh hands out "new", everything else wants "Bearer new".
class _FakeServer implements HttpClientAdapter {
  int refreshCalls = 0;
  @override
  Future<ResponseBody> fetch(RequestOptions o, Stream<Uint8List>? body, Future<void>? cancel) async {
    await Future.delayed(const Duration(milliseconds: 20));
    if (o.path.endsWith('/auth/refresh')) {
      refreshCalls++;
      return _json(200, {'data': {'access_token': 'new', 'refresh_token': 'r2'}});
    }
    if (o.path.endsWith('/orders/x')) return _json(404, {'error': 'Order not found', 'message': 'Order not found'});
    return o.headers['Authorization'] == 'Bearer new' ? _json(200, {'ok': true}) : _json(401, {'error': 'UNAUTHORIZED'});
  }

  ResponseBody _json(int status, Object data) => ResponseBody.fromString(jsonEncode(data), status, headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      });
  @override
  void close({bool force = false}) {}
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('concurrent 401s share one refresh, all retry with the new token, and a 404 does not log out', () async {
    SharedPreferences.setMockInitialValues({'auth_token': 'old', 'refresh_token': 'r1'});
    await DioClient.initialize();
    final server = _FakeServer();
    DioClient.instance.httpClientAdapter = server;
    DioClient.setAuthToken('old');
    var loggedOut = false;
    DioClient.onAuthFailure = (_) async => loggedOut = true;
    String? propagated;
    DioClient.onTokenRefreshed = (t) async => propagated = t;

    final results = await Future.wait(List.generate(5, (i) => DioClient.instance.get('/thing/$i',
        options: Options(headers: {'Authorization': 'Bearer stale-captured-token'}))));

    expect(results.every((r) => r.statusCode == 200), isTrue);
    expect(server.refreshCalls, 1);
    expect(propagated, 'new');
    expect((await SharedPreferences.getInstance()).getString('refresh_token'), 'r2');

    // stale explicit token is overridden by the current one — no second refresh
    expect((await DioClient.instance.get('/later', options: Options(headers: {'Authorization': 'Bearer old'}))).statusCode, 200);
    expect(server.refreshCalls, 1);

    await expectLater(DioClient.instance.get('/orders/x'), throwsA(isA<DioException>()));
    expect(loggedOut, isFalse);
  });
}
