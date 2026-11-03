// Firebase is not configured yet. The old TrueAstroTalk project (trueastrotalk-1) was removed;
// it lives in _context/old-trueastrotalk-firebase/ for reference.
//
// Once the new Astromate Firebase project exists (bundle/package id: online.astromate), run:
//   dart pub global activate flutterfire_cli
//   flutterfire configure --project=<new-project-id> --platforms=android,ios \
//     --android-package-name=online.astromate --ios-bundle-id=online.astromate
// That regenerates this file and adds google-services.json + GoogleService-Info.plist.
//
// Until then the app runs without Firebase (no push notifications / background call alerts).
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform =>
      throw UnsupportedError('Firebase not configured yet — run flutterfire configure');
}
